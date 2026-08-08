# ARCHITECTURE — NextGig FE Portal

> Tài liệu kiến trúc hệ thống. Mô tả **luồng dữ liệu thực tế** của ứng dụng, giải thích chi tiết từng bước từ HTTP layer đến pixel trên màn hình, kèm phân tích thiết kế (design rationale), các bất biến (invariants) phải giữ, và các bẫy (pitfalls) đã tồn tại trong code.
>
> Ví dụ xuyên suốt: module **Jobs** (`src/modules/jobs/jobs`) — module hoàn chỉnh nhất; các module `company`, `management` đều là bản sao của khuôn này.

---

## Mục lục

1. [Bối cảnh & ràng buộc kiến trúc](#1-bối-cảnh--ràng-buộc-kiến-trúc)
2. [Tổng quan phân lớp](#2-tổng-quan-phân-lớp)
3. [Vòng đời một request — 10 bước chi tiết](#3-vòng-đời-một-request--10-bước-chi-tiết)
4. [Hạ tầng HTTP: interceptor & single-flight refresh](#4-hạ-tầng-http-interceptor--single-flight-refresh)
5. [List state machine: `useQueryString`](#5-list-state-machine-usequerystring)
6. [Tầng render bảng: DataTable](#6-tầng-render-bảng-datatable)
7. [Dual-path Desktop / Mobile](#7-dual-path-desktop--mobile)
8. [Overlay system: Drawer external store](#8-overlay-system-drawer-external-store)
9. [Vòng đời mutation: write → invalidate → re-render](#9-vòng-đời-mutation-write--invalidate--re-render)
10. [Tầng Form](#10-tầng-form)
11. [Phân quyền](#11-phân-quyền)
12. [Bản đồ quản lý state](#12-bản-đồ-quản-lý-state)
13. [Các bất biến kiến trúc](#13-các-bất-biến-kiến-trúc)
14. [Playbook: thêm một module mới](#14-playbook-thêm-một-module-mới)
15. [Nợ kỹ thuật đã biết](#15-nợ-kỹ-thuật-đã-biết)

---

## 1. Bối cảnh & ràng buộc kiến trúc

**Sản phẩm.** Portal dành cho nhà tuyển dụng (employer) của nền tảng việc làm theo ca (gig/shift marketplace): đăng job, quản lý ca làm, duyệt ứng viên, quản trị company/brand/location, credit và report.

**Stack.** React 19 · TypeScript 5.7 · Vite 6 (SWC) · TanStack Query v5 · TanStack Table v8 · React Router v7 · Zustand v5 · Tailwind v4 · shadcn/ui (Radix) · react-hook-form + Yup · Axios.

**Ràng buộc định hình kiến trúc:**

| Ràng buộc | Hệ quả kiến trúc |
|---|---|
| Backend REST, phân trang + sort + filter **server-side** | Client không giữ dataset đầy đủ. `query` object là nguồn sự thật duy nhất; đổi `query` → refetch. |
| Envelope response `{ data, metadata }` | Interceptor unwrap một lần ở tầng HTTP; toàn bộ tầng trên chỉ thấy body. |
| Access token ngắn hạn + refresh token | Cần cơ chế refresh không gây race → single-flight queue. |
| Mobile dùng infinite scroll, desktop dùng phân trang | Không thể giải bằng CSS → phải tách **hai code path**. |
| Nhiều luồng nghiệp vụ nhiều tầng (job → shift → applicant → clock-in) | Modal phải xếp chồng được (stack) và mở được từ mọi nơi → external store thay vì Context. |
| Phân quyền theo module × hành động | Gate ở tầng route, không rải `if` trong component. |

---

## 2. Tổng quan phân lớp

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  L0  ENTRY            main.tsx  →  QueryClientProvider → BrowserRouter    ║
║                       App.tsx   →  setToken() · useRoutes() · <Drawer/>   ║
╚═════════════════════════════════╤═════════════════════════════════════════╝
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L1  ROUTING          routes/index.tsx                                    ║
║                       RequireAuth → MasterLayout                          ║
║                       modules/<feature>/index.tsx  (nested useRoutes)     ║
║                       RequirePermission(moduleId)                         ║
╚═════════════════════════════════╤═════════════════════════════════════════╝
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L2  SCREEN           modules/<area>/<feature>/index.tsx                  ║
║                       Chỉ layout + lifecycle. KHÔNG chạm data.            ║
╚═════════════════════════════════╤═════════════════════════════════════════╝
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L3  CONTAINER        <feature>/table/index.tsx                           ║
║                       useQueryString()  → query state machine             ║
║                       use<Domain>()     → data + mutations                ║
║                       columns: ColumnDef[]                                ║
╚═══════╤═══════════════════════════════════════════╤═══════════════════════╝
        ▼                                           ▼
╔═══════════════════════╗                 ╔═════════════════════════════════╗
║ L4a  DataTable        ║                 ║ L4b  CardList                   ║
║      (desktop)        ║                 ║      (mobile · infinite)        ║
╚═══════════════════════╝                 ╚═════════════════════════════════╝
                                  │
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L5  QUERY            hooks/query/<domain>/index.ts                       ║
║                       useQuery · useInfiniteQuery · useMutation           ║
║                       queryKey ← constants/queryKeys.ts                   ║
╚═════════════════════════════════╤═════════════════════════════════════════╝
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L6  SERVICE          services/<domain>/index.ts  → <domain>Controller    ║
║                       URL ← constants/common.ts → API.*                   ║
╚═════════════════════════════════╤═════════════════════════════════════════╝
                                  ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║  L7  HTTP CORE        services/config/index.ts → apiConfig (axios)        ║
║                       req: encode search · res: unwrap · 401: refresh     ║
╚═══════════════════════════════════════════════════════════════════════════╝

  Ngang hàng (cross-cutting):
    stores/global   — zustand persist: token, profile, role, openMobile
    stores/filters  — zustand persist: filter đã lưu
    DrawerRight     — external store: stack overlay toàn cục
```

**Quy tắc phụ thuộc.** Mũi tên chỉ đi xuống. Cụ thể:

- Component **không** được `import` từ `src/services` — luôn qua `hooks/query`.
- `hooks/query` **không** biết gì về UI (không import component, không nhận `ReactNode`).
- `services` **không** biết gì về React (không hook, không state).
- `constants/*` là lá — không import ngược lên.

Vi phạm quy tắc này là dấu hiệu cần refactor, không phải trường hợp ngoại lệ.

---

## 3. Vòng đời một request — 10 bước chi tiết

Trace đầy đủ khi user điều hướng tới `/jobs/job/list`. Đọc theo đúng thứ tự thực thi.

---

### Bước 0 — Bootstrap ứng dụng

**File:** [`src/main.tsx`](src/main.tsx) → [`src/App.tsx`](src/App.tsx)

```tsx
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,   // tắt refetch khi đổi tab
      retry: false,                  // không tự retry — lỗi hiện ngay
    },
  },
});
```

**Vì sao hai option này quan trọng:** `retry: false` nghĩa là một lỗi mạng thoáng qua sẽ hiển thị ngay cho user, không có lớp đệm. Kết hợp với việc `queryFn` nuốt lỗi (bước 5), hệ quả là **lỗi API và "không có dữ liệu" trông giống hệt nhau**. Đây là quyết định cần biết trước khi debug.

```tsx
// App.tsx — thứ tự khởi tạo có ý nghĩa
const token = localStorageService.getItem(ACCESS_TOKEN);
if (token) setToken(token);          // ① CHẠY TRONG THÂN RENDER, trước mọi query
const routes = useRoutes(configAppRoutes);
```

**Chi tiết quan trọng:** `setToken()` được gọi **đồng bộ trong thân component**, không trong `useEffect`. Đây là chủ ý: `useEffect` chạy *sau* khi cây con đã mount, mà component con có thể đã bắn query ngay ở lần render đầu. Nếu đặt trong effect, request đầu tiên sau khi F5 sẽ thiếu header `Authorization` → 401 → kích hoạt refresh flow không cần thiết.

*(Đánh đổi: gọi hàm có side-effect trong thân render vi phạm quy tắc pure render của React. Với StrictMode nó chạy hai lần, nhưng vì `setToken` idempotent nên vô hại. Cách chuẩn hơn là khởi tạo axios instance với token đọc sẵn từ localStorage.)*

Ba thứ được mount **một lần duy nhất** tại `App.tsx`, ngoài `routes`:

```tsx
<Toaster position='top-center' … />   // react-hot-toast, giới hạn 1 toast qua useToastLimit(1)
<GlobalLoading />                      // overlay loading toàn cục, điều khiển bởi useGlobal
<Drawer />                             // ⚠️ single mount point của toàn bộ overlay — xem §8
```

---

### Bước 1 — Route matching & permission gate

**File:** [`src/routes/index.tsx`](src/routes/index.tsx) → [`src/modules/jobs/index.tsx`](src/modules/jobs/index.tsx)

Routing có **hai tầng**. Tầng ngoài xác định có đăng nhập chưa và dựng layout:

```tsx
{
  element: <RequireAuth><MasterLayout /></RequireAuth>,
  children: [
    { path: APP_ROUTES.JOBS.path,       element: <JobsFeature /> },        // 'jobs/*'
    { path: APP_ROUTES.COMPANY.path,    element: <CompanyFeature /> },
    { path: APP_ROUTES.MANAGEMENT.path, element: <ManagementFeature /> },
  ],
}
```

Tầng trong do **feature module** tự khai báo bằng `useRoutes` lồng nhau:

```tsx
// modules/jobs/index.tsx
{
  path: APP_ROUTES.JOBS.JOB.LIST.path,        // 'job/list' — TƯƠNG ĐỐI
  element: (
    <RequirePermission moduleId={MODULE_PERMISSION_ID.JOB_LIST}>
      <Jobs />
    </RequirePermission>
  ),
}
```

**Vì sao lồng route thay vì một bảng phẳng:** mỗi feature sở hữu bảng route riêng, thêm màn hình không phải sửa file routing trung tâm — giảm xung đột merge khi nhiều người làm song song trên các module khác nhau. Cái giá là phải nhớ dấu `/*` ở route cha (`'jobs/*'`), nếu quên thì route con không bao giờ match.

**Quy ước `path` vs `to`** trong [`routes/routes.ts`](src/routes/routes.ts) — mỗi node mang cả hai:

```ts
LIST: {
  path: 'job/list',        // tương đối → dùng khi ĐĂNG KÝ route
  to:   '/jobs/job/list',  // tuyệt đối → dùng khi ĐIỀU HƯỚNG
  parent: 'jobs/job',
}
```

Dùng nhầm `to` khi đăng ký route sẽ tạo path `/jobs//jobs/job/list` — lỗi im lặng, không cảnh báo.

---

### Bước 2 — Screen dựng khung & quản lý lifecycle

**File:** [`src/modules/jobs/jobs/index.tsx`](src/modules/jobs/jobs/index.tsx)

Screen component **cố ý không chạm data**. Nó chỉ làm ba việc: chọn header theo breakpoint, redirect mobile, và dọn dẹp khi rời màn.

```tsx
const { onResetFilters } = useQueryString();
const { resetFilters }   = useFilterSync();
const { openMobile }     = useGlobal();

useEffect(() => {
  if (openMobile) navigate(APP_ROUTES.JOBS.JOB.HOME.to, { replace: true });
}, [openMobile]);

useEffect(() => () => {     // cleanup khi unmount
  resetFilters();           // xoá filter trong zustand store (persist)
  onResetFilters();         // reset query về InitialQuery
}, []);
```

**Vì sao cần cleanup thủ công:** `useFilters` là zustand store có `persist` — filter sống lâu hơn component. Không xoá thì user rời `/jobs` sang `/company` rồi quay lại sẽ thấy filter cũ còn nguyên trong khi UI filter bar đã reset → dữ liệu bảng không khớp với filter đang hiển thị. Đây là hệ quả trực tiếp của việc chọn persist store cho filter.

**`replace: true`** trong redirect mobile: dùng `replace` thay vì `push` để nút Back không đưa user về đúng màn vừa bị đá đi (gây vòng lặp redirect).

---

### Bước 3 — Container khởi tạo state machine

**File:** [`src/modules/jobs/jobs/table/index.tsx`](src/modules/jobs/jobs/table/index.tsx)

Đây là nơi hội tụ mọi thứ. `useQueryString()` sở hữu toàn bộ state của list:

```tsx
const {
  query,              // { page, limit, sort, search, filter }
  setQuery,           // setter thô — DataTable dùng cho phân trang
  onSearchHandler,    // debounce 400ms
  onChangeSort,       // toggle 3 trạng thái
  checkSort,          // đọc hướng sort hiện tại
  setFilter,          // merge filter + reset page
} = useQueryString();
```

`query` khởi tạo từ URL, không phải từ giá trị rỗng:

```ts
const [query, setQuery] = useState<IQueryString>(
  !unabledParam && location.search
    ? (parseURL(location.search) as any)   // khôi phục từ URL
    : init                                  // InitialQuery = { limit: 20, page: 1, search: '' }
);
```

**Vì sao:** cho phép **deep-link** và **F5 giữ nguyên trạng thái**. User lọc job status = Active, sang trang 3, copy URL gửi đồng nghiệp → mở ra đúng trạng thái đó. Đây là lý do `query` phải đồng bộ hai chiều với URL (xem bước 4).

---

### Bước 4 — Đồng bộ `query` ⇄ URL

**File:** [`src/hooks/queryString/index.ts`](src/hooks/queryString/index.ts) + [`src/hooks/route/index.ts`](src/hooks/route/index.ts)

```ts
useEffect(() => {
  if (!unabledParam)
    route(location.pathname, {
      params: query,
      replace: true,        // ⚠️ replace, không push
      enableSearch: false,
    });
}, [query, unabledParam]);
```

**Vì sao `replace: true`:** mỗi ký tự gõ vào ô search, mỗi lần đổi trang đều ghi URL. Nếu dùng `push`, history stack sẽ đầy hàng chục entry rác và nút Back trở nên vô dụng. `replace` giữ history sạch — Back đưa user về màn *trước đó*, không phải về trạng thái filter trước đó.

**Serialization** do `createQueryString` trong [`lib/utils.ts`](src/lib/utils.ts) đảm nhiệm. Nó xử lý ba dạng giá trị:

| Kiểu | Input | Output |
|---|---|---|
| Nguyên thuỷ | `{ page: 2 }` | `page=2` |
| Mảng | `{ fields: ['a','b'] }` | `fields=a&fields=b` |
| Object lồng | `{ filter: { status: 'active' } }` | `filter%5Bstatus%5D=active` |

`parseURL` là phép nghịch đảo, cần biết trước key nào là array/object:

```ts
parseURL(search, {
  arrayField:  ['fields'],    // mặc định
  objectField: ['filter'],    // mặc định
})
```

**Bất biến:** nếu thêm một filter key lồng mới ngoài `filter`, **phải** khai báo trong `objectField`, nếu không parse ngược sẽ ra chuỗi phẳng `"[object Object]"` và deep-link vỡ âm thầm.

**Ghi chú thiết kế:** `useRoute` dùng **function overload** của TypeScript để hỗ trợ 4 chữ ký (`route(path)`, `route(path, id)`, `route(path, ids[])`, `route(-1)`). Đây là kỹ thuật đúng cho API đa hình, hiếm gặp ở codebase mid-level.

---

### Bước 5 — Query hook gọi API

**File:** [`src/hooks/query/jobs/jobs/index.ts`](src/hooks/query/jobs/jobs/index.ts)

```ts
export const useJobs = () => {
  const queryClient = useQueryClient();
  const { openMobile } = useGlobal();

  const useGetList = (params: IQueryString) => {
    const { data, ...rest } = useQuery({
      queryKey: [queryKey.jobs.list, params],   // ① params NẰM TRONG key
      queryFn: async () => {
        try {
          const response = await jobsController.getJobList(params);
          return response.data;
        } catch (error) {
          toast.error(formatRejectError(error as IError));   // ② nuốt lỗi
        }
      },
      enabled: !openMobile || false,             // ③ desktop-only
    });
    return { data, ...rest };
  };
  …
};
```

**① `params` nằm trong `queryKey`** — đây là cơ chế cốt lõi. TanStack Query serialize key bằng deep-equal; `query` đổi → key đổi → cache miss → refetch tự động. Không cần `useEffect` theo dõi, không cần gọi `refetch()` thủ công. Đổi lại, mỗi tổ hợp filter tạo một cache entry riêng — trở lại filter cũ sẽ hiển thị **ngay lập tức** từ cache rồi refetch nền.

**② Nuốt lỗi trong `queryFn`** — `try/catch` bọc toàn bộ nên khi lỗi, `queryFn` trả `undefined` thay vì throw. Hệ quả: `isError` **không bao giờ** `true`, `error` luôn `undefined`, và UI rơi vào nhánh empty state. User chỉ thấy toast thoáng qua + màn hình "No results found". Xem [§15](#15-nợ-kỹ-thuật-đã-biết) để biết cách sửa.

**③ `enabled: !openMobile`** — gate query theo breakpoint. Cặp với `useInfiniteGetList` có `enabled: openMobile`, đảm bảo tại một thời điểm **chỉ một** query chạy, không tốn request thừa.

**Quy ước tổ chức:** mỗi domain export **một** hook `use<Domain>()` trả về cụm hook con + mutation. Lý do: các thao tác cùng domain chia sẻ `queryClient` và cần invalidate chéo nhau; gom một chỗ giúp thấy được toàn bộ quan hệ invalidate mà không phải lần theo nhiều file.

---

### Bước 6 — Service chuẩn hoá params

**File:** [`src/services/jobs/index.ts`](src/services/jobs/index.ts)

```ts
export const customParams = (data: any) => {
  if (!data) return {};
  const result = { ...data };
  result.filter = result.filter ? { ...result.filter } : {};   // deep-copy 1 tầng

  if (result.filter.status === JOB_STATUS.ALL) delete result.filter.status;  // 'all' = không lọc
  if (result.filter.search) delete result.filter.search;                     // search ở top-level
  return result;
};

export const jobsController = {
  getJobList: (params: IQueryString): Promise<IResponse<EJobResponse>> =>
    apiConfig.get(API.JOBS.LIST, { params: customParams(params) }),
  …
};
```

**Vai trò của tầng này: anti-corruption layer.** UI có khái niệm riêng (`status = 'all'` để hiển thị tab "All"), backend không hiểu khái niệm đó. Thay vì để UI biết "gửi `all` thì phải bỏ field đi", quy tắc dịch được đóng gói tại service. Đổi hợp đồng API sau này chỉ sửa một chỗ.

**Chú ý deep-copy:** `{ ...data }` là shallow copy — `result.filter` vẫn trỏ chung object với `params`. Vì `params` nằm trong `queryKey`, mutate nó sẽ làm hỏng cache key. Dòng `result.filter = { ...result.filter }` chính là để tránh việc đó. Đây là chi tiết dễ bỏ sót nhưng bắt buộc.

**Quy ước URL:** mọi endpoint nằm trong `API` (`constants/common.ts`); path có tham số khai báo dạng hàm:

```ts
DETAIL: (id: string) => `/jobs/${id}`,
```

---

### Bước 7 — Tầng HTTP

**File:** [`src/services/config/index.ts`](src/services/config/index.ts) — xem [§4](#4-hạ-tầng-http-interceptor--single-flight-refresh) để phân tích đầy đủ.

Tóm tắt những gì xảy ra với request này:

1. **Request interceptor** — `encodeURIComponent(params.search)` nếu có. *Bất biến: không encode lại ở call-site, sẽ thành double-encode (`%2520`).*
2. Gửi đi kèm header `Authorization` đã set ở bước 0.
3. **Response interceptor** — `return response.data`, bóc lớp axios.

**Hệ quả type quan trọng:** vì interceptor đã bóc, kiểu `Promise<IResponse<T>>` của controller mô tả **envelope body**, không phải `AxiosResponse`. Nghĩa là:

```ts
const response = await jobsController.getJobList(params);
response.data      // ✅ mảng job — đây là envelope.data
// KHÔNG phải response.data.data
```

Đây là nguồn nhầm lẫn phổ biến nhất với người mới vào codebase.

---

### Bước 8 — Chuẩn hoá dữ liệu cho bảng

**File:** [`src/modules/jobs/jobs/util/index.ts`](src/modules/jobs/jobs/util/index.ts)

API trả cấu trúc theo backend (`_id`, `title`, `industries: [{name}]`); bảng cần string phẳng để render và sort.

```ts
export const formatTableData = (data: any[]): IJobs[] =>
  data.map((item) => ({
    ...item,                                   // giữ nguyên bản gốc cho cell tuỳ biến
    [EJobs.id]:         item._id || '',
    [EJobs.job_title]:  item.title || '',
    [EJobs.industries]: item.industries?.map((i) => i.name).join(', ') ?? '',
    [EJobs.shifts]:     item.shifts?.length ?? 0,
    [EJobs.hourly]:     formatMoney(item.minWage,  item.maxWage),
    [EJobs.gross]:      formatMoney(item.minGross, item.maxGross),
    [EJobs.status]:     item.status || '',
  }));
```

**Ba điểm thiết kế:**

1. **`...item` đặt đầu tiên** — giữ lại toàn bộ field gốc để `cell` renderer truy cập được (`row.original.brand.logoUrl`), trong khi các key đã format ghi đè lên trên.
2. **Enum `EJobs` là hợp đồng ba bên** — cùng một chuỗi được dùng làm key của `formatTableData`, `accessorKey` của column, và tên field gửi lên server khi sort. Đổi enum là đổi cả ba, đây chính là mục đích.
3. **Hàm thuần, không hook** — dễ test, dễ tái dùng cho export CSV.

**Bẫy hiệu năng:** `formatTableData(data?.data || [])` được gọi **trong JSX**, tức là chạy lại mỗi lần render kể cả khi `data` không đổi. Với 20 dòng thì không đáng kể, nhưng nó cũng tạo mảng mới mỗi lần → phá vỡ mọi memo hoá phía dưới. Nên bọc `useMemo`.

---

### Bước 9 — Định nghĩa columns

```tsx
const columns = useMemo<ColumnDef<IJobs>[]>(() => [
  {
    accessorKey: EJobs.brand,
    header: 'Brand',
    sortUndefined: checkSort(EJobs.brand),      // ⚠️ dùng lệch chuẩn — xem dưới
    accessorFn: (row) => row.brand?.name || '', // giá trị dùng để sort/lọc
    cell: ({ row }) => {                        // giá trị hiển thị
      const brand = row.original.brand;
      return (
        <div className='flex items-center gap-2'>
          {brand?.logoUrl && <img src={brand.logoUrl} className='w-8 h-8 rounded-[5px]' />}
          <span>{brand?.name || ''}</span>
        </div>
      );
    },
    size: 195,
  },
  …
  {
    id: ESticky.right,        // đánh dấu cột ghim phải
    accessorKey: 'action',
    header: 'Action',
    enableSorting: false,
    cell: ({ row }) => { … }, // cụm nút View / Edit / Delete
  },
], [checkSort, handleDetailNavigation, handleEditNavigation, handleOpenDel]);
```

**Bảng thuộc tính:**

| Thuộc tính | Vai trò | Ghi chú |
|---|---|---|
| `accessorKey` | Khớp key output của `formatTableData` | Cũng là tên field gửi server khi sort |
| `accessorFn` | Tách *giá trị* khỏi *hiển thị* | Dùng khi cell là JSX phức tạp |
| `cell` | Render tuỳ biến | Nhận `row.original` = bản ghi gốc chưa format |
| `size` | Width cố định (px) | `DataTable` map thành `minWidth`/`maxWidth`; `150` là sentinel nghĩa là "tự do" |
| `enableSorting: false` | Cột server chưa hỗ trợ sort | Ẩn luôn nút mũi tên |
| `id: ESticky.right` | Ghim cột về bên phải | `TableHead`/`TableCell` đọc `columnDef.id` để áp CSS sticky |
| `sortUndefined` | **Chở hướng sort hiện tại** | ⚠️ Không đúng ý đồ gốc của TanStack |

**Về `sortUndefined`:** trong TanStack Table, field này dùng để quy định vị trí của giá trị `undefined` khi sort client-side. Ở đây nó bị mượn làm nơi nhét `1 | -1 | undefined` để `DataTable` đọc lại và tô màu mũi tên. Nó *chạy được* vì sort là server-side nên ý nghĩa gốc không bao giờ được dùng đến — nhưng đây là hack, sẽ gây hiểu nhầm cho người đọc và vỡ nếu sau này bật sort client-side. Cách đúng: dùng `meta: { sortDir }` (TanStack có sẵn `ColumnMeta` để mở rộng).

**Về deps array:** `[checkSort, …]` — nhưng `checkSort` là hàm **được tạo mới mỗi render** trong `useQueryString` (không bọc `useCallback`). Nghĩa là `useMemo` này thực chất **không bao giờ hit cache**. Muốn memo thật sự thì `checkSort` phải được ổn định hoá ở nguồn.

---

### Bước 10 — DataTable render

**File:** [`src/components/common/DataTable/index.tsx`](src/components/common/DataTable/index.tsx)

```tsx
<DataTable
  containerClass='h-[calc(100%-51px)] bg-white'
  columns={columns}
  data={formatTableData(data?.data || [])}
  loading={loadData}
  onSorting={onChangeSort}                    // click header → đổi query.sort
  count={data?.metadata?.totalCount || 0}     // tổng bản ghi từ server
  page={query.page}
  rowsPerPage={query.limit}
  params={query}
  setParams={setQuery}                        // Pagination ghi ngược vào query
/>
```

Chi tiết bên trong ở [§6](#6-tầng-render-bảng-datatable).

---

## 4. Hạ tầng HTTP: interceptor & single-flight refresh

**File:** [`src/services/config/index.ts`](src/services/config/index.ts)

Đây là phần kỹ thuật chặt chẽ nhất của codebase. Toàn bộ ứng dụng dùng **một** axios instance.

### 4.1 Quản lý token

```ts
export const setToken = (token: string) => {
  apiConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeToken = () => {
  localStorageService.clear();
  delete apiConfig.defaults.headers.common['Authorization'];
};
```

Token sống ở **hai nơi có chủ đích**: `localStorage` (nguồn bền vững, sống qua F5) và `defaults.headers` của axios (nguồn nóng, áp vào mọi request). `App.tsx` đồng bộ hai nơi lúc khởi động.

*Ghi chú bảo mật: token trong `localStorage` bị lộ với XSS. Đánh đổi phổ biến để đơn giản hoá; giải pháp chặt hơn là httpOnly cookie + CSRF token, nhưng cần backend hỗ trợ.*

### 4.2 Request interceptor

```ts
apiConfig.interceptors.request.use((config) => {
  if (config?.params?.search) {
    config.params.search = encodeURIComponent(config.params.search);
  }
  return config;
});
```

Đảm bảo ký tự đặc biệt trong search (`&`, `#`, `+`) không phá query string. **Bất biến: không encode ở call-site.**

### 4.3 Response interceptor — unwrap

```ts
apiConfig.interceptors.response.use(
  (response) => response.data,     // bóc AxiosResponse → envelope body
  async (error) => { … }
);
```

Bóc một lần tại đây giúp toàn bộ tầng trên không phải viết `.data.data`. Cái giá: kiểu trả về của controller **nói dối** so với runtime của axios, nên bắt buộc phải khai báo kiểu tường minh trên từng method của controller.

### 4.4 Single-flight refresh — phần khó nhất

**Vấn đề.** Màn hình mở đồng thời 3 request (list + metric + profile). Token hết hạn → cả 3 nhận 401 cùng lúc. Nếu mỗi request tự gọi refresh, ta có 3 lần refresh song song; backend thường xoay vòng refresh token nên lần 2 và 3 sẽ thất bại → user bị đăng xuất oan.

**Lời giải.** Một cờ + một hàng đợi:

```ts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};
```

Luồng xử lý 401:

```ts
if (status === 401) {
  // ── Chốt chặn: đã thử refresh rồi mà vẫn 401 → token thực sự chết
  if (originalRequest._retry && originalRequest._retryAfterRefresh) {
    removeToken();
    localStorage.setItem('errorToast', SYS_MESS.ERROR.EM1);   // ① trao tay qua storage
    window.location.replace(APP_ROUTES.HOME.to);              // ② hard redirect
    return Promise.reject(errorCreate(401, SYS_MESS.ERROR.EM1));
  }

  // ── Đang có người refresh → xếp hàng chờ
  if (isRefreshing) {
    return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
      .then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        originalRequest._retry = true;
        originalRequest._retryAfterRefresh = true;
        return apiConfig(originalRequest);      // replay
      });
  }

  // ── Người đầu tiên: giành quyền refresh
  originalRequest._retry = true;
  isRefreshing = true;
  try {
    const newToken = await refreshAccessToken();
    if (newToken) {
      setToken(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      originalRequest._retryAfterRefresh = true;
      processQueue(null, newToken);             // đánh thức cả hàng đợi
      return apiConfig(originalRequest);
    }
    throw new Error('Refresh token failed');
  } catch (refreshError) {
    removeToken();
    localStorage.setItem('errorToast', SYS_MESS.ERROR.EM1);
    window.location.replace(APP_ROUTES.HOME.to);
    processQueue(refreshError);
    return Promise.reject(errorCreate(401, SYS_MESS.ERROR.EM1));
  } finally {
    isRefreshing = false;                        // ⚠️ luôn nhả cờ
  }
}
```

**Bảng bất biến:**

| Bất biến | Vì sao |
|---|---|
| Đúng **một** request gọi `/auth/refresh-access-token` mỗi chu kỳ | Refresh token xoay vòng; gọi song song sẽ vô hiệu hoá nhau |
| `isRefreshing = false` đặt trong `finally` | Nếu throw mà không nhả cờ, mọi 401 sau đó treo vĩnh viễn trong hàng đợi |
| `failedQueue = []` sau khi `processQueue` | Tránh replay hai lần ở chu kỳ tiếp theo |
| Hai cờ `_retry` + `_retryAfterRefresh` | Phân biệt "đã thử lại" với "đã thử lại **sau khi** refresh" → chống vòng lặp vô hạn |

**① Trao tay qua `localStorage`:** vì `window.location.replace` **huỷ toàn bộ React tree**, không thể gọi `toast.error()` — component sẽ bị unmount trước khi toast kịp hiện. Giải pháp: ghi message vào `localStorage`, màn login đọc và hiển thị sau khi mount. Đây là kỹ thuật hợp lệ cho tình huống này.

**② Hard redirect thay vì `navigate()`:** chủ ý xoá sạch toàn bộ in-memory state (zustand, TanStack cache, drawer stack). Sau khi phiên chết, giữ lại bất kỳ state nào cũng là rủi ro rò rỉ dữ liệu giữa hai tài khoản.

### 4.5 Chuẩn hoá lỗi

```ts
const errorCreate = (_code: number, message: string): INormalError =>
  ({ status: _code, message, success: false, error: message });
```

Mọi status (400/403/404/500/khác) đều được ánh xạ về `INormalError` rồi `reject`. Call-site chỉ cần biết một hình dạng lỗi duy nhất, xử lý qua `formatRejectError`:

```ts
export const formatRejectError = (error: IError): string => {
  toast.dismiss();                                 // dọn toast cũ trước
  if (typeof error.message === 'string') return error.message;
  if (!Array.isArray(error.error)) return error.error;
  return error?.error?.[0] ? `${error.error[0].field}: ${error.error[0].message}` : '';
};
```

Hàm này xử lý cả lỗi validation dạng mảng từ backend (`[{ field, message }]`) → hiển thị `"email: is required"`.

---

## 5. List state machine: `useQueryString`

**File:** [`src/hooks/queryString/index.ts`](src/hooks/queryString/index.ts)

Toàn bộ trạng thái của một màn list được mô hình hoá thành **một** object `query`. Mọi tương tác đều là một phép biến đổi trên object đó.

```
                    ┌──────────────────────────────────────┐
   URL (?page=2…) ──▶│                                      │──▶ URL (replace)
                    │            query object              │
   InitialQuery ───▶│  { page, limit, sort, search, filter }│──▶ queryKey → API
                    └──────────────────────────────────────┘
                             ▲    ▲    ▲    ▲
              onSearchHandler┘    │    │    └setQuery (pagination)
                     onChangeSort ┘    └ setFilter
```

### 5.1 Các phép biến đổi

**Search — debounce 400ms, reset trang:**

```ts
const onSearchHandler = _.debounce((e, key = 'search') => {
  const newQuery = _.cloneDeep(query);
  newQuery[key] = value.trim();
  newQuery.page = 1;                 // ⚠️ BẮT BUỘC
  setQuery(newQuery);
}, 400);
```

`page = 1` là bắt buộc: nếu user đang ở trang 5 rồi gõ search, kết quả mới có thể chỉ có 2 trang → server trả rỗng, user thấy "No results" dù thực tế có dữ liệu.

**Sort — máy trạng thái 3 pha:**

```ts
const onChangeSort = (state: { accessorKey: string }) => {
  const field = state.accessorKey;
  if (query.sort === field)        newQuery.sort = `-${field}`;  // asc  → desc
  else if (query.sort === `-${field}`) delete newQuery.sort;     // desc → tắt
  else                             newQuery.sort = field;        // tắt  → asc
};
```

Quy ước `-field` = giảm dần là chuẩn API (giống MongoDB/Django). `checkSort` đọc ngược lại để tô mũi tên:

```ts
const checkSort = (name: string): 1 | -1 | undefined =>
  !query.sort ? undefined : query.sort === name ? 1 : query.sort === `-${name}` ? -1 : undefined;
```

**Filter — merge + reset trang:**

```ts
const setFilter = (param: Partial<IQueryString>) => setQuery({ ...query, ...param, page: 1 });
```

### 5.2 Vì sao dùng `_.cloneDeep`

`query` nằm trong `queryKey`. TanStack Query so key bằng deep-equal nhưng **giữ tham chiếu**; mutate tại chỗ sẽ làm hỏng entry cache đã lưu (cache trỏ tới object đã bị đổi). `cloneDeep` đảm bảo mỗi lần biến đổi tạo một object hoàn toàn mới.

### 5.3 Nợ kỹ thuật của hook này

| Vấn đề | Ảnh hưởng |
|---|---|
| `_.debounce` tạo mới mỗi render | Debounce **không hoạt động** đúng — mỗi lần gõ tạo một timer riêng thay vì gia hạn timer cũ. Cần `useMemo`/`useRef`. |
| `checkSort`, `setFilter`… không `useCallback` | Mọi `useMemo`/`memo` phía dưới phụ thuộc chúng đều miss cache |
| `query` không đồng bộ ngược từ URL | Nút Back của trình duyệt đổi URL nhưng `query` state không cập nhật → UI và URL lệch nhau |

---

## 6. Tầng render bảng: DataTable

**File:** [`src/components/common/DataTable/index.tsx`](src/components/common/DataTable/index.tsx)

### 6.1 Khởi tạo

```tsx
const table = useReactTable({
  data: data || empty,          // `empty` là hằng module-level: tránh tạo [] mới mỗi render
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),   // ⚠️ khai báo nhưng KHÔNG dùng
});
```

### 6.2 Sort & phân trang là server-side hoàn toàn

Đây là điểm dễ hiểu nhầm nhất:

```tsx
table.getCoreRowModel().rows.map(…)     // render RAW rows
```

Component render `getCoreRowModel()` — dữ liệu thô đúng như server trả — **không phải** `getRowModel()` (đã áp sort/phân trang client-side). Nghĩa là:

- Click header → gọi `onSorting(columnDef)` → `onChangeSort` → đổi `query.sort` → refetch. TanStack Table **không** tự sort gì cả.
- `getPaginationRowModel()` được khai báo nhưng vô tác dụng vì row model của nó không bao giờ được đọc. **Đây là code chết** — nên xoá để tránh gây hiểu nhầm rằng có phân trang client-side.

**Vì sao chọn server-side:** dataset có thể hàng nghìn bản ghi; tải hết về client để sort là không khả thi. TanStack Table ở đây đóng vai trò **render engine + column API**, không phải data engine.

### 6.3 Ba trạng thái hiển thị

```tsx
{loading ? (
  <TableRow><TableCell colSpan={columns.length}><Loading /></TableCell></TableRow>
) : table.getCoreRowModel().rows?.length ? (
  rows.map(…)
) : (
  <EmptyState />    // "No results found · Please change or remove search/filters"
)}
```

**Thiếu trạng thái thứ tư: error.** Vì `queryFn` nuốt lỗi (bước 5), lỗi API rơi vào nhánh empty state. Bổ sung nhánh error là ưu tiên số 1 trong [§15](#15-nợ-kỹ-thuật-đã-biết).

### 6.4 Sizing & sticky column

```tsx
const sizeWidth = header.column.getSize();
style={{ ...(sizeWidth !== 150 && { minWidth: sizeWidth, maxWidth: sizeWidth }) }}
```

`150` là **default size của TanStack**, được dùng làm sentinel nghĩa là "không set size → để tự do". Hợp lý nhưng là magic number không có tên — nên tách thành hằng `const TANSTACK_DEFAULT_SIZE = 150`.

Sticky column qua `columnDef.id`:

```tsx
<TableHead type={header.column.columnDef.id as ISticky} … />
```

Column nào đặt `id: ESticky.right` sẽ được `TableHead`/`TableCell` áp CSS ghim phải — dùng cho cột Action luôn hiển thị khi cuộn ngang.

### 6.5 DnD & tooltip

Mỗi row bọc `DNDItem` trong `DndProvider` (react-dnd HTML5 backend), bật/tắt bằng `isDND`. Với Jobs `isDND = false` nên chỉ là passthrough. Hạ tầng này phục vụ các bảng sắp xếp thứ tự được ở module khác.

Mỗi cell bọc `EllipsisTooltip` — tự phát hiện text tràn và hiện tooltip.

**Bẫy:** `moveField` khai báo `useCallback(…, [])` nhưng đọc `setList` và `onChangeDND` từ closure. Với deps rỗng, nó khoá cứng giá trị lần render đầu. Hiện không lộ bug vì các bảng DnD truyền prop ổn định, nhưng đây là bug tiềm ẩn.

---

## 7. Dual-path Desktop / Mobile

**Không phải responsive CSS — là hai code path riêng biệt.**

### 7.1 Nguồn của `openMobile`

```tsx
// App.tsx
const handleResize = () => setOpenMobile(window.screen.width < theme.breakpoints.md);
window.addEventListener('resize', handleResize);
window.addEventListener('load',   handleResize);
```

Lưu trong `useGlobal` (persist). Lưu ý dùng `window.screen.width` (kích thước **màn hình vật lý**) chứ không phải `window.innerWidth` (kích thước **viewport**) — nghĩa là thu nhỏ cửa sổ desktop sẽ *không* kích hoạt chế độ mobile. Đây là chủ ý: phân biệt thiết bị, không phân biệt kích thước cửa sổ. *(Đánh đổi: DevTools device emulation không đổi `screen.width`, nên khó test mobile trên desktop.)*

### 7.2 Hai query loại trừ nhau

```tsx
const { data, isLoading } = useGetList({ ...query });            // enabled: !openMobile
const { data: infiniteData, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteGetList({ ...query }, { enabled: openMobile });
```

### 7.3 Infinite query

```ts
useInfiniteQuery({
  queryKey: [queryKey.jobs.infinite, params],
  queryFn: async ({ pageParam = 1 }) => {
    const response = await jobsController.getJobList({ ...params, page: pageParam, limit: 20 });
    const metadata = response?.data?.metadata || {};
    return { data: response.data, pageParams: pageParam, hasMore: pageParam < (metadata.totalPage || 1) };
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.pageParams + 1 : undefined,
});
```

`getNextPageParam` trả `undefined` để báo hết dữ liệu → `hasNextPage = false`.

### 7.4 Làm phẳng cho render

```tsx
const flattenedData = useMemo(
  () => infiniteData?.pages.flatMap((p) => p?.data?.data || []) ?? [],
  [infiniteData?.pages]
);
```

### 7.5 Rẽ nhánh render

```tsx
{!openMobile && <div className='layout-content h-[calc(100vh-191px-16px)]'>
  <DataTable … /></div>}

{openMobile && <div className='h-[calc(100vh-39px-82px-30px)] overflow-y-auto'>
  <CardList data={formatTableData(flattenedData)} fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} /></div>}
```

`CardList` dùng `react-intersection-observer` — sentinel cuối danh sách vào viewport thì gọi `fetchNextPage()`.

> **⚠️ Bất biến bảo trì:** Mọi thay đổi trên màn list phải áp dụng cho **cả hai** nhánh. Thêm cột → thêm field vào card. Thêm filter → kiểm tra cả hai query. Thêm mutation → invalidate **cả** `jobs.list` **và** `jobs.infinite`.

**Nợ kỹ thuật:** các `calc()` hardcode chiều cao header (`191px`, `39px`, `82px`, `30px`). Đổi chiều cao header sẽ vỡ layout ở nhiều file mà không có cảnh báo. Nên chuyển sang CSS custom property (`--header-h`) đặt tại layout.

---

## 8. Overlay system: Drawer external store

**Files:** [`use-drawer.tsx`](src/components/common/DrawerRight/use-drawer.tsx) · [`index.tsx`](src/components/common/DrawerRight/index.tsx)

Đây là abstraction đáng chú ý nhất của codebase. Đang được dùng ở **32 file** trong `src/modules`.

### 8.1 Vấn đề cần giải

Luồng nghiệp vụ nhiều tầng: bảng Jobs → drawer Job Detail → drawer Applicant Profile → drawer Clock-in QR → drawer Status. Với Context/state cục bộ ta sẽ phải:

- Khai báo trước mọi modal ở component cha
- Truyền `open`/`setOpen` qua nhiều tầng (prop drilling)
- Không mở được modal từ trong `cell` renderer của bảng

### 8.2 Lời giải: external store

Cùng pattern với `react-hot-toast` — state sống **ngoài** React, component đăng ký nhận thông báo:

```ts
let memoryState: Required<DrawerProps>[] = [];        // ① state module-level
const listeners: Array<(state: any) => void> = [];    // ② danh sách setState đã đăng ký

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);         // ③ reducer thuần
  listeners.forEach((listener) => listener(memoryState));   // ④ broadcast
}

const useDrawerRight = () => {
  const [state, setState] = useState(memoryState);
  useEffect(() => {
    listeners.push(setState);                          // ⑤ đăng ký khi mount
    return () => { listeners.splice(listeners.indexOf(setState), 1); };  // ⑥ huỷ khi unmount
  }, []);
  …
};
```

**Vì sao không dùng Context:** Context Provider bọc cây con, chỉ component *bên trong* mới gọi được. External store gọi được từ **bất kỳ đâu**, kể cả code không phải component. Ngoài ra Context re-render toàn bộ subtree khi giá trị đổi; ở đây chỉ các component thực sự gọi `useDrawerRight()` mới re-render.

*(Ghi chú: React 18+ có `useSyncExternalStore` — API chính thức cho đúng pattern này, xử lý tearing trong concurrent rendering. Cách thủ công ở đây chạy được nhưng chưa an toàn với concurrent features.)*

### 8.3 Reducer — quản lý stack

```ts
case 'SHOW_DRAWER': {
  const drawerProps = { ...defaultDrawerState, ...action.payload };
  if (!drawerProps.id) drawerProps.id = generateId();     // tự sinh id
  drawerProps.open = true;

  const existingIndex = state.findIndex((d) => d.id === drawerProps.id);
  if (existingIndex >= 0) {                                // UPSERT theo id
    const newState = [...state];
    newState[existingIndex] = drawerProps;
    return newState;
  }
  return [...state, drawerProps];                          // PUSH lên stack
}

case 'HIDE_DRAWER':
  return action.drawerId
    ? state.filter((d) => d.id !== action.drawerId)        // ⚠️ REMOVE, không phải open=false
    : state.slice(0, -1);                                  // pop drawer trên cùng

case 'HIDE_ALL_DRAWERS':
  return [];
```

**Quyết định thiết kế quan trọng:** `HIDE_DRAWER` **xoá khỏi mảng** thay vì set `open = false`. Hệ quả là component con **unmount ngay lập tức** → mọi state nội bộ (form đang nhập dở, query đang chạy) bị huỷ. Đúng cho use case này: mở lại drawer phải là phiên làm việc mới, không phải khôi phục dở dang.

**Upsert theo `id`:** gọi `show()` với `id` đã tồn tại sẽ *cập nhật* drawer đó thay vì mở chồng — cho phép cập nhật nội dung drawer đang mở.

### 8.4 Một điểm mount duy nhất

```tsx
// App.tsx — NGOÀI routes, nên sống sót qua mọi lần đổi route
<Drawer />
```

```tsx
// DrawerRight/index.tsx
const openDrawers = allDrawers.filter((d) => d.open);
if (openDrawers.length === 0) return null;

return (
  <Fragment>
    {openDrawers.map((drawerState) => (
      <Sheet key={drawerState.id} {...drawerState} onOpenChange={onOpenChange}>
        {drawerState.open && <div className='fixed inset-0 backdrop-blur-[2px] z-40' />}
        <SheetContent id={drawerState.id}
                      className={cn(drawerState.contentClassname, 'p-0 sm:min-w-[522px] h-full')}
                      onInteractOutside={clickOutside}>
          …
        </SheetContent>
      </Sheet>
    ))}
  </Fragment>
);
```

Mỗi drawer là một `<Sheet>` (Radix Dialog) riêng với backdrop riêng, xếp chồng theo thứ tự mảng.

**Xử lý click-outside cho stack:** đây là chi tiết tinh tế. Click vào drawer *bên dưới* không được đóng drawer *bên trên*:

```tsx
const clickOutside = (e: any) => {
  const target = e.target as HTMLElement;
  const isClickOnAnotherDrawer = openDrawers.some((drawer) => {
    if (drawer.id === drawerState.id) return false;        // bỏ qua chính nó
    const el = document.getElementById(drawer.id);
    return el && (el === target || el.contains(target));
  });
  if (!isClickOnAnotherDrawer) hideAll();
};
```

*(Đây là lý do `SheetContent` phải có `id={drawerState.id}` — để tra ngược bằng `getElementById`.)*

### 8.5 API sử dụng

```tsx
const { show: showDrawer } = useDrawerRight();

showDrawer({
  title: 'Applicant Profile',
  isHeader: true,
  isFooter: false,
  isBack: false,
  contentClassname: 'w-full max-w-screen w-[450px] h-screen',
  children: <ApplicantProfile employeeId={applicant.user?._id}
                              jobId={jobId ?? ''}
                              shiftId={applicant.shift} />,
});
```

**`children` là ReactNode dựng sẵn, không phải component reference.** Hệ quả cần nắm:

| Hệ quả | Chi tiết |
|---|---|
| Props bị **đóng băng** tại thời điểm `show()` | State cha đổi sau đó không truyền được vào |
| Component con phải **tự lấy data** | `ApplicantProfile` tự gọi `useGetProfileEmployees` — đúng pattern |
| Không cần khai báo trước ở cha | Gọi được từ `cell` renderer, từ handler, từ bất kỳ đâu |
| JSX được tạo dù drawer chưa mở | Với cây con nặng, nên truyền props và để component tự render |

### 8.6 Nested drawer & helper

`metric-dashboard/index.tsx` mở drawer từ tile metric với `side: 'left'`; bên trong lại `show()` tiếp → stack nhiều tầng.

```ts
const resetToFirstDrawer = () => {
  setOpenLoading(true);
  const firstDrawer = state.length > 0 ? { ...state[0] } : null;
  hideAll();
  if (firstDrawer) {
    setTimeout(() => { show(firstDrawer); setOpenLoading(false); }, 50);   // ⚠️
  } else setOpenLoading(false);
};
```

Dùng sau khi hoàn tất luồng clock-in/clock-out để quay về drawer gốc (xem `jobStatus/clockIn/status.tsx`).

**`setTimeout(50)` là điểm yếu:** đây là dùng thời gian để đồng bộ state — chạy được vì `dispatch` đồng bộ và 50ms đủ để React flush, nhưng mong manh dưới tải nặng hoặc concurrent rendering. Cách chuẩn: `dispatch` một action `RESET_TO_FIRST` xử lý nguyên tử trong reducer.

### 8.7 Footer form submission

```tsx
<Button
  onClick={drawerState?.onOk}
  loading={drawerState?.loadingOk || openLoading}
  {...(drawerState?.idForm && { form: drawerState.idForm, type: 'submit' })}
>
  {drawerState?.okMess}
</Button>
```

Dùng thuộc tính HTML `form="<id>"` để nút **nằm ngoài** `<form>` vẫn submit được form đó. Giải quyết đúng bài toán: footer cố định ở đáy drawer, form cuộn ở giữa.

**Bất biến:** `idForm` mặc định là `'userForm'` — form con **phải** đặt `id` khớp, nếu không nút OK sẽ không làm gì cả.

### 8.8 Drawer vs PopupConfirm

Confirm dialog **không** dùng drawer store, mà là state cục bộ:

```tsx
const [delSelect, setDelSelect] = useState<string>();

<PopupConfirm
  open={!!delSelect}
  setOpen={setDelSelect}
  title='Are you sure you want to delete this item?'
  description='Deleted item cannot be retrieved.'
  onOk={handleDel}
  loadingOk={del.isPending}
/>
```

| Dùng | Khi nào |
|---|---|
| **Drawer** (`show()`) | Nội dung phong phú, nhiều tầng, mở từ nơi không có quan hệ cha-con |
| **PopupConfirm** (state cục bộ) | Xác nhận đơn giản, phạm vi một màn, gắn với một hành động |

---

## 9. Vòng đời mutation: write → invalidate → re-render

Trace đầy đủ thao tác xoá một job:

```
① Click nút Trash2 trong cell Action
      handleOpenDel(rowId)  →  setDelSelect(rowId)
         ↓
② PopupConfirm mở  (open = !!delSelect)
         ↓
③ User bấm Confirm  →  handleDel()
      del.mutate(delSelect, { onSuccess: () => setDelSelect(undefined) })
         ↓
④ mutationFn = jobsController.delete
      apiConfig.delete(API.JOBS.DELETE(id))
         ↓
⑤ onSuccess (khai báo TRONG hook, không ở component):
      toast.success(SYS_MESS.SUCCESS.DELETE)
      queryClient.invalidateQueries({ queryKey: [queryKey.jobs.list] })
      queryClient.invalidateQueries({ queryKey: [queryKey.jobs.infinite] })
         ↓
⑥ TanStack đánh dấu stale mọi query khớp PREFIX key
      → query đang active refetch ngay
      → query inactive refetch khi được mount lại
         ↓
⑦ useGetList trả data mới → formatTableData → DataTable re-render
```

### 9.1 Phân chia trách nhiệm

```ts
// TRONG hook — mọi thứ liên quan tới cache và thông báo
const del = useMutation({
  mutationKey: [queryKey.jobs.delete],
  mutationFn: jobsController.delete,
  onSuccess: () => {
    toast.success(SYS_MESS.SUCCESS.DELETE);
    queryClient.invalidateQueries({ queryKey: [queryKey.jobs.list] });
    queryClient.invalidateQueries({ queryKey: [queryKey.jobs.infinite] });
  },
  onError: (error: IError) => toast.error(formatRejectError(error)),
});
```

```tsx
// TRONG component — chỉ state của UI
del.mutate(delSelect, { onSuccess: () => setDelSelect(undefined) });
```

**Nguyên tắc:** hook lo *server state*, component lo *UI state*. Cả hai `onSuccess` đều chạy (của hook trước, của call-site sau).

### 9.2 Invalidate theo prefix

`queryKey` của list là `[queryKey.jobs.list, params]`, nhưng invalidate chỉ truyền `[queryKey.jobs.list]`. TanStack khớp theo **prefix**, nên một lệnh xoá sạch cache của **mọi** tổ hợp `params` — user quay lại filter cũ vẫn thấy dữ liệu mới.

### 9.3 Invalidate chéo module

```ts
const approveShift = useMutation({
  mutationFn: jobsController.approveShift,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: [queryKey.jobs.shift_list] });
    queryClient.invalidateQueries({ queryKey: [queryKey.jobStatus.list] });
    queryClient.invalidateQueries({ queryKey: [queryKey.jobStatus.get_job_by_status] });
    toast.success('Approved shift successfully.');
  },
  onError(error: IError) {
    queryClient.invalidateQueries({ queryKey: [queryKey.jobs.shift_list] });   // cả khi lỗi
    queryClient.invalidateQueries({ queryKey: [queryKey.jobStatus.list] });
    toast.error(formatRejectError(error));
  },
});
```

Duyệt một ứng viên đổi trạng thái ở nhiều màn → invalidate cả cụm. **Invalidate cả trong `onError`** là chủ ý: khi lỗi, state client có thể đã lệch với server, refetch để đồng bộ lại.

> **⚠️ Bất biến:** mutation ảnh hưởng danh sách **phải** invalidate cả `<domain>.list` **và** `<domain>.infinite`, nếu không mobile sẽ hiển thị dữ liệu cũ.

---

## 10. Tầng Form

**File tham chiếu:** [`modules/jobs/jobs/pages/modify/index.tsx`](src/modules/jobs/jobs/pages/modify/index.tsx)

### 10.1 Quy ước tách file

```
pages/modify/
  index.tsx        # component: layout, handler, submit
  constants.ts     # yup schema + defaultValues + field config
  jobUtils.ts      # hàm thuần: transform, validate nghiệp vụ
```

Tách schema khỏi component giúp test schema độc lập và tái dùng giữa create/edit.

### 10.2 Khởi tạo form

```tsx
const mode = getModeFromPath(location.pathname);      // create | edit | detail
const { id: idJob } = useParams();
const { createJob, update, useGetDetail } = useJobs();
const { data: detailJob } = useGetDetail(idJob);      // enabled: !!id && id !== createAction

const formMethods = useForm<IModifyShiftForm>({
  resolver: yupResolver(yupModifyJobs()) as any,
  defaultValues: defaultJobValues,
  mode: 'onChange',                                    // validate realtime
});
```

**Một component cho ba mode** (create/edit/detail), phân biệt bằng `getModeFromPath`. Giảm trùng lặp; đổi lại component phình to và nhiều nhánh `if (mode === …)`.

### 10.3 Cầu nối API ⇄ Form

Hình dạng dữ liệu API và form khác nhau (select trả `{value,label}`, API cần `id`). Ba hàm trong [`lib/select.ts`](src/lib/select.ts) đảm nhiệm:

| Hàm | Chiều | Nhiệm vụ |
|---|---|---|
| `formatApiDataToFormData` | API → Form | Bọc id thành `{ value, label }` cho select |
| `getIdFromOption` | Form → API | Bóc `value` khỏi option object |
| `prepareFormDataForSubmission` | Form → API | Chuẩn hoá toàn bộ payload |

**Vì sao tách:** đây là ranh giới chống ăn mòn giữa hợp đồng backend và mô hình UI. Backend đổi tên field chỉ cần sửa ở đây.

### 10.4 Field components

Toàn bộ field dùng wrapper trong [`components/common/form-control`](src/components/common/form-control): `FormInput`, `FormAPISelect`, `FormInputNumber`, `FormTimeInput`, `FormToggleButton`, `FormTextarea`…

`FormAPISelect` là đáng chú ý nhất — select tự gọi API, hỗ trợ search + phân trang, dùng `InitialQuerySelect` (`{ limit: 20, page: 1, sort: 'name', filter: { status: Active } }`).

**Bất biến:** dựng form bằng các wrapper này, **không** dùng trực tiếp Radix primitive — wrapper đã lo `Controller`, hiển thị lỗi, và style thống nhất.

### 10.5 Filter form với field phụ thuộc

Filter bar cũng là react-hook-form. Điểm kỹ thuật đáng chú ý là reset dây chuyền:

```tsx
useEffect(() => {
  const subscription = formMethods.watch((_value, { name }) => {
    if (name === EFilterAdmin.company) {
      formMethods.setValue(EFilterAdmin.brand,     '', { shouldValidate: false });
      formMethods.setValue(EFilterAdmin.locations, '', { shouldValidate: false });
    }
  });
  return () => subscription.unsubscribe();
}, []);
```

Đổi Company → xoá Brand và Location (vì brand thuộc company). Dùng `watch` dạng subscription (không phải `watch(name)` gây re-render) là cách đúng cho side-effect.

Đường đi từ form filter → `query`:

```ts
const onChangeAll = () => {
  const newValues = { ...formMethods.getValues() };
  const validForm  = filterValidValues(newValues);   // bỏ giá trị rỗng/null
  const cleared    = clearCheckFilter(validForm);    // bỏ các key `check_*` (chỉ dùng cho UI)
  const formatted  = formatFilterKeys(cleared);      // đổi tên key theo hợp đồng API
  setFilter({ filter: formatted });
};
```

Chiều ngược lại — khôi phục form từ URL — dùng `reverseFormatFilterKeys`:

```tsx
useEffect(() => {
  formMethods.reset({ ...reverseFormatFilterKeys(query.filter || {}), search: query?.search || '' });
}, [query]);
```

Cặp `formatFilterKeys` / `reverseFormatFilterKeys` phải luôn là nghịch đảo của nhau, nếu không deep-link filter sẽ vỡ.

---

## 11. Phân quyền

**Files:** [`hooks/permission/`](src/hooks/permission) · [`routes/RequirePermission.tsx`](src/routes/RequirePermission.tsx)

### 11.1 Mô hình

Hai enum giao nhau tạo ma trận quyền:

```ts
export enum ADMIN_PERMISSION_ID { VIEW = 1, CREATE = 2, EDIT = 3, DELETE = 4, ASSIGN = 5 }

export enum MODULE_PERMISSION_ID {
  JOB_HOME = 1, JOB_LIST = 2, JOB_CREATE = 3, …, JOB_SHIFT_DETAIL = 13,
  COMPANY_HOME = 20, …    // company: dải 20
  BRAND_HOME = 30, …      // brand:   dải 30
  LOCATION_HOME = 40, …   // location:dải 40
  MANAGEMENT_HOME = 50, … // management: dải 50+
}
```

**Bất biến:** ID mới phải nằm đúng dải số của module. Dải được đánh thưa (10 slot/module) để chèn thêm không phải đánh số lại.

### 11.2 Gate ở tầng route

```tsx
<RequirePermission moduleId={MODULE_PERMISSION_ID.JOB_LIST}>
  <Jobs />
</RequirePermission>
```

Ba nhánh xử lý:

| Điều kiện | Hành vi |
|---|---|
| `isGranted` | Render children |
| `!isGranted` nhưng `moduleIsGranted` | `<Navigate to={NOT_FOUND} replace />` |
| `!moduleIsGranted` | `toast.error(EM29)` → `removeToken()` → `hide()` drawer → về `/` |

Nhánh thứ ba dùng `useDebounce(…, 150)` để tránh nhiều component cùng kích hoạt logout song song.

### 11.3 Kiểm tra quyền trong component

```tsx
const { permissionsGranted: [[isHasPermissionCreate]] } = usePermission({
  modules: [{
    id: MODULE_PERMISSION_ID.JOB_LIST,
    permissions: [ADMIN_PERMISSION_ID.CREATE, ADMIN_PERMISSION_ID.EDIT, ADMIN_PERMISSION_ID.DELETE],
  }],
});
```

`permissionsGranted` là **mảng hai chiều** — `[moduleIndex][permissionIndex]` — nên cú pháp destructuring lồng. API này khó đọc; trả về object có tên (`{ canCreate, canEdit, canDelete }`) sẽ tốt hơn nhiều.

### 11.4 Điểm cần cải thiện

```ts
const modulePermissionIds = hardCodePermission(globalRole || profileData?.role);
```

Ánh xạ role → permission **hardcode ở client**. Rủi ro: đổi role bên backend không phản ánh ở FE cho tới khi deploy lại; và ma trận quyền lộ trong bundle. Nên lấy từ API `/employers/me` và cache qua TanStack Query.

---

## 12. Bản đồ quản lý state

| Loại state | Công cụ | Vị trí | Vòng đời | Ví dụ |
|---|---|---|---|---|
| **Server state** | TanStack Query | `hooks/query/*` | Cache theo `queryKey`, invalidate thủ công | Danh sách job, chi tiết, metric |
| **List/URL state** | `useQueryString` + URL | Cục bộ container | Theo màn, đồng bộ URL | page, limit, sort, search, filter |
| **Global app state** | Zustand + persist | `stores/global` | Sống qua F5 | token, profile, role, `openMobile` |
| **Filter đã lưu** | Zustand + persist | `stores/filters` | Sống qua F5, xoá khi rời màn | Lựa chọn ở MoreFilter |
| **Overlay state** | External store | `DrawerRight/use-drawer` | Trong phiên, xoá khi navigate cứng | Stack drawer |
| **Form state** | react-hook-form | Cục bộ component | Theo lần mount | Form create/edit |
| **UI state cục bộ** | `useState` | Cục bộ component | Theo lần mount | `delSelect`, `shiftModifyPopup` |

**Nguyên tắc chọn:** dữ liệu từ server → **luôn** dùng TanStack Query, không copy vào `useState`. State cần deep-link → `useQueryString`. State cần sống qua F5 → zustand persist. Còn lại → `useState`.

**Về `partialize`:**

```ts
// stores/global — CÓ allowlist rõ ràng ✅
partialize: (state) => ({ accessToken, refreshToken, profileData, globalRole, openMobile }),

// stores/filters — BỊ COMMENT ❌ → persist toàn bộ store
```

`useFilters` hiện persist mọi thứ. Ngoài ra khai báo `localFilter: null | SavedFilter` nhưng khởi tạo `{}` — type nói `null` là hợp lệ, thực tế không bao giờ `null`.

---

## 13. Các bất biến kiến trúc

Danh sách rút gọn để review code. Vi phạm bất kỳ mục nào là bug hoặc nợ kỹ thuật.

| # | Bất biến | Vì sao |
|---|---|---|
| 1 | Component không import từ `src/services` | Bỏ qua cache và xử lý lỗi của tầng query |
| 2 | `hooks/query` không import component/ReactNode | Giữ tầng data thuần, test được |
| 3 | Controller trả **envelope body**, không phải `AxiosResponse` | Interceptor đã unwrap |
| 4 | Không encode `search` ở call-site | Request interceptor đã encode → double-encode |
| 5 | `params` phải nằm trong `queryKey` | Nếu không sẽ không refetch khi filter đổi |
| 6 | Không mutate object đã đưa vào `queryKey` | Hỏng cache key |
| 7 | Mutation invalidate cả `.list` **và** `.infinite` | Mobile sẽ hiển thị dữ liệu cũ |
| 8 | Mọi thay đổi màn list áp cho **cả hai** nhánh desktop/mobile | Hai code path riêng |
| 9 | `page = 1` khi search hoặc đổi filter | Tránh rơi vào trang trống |
| 10 | Route đăng ký bằng `path`, điều hướng bằng `to` | Nhầm sẽ tạo path lồng sai |
| 11 | `MODULE_PERMISSION_ID` mới nằm đúng dải số module | Giữ khả năng mở rộng |
| 12 | Form con phải có `id` khớp `idForm` của drawer | Nút OK không submit được |
| 13 | Key filter lồng mới phải khai báo trong `objectField` của `parseURL` | Deep-link vỡ âm thầm |
| 14 | `formatFilterKeys` / `reverseFormatFilterKeys` phải nghịch đảo nhau | Khôi phục filter từ URL vỡ |
| 15 | `isRefreshing = false` luôn trong `finally` | Treo vĩnh viễn mọi 401 sau đó |
| 16 | Chuỗi hiển thị lấy từ `SYS_MESS` | Tập trung hoá copy |

---

## 14. Playbook: thêm một module mới

Ví dụ thêm module `Invoices`.

**1. Endpoint** — `src/constants/common.ts`

```ts
INVOICES: {
  LIST:   '/invoices',
  CREATE: '/invoices',
  DETAIL: (id: string) => `/invoices/${id}`,
  UPDATE: (id: string) => `/invoices/${id}`,
  DELETE: (id: string) => `/invoices/${id}`,
},
```

**2. Query key** — `src/constants/queryKeys.ts`

```ts
invoices: { list: 'invoice-list', infinite: 'invoice-infinite', detail: 'invoice-detail',
            create: 'invoice-create', update: 'invoice-update', delete: 'invoice-delete' },
```

**3. Service** — `src/services/invoices/index.ts`

```ts
export const invoicesController = {
  getList: (params: IQueryString): Promise<IResponse<IInvoiceResponse>> =>
    apiConfig.get(API.INVOICES.LIST, { params: customParams(params) }),
  getDetail: (id: string): Promise<IResponse<IInvoice>> =>
    apiConfig.get(API.INVOICES.DETAIL(id)),
  delete: (id: string) => apiConfig.delete(API.INVOICES.DELETE(id)),
};
```

**4. Query hook** — `src/hooks/query/invoices/index.ts`

Export `useInvoices()` gồm `useGetList` (`enabled: !openMobile`), `useInfiniteGetList` (`enabled: openMobile`), `useGetDetail` (`enabled: !!id && id !== createAction`), và các mutation kèm `onError` toast + `invalidateQueries` cả `.list` lẫn `.infinite`.

**5. Route** — `src/routes/routes.ts`

```ts
INVOICES: {
  path: 'invoices/*', to: '/invoices',
  LIST:   { path: 'invoice/list',      to: '/invoices/invoice/list',   parent: 'invoices' },
  CREATE: { path: 'invoice/create',    to: '/invoices/invoice/create', parent: 'invoices' },
  EDIT:   { path: 'invoice/edit/:id',  to: '/invoices/invoice/edit',   parent: 'invoices' },
},
```

**6. Permission** — `src/hooks/permission/types.ts`

```ts
INVOICE_HOME = 70, INVOICE_LIST = 71, INVOICE_CREATE = 72, INVOICE_EDIT = 73, INVOICE_DETAIL = 74,
```

Cập nhật `hardCodePermission` để cấp cho các role phù hợp.

**7. Module** — `src/modules/invoices/`

```
invoices/
  index.tsx                    # configRoutes + useRoutes + RequirePermission
  invoices/
    index.tsx                  # screen: Header/HeaderMobile + <TableList/>
    types.ts                   # IInvoice, EInvoice enum, EFilterInvoice
    util/index.ts              # formatTableData
    filter/{index.tsx,constants.ts}
    moreFilter/{index.tsx,constants.ts}
    table/{index.tsx,CardList.tsx}
    pages/modify/{index.tsx,constants.ts}
```

**8. Đăng ký** — thêm nhánh vào `src/routes/index.tsx` và menu tại `components/layout/master/constant.tsx`.

**9. Xác minh**

```bash
yarn build     # gồm tsc -b — strict + noUnusedLocals sẽ bắt lỗi
yarn lint
```

---

## 15. Nợ kỹ thuật đã biết

Xếp theo tác động. Đây là danh sách để lập kế hoạch, không phải để chê code.

### Ưu tiên cao

**1. `queryFn` nuốt lỗi → không phân biệt được lỗi API và rỗng**

```ts
// HIỆN TẠI — lỗi biến mất, isError không bao giờ true
queryFn: async () => {
  try { return (await jobsController.getJobList(params)).data; }
  catch (error) { toast.error(formatRejectError(error as IError)); }
}
```

```ts
// ĐỀ XUẤT — để lỗi nổi lên, xử lý tập trung
// hooks/query
queryFn: async () => (await jobsController.getJobList(params)).data,

// main.tsx
new QueryClient({
  queryCache: new QueryCache({ onError: (e) => toast.error(formatRejectError(e as IError)) }),
  …
});

// DataTable — thêm trạng thái thứ tư
{isError ? <ErrorState onRetry={refetch} /> : loading ? … }
```

**2. `@ts-nocheck` và `any` làm mất giá trị TypeScript**

`DrawerRight/index.tsx` mở đầu bằng `// @ts-nocheck` — vô hiệu hoá type check cho toàn bộ file chứa logic overlay quan trọng nhất. Cộng với `profileData: null | any`, `data?: TData[] | null | any`, `IListResponse<any>` ở nhiều nơi.

**3. Không có test**

Không có test runner. Hai vùng rủi ro cao cần test trước: `refreshAccessToken` + `failedQueue` (race condition), và `reducer` của drawer stack (logic thuần, dễ test).

### Ưu tiên trung bình

**4. `_.debounce` tạo mới mỗi render** — trong `useQueryString`, khiến debounce không có tác dụng. Sửa bằng `useMemo(() => _.debounce(fn, 400), [])` + cleanup `cancel()`.

**5. Hàm trả về không ổn định** — `checkSort`, `setFilter`, `onChangeSort` không `useCallback`, làm mọi `useMemo` phía dưới miss cache.

**6. Dùng sai API TanStack Table** — `sortUndefined` chở hướng sort (nên chuyển sang `meta`); `getPaginationRowModel()` khai báo nhưng không dùng (nên xoá).

**7. `setTimeout(50)` làm cơ chế đồng bộ** — trong `resetToFirstDrawer`/`resetToDrawerById`. Nên gộp thành một action nguyên tử trong reducer.

**8. `hardCodePermission` hardcode ở client** — nên lấy từ API.

**9. Magic number trong `calc()`** — `h-[calc(100vh-191px-16px)]`, `h-[calc(100vh-39px-82px-30px)]`. Nên dùng CSS custom property đặt tại layout.

**10. Deps array không trung thực** — nhiều `// eslint-disable-next-line react-hooks/exhaustive-deps`; `moveField` trong DataTable có deps `[]` nhưng đọc closure.

### Ưu tiên thấp

**11. `console.log` trong production** — `RequireAuth` và `RequirePermission` log mỗi lần render; `filter/index.tsx` log `'Form methods reset with:'`.

**12. Code chết** — khối comment-out lớn trong reducer drawer và `DataTable.moveField`.

**13. Typo trong hằng số** — `'profile-emmplyees'` (queryKey), `nuetral-light-200` (class Tailwind, class này không tồn tại nên không áp style).

**14. `useFilters` persist toàn bộ store** — `partialize` bị comment; `localFilter` khai báo `null | SavedFilter` nhưng khởi tạo `{}`.

**15. `formatTableData` gọi trong JSX** — chạy lại mỗi render, tạo mảng mới phá memo hoá. Nên bọc `useMemo`.

**16. Comment lẫn Việt–Anh** — nên thống nhất một ngôn ngữ.

---

## Phụ lục: bản đồ file nhanh

| Cần tìm | File |
|---|---|
| Axios instance, interceptor, refresh token | `src/services/config/index.ts` |
| Danh sách endpoint | `src/constants/common.ts` → `API` |
| Query key | `src/constants/queryKeys.ts` → `queryKey` |
| Cây route | `src/routes/routes.ts` → `APP_ROUTES` |
| Bảng route gốc | `src/routes/index.tsx` |
| Enum & ma trận quyền | `src/hooks/permission/types.ts`, `function.ts` |
| State list (page/sort/filter) | `src/hooks/queryString/index.ts` |
| Điều hướng có overload | `src/hooks/route/index.ts` |
| Serialize/parse URL | `src/lib/utils.ts` → `createQueryString`, `parseURL` |
| Store drawer | `src/components/common/DrawerRight/use-drawer.tsx` |
| Render drawer | `src/components/common/DrawerRight/index.tsx` |
| Bảng dùng chung | `src/components/common/DataTable/index.tsx` |
| Field form | `src/components/common/form-control/` |
| Global store | `src/stores/global/index.ts` |
| Chuỗi hiển thị | `src/constants/rules.ts` → `SYS_MESS` |
| Cầu nối API ⇄ form select | `src/lib/select.ts` |
| Helper filter | `src/lib/filter.ts` |

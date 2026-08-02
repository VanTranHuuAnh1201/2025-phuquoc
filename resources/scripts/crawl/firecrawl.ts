/**
 * Wrapper mỏng quanh Firecrawl API.
 *
 * Mặc định trỏ tới Firecrawl Cloud. Nếu bạn self-host (docker compose của repo
 * firecrawl/firecrawl) thì set FIRECRAWL_API_URL=http://localhost:3002 trong .env.local.
 */

import Firecrawl from "@mendable/firecrawl-js";

const apiKey = process.env.FIRECRAWL_API_KEY;
const apiUrl = process.env.FIRECRAWL_API_URL; // undefined => dùng cloud

if (!apiKey && !apiUrl) {
    throw new Error(
        "Thiếu FIRECRAWL_API_KEY. Tạo file .env.local ở gốc project và thêm:\n" +
            "  FIRECRAWL_API_KEY=fc-xxxxxxxx\n" +
            "Lấy key miễn phí tại https://www.firecrawl.dev/app/api-keys\n" +
            "Hoặc self-host và set FIRECRAWL_API_URL=http://localhost:3002"
    );
}

export const firecrawl = new Firecrawl({
    apiKey: apiKey ?? "self-hosted",
    ...(apiUrl ? { apiUrl } : {}),
});

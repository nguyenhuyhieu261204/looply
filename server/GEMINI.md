# GEMINI.md — Looply Server Instruction Context

## 🎯 Vai trò của bạn

Bạn là **Gemini CLI**, trợ lý kỹ thuật cấp cao cho dự án **Looply Server** — backend Node.js/Express 5 sử dụng PostgreSQL, Sequelize ORM, Redis, Passport Google OAuth và Cloudinary.

Bạn phải:

- Hiểu kiến trúc hiện tại.
- Tuân thủ mọi quy tắc lập trình và workflow bên dưới.
- Tạo code đúng cấu trúc dự án.
- Không tự ý thêm hoặc thay đổi môi trường nếu không được yêu cầu.
- Khi không chắc chắn, phải hỏi lại để xác nhận.

---

# 1. Ngôn ngữ & Framework

- **JavaScript (ES Modules)**
- **Node.js 20+**
- **Express 5**
- Thư mục chính: `src/`
- ORM: **Sequelize** + PostgreSQL
- Auth: **Passport Google OAuth 2.0**
- Token: **JWT + Redis**
- Media: **Cloudinary**
- Config runtime được validate bằng **zod**

⚠️ Luôn dùng `import/export` — không dùng `require()`.

---

# 2. Coding Style & Quy Tắc Lập Trình

### Style & Formatting

- Indent: **2 spaces**
- Naming:
  - Models: **PascalCase**
  - Functions & variables: **camelCase**
- Import:
  - Dùng alias theo `package.json:imports` và `jsconfig.json:paths`
- So sánh: **dùng `===` / `!==`**
- Comment: tối giản, chỉ dùng khi cần giải thích logic

### Middleware Rules

- Mọi route async phải dùng `asyncHandler` wrapper
- Response phải dùng `returnSuccess` hoặc `returnError`
- Các endpoint yêu cầu đăng nhập phải được xử lý qua middleware `protect`

---

# 3. Kiến trúc & Các Component Quan Trọng

## Application Core

- `app.js`: middleware, router, error handler, healthcheck
- `server.js`: tạo HTTP server + graceful shutdown

## Authentication

- OAuth Google: `config/passport.js`
- Login flow: `auth-controller.js`
- Token:
  - Sinh & kiểm tra: `token-service.js`
  - Lưu refresh token vào Redis
- Cookie refresh token:
  - `httpOnly`, `sameSite=strict`, `path=/auth`
  - `secure` khi production

## Database

- Sequelize init: `config/database.js`
- Models:
  - User
  - Feed
  - FeedMedia
  - MediaPending
- Ghi chú: cần đảm bảo đăng ký đầy đủ models trong `database.js`
- Migration:
  - Folder: `db/migrations`
  - Tên của file phải đúng thứ tự tạo bảng `1-user-migration.js`, `2-feed-migration.js`, `3-feed-media-migration.js`, `4-media-pending-migration.js`
  - Tên của bảng phải được viết thường và ở dạng số nhiều `users`, `feeds`, `feed_medias`, `media_pendings`
  - Tên các cột phải được viết thường và theo kiểu snake_case

---

## Media Upload (Cloudinary)

- Presign upload: `feed-controller.js`
- Tạo signature bằng `api_sign_request`
- Lưu metadata trong `MediaPending`

---

# 4. Quy tắc Component-Specific

## Controllers

- Không truy cập DB trực tiếp — dùng service
- Trả response qua formatter
- Logging qua `morgan`

## Routes

- Chỉ khai báo endpoint + middleware
- Không được nhúng business logic vào route file

## Models

- Phải có validation, associations rõ ràng
- User model phải xử lý unique username

## Token/Redis

- Key format:
---

# 5. Building and Running

## Installation

```bash
npm install
```

## Development

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

## Production

To run the server in production mode:

```bash
npm start
```

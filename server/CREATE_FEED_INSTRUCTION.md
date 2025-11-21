# HƯỚNG DẪN TRIỂN KHAI FEED CONTROLLER

## ENDPOINT 1: GET /feed/upload-signature

### CÁC BƯỚC XỬ LÝ:

**Bước 1: XÁC THỰC USER**

- Middleware authMiddleware lấy thông tin user từ token
- Lấy userId từ request

**Bước 2: TẠO CLOUDINARY CREDENTIALS**

- Tạo timestamp hiện tại (giây)
- Tạo public*id unique theo định dạng: feed*{userId}_{timestamp}_{randomString}
- Tạo Cloudinary signature sử dụng API secret
- Chỉ định folder: "feeds/pending"

**Bước 3: LƯU THÔNG TIN PENDING**

- Tạo record trong bảng MediaPending
- Lưu userId, cloudinaryPublicId, type
- Type có thể mặc định là "image" hoặc nhận từ client

**Bước 4: TRẢ VỀ RESPONSE**

- Trả về object chứa: signature, timestamp, apiKey, cloudName, publicId, folder
- Format response: { success: true, data: { ...credentials } }

### VALIDATION:

- User phải đăng nhập
- UserId phải tồn tại trong database

---

## ENDPOINT 2: POST /api/feed

### CÁC BƯỚC XỬ LÝ:

**Bước 1: VALIDATE INPUT**

- Kiểm tra có ít nhất content hoặc mediaPublicIds
- Kiểm tra mediaPublicIds không vượt quá 10 items
- Validate content không vượt quá độ dài cho phép

**Bước 2: BẮT ĐẦU TRANSACTION**

- Khởi tạo database transaction
- Tất cả database operations sẽ rollback nếu có lỗi

**Bước 3: TẠO FEED RECORD**

- Tạo record trong bảng Feed
- Fields: userId, content, isPublic, isModerated = false
- Lưu ý: isModerated luôn false khi tạo mới

**Bước 4: XỬ LÝ MEDIA (nếu có)**

- Với mỗi mediaPublicId trong mảng:
  - Kiểm tra tồn tại trong MediaPending và thuộc về user
  - Lấy thông tin media từ Cloudinary API
  - Tạo record trong FeedMedia
  - Xóa record tương ứng trong MediaPending

**Bước 5: HOÀN THÀNH TRANSACTION**

- Commit transaction nếu tất cả operations thành công
- Rollback transaction nếu có bất kỳ lỗi nào

**Bước 6: TRẢ VỀ RESPONSE**

- Trả về thông tin feed đã tạo kèm danh sách media
- Format: { success: true, data: { feed: {...} } }

### ERROR HANDLING:

- Nếu transaction rollback: MediaPending records vẫn giữ nguyên
- Cleanup job sẽ xử lý các MediaPending records tồn đọng
- Trả về lỗi cụ thể cho client

### VALIDATION QUAN TRỌNG:

- User phải là owner của tất cả mediaPublicIds
- MediaPublicIds phải tồn tại trong MediaPending
- Feed phải có ít nhất content hoặc media

---

## TRIỂN KHAI CLEANUP PENDING MEDIA JOB

### CÁC BƯỚC TRIỂN KHAI

#### Bước 1: TẠO CLEANUP FUNCTION

**Logic xử lý:**

1. Truy vấn các MediaPending records được tạo trước 24 giờ
2. Với mỗi record:
   - Xóa media file trên Cloudinary sử dụng cloudinaryPublicId
   - Xóa record khỏi bảng MediaPending
3. Ghi log kết quả thực hiện

**Xử lý lỗi:**

- Nếu xóa trên Cloudinary thất bại, vẫn tiếp tục với record tiếp theo
- Ghi log lỗi chi tiết để debug

#### Bước 2: CẤU HÌNH SCHEDULER

**Tần suất chạy:** Mỗi ngày 1 lần

**Thời điểm khuyến nghị:** 2:00 AM (ít người dùng)

**Các option scheduling:**

- Cron job: `0 2 * * *` (chạy 2h sáng mỗi ngày)
- Interval: 24 giờ một lần

#### Bước 3: TRIỂN KHAI VÀ MONITORING

**Khởi chạy:**

- Start job khi server khởi động
- Đảm bảo chỉ có một instance job chạy trong cluster

**Theo dõi:**

- Ghi log số lượng records đã xóa
- Ghi log lỗi nếu có
- Monitoring số lượng pending media tồn đọng

### LƯU Ý QUAN TRỌNG

- **Timezone:** Sử dụng timezone thống nhất cho server
- **Performance:** Chunk processing nếu số lượng records lớn
- **Safety:** Kiểm tra kỹ điều kiện thời gian tránh xóa nhầm
- **Backup:** Có thể backup records trước khi xóa (tùy requirement)

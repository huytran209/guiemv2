# Our 6 Months Together — Mobile Polish v4

Website kỷ niệm 6 tháng của Huy Tran & Thuỳ Linh. Phiên bản này giữ nội dung, ảnh và bài nhạc đã cung cấp, đồng thời bổ sung hệ thống animation tinh tế, chuyển động theo cuộn và cải thiện khả năng sử dụng trên điện thoại.

## Cấu trúc

- `index.html` — nội dung trang và các thành phần.
- `style.css` — giao diện chính, màu sắc, bố cục và responsive.
- `animations.css` — hệ thống animation, hiệu ứng xuất hiện khi cuộn, phản hồi nút và hiệu ứng nền.
- `script.js` — tương tác, bộ đếm, trình phát nhạc, lời nhắn, thanh tiến độ cuộn và hiệu ứng.
- `assets/images/` — hai ảnh đã cung cấp.
- `assets/music/` — bản MP3 ưu tiên và M4A dự phòng.
- `index-single-standalone.html` — bản một file độc lập, nhúng tài nguyên.

## Chạy thử

Mở `index.html` trực tiếp trong trình duyệt hoặc dùng một máy chủ tĩnh cục bộ. Trên iOS Safari, trình duyệt có thể chặn tự phát nhạc có tiếng; nếu vậy, chạm nút phát trên trình phát nổi.

## Đăng GitHub Pages

1. Giải nén ZIP.
2. Tải toàn bộ nội dung bên trong thư mục dự án lên thư mục gốc repository (không chỉ tải ZIP).
3. Giữ nguyên đường dẫn `assets/images/` và `assets/music/`.
4. Mở **Settings → Pages**, chọn nhánh `main` và thư mục `/ (root)`.
5. Sau khi triển khai, mở website và kiểm tra ảnh, nhạc, trình phát thu gọn/mở rộng và các tương tác.

## Tùy chỉnh

- Đổi ảnh: thay file trong `assets/images/` bằng tên tương ứng hoặc cập nhật đường dẫn trong `index.html`.
- Đổi nhạc: thay `assets/music/our-song.mp3` (và tùy chọn M4A dự phòng), giữ đúng tên file hoặc cập nhật các thẻ `<source>`.
- Đổi màu/font: chỉnh các CSS custom properties ở đầu `style.css`.
- Tắt animation: thiết bị/người dùng bật `prefers-reduced-motion: reduce` sẽ nhận chuyển động tối thiểu.

## Animation trong v4

- Thanh tiến độ cuộn ở cạnh trên.
- Reveal theo cuộn với hướng chuyển động xen kẽ.
- Hiệu ứng ánh sáng lướt trên bìa nhật ký.
- Chuyển động nhẹ cho ảnh Polaroid và con dấu.
- Parallax nền rất nhẹ trên thiết bị desktop có chuột.
- Hiệu ứng vinyl khi nhạc đang phát.
- Hiệu ứng nhấn nút và burst trang trí khi mở nhật ký/rút lời nhắn.
- Hỗ trợ `prefers-reduced-motion`.

## Kiểm tra đã thực hiện

- JavaScript: đã chạy `node --check`.
- Đã kiểm tra các đường dẫn ảnh/nhạc trong cấu trúc gói.
- Đã tạo bản standalone bằng cách nhúng CSS, JavaScript, ảnh và nhạc.

Chưa xác nhận trực tiếp trên mọi phiên bản iOS Safari hoặc trên URL GitHub Pages của repository; cần kiểm thử thực tế sau khi xuất bản.

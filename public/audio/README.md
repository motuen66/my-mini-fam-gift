# Âm thanh

Bỏ 3 file ghi âm/nhạc vào thư mục này. Web tự thử `.mp3`, `.m4a`, `.wav`, `.ogg`.

## File cần có

1. `bgm` — nhạc nền lofi/ấm áp (tự lặp).
2. `voice-boyfriend` — lời chúc của a Mỏ gửi em Tròn.
3. `voice-family` — lời chúc của cả nhà 3 người.

Ví dụ: `bgm.m4a`, `voice-boyfriend.m4a`, `voice-family.m4a`.

## Cách ghi âm bằng iPhone

1. Mở app Ghi âm (Voice Memos), ghi lời chúc.
2. Chạm vào bản ghi → Chia sẻ → Lưu vào Files.
3. Đổi tên thành `voice-boyfriend.m4a` / `voice-family.m4a`.
4. Kéo vào thư mục này.
5. Chạy lại `npm.cmd run build` và deploy lại.

## Nếu chưa có file

- Nhạc nền: web tự phát một đoạn nhạc tổng hợp nhẹ.
- Voice note: web hiện phụ đề và tự chạy như một bản đọc chậm.
- Không có file nào bị lỗi 404 hiển thị ra ngoài.

# Quà 20/10 — a Mỏ gửi em Tròn & Gia đình nhỏ

Trang quà tặng 20/10 tương tác, tối ưu cho điện thoại:

- **Tab 1 — Dành cho em Tròn:** hộp quà chạy trốn, Photo Story 6 khung, vòng quay may mắn có troll, 20 thẻ lý do + lá thư cuối, voice note.
- **Tab 2 — Gia đình nhỏ:** 3 cây nến (Ba vàng, Mẹ xanh, Con hồng), thắp nến sáng cả trang, confetti 3 màu, voice note gia đình, hộp quà 5 lớp.
- Sticker WebP cắt sẵn từ 2 sheet AI, có fallback SVG khi thiếu file.
- Không cần server/backend. Chỉ là file tĩnh sau khi build.

## Chạy thử trên máy

Yêu cầu: Node.js 20+.

```powershell
npm.cmd install
npm.cmd run dev
```

Mở link `http://localhost:3000`. Điện thoại cùng Wi-Fi có thể mở link LAN mà Vite in ra (dạng `http://192.168.x.x:3000`).

> Trên Windows, dùng `npm.cmd` nếu PowerShell chặn `npm.ps1`.

## Sửa nội dung

Gần như mọi câu chữ nằm trong **`src/content/config.ts`**:

| Muốn sửa | Sửa ở đâu |
| --- | --- |
| Tên 3 người | `DEFAULT_CONFIG.names` |
| Lời chúc voice | `voiceNoteBoyfriend`, `voiceNoteFamily` |
| Caption 6 ảnh | `PHOTO_MOMENTS` |
| Câu chân thành cuối Photo Story | `PHOTO_STORY_FINAL_LINE` |
| 8 giải vòng quay | `INITIAL_WHEEL_PRIZES` |
| 20 lý do | `INITIAL_REASONS` |
| Lá thư cuối | `LOVE_LETTER` |
| 3 cây nến | `INITIAL_CANDLES` |
| Hộp quà 5 lớp | `INITIAL_GIFT_LAYERS` |
| Câu kết gia đình | `FAMILY_CLOSING` |
| Sticker | `STICKERS_CONFIG` |

Các chỗ có ghi `TODO` là gợi ý thay bằng kỷ niệm thật. Nếu không thay, trang vẫn hiển thị câu hoàn chỉnh.

## Thay ảnh, sticker, âm thanh

- **Ảnh:** bỏ `moment-1.jpg` … `moment-6.jpg` vào `public/assets/photos/`. Hỗ trợ thêm `.png`, `.webp`.
- **Sticker:** xem `public/assets/stickers/README.md`. Đã có sẵn 19 sticker WebP.
- **Âm thanh:** bỏ `bgm`, `voice-boyfriend`, `voice-family` vào `public/audio/` (đuôi `.m4a`, `.mp3`, `.wav`, `.ogg` đều được). Xem `public/audio/README.md`.

Không có file nào cũng không sao:

- Ảnh thiếu → khung polaroid + sticker.
- Nhạc thiếu → nhạc tổng hợp nhẹ.
- Voice thiếu → phụ đề tự chạy.

## Build & deploy

```powershell
npm.cmd run build
```

Thư mục `dist/` là toàn bộ website.

### Cách nhanh nhất: Netlify Drop

1. Mở <https://app.netlify.com/drop>.
2. Kéo thả **thư mục `dist`** (không kéo `src`).
3. Nhận link dạng `https://ten-ngau-nhien.netlify.app`.
4. Gửi link qua Zalo/Messenger.

### GitHub Pages (nếu thích)

Project đã đặt `base: './'` nên chạy được ở thư mục con. Đưa nội dung `dist/` lên nhánh `gh-pages` là được.

## Kiểm tra trước khi gửi

- [ ] Mở link trên **iPhone thật**, cả Safari và bong bóng chat Zalo/Messenger.
- [ ] Bật âm lượng, tắt công tắc im lặng (silent switch) — iPhone sẽ chặn tiếng nếu bật im lặng.
- [ ] Bấm "Chạm để bắt đầu" một lần để trình duyệt cho phép phát audio.
- [ ] Thử cả 2 tab, thắp đủ 3 nến, quay vòng quay, lật đủ 20 thẻ.
- [ ] Kiểm tra không bị cuộn ngang, nút bấm dễ chạm.
- [ ] Nếu có ảnh/audio thật: build lại và deploy lại đúng thư mục `dist`.

## Lệnh hữu ích

```powershell
npm.cmd run typecheck   # kiểm tra TypeScript
npm.cmd run test        # test logic hộp quà / vòng quay / nến
npm.cmd run build       # build ra dist/
npm.cmd run preview     # xem thử bản build
```

## Cấu trúc chính

```
src/
  content/config.ts        ← SỬA NỘI DUNG Ở ĐÂY
  components/              ← các khối giao diện
  utils/audio.ts           ← nhạc nền, voice, SFX
  utils/assets.ts          ← fallback đuôi file ảnh/audio
  utils/logic.ts           ← logic hộp quà, vòng quay, nến
public/
  assets/photos/           ← 6 ảnh kỷ niệm
  assets/stickers/         ← sticker WebP
  audio/                   ← nhạc + voice
assets-source/             ← sheet gốc + script cắt sticker (không deploy)
scripts/                   ← script Python cắt sticker
```

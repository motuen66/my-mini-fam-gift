# Quà 20/10 — a Mỏ gửi em Tròn & Gia đình nhỏ

Trang quà tặng 20/10 tương tác, tối ưu cho điện thoại:

- **Bước đầu:** hỏi ai đang mở web. `em Tròn` xem cả 2 tab; `Hoành con` chỉ xem tab Gia đình nhỏ.
- **Tab 1 — Dành cho em Tròn:** hộp quà chạy trốn (né 10 lần), Photo Story 6 khung ảnh hiện dần khi cuộn, vòng quay may mắn có troll, 20 thẻ thông điệp vui vẻ + lá thư cuối, voice note.
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
| Danh sách 6 ảnh Photo Story (chỉ ảnh, không caption) | `PHOTO_MOMENTS` |
| 8 giải vòng quay | `INITIAL_WHEEL_PRIZES` |
| 20 thông điệp vui vẻ & may mắn | `INITIAL_REASONS` |
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
- Voice thiếu → hiện thông báo thân thiện, không có phụ đề giả.

## Build & deploy

```powershell
npm.cmd run build
```

Thư mục `dist/` là toàn bộ website.

### GitHub Pages (link cố định)

Project đã đặt `base: './'` nên chạy được ở thư mục con. Đưa nội dung `dist/` lên nhánh `gh-pages` và bật Pages cho nhánh đó.

Link dạng: `https://<username>.github.io/<repo>/`

### Netlify Drop (nhanh, nhưng cần claim)

1. Mở <https://app.netlify.com/drop>.
2. Kéo thả **thư mục `dist`** (không kéo `src`).
3. Nhận link dạng `https://ten-ngau-nhien.netlify.app`.
4. **Claim site trong vòng 1 giờ** (đăng nhập Netlify), nếu không site sẽ tự hết hạn.
5. Gửi link qua Zalo/Messenger.

## Kiểm tra trước khi gửi

- [ ] Mở link trên **iPhone thật**, cả Safari và bong bóng chat Zalo/Messenger.
- [ ] Bật âm lượng, tắt công tắc im lặng (silent switch) — iPhone sẽ chặn tiếng nếu bật im lặng.
- [ ] Chọn đúng người ở màn hình đầu (thao tác này mở khóa audio trên iPhone).
- [ ] `em Tròn` thấy cả 2 tab; `Hoành con` chỉ thấy tab Gia đình nhỏ.
- [ ] Thắp đủ 3 nến, quay vòng quay, lật đủ 20 thẻ.
- [ ] Kiểm tra không bị cuộn ngang, nút bấm dễ chạm.
- [ ] Mở lại / reload trang: màn hình hỏi `Ai đang mở quà đây?` phải luôn hiện lại, không tự vào thẳng.
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

"""Cắt sticker từ 2 sheet AI, xoá nền trắng, xuất PNG trong suốt.

Cách dùng:
    python scripts/crop_stickers.py

Kết quả:
    public/assets/stickers/tron_*.png
    public/assets/stickers/hoanh_*.png
    assets-source/preview-stickers.png  (xem trước trên nền tối)
"""

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets-source"
OUT = ROOT / "public" / "assets" / "stickers"
RAW = SOURCE / "crops_raw"
OUT.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

# (tên file, sheet, box trái, trên, phải, dưới)
# Box được canh quanh nhân vật. Một số box lấy luôn chữ Viết tay cho tự nhiên.
CROPS = [
    # --- EM TRÒN ---
    ("tron_um", "Tron", (5, 30, 300, 410)),
    ("tron_kho_chiu", "Tron", (300, 55, 625, 410)),
    ("tron_ha", "Tron", (630, 70, 922, 410)),
    ("tron_buon_ngu", "Tron", (910, 130, 1245, 410)),
    ("tron_hi_hi_hi", "Tron", (10, 440, 300, 805)),
    ("tron_oi_troi_oi", "Tron", (320, 450, 590, 805)),
    ("tron_dinh_luon", "Tron", (945, 450, 1225, 805)),
    ("tron_ok_luon", "Tron", (5, 830, 310, 1210)),
    ("tron_di_thoi", "Tron", (315, 840, 615, 1215)),
    ("tron_muon_chat", "Tron", (628, 820, 935, 1215)),
    ("tron_vo_duyen", "Tron", (1000, 1015, 1245, 1235)),
    # --- HOÀNH CON ---
    ("hoanh_binh_thuong", "Hoanh", (590, 10, 900, 380)),
    ("hoanh_kinh_ram", "Hoanh", (940, 410, 1220, 700)),
    ("hoanh_tra_sua", "Hoanh", (300, 400, 620, 700)),
    ("hoanh_om_tho", "Hoanh", (0, 400, 300, 700)),
    ("hoanh_cuoi", "Hoanh", (610, 740, 870, 975)),
    ("hoanh_yeahhh", "Hoanh", (300, 700, 600, 975)),
    ("hoanh_vo_duyen", "Hoanh", (310, 1000, 620, 1254)),
]


def remove_white_background(image: Image.Image, threshold: int = 242) -> Image.Image:
    """Xoá vùng trắng nối với mép ảnh, giữ lại highlight trắng bên trong."""
    rgba = image.convert("RGBA")
    arr = np.array(rgba)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)

    # Trắng gần như tuyệt đối; hạ ngưỡng xuống sẽ ăn cả áo trắng.
    white = rgb.min(axis=2) >= threshold

    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    for x in range(w):
        for y in (0, h - 1):
            if white[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if white[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and white[ny, nx] and not visited[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    arr[:, :, 3] = np.where(visited, 0, 255)
    result = Image.fromarray(arr, mode="RGBA")

    # Vuốt nhẹ alpha để bớt viền trắng.
    alpha = result.getchannel("A")
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    result.putalpha(alpha)

    # Cắt sát nội dung, chừa 4px.
    bbox = result.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        pad = 4
        result = result.crop(
            (max(0, left - pad), max(0, top - pad), min(w, right + pad), min(h, bottom + pad))
        )

    # Resize về tối đa 320px; trên web chỉ hiển thị 48-96px nên vẫn nét.
    max_side = max(result.size)
    if max_side > 320:
        ratio = 320 / max_side
        result = result.resize(
            (round(result.width * ratio), round(result.height * ratio)),
            Image.LANCZOS,
        )

    return result


def main() -> None:
    sheets = {
        "Tron": Image.open(SOURCE / "Tron-sheet.png").convert("RGB"),
        "Hoanh": Image.open(SOURCE / "Hoanh-sheet.png").convert("RGB"),
    }

    made = []
    for name, sheet_name, box in CROPS:
        raw = sheets[sheet_name].crop(box)
        raw.save(RAW / f"{name}.png")
        transparent = remove_white_background(raw)
        transparent.save(OUT / f"{name}.png", optimize=True)
        made.append((name, transparent))
        print(f"{name:20s} {transparent.size}")

    # "Hehe" dùng lại khuôn mặt cười hí hí (bản gốc ở mép sheet bị cắt).
    hehe = Image.open(OUT / "tron_hi_hi_hi.png")
    hehe.save(OUT / "tron_hehe.png")
    made.append(("tron_hehe", hehe))

    # Preview trên nền tối + caro để thấy viền trắng còn sót.
    cell_w, cell_h = 220, 240
    cols = 5
    rows = (len(made) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cell_w, rows * cell_h), (18, 22, 34, 255))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for idx, (name, image) in enumerate(made):
        col, row = idx % cols, idx // cols
        x, y = col * cell_w, row * cell_h
        # caro
        for cy in range(0, cell_h, 20):
            for cx in range(0, cell_w, 20):
                if (cx // 20 + cy // 20) % 2 == 0:
                    draw.rectangle([x + cx, y + cy, x + cx + 19, y + cy + 19], fill=(40, 44, 58, 255))
        thumb = image.copy()
        thumb.thumbnail((cell_w - 20, cell_h - 40), Image.LANCZOS)
        px = x + (cell_w - thumb.width) // 2
        py = y + 10 + (cell_h - 40 - thumb.height) // 2
        sheet.alpha_composite(thumb, (px, py))
        draw.text((x + 8, y + cell_h - 24), name, fill=(255, 230, 150, 255), font=font)

    preview = SOURCE / "preview-stickers.png"
    sheet.convert("RGB").save(preview)
    print(f"\nPreview: {preview}")


if __name__ == "__main__":
    main()

from PIL import Image, ImageDraw, ImageFont
import os

TEMP = os.environ.get("TEMP", ".")
FONT = ImageFont.load_default()

for name in ["Tron-sheet", "Hoanh-sheet"]:
    src = f"assets-source/{name}.png"
    img = Image.open(src).convert("RGB")
    w, h = img.size
    draw = ImageDraw.Draw(img)

    for x in range(0, w, 100):
        color = (255, 0, 0) if x % 500 == 0 else (0, 160, 255)
        draw.line([(x, 0), (x, h)], fill=color, width=1)
        draw.text((x + 2, 2), str(x), fill=(200, 0, 0), font=FONT)
        draw.text((x + 2, h - 14), str(x), fill=(200, 0, 0), font=FONT)

    for y in range(0, h, 100):
        color = (255, 0, 0) if y % 500 == 0 else (0, 160, 255)
        draw.line([(0, y), (w, y)], fill=color, width=1)
        draw.text((2, y + 1), str(y), fill=(200, 0, 0), font=FONT)
        draw.text((w - 40, y + 1), str(y), fill=(200, 0, 0), font=FONT)

    out = os.path.join(TEMP, f"grid_{name}.png")
    img.save(out)
    print(out)

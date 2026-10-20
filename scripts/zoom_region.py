from PIL import Image, ImageDraw, ImageFont
import os, sys

src, x0, y0, x1, y1, scale, out = sys.argv[1], *map(int, sys.argv[2:6]), float(sys.argv[6]), sys.argv[7]
img = Image.open(src).convert("RGB")
img = img.crop((x0, y0, x1, y1))
img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
draw = ImageDraw.Draw(img)
font = ImageFont.load_default()
step = 50
for x in range(0, x1 - x0, step):
    sx = round(x * scale)
    draw.line([(sx, 0), (sx, img.height)], fill=(0, 160, 255), width=1)
    draw.text((sx + 1, 1), str(x0 + x), fill=(200, 0, 0), font=font)
for y in range(0, y1 - y0, step):
    sy = round(y * scale)
    draw.line([(0, sy), (img.width, sy)], fill=(0, 160, 255), width=1)
    draw.text((1, sy + 1), str(y0 + y), fill=(200, 0, 0), font=font)
img.save(out)
print(out)

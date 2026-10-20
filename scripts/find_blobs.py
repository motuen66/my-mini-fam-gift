from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def components(path: Path):
    img = Image.open(path).convert("RGB")
    arr = np.array(img).astype(np.int16)
    # Nội dung: không phải gần-trắng
    mask = arr.min(axis=2) < 238
    h, w = mask.shape
    seen = np.zeros((h, w), dtype=bool)
    boxes = []

    for y0 in range(h):
        for x0 in range(w):
            if not mask[y0, x0] or seen[y0, x0]:
                continue
            q = deque([(y0, x0)])
            seen[y0, x0] = True
            minx = maxx = x0
            miny = maxy = y0
            count = 0
            while q:
                y, x = q.popleft()
                count += 1
                if x < minx: minx = x
                if x > maxx: maxx = x
                if y < miny: miny = y
                if y > maxy: maxy = y
                for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        q.append((ny, nx))
            if count > 12000:
                boxes.append((miny, minx, maxy, maxx, count))

    boxes.sort()
    return boxes


for name in ("Tron-sheet", "Hoanh-sheet"):
    print(f"\n=== {name} ===")
    for i, (y0, x0, y1, x1, count) in enumerate(components(ROOT / "assets-source" / f"{name}.png")):
        print(
            f"{i:2d}  box=({x0:4d}, {y0:4d}, {x1:4d}, {y1:4d})  "
            f"size={x1-x0:4d}x{y1-y0:4d}  area={count}"
        )

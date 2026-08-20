import os
import io
import base64
from PIL import Image, ImageOps

src_path = "public/SVG's/Component Inspo SVG's/Iconiq.jpg"
if not os.path.exists(src_path):
    print("Source image not found:", src_path)
    exit(1)

# Open source image and convert to grayscale for mask
img = Image.open(src_path).convert('RGB')
gray = ImageOps.grayscale(img)

# Bounding box of non-black pixels (threshold > 25)
thresh = gray.point(lambda p: 255 if p > 25 else 0)
bbox = thresh.getbbox()

if bbox:
    pad = 40
    xmin = max(0, bbox[0] - pad)
    ymin = max(0, bbox[1] - pad)
    xmax = min(img.width, bbox[2] + pad)
    ymax = min(img.height, bbox[3] + pad)
    cropped_gray = gray.crop((xmin, ymin, xmax, ymax))
else:
    cropped_gray = gray

# Create an all-black image with cropped_gray as alpha channel
w, h = cropped_gray.size
black_img = Image.new('RGB', (w, h), (0, 0, 0))
rgba_img = black_img.convert('RGBA')
rgba_img.putalpha(cropped_gray)

os.makedirs("public/component-inspirations", exist_ok=True)
rgba_img.save("public/component-inspirations/iconiq.png")
rgba_img.save("public/component-inspirations/Iconiq.png")

# Also generate clean SVG
buf = io.BytesIO()
rgba_img.save(buf, format='PNG')
b64_str = base64.b64encode(buf.getvalue()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" />
</svg>'''

with open("public/component-inspirations/iconiq.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

with open("public/SVG's/Component Inspo SVG's/Iconiq.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Done! Generated transparent black font iconiq.png and iconiq.svg ({w}x{h})")

import os
import io
import base64
import unicodedata
from PIL import Image, ImageOps

folder = "public/component-inspirations"
orig_folder = "public/SVG's/Component Inspo SVG's"

os.makedirs(folder, exist_ok=True)

def slugify(name):
    # normalize unicode
    n = unicodedata.normalize('NFKD', name).encode('ASCII', 'ignore').decode('ASCII')
    n = n.lower().replace(" ", "-").replace("'", "").replace("_", "-")
    # clean extra dashes
    while "--" in n:
        n = n.replace("--", "-")
    return n.strip("-")

def process_image(file_path):
    try:
        img = Image.open(file_path).convert("RGBA")
    except Exception as e:
        return None

    gray = ImageOps.grayscale(img)
    
    # Check corners to see if background is dark or light
    w_orig, h_orig = img.size
    corners = [
        gray.getpixel((0, 0)),
        gray.getpixel((w_orig - 1, 0)),
        gray.getpixel((0, h_orig - 1)),
        gray.getpixel((w_orig - 1, h_orig - 1))
    ]
    avg_corner = sum(corners) / 4.0

    if avg_corner < 60:
        # Dark/Black background: text is bright (white/light)
        # We want transparent background with black font for light mode, which inverts to white in dark mode
        thresh = gray.point(lambda p: 255 if p > 25 else 0)
        bbox = thresh.getbbox()
        if bbox:
            pad = 20
            xmin = max(0, bbox[0] - pad)
            ymin = max(0, bbox[1] - pad)
            xmax = min(img.width, bbox[2] + pad)
            ymax = min(img.height, bbox[3] + pad)
            cropped_gray = gray.crop((xmin, ymin, xmax, ymax))
            w, h = cropped_gray.size
            black_img = Image.new('RGB', (w, h), (0, 0, 0))
            rgba_img = black_img.convert('RGBA')
            rgba_img.putalpha(cropped_gray)
            return rgba_img
    else:
        # Light/White background: text is dark
        thresh = gray.point(lambda p: 255 if p < 240 else 0)
        bbox = thresh.getbbox()
        if bbox:
            pad = 20
            xmin = max(0, bbox[0] - pad)
            ymin = max(0, bbox[1] - pad)
            xmax = min(img.width, bbox[2] + pad)
            ymax = min(img.height, bbox[3] + pad)
            cropped = img.crop((xmin, ymin, xmax, ymax))
            cropped_gray = ImageOps.grayscale(cropped)
            inv_gray = ImageOps.invert(cropped_gray)
            w, h = cropped.size
            black_img = Image.new('RGB', (w, h), (0, 0, 0))
            rgba_img = black_img.convert('RGBA')
            rgba_img.putalpha(inv_gray)
            return rgba_img

    return img

for fname in os.listdir(orig_folder):
    fpath = os.path.join(orig_folder, fname)
    if fname.lower().endswith(('.png', '.jpg', '.jpeg')):
        base_name = os.path.splitext(fname)[0]
        cleaned = slugify(base_name)
        
        cropped = process_image(fpath)
        if cropped:
            out_png = os.path.join(folder, f"{cleaned}.png")
            cropped.save(out_png)
            
            # Also create standard alias names without '-ui' if applicable
            short_cleaned = cleaned.replace("-ui", "")
            if short_cleaned != cleaned:
                cropped.save(os.path.join(folder, f"{short_cleaned}.png"))

            # Generate tightly cropped SVG
            buf = io.BytesIO()
            cropped.save(buf, format='PNG')
            b64_str = base64.b64encode(buf.getvalue()).decode('utf-8')
            w, h = cropped.size
            svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" />
</svg>'''
            out_svg = os.path.join(folder, f"{cleaned}.svg")
            with open(out_svg, "w", encoding="utf-8") as f:
                f.write(svg_content)
            if short_cleaned != cleaned:
                with open(os.path.join(folder, f"{short_cleaned}.svg"), "w", encoding="utf-8") as f:
                    f.write(svg_content)
            print(f"Cropped {cleaned} to {w}x{h}")

print("Completed cropping all logos successfully!")

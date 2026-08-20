import os
import io
import base64
import unicodedata
from PIL import Image, ImageOps

folder = "public/component-inspirations"
orig_folder = "public/SVG's/Component Inspo SVG's"

os.makedirs(folder, exist_ok=True)

def slugify(name):
    n = unicodedata.normalize('NFKD', name).encode('ASCII', 'ignore').decode('ASCII')
    n = n.lower().replace(" ", "-").replace("'", "").replace("_", "-")
    while "--" in n:
        n = n.replace("--", "-")
    return n.strip("-")

def process_color_preserving(file_path):
    try:
        img = Image.open(file_path).convert("RGBA")
    except Exception as e:
        return None

    w_orig, h_orig = img.size
    gray = ImageOps.grayscale(img)
    corners = [
        gray.getpixel((0, 0)),
        gray.getpixel((w_orig - 1, 0)),
        gray.getpixel((0, h_orig - 1)),
        gray.getpixel((w_orig - 1, h_orig - 1))
    ]
    avg_corner = sum(corners) / 4.0

    # Check if image has significant color
    r, g, b, a = img.split()
    r_data = list(r.getdata())
    g_data = list(g.getdata())
    b_data = list(b.getdata())
    
    diffs = [max(abs(r_data[i] - g_data[i]), abs(g_data[i] - b_data[i]), abs(r_data[i] - b_data[i])) for i in range(0, len(r_data), 10)]
    has_color = max(diffs) > 40

    if avg_corner < 60:
        # Dark background
        thresh = gray.point(lambda p: 255 if p > 25 else 0)
        bbox = thresh.getbbox()
        if not bbox:
            return img
        pad = 20
        xmin = max(0, bbox[0] - pad)
        ymin = max(0, bbox[1] - pad)
        xmax = min(img.width, bbox[2] + pad)
        ymax = min(img.height, bbox[3] + pad)
        cropped = img.crop((xmin, ymin, xmax, ymax))
        cropped_gray = gray.crop((xmin, ymin, xmax, ymax))

        if has_color:
            # Preserve color, make black background transparent
            # Alpha is based on brightness of background
            alpha_chan = cropped_gray.point(lambda p: min(255, int(p * 2.5)))
            cropped.putalpha(alpha_chan)
            return cropped
        else:
            # Monochrome: create solid black with alpha
            w, h = cropped.size
            black_img = Image.new('RGB', (w, h), (0, 0, 0)).convert('RGBA')
            black_img.putalpha(cropped_gray)
            return black_img
    else:
        # Light / White background
        thresh = gray.point(lambda p: 255 if p < 240 else 0)
        bbox = thresh.getbbox()
        if not bbox:
            return img
        pad = 20
        xmin = max(0, bbox[0] - pad)
        ymin = max(0, bbox[1] - pad)
        xmax = min(img.width, bbox[2] + pad)
        ymax = min(img.height, bbox[3] + pad)
        cropped = img.crop((xmin, ymin, xmax, ymax))
        cropped_gray = gray.crop((xmin, ymin, xmax, ymax))

        if has_color:
            # Preserve color, make white background transparent
            # Alpha is inverted brightness
            inv_gray = ImageOps.invert(cropped_gray)
            alpha_chan = inv_gray.point(lambda p: min(255, int(p * 2.5)))
            cropped.putalpha(alpha_chan)
            return cropped
        else:
            # Monochrome: black font with alpha
            inv_gray = ImageOps.invert(cropped_gray)
            w, h = cropped.size
            black_img = Image.new('RGB', (w, h), (0, 0, 0)).convert('RGBA')
            black_img.putalpha(inv_gray)
            return black_img

# Process all files
for fname in os.listdir(orig_folder):
    fpath = os.path.join(orig_folder, fname)
    if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
        base_name = os.path.splitext(fname)[0]
        cleaned = slugify(base_name)
        
        cropped = process_color_preserving(fpath)
        if cropped:
            out_png = os.path.join(folder, f"{cleaned}.png")
            cropped.save(out_png)
            
            short_cleaned = cleaned.replace("-ui", "")
            if short_cleaned != cleaned:
                cropped.save(os.path.join(folder, f"{short_cleaned}.png"))

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

# Copy bklit and aliases
import shutil
shutil.copy("public/SVG's/Component Inspo SVG's/bklit.svg", "public/component-inspirations/bklit.svg")
shutil.copy("public/component-inspirations/chanh-ai-ui.svg", "public/component-inspirations/chanhdai.svg")
shutil.copy("public/component-inspirations/chanh-ai-ui.png", "public/component-inspirations/chanhdai.png")
shutil.copy("public/component-inspirations/dqnamos.svg", "public/component-inspirations/dqnamo.svg")
shutil.copy("public/component-inspirations/dqnamos.png", "public/component-inspirations/dqnamo.png")

print("All logos processed with preserved brand colors!")

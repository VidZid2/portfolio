import os
import io
import base64
from PIL import Image, ImageOps

folder = "public/component-inspirations"
orig_folder = "public/SVG's/Component Inspo SVG's"

def save_as_svg(img, svg_path):
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    b64_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    w, h = img.size
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image href="data:image/png;base64,{b64_str}" width="{w}" height="{h}" />
</svg>'''
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

# 1. WATERMELON UI
wm_path = os.path.join(orig_folder, "Watermelon UI.jpeg")
if os.path.exists(wm_path):
    img = Image.open(wm_path).convert("RGBA")
    gray = ImageOps.grayscale(img)
    thresh = gray.point(lambda p: 255 if p < 240 else 0)
    bbox = thresh.getbbox()
    pad = 20
    xmin, ymin, xmax, ymax = max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(img.width, bbox[2]+pad), min(img.height, bbox[3]+pad)
    cropped = img.crop((xmin, ymin, xmax, ymax))
    
    # Find rightmost pixel of green icon
    c_pix = cropped.load()
    w, h = cropped.size
    icon_xmax = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            if g > 130 and r < 180 and b < 100:
                if x > icon_xmax:
                    icon_xmax = x
    
    icon_boundary = icon_xmax + 15
    print(f"Watermelon icon boundary: {icon_boundary} / {w}")
    
    light_img = Image.new("RGBA", (w, h), (0,0,0,0))
    dark_img = Image.new("RGBA", (w, h), (0,0,0,0))
    l_pix, d_pix = light_img.load(), dark_img.load()
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            if r > 245 and g > 245 and b > 245:
                continue
            if x <= icon_boundary:
                # Icon part: keep original color
                l_pix[x, y] = (r, g, b, 255)
                d_pix[x, y] = (r, g, b, 255)
            else:
                # Text part:
                br = (r + g + b) // 3
                alpha = max(0, min(255, 255 - br))
                if alpha > 15:
                    l_pix[x, y] = (0, 0, 0, alpha)
                    d_pix[x, y] = (255, 255, 255, alpha)
                    
    light_img.save(os.path.join(folder, "watermelon-ui.png"))
    dark_img.save(os.path.join(folder, "watermelon-ui-dark.png"))
    save_as_svg(light_img, os.path.join(folder, "watermelon-ui.svg"))
    save_as_svg(dark_img, os.path.join(folder, "watermelon-ui-dark.svg"))

# 2. MAGIC UI
mg_path = os.path.join(orig_folder, "Magic UI.jpeg")
if os.path.exists(mg_path):
    img = Image.open(mg_path).convert("RGBA")
    gray = ImageOps.grayscale(img)
    thresh = gray.point(lambda p: 255 if p < 240 else 0)
    bbox = thresh.getbbox()
    pad = 20
    xmin, ymin, xmax, ymax = max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(img.width, bbox[2]+pad), min(img.height, bbox[3]+pad)
    cropped = img.crop((xmin, ymin, xmax, ymax))
    
    c_pix = cropped.load()
    w, h = cropped.size
    icon_xmax = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            # Gradient circle has color saturation
            if max(abs(r-g), abs(g-b), abs(r-b)) > 30 and (r > 120 or b > 120):
                if x > icon_xmax:
                    icon_xmax = x
    
    icon_boundary = icon_xmax + 15
    print(f"Magic UI icon boundary: {icon_boundary} / {w}")
    
    light_img = Image.new("RGBA", (w, h), (0,0,0,0))
    dark_img = Image.new("RGBA", (w, h), (0,0,0,0))
    l_pix, d_pix = light_img.load(), dark_img.load()
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            if r > 245 and g > 245 and b > 245:
                continue
            if x <= icon_boundary:
                l_pix[x, y] = (r, g, b, 255)
                d_pix[x, y] = (r, g, b, 255)
            else:
                br = (r + g + b) // 3
                alpha = max(0, min(255, 255 - br))
                if alpha > 15:
                    l_pix[x, y] = (0, 0, 0, alpha)
                    d_pix[x, y] = (255, 255, 255, alpha)
                    
    light_img.save(os.path.join(folder, "magic-ui.png"))
    dark_img.save(os.path.join(folder, "magic-ui-dark.png"))
    save_as_svg(light_img, os.path.join(folder, "magic-ui.svg"))
    save_as_svg(dark_img, os.path.join(folder, "magic-ui-dark.svg"))

# 3. ORIGIN KIT UI
ok_path = os.path.join(orig_folder, "Origin Kit UI.jpeg")
if os.path.exists(ok_path):
    img = Image.open(ok_path).convert("RGBA")
    gray = ImageOps.grayscale(img)
    thresh = gray.point(lambda p: 255 if p < 240 else 0)
    bbox = thresh.getbbox()
    pad = 20
    xmin, ymin, xmax, ymax = max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(img.width, bbox[2]+pad), min(img.height, bbox[3]+pad)
    cropped = img.crop((xmin, ymin, xmax, ymax))
    
    c_pix = cropped.load()
    w, h = cropped.size
    icon_xmax = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            # Orange circle
            if r > 200 and g < 160 and b < 80:
                if x > icon_xmax:
                    icon_xmax = x
    
    icon_boundary = icon_xmax + 15
    print(f"Origin Kit UI icon boundary: {icon_boundary} / {w}")
    
    light_img = Image.new("RGBA", (w, h), (0,0,0,0))
    dark_img = Image.new("RGBA", (w, h), (0,0,0,0))
    l_pix, d_pix = light_img.load(), dark_img.load()
    
    for y in range(h):
        for x in range(w):
            r, g, b, a = c_pix[x, y]
            if r > 245 and g > 245 and b > 245:
                continue
            if x <= icon_boundary:
                l_pix[x, y] = (r, g, b, 255)
                d_pix[x, y] = (r, g, b, 255)
            else:
                br = (r + g + b) // 3
                alpha = max(0, min(255, 255 - br))
                if alpha > 15:
                    l_pix[x, y] = (0, 0, 0, alpha)
                    d_pix[x, y] = (255, 255, 255, alpha)
                    
    light_img.save(os.path.join(folder, "origin-kit-ui.png"))
    dark_img.save(os.path.join(folder, "origin-kit-ui-dark.png"))
    save_as_svg(light_img, os.path.join(folder, "origin-kit-ui.svg"))
    save_as_svg(dark_img, os.path.join(folder, "origin-kit-ui-dark.svg"))

print("Precise color-separated Light & Dark logos created!")

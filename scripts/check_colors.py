import os
import unicodedata
from PIL import Image, ImageOps

folder = "public/SVG's/Component Inspo SVG's"
for f in os.listdir(folder):
    if f.lower().endswith(('.jpg', '.jpeg', '.png')):
        try:
            img = Image.open(os.path.join(folder, f)).convert('RGB')
            r, g, b = img.split()
            diff1 = [abs(p1 - p2) for p1, p2 in zip(r.getdata(), g.getdata())]
            diff2 = [abs(p1 - p2) for p1, p2 in zip(g.getdata(), b.getdata())]
            max_diff = max(max(diff1), max(diff2))
            clean_f = unicodedata.normalize('NFKD', f).encode('ASCII', 'ignore').decode('ASCII')
            print(f"{clean_f}: max_color_diff = {max_diff}")
        except Exception as e:
            print(f"Error {e}")

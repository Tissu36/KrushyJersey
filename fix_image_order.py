import json
from PIL import Image
import os

p = json.load(open("products.json"))
fixed = 0

for x in p:
    imgs = x.get("images", [])
    if len(imgs) < 2:
        continue
        
    scored_imgs = []
    for img in imgs:
        path = f"public/images/{img}"
        if not os.path.exists(path):
            scored_imgs.append((img, 0))
            continue
            
        try:
            with Image.open(path) as im:
                w, h = im.size
                # Full jerseys are taller than they are wide (portrait).
                # Badges/zippers are square (1:1) or landscape.
                # A ratio of h/w > 1.2 means it's a full jersey shot.
                score = h / w if w > 0 else 0
                scored_imgs.append((img, score))
        except:
            scored_imgs.append((img, 0))

    # Sort by score descending (highest portrait ratio first)
    scored_imgs.sort(key=lambda a: -a[1])
    new_order = [img for img, score in scored_imgs]
    
    if new_order != imgs:
        x["images"] = new_order
        fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Reordered images for {fixed} products to show full jerseys first.")

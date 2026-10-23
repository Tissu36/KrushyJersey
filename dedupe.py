import json, os

p = json.load(open("products.json"))
seen_names = set()
unique_products = []

for x in p:
    name = x["name"].lower().strip()
    
    # If we haven't seen this exact name yet, keep it
    if name not in seen_names:
        seen_names.add(name)
        
        # If it has multiple images, move the largest one to the front
        # (Larger files are usually the full jersey shot, not a badge close-up)
        imgs = x.get("images", [])
        if len(imgs) > 1:
            sized_imgs = []
            for img in imgs:
                path = f"public/images/{img}"
                sz = os.path.getsize(path) if os.path.exists(path) else 0
                sized_imgs.append((img, sz))
            sized_imgs.sort(key=lambda a: -a[1])
            x["images"] = [img for img, _ in sized_imgs]

        unique_products.append(x)

json.dump(unique_products, open("products.json", "w"), separators=(",", ":"))
print(f"Removed duplicates. Kept {len(unique_products)} unique products.")

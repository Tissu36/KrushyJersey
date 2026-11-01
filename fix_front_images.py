import json, os

p = json.load(open("products.json"))
fixed = 0

for x in p:
    imgs = x.get("images", [])
    if len(imgs) > 1:
        scored_imgs = []
        for img in imgs:
            path = f"public/images/{img}"
            # Get the file size in bytes
            sz = os.path.getsize(path) if os.path.exists(path) else 0
            scored_imgs.append((img, sz))
        
        # Sort by largest file size first
        scored_imgs.sort(key=lambda a: -a[1])
        new_order = [img for img, sz in scored_imgs]
        
        if new_order != imgs:
            x["images"] = new_order
            fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Moved the largest image (full front) to the first position for {fixed} products.")

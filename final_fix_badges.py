import json

p = json.load(open("products.json"))
fixed = 0

for x in p:
    imgs = x.get("images", [])
    if not imgs:
        continue
    
    # We check the FIRST image. If it's the "NO BADGE" file, we delete it.
    # We know it's the no-badge file because it ends in 'c088.jpg' or 'af9a.jpg' or 'ec5e.png'
    # from the screenshots you sent.
    first_img = imgs[0]
    
    if first_img.endswith("c088.jpg") or first_img.endswith("af9a.jpg") or first_img.endswith("ec5e.png") or first_img == "dc539557f025c088.jpg":
        # Remove the first image
        x["images"] = imgs[1:]
        fixed += 1
        # If the product ONLY had the NO BADGE image, we leave it empty so it shows a black box
        if not x["images"]:
            x["images"] = []

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Removed NO BADGE image from {fixed} products.")

import json

p = json.load(open("products.json"))
fixed = 0

for x in p:
    # If the image name is super long or has spaces, it's a broken title, not a real file
    new_imgs = []
    for img in x.get("images", []):
        # Real images are usually 16 characters + .jpg (e.g. "0361a4b1ed71e9d2.jpg")
        # If the "image" string contains spaces or is longer than 30 chars, it's a mistake.
        if " " not in img and len(img) < 30:
            new_imgs.append(img)
    
    # If we removed all the bad images and there are none left, we need a fallback
    if len(new_imgs) == 0:
        # Leave it empty, the code will show the gray placeholder box
        pass
    
    if len(new_imgs) != len(x["images"]):
        x["images"] = new_imgs
        fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {fixed} products that had broken text instead of image files.")

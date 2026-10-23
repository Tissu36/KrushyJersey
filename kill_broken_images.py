import json, os

# Load the list of valid images we extracted from the zips
valid_imgs = set()
if os.path.exists("valid_images.txt"):
    with open("valid_images.txt") as f:
        for line in f:
            valid_imgs.add(line.strip().replace("images/", ""))

p = json.load(open("products.json"))
removed = 0

for x in p:
    new_imgs = []
    for img in x.get("images", []):
        # Clean the name
        clean_img = img.replace("images/", "")
        # Only keep the image if it's actually in the valid_images.txt list
        if clean_img in valid_imgs:
            new_imgs.append(clean_img)
        else:
            removed += 1
            
    x["images"] = new_imgs

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Removed {removed} broken image references from the database.")

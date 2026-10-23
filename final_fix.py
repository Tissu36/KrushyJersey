import json, re, urllib.parse, os

# Get the list of valid images from the zips
valid_imgs = set()
if os.path.exists("valid_images.txt"):
    with open("valid_images.txt") as f:
        for line in f:
            valid_imgs.add(line.strip().replace("images/", ""))

p = json.load(open("products.json"))
cleaned_names = 0
cleaned_imgs = 0

for x in p:
    # Clean the name (removes %eaehbbd and diamond symbols)
    old_name = x["name"]
    new_name = urllib.parse.unquote(old_name)
    new_name = new_name.encode('ascii', 'ignore').decode('ascii') # Strips non-english symbols
    new_name = re.sub(r'\s+', ' ', new_name).strip()
    if new_name != old_name:
        x["name"] = new_name
        cleaned_names += 1
    
    # Clean the images (only keep ones that exist in the zip)
    old_imgs = x.get("images", [])
    new_imgs = []
    for img in old_imgs:
        clean_img = img.replace("images/", "")
        if clean_img in valid_imgs:
            new_imgs.append(clean_img)
    
    if len(new_imgs) != len(old_imgs):
        x["images"] = new_imgs
        cleaned_imgs += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {cleaned_names} names and {cleaned_imgs} products with broken images.")

import json, re, urllib.parse

p = json.load(open("products.json"))
cleaned_products = []
removed_count = 0
fixed_imgs = 0

# The exact file names of the banners, NO BADGE, and Puma logos
banned_imgs = {
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg",
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png"
}

for x in p:
    # 1. Clean the name (remove % and Chinese chars)
    old_name = x["name"]
    new_name = urllib.parse.unquote(old_name)
    new_name = re.sub(r"[\u4e00-\u9fff]+", "", new_name) # removes Chinese
    new_name = re.sub(r"[^\w\s\-\.]", "", new_name) # removes weird symbols
    new_name = re.sub(r"\s+", " ", new_name).strip()
    x["name"] = new_name

    # 2. Drop the product entirely if the name is just garbage
    if len(new_name) < 3:
        removed_count += 1
        continue

    # 3. Remove the banned images from the gallery
    old_imgs = x.get("images", [])
    new_imgs = [img for img in old_imgs if img not in banned_imgs]
    
    # 4. Drop the product if it has NO images left
    if len(new_imgs) == 0:
        removed_count += 1
        continue
        
    if len(new_imgs) != len(old_imgs):
        fixed_imgs += 1
        
    x["images"] = new_imgs
    cleaned_products.append(x)

json.dump(cleaned_products, open("products.json", "w"), separators=(",", ":"))
print(f"Removed {removed_count} fake products.")
print(f"Cleaned images for {fixed_imgs} products.")
print(f"Total real products remaining: {len(cleaned_products)}")

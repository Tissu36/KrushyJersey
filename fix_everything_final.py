import json, re, urllib.parse

p = json.load(open("products.json"))

# The exact filenames of the OKK banners to remove
banned_imgs = {
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg",
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png"
}

fixed = 0
for x in p:
    # 1. Remove the banner images from the image list
    old_imgs = x.get("images", [])
    new_imgs = [img for img in old_imgs if img not in banned_imgs]
    
    # 2. If the first image is the OKK logo, remove it
    if new_imgs and new_imgs[0] in banned_imgs:
        new_imgs = new_imgs[1:]
        
    x["images"] = new_imgs

    # 3. Clean the names (remove the %5C26 stuff)
    old_name = x["name"]
    new_name = urllib.parse.unquote(old_name)
    new_name = re.sub(r'[^\w\s\-\.]', '', new_name) # Keep letters, numbers, spaces, dashes, dots
    new_name = re.sub(r'\s+', ' ', new_name).strip()
    if new_name != old_name and len(new_name) > 2:
        x["name"] = new_name
        fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Fixed {fixed} product names and removed OKK banners.")

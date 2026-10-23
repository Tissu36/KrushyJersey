import json, re

# Load the database
p = json.load(open("products.json"))

# 1. Remove the shared banner images (the model photos)
# These specific files are used as banners on okktt, not as real jerseys
banned_banners = {
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg",
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png"
}

fixed_imgs = 0
fixed_cats = 0

for x in p:
    # 2. Clean the images (remove the model photos and broken files)
    old_imgs = x.get("images", [])
    new_imgs = [img for img in old_imgs if img not in banned_banners]
    
    # If a product had ONLY the banner images, we leave it empty so it shows a black box
    if len(new_imgs) != len(old_imgs):
        x["images"] = new_imgs
        fixed_imgs += 1

    # 3. Fix the Categories (remove the ones that aren't actual clubs)
    bad_cats = ["casual-clothing", "national-teams", "retro-jerseys", "jackets", "kits", "efl-championship", "mls"]
    new_cats = [c for c in x.get("categories", []) if c not in bad_cats]
    
    if len(new_cats) != len(x.get("categories", [])):
        x["categories"] = new_cats
        fixed_cats += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {fixed_imgs} products with banner images.")
print(f"Cleaned {fixed_cats} products with bad categories.")

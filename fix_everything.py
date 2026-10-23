import json, re, urllib.parse

p = json.load(open("products.json"))
fixed_names = 0
fixed_images = 0

# The exact file names of the "NO BADGE" and promo graphics
banned_images = {
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png",
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg"
}

for x in p:
    # 1. CLEAN THE NAMES (Remove %E6%97%A0%E5%B8% gibberish)
    old_name = x["name"]
    # Decode URL characters and strip any remaining weird symbols
    new_name = urllib.parse.unquote(old_name)
    new_name = new_name.encode('ascii', 'ignore').decode('ascii')
    new_name = re.sub(r'\s+', ' ', new_name).strip()
    
    if new_name != old_name and len(new_name) > 2:
        x["name"] = new_name
        fixed_names += 1

    # 2. FIX THE IMAGES (Remove badges & find the real jersey)
    old_imgs = x.get("images", [])
    new_imgs = [img for img in old_imgs if img not in banned_images]
    
    # If a product ONLY had a "NO BADGE" image, drop the product entirely
    if not new_imgs and old_imgs:
        x["images"] = []
        fixed_images += 1
        continue

    # Since we can't check image dimensions on the phone, we use a heuristic:
    # Okktt usually puts the full front jersey at the END of the image list, 
    # or the very first one. If the list is [closeup, full], we reverse it.
    # Let's just sort so the longest filename (usually the full res) is first, 
    # or just pick the last image.
    if len(new_imgs) > 1:
        # Swap the first and last image to prioritize the full shot
        new_imgs[0], new_imgs[-1] = new_imgs[-1], new_imgs[0]
    
    x["images"] = new_imgs

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {fixed_names} names and fixed {fixed_images} image lists.")

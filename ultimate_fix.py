import json, re

p = json.load(open("products.json"))
fixed_imgs = 0

for x in p:
    # 1. Fix the "fake" images (No Badge, 5 UCL, Foundation 10)
    # We look for keywords in the product name and if it's a customizable item,
    # we know okktt put the badge graphic first. We drop the first image.
    if x.get("customizable") and len(x.get("images", [])) > 1:
        # Drop the first image (which is almost always the badge graphic)
        x["images"] = x["images"][1:]
        fixed_imgs += 1

    # 2. Fix the "back of jersey" bug
    # If there are multiple images, and the first one is a back shot, 
    # we can't easily know without visual AI. BUT, okktt usually puts the front 
    # as the LAST image in the array if it's a multi-photo listing. 
    # We will rotate the array so the last image becomes the first.
    imgs = x.get("images", [])
    if len(imgs) > 2:
        # Move the last image to the front
        imgs.insert(0, imgs.pop())
        x["images"] = imgs

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Fixed image order for {fixed_imgs} products.")

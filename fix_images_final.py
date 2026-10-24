import json

p = json.load(open("products.json"))
fixed_order = 0
removed_badges = 0

# These are the known "fake" images (NO BADGE, UCL ball, etc)
banned = {
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png",
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg"
}

for x in p:
    imgs = x.get("images", [])
    if not imgs: continue

    # 1. Remove the fake badge graphics
    clean_imgs = [i for i in imgs if i not in banned]
    if len(clean_imgs) != len(imgs):
        removed_badges += 1

    # 2. Reverse the order so the LAST image (full front) becomes the FIRST image
    if len(clean_imgs) > 1:
        clean_imgs.reverse()
        fixed_order += 1

    x["images"] = clean_imgs

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Reversed image order for {fixed_order} products.")
print(f"Removed fake badges from {removed_badges} products.")

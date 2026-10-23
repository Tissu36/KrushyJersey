import json

p = json.load(open("products.json"))
fixed = 0

for x in p:
    imgs = x.get("images", [])
    if len(imgs) > 1:
        # Reverse the list so the last image (full front) becomes the first
        imgs.reverse()
        x["images"] = imgs
        fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Reversed images for {fixed} products. The full jerseys should now be first.")

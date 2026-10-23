import json

p = json.load(open("products.json"))
fixed = 0

for x in p:
    # If the product is customizable, okktt puts the "NO BADGE" graphic first.
    if x.get("customizable") and len(x.get("images", [])) > 1:
        # Drop the first image
        x["images"] = x["images"][1:]
        fixed += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Dropped the first image (NO BADGE) from {fixed} customizable products.")

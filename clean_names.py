import json, re

p = json.load(open("products.json"))
cleaned = 0

for x in p:
    old_name = x["name"]
    # Remove percentage signs and the numbers/letters right next to them
    new_name = re.sub(r'\d+%\s*(off|OFF)?', '', old_name)
    # Remove leftover double spaces or trailing dashes
    new_name = re.sub(r'\s+', ' ', new_name).strip()
    
    if new_name != old_name:
        x["name"] = new_name
        cleaned += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {cleaned} product names!")

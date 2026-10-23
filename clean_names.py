import json, re, urllib.parse

p = json.load(open("products.json"))
cleaned = 0

for x in p:
    old_name = x["name"]
    
    # 1. Decode URL encoded characters (like %eaehbbd)
    new_name = urllib.parse.unquote(old_name)
    
    # 2. Remove any remaining weird symbols or percent signs
    new_name = re.sub(r'[%\^&*_+={}\[\]|\\<>]', '', new_name)
    
    # 3. Remove weird unicode blocks (like Chinese characters if you only want English)
    new_name = re.sub(r'[\u4e00-\u9fff]+', '', new_name)
    
    # 4. Clean up extra spaces
    new_name = re.sub(r'\s+', ' ', new_name).strip()
    
    if new_name != old_name and new_name != "":
        x["name"] = new_name
        cleaned += 1

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Cleaned {cleaned} product names!")

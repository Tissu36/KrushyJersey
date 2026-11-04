import json, re, urllib.parse

MANIFEST = "okktt_manifest.jsonl"
CATMAP = "product_categories_full.json"
OUT = "products.json"

# The exact categories we want to keep
CATEGORY_SLUGS = {
  "premier league": "premier-league",
  "la liga": "la-liga",
  "serie a": "serie-a",
  "bundesliga": "bundesliga",
  "ligue 1": "ligue-1-mcdonalds",
  "national team": "national-team",
  "retro jerseys": "retro-jerseys",
  "casual clothing": "casual-clothing",
  "mlb": "mlb", "nba": "nba", "nfl": "nfl", "nhl": "nhl",
  "efl championship and other": "efl-championship-and-other",
  "mls": "mls"
}

# Banned images (NO BADGE, No Racism, UCL, etc)
BANNED_IMGS = {
  "7b860bd7e570af9a.jpg", "7e2a179a35d05d8d.jpg", "7c60ad77ef4dec5e.png",
  "6a0d3f179efc0168.jpg", "9e95f908763b716b.jpg", "570d74262f02c7c8.jpg",
  "10b8f9aee43f5d20.jpg", "8bf77970314ba8ae.jpg", "3936e48f1970f89e.jpg",
  "f75a721ec8d9ff58.jpg", "933d4c803699dac4.jpg"
}

catmap = json.load(open(CATMAP))
products = []
seen = set()

for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product","")
    
    # 1. Skip the fake products by name
    path = url.rstrip("/").split("/")[-1]
    path = re.sub(r"\.html?$","",path)
    path = re.sub(r"-p\d+$","",path)
    name = path.replace("-", " ").title()
    
    upper_name = name.upper()
    if any(bad in upper_name for bad in ["NO BADGE", "RACISM", "FOUNDATION", "UCL", "PATCH"]):
        continue

    # 2. Filter images
    raw_imgs = row.get("imgs", [])
    imgs = [i for i in raw_imgs if i not in BANNED_IMGS]
    if not imgs: continue

    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)

    # 3. Map categories correctly
    raw_cats = catmap.get(pid, [])
    slugs = []
    for c in raw_cats:
        key = c.lower().strip().replace("-", " ")
        if key in CATEGORY_SLUGS:
            slugs.append(CATEGORY_SLUGS[key])

    # If it doesn't belong to any real league, drop it
    if not slugs:
        continue

    # 4. Create the product
    name = re.sub(r"[\u4e00-\u9fff]+", "", name) # Remove Chinese
    name = re.sub(r"[^\w\s\-\.]", "", name).strip()
    
    slug = re.sub(r"[^a-z0-9]+","-",path.lower()).strip("-")
    if slug in seen: slug += "-" + pid
    seen.add(slug)

    primary = slugs[0]
    
    lname = name.lower()
    customizable = not any(k in lname for k in ("retro","jacket","windbreaker","hoodie","tracksuit","training","suit","shorts","kids","youth","junior"))

    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": 34.99, # Base price, will be multiplied by 1.1 in the UI
        "category": primary, "categorySlug": primary,
        "categories": list(set(slugs)),
        "images": imgs, 
        "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })

json.dump(products, open(OUT,"w"), separators=(",", ":"))
print(f"Rebuilt perfectly. Kept {len(products)} real products.")

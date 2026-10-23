import json, re, os

MANIFEST = "okktt_manifest.jsonl"
CATMAP = "product_categories_full.json"
OUT = "products.json"

CATEGORY_NAMES = {
  "national team": "National Teams", "premier league": "Premier League",
  "la liga": "La Liga", "serie a": "Serie A", "bundesliga": "Bundesliga",
  "ligue 1": "Ligue 1 McDonald's", "retro jerseys": "Retro Jerseys",
  "casual clothing": "Casual Clothing", "mlb": "MLB", "nba": "NBA", "nfl": "NFL", "nhl": "NHL",
  "efl championship and other": "EFL Championship", "mls": "MLS"
}

def price_for(name):
    n = name.lower()
    if any(k in n for k in ("jacket","windbreaker","hoodie","hoody")): return 54.99
    if any(k in n for k in ("tracksuit","training suit","suit")): return 49.99
    if any(k in n for k in ("kids","youth","junior")): return 28.99
    if "retro" in n: return 37.99
    if "player" in n: return 54.99 if any(k in n for k in ("badge","name","print")) else 44.99
    return 34.99

STRIP = ["1:1 thai quality","1-1-thai-quality","thai quality","thai-quality","1:1","1-1","soccer jersey","soccer"]
def clean_name(n):
    low = n.lower()
    for p in STRIP: low = low.replace(p, " ")
    return re.sub(r"\s+"," ",low).strip().title()

def name_of(url):
    path = url.rstrip("/").split("/")[-1]
    path = re.sub(r"\.html?$","",path)
    return re.sub(r"-p\d+$","",path).replace("-", " ")

catmap = json.load(open(CATMAP))
products = []
seen = set()

for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product","")
    imgs = [i for i in row.get("imgs", []) if " " not in i]
    if not imgs: continue
    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)
    raw_name = name_of(url)
    name = clean_name(raw_name) or "Product"
    slug = re.sub(r"[^a-z0-9]+","-",raw_name.lower()).strip("-")
    if slug in seen: slug += "-" + pid
    seen.add(slug)

    cats_raw = catmap.get(pid, [])
    all_slugs = []
    for c in cats_raw:
        key = c.lower().strip()
        if key in CATEGORY_NAMES: all_slugs.append(CATEGORY_NAMES[key])
    if not all_slugs: all_slugs = ["Other"]

    lname = name.lower()
    customizable = not any(k in lname for k in ("retro","jacket","windbreaker","hoodie","tracksuit","training","suit","shorts","kids","youth","junior"))

    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": price_for(name),
        "category": all_slugs[0], "categorySlug": re.sub(r"[^a-z0-9]+","-",all_slugs[0].lower()).strip("-"),
        "categories": [re.sub(r"[^a-z0-9]+","-",c.lower()).strip("-") for c in all_slugs],
        "images": imgs, "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })

json.dump(products, open(OUT,"w"), separators=(",", ":"))
print("Restored:", len(products), "products")

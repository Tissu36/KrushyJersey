import json, re, os
from collections import Counter

MANIFEST = "okktt_manifest.jsonl"
CATS_FILE = "categories.txt"
OUT = "products.json"

CLUB_CODES = {
  "ARS":"Arsenal","LIV":"Liverpool","RMA":"Real Madrid","BAR":"Barcelona",
  "PSG":"Paris Saint-Germain","ACM":"AC Milan","INT":"Inter Milan","JUV":"Juventus",
  "CHE":"Chelsea","ATM":"Atletico Madrid","TOT":"Tottenham","PSV":"PSV",
  "EVE":"Everton","MLB":"MLB","NFL":"NFL","NBA":"NBA","NHL":"NHL",
}
JUNK = {"AD","NK","FC","ON","UA","SA","CA","LA","RB","UD","RC","MN","DR",
        "SC","CD","CF","PM","ALL","AJ","NEAL","JR","BALL","FOX","POLO",
        "EQT","MONK","PAUL","JOM","ALO","TNF","AL","ROSE"}

def price_for(name, category):
    n = name.lower(); c = (category or "").lower()
    base = 34.99
    if c in ("mlb","nba","nfl","nhl"): base = 42.99
    if any(k in n for k in ("jacket","windbreaker","hoodie","hoody")): return 54.99
    if any(k in n for k in ("tracksuit","training suit","suit")): return 49.99
    if any(k in n for k in ("kids","youth","junior")): base = 28.99
    elif "retro" in n: base = 37.99
    elif "player" in n:
        base = 54.99 if any(k in n for k in ("badge","name","print")) else 44.99
    if "long-sleeve" in n or "long-sleeves" in n or "long sleeve" in n:
        if base < 50: base += 4
    return round(base, 2)

STRIP = ["1:1 thai quality","1-1-thai-quality","thai quality","thai-quality",
         "1:1","1-1","soccer jersey","soccer"]

def expand_name(raw):
    s = re.sub(r"[-_]+", " ", raw)
    out = []
    for t in s.split():
        up = t.upper()
        if up in JUNK: continue
        out.append(CLUB_CODES.get(up, t))
    return " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize() for w in out)

def clean_further(name):
    low = name.lower()
    for p in STRIP: low = low.replace(p, " ")
    return re.sub(r"\s+"," ",low).strip()

def slug_from(raw):
    s = raw.lower()
    for p in STRIP: s = s.replace(p, "-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return re.sub(r"-+","-",s).strip("-")

def name_from_url(url):
    path = url.rstrip("/").split("/")[-1]
    path = re.sub(r"\.html?$","",path)
    return re.sub(r"-p\d+$","",path)

def classify(name):
    l = name.lower()
    tags = []
    is_outer = any(k in l for k in ("windbreaker","jacket","hoodie","hoody"))
    is_track = any(k in l for k in ("tracksuit","track suit","training suit"))
    is_short = "short" in l
    is_kid = any(k in l for k in ("kid","youth","junior"))
    is_retro = "retro" in l
    is_suit = bool(re.search(r"\bsuit\b", l)) and not is_track
    if is_outer: tags.append("jacket")
    if is_track: tags.append("tracksuit")
    if is_short: tags.append("shorts")
    if is_kid: tags.append("kids")
    if is_retro: tags.append("retro")
    if is_suit: tags.append("suit")
    if not (is_outer or is_track or is_short or is_suit):
        tags.append("jersey")
    return tags

products = []
seen = set()
for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product","")
    imgs = row.get("imgs", [])
    if not imgs: continue
    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)
    raw_name = name_from_url(url)
    name = " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize()
                    for w in clean_further(expand_name(raw_name)).split())
    if not name: name = "Product " + pid
    slug = slug_from(raw_name) or ("product-" + pid)
    if slug in seen: slug = slug + "-" + pid
    seen.add(slug)

    cat_slug = "other"
    cat_name = "Other"

    lname = name.lower()
    customizable = not any(k in lname for k in (
        "retro","jacket","windbreaker","hoodie","tracksuit","training",
        "suit","shorts","kids","youth","junior"))

    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": price_for(name, cat_slug),
        "category": cat_name,
        "categorySlug": cat_slug,
        "categories": [cat_slug],
        "subtags": classify(name),
        "images": imgs,
        "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })

products.sort(key=lambda p: (p["categorySlug"].lower(), p["name"].lower()))
json.dump(products, open(OUT,"w"), separators=(",", ":"))
print("REBUILT:", len(products), "products ->", OUT)

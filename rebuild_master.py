import json, re, os, hashlib
from collections import Counter
from PIL import Image

MANIFEST = "okktt_manifest.jsonl"
CATMAP = "product_categories_full.json"
HERO = "hero_order.json"
OUT = "products.json"
IMAGES_DIR = "public/images"

# ---------- 1. find shared banner images ----------
appearances = Counter()
for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    for img in row.get("imgs", []):
        appearances[img] += 1
BANNERS = {img for img, n in appearances.items() if n >= 50}
print("banner images filtered:", len(BANNERS), flush=True)

# ---------- 2. badge detector ----------
def is_badge(img):
    if img in BANNERS: return True
    path = os.path.join(IMAGES_DIR, img)
    if not os.path.exists(path): return True
    try:
        sz = os.path.getsize(path)
        im = Image.open(path)
        w, h = im.size
        if h == 0: return True
        ratio = w / h
        if 0.9 < ratio < 1.11 and sz < 25000: return True
        if sz < 5000: return True
        return False
    except: return True

# ---------- 3. category mapping ----------
CATEGORY_MAP = {
  "national team": "national-team", "premier league": "premier-league",
  "la liga": "la-liga", "serie a": "serie-a", "bundesliga": "bundesliga",
  "ligue 1": "ligue-1-mcdonalds", "kits": "kits",
  "retro jerseys": "retro-jerseys", "casual clothing": "casual-clothing",
  "jacket windbreaker": "jackets", "jacket   windbreaker": "jackets",
  "mlb": "mlb", "nba": "nba", "nfl": "nfl", "nhl": "nhl",
  "rugby": "rugby", "f1": "f1", "mls": "mls",
  "brasileiro s%C3%A9rie  a": "brasileiro-serie-a",
  "brasileiro s-c3-a9rie-a": "brasileiro-serie-a",
  "mexigo liga": "mexican-liga",
  "other american and asia clubs": "other-american-asia",
  "other european clubs": "other-european",
  "primeira liga eredlvlse": "primeira-liga",
  "scottish premiership": "scottish-premiership",
  "saudi arabia clubs": "saudi-arabia-clubs",
  "turkey austria clubs": "turkey-austria",
}

CATEGORY_NAMES = {
  "national-team": "National Teams", "premier-league": "Premier League",
  "la-liga": "La Liga", "serie-a": "Serie A", "bundesliga": "Bundesliga",
  "ligue-1-mcdonalds": "Ligue 1 McDonald's",
  "retro-jerseys": "Retro Jerseys", "casual-clothing": "Casual Clothing",
  "jackets": "Jackets", "kits": "Kits",
  "mlb": "MLB", "nba": "NBA", "nfl": "NFL", "nhl": "NHL",
  "rugby": "Rugby", "f1": "F1", "mls": "MLS",
  "brasileiro-serie-a": "Brasileiro Série A",
  "mexican-liga": "Mexican Liga",
  "other-american-asia": "Other American & Asia",
  "other-european": "Other European",
  "primeira-liga": "Primeira Liga",
  "scottish-premiership": "Scottish Premiership",
  "saudi-arabia-clubs": "Saudi Arabia",
  "turkey-austria": "Turkey & Austria",
}

def slugify_cat(raw):
    key = re.sub(r"\s+", " ", raw.lower().strip())
    if key in CATEGORY_MAP: return CATEGORY_MAP[key]
    s = re.sub(r"[^a-z0-9]+", "-", key).strip("-")
    return s or "other"

# ---------- 4. name/price helpers ----------
CLUB_CODES = {
  "ARS":"Arsenal","LIV":"Liverpool","RMA":"Real Madrid","BAR":"Barcelona",
  "PSG":"Paris Saint-Germain","ACM":"AC Milan","INT":"Inter Milan","JUV":"Juventus",
  "CHE":"Chelsea","ATM":"Atletico Madrid","TOT":"Tottenham","PSV":"PSV","EVE":"Everton",
}
JUNK = {"AD","NK","FC","ON","UA","SA","CA","LA","RB","UD","RC","MN","DR","SC","CD",
        "CF","PM","ALL","AJ","NEAL","JR","BALL","FOX","POLO","EQT","MONK","PAUL",
        "JOM","ALO","TNF","AL","ROSE"}

def price_for(name):
    n = name.lower()
    if any(k in n for k in ("jacket","windbreaker","hoodie","hoody")): return 54.99
    if any(k in n for k in ("tracksuit","training suit","suit")): return 49.99
    if any(k in n for k in ("kids","youth","junior")): return 28.99
    if "retro" in n: return 37.99
    if "player" in n:
        return 54.99 if any(k in n for k in ("badge","name","print")) else 44.99
    return 34.99

STRIP = ["1:1 thai quality","1-1-thai-quality","thai quality","thai-quality",
         "1:1","1-1","soccer jersey","soccer"]

def expand(raw):
    s = re.sub(r"[-_]+", " ", raw); out = []
    for t in s.split():
        up = t.upper()
        if up in JUNK: continue
        out.append(CLUB_CODES.get(up, t))
    return " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize() for w in out)

def clean(n):
    low = n.lower()
    for p in STRIP: low = low.replace(p, " ")
    return re.sub(r"\s+"," ",low).strip()

def slug_of(raw):
    s = raw.lower()
    for p in STRIP: s = s.replace(p, "-")
    s = re.sub(r"[^a-z0-9]+","-",s)
    return re.sub(r"-+","-",s).strip("-")

def name_of(url):
    path = url.rstrip("/").split("/")[-1]
    path = re.sub(r"\.html?$","",path)
    return re.sub(r"-p\d+$","",path)

def classify(name):
    l = name.lower(); tags = []
    if any(k in l for k in ("windbreaker","jacket","hoodie","hoody")): tags.append("jacket")
    if any(k in l for k in ("tracksuit","track suit","training suit")): tags.append("tracksuit")
    if "short" in l: tags.append("shorts")
    if any(k in l for k in ("kid","youth","junior")): tags.append("kids")
    if "retro" in l: tags.append("retro")
    if not any(t in tags for t in ("jacket","tracksuit","shorts")):
        tags.append("jersey")
    return tags

# ---------- 5. hero order ----------
hero_data = json.load(open(HERO))
print("hero data loaded:", len(hero_data), flush=True)

def url_to_hash(url):
    return hashlib.md5(url.encode()).hexdigest()[:16]

def reorder_by_hero(pid, imgs):
    h = hero_data.get(pid)
    if not h or not h.get("thumbs"): return imgs
    ordered = []
    for u in h["thumbs"]:
        hsh = url_to_hash(u)
        for img in imgs:
            if img.startswith(hsh):
                if img not in ordered: ordered.append(img)
                break
    if not ordered: return imgs
    leftover = [i for i in imgs if i not in ordered]
    return ordered + leftover

# ---------- 6. rebuild ----------
catmap = json.load(open(CATMAP))
products = []; seen = set()
kept = 0; dropped = 0

for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product","")
    imgs = [i for i in row.get("imgs", []) if not is_badge(i)]
    if not imgs:
        dropped += 1; continue
    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)
    imgs = reorder_by_hero(pid, imgs)
    raw = name_of(url)
    name = " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize()
                    for w in clean(expand(raw)).split()) or "Product " + pid
    slug = slug_of(raw) or "product-" + pid
    if slug in seen: slug += "-" + pid
    seen.add(slug)
    cats_raw = catmap.get(pid, [])
    all_slugs = list(dict.fromkeys(slugify_cat(c) for c in cats_raw)) or ["other"]
    primary_slug = all_slugs[0]
    primary_name = CATEGORY_NAMES.get(primary_slug, primary_slug.replace("-"," ").title())
    lname = name.lower()
    customizable = not any(k in lname for k in (
        "retro","jacket","windbreaker","hoodie","tracksuit","training",
        "suit","shorts","kids","youth","junior"))
    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": price_for(name),
        "category": primary_name, "categorySlug": primary_slug,
        "categories": all_slugs,
        "subtags": classify(name),
        "images": imgs, "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })
    kept += 1

products.sort(key=lambda p: (p["categorySlug"].lower(), p["name"].lower()))
json.dump(products, open(OUT, "w"), separators=(",", ":"))
print("FINAL:", len(products), "products")
print("kept:", kept, "dropped:", dropped)
from collections import Counter
c = Counter(x["categorySlug"] for x in products)
print("top categories:")
for k, n in c.most_common(15):
    print("  {} {}".format(str(n).rjust(5), k))

import json, re, requests, io, os, hashlib, time
from PIL import Image
from bs4 import BeautifulSoup

BASE = "https://www.okktt.com"
CATMAP = "product_categories_full.json"
OUT = "products.json"
IMAGES_DIR = "public/images"
MANIFEST = "okktt_manifest.jsonl"

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

def slugify_cat(raw):
    key = re.sub(r"\s+", " ", raw.lower().strip())
    if key in CATEGORY_MAP: return CATEGORY_MAP[key]
    s = re.sub(r"[^a-z0-9]+", "-", key).strip("-")
    return s or "other"

# find missing IDs
p = json.load(open(OUT))
ours = set(x["id"] for x in p)
catmap = json.load(open(CATMAP))
missing_ids = set(catmap.keys()) - ours
print("missing:", len(missing_ids), flush=True)

# find URLs
by_pid = {}
with open("okktt_products.txt") as f:
    for line in f:
        line = line.strip()
        if not line: continue
        m = re.search(r"-p(\d+)\.html?$", line)
        if m: by_pid[m.group(1)] = line

sess = requests.Session()
sess.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0",
    "Referer": BASE + "/",
})

mfp = open(MANIFEST, "a")
recovered_products = []

for i, pid in enumerate(list(missing_ids), 1):
    url = by_pid.get(pid)
    if not url:
        continue
    try:
        r = sess.get(url, timeout=25)
        if r.status_code != 200: continue
        imgs_urls = re.findall(r'data_pic="(https://cdn\.staticyy\.com/100530/[^"]+)"', r.text)
        if not imgs_urls: continue
        saved = []
        seen = set()
        for u in imgs_urls[:10]:
            u2 = u.split("?")[0]
            if u2 in seen: continue
            seen.add(u2)
            try:
                rr = sess.get(u2, timeout=20)
                if rr.status_code != 200 or len(rr.content) < 25000: continue
                im = Image.open(io.BytesIO(rr.content))
                if im.mode in ("P","RGBA","LA"): im = im.convert("RGB")
                w, h = im.size
                if w > 800: im = im.resize((800, int(h*800/w)), Image.LANCZOS)
                name = hashlib.md5(u2.encode()).hexdigest()[:16] + ".jpg"
                path = os.path.join(IMAGES_DIR, name)
                if not os.path.exists(path):
                    im.save(path, "JPEG", quality=82, optimize=True)
                saved.append(name)
            except: pass
        if not saved: continue
        mfp.write(json.dumps({"product": url, "imgs": saved}) + "\n")
        mfp.flush()
        cats_raw = catmap.get(pid, [])
        all_slugs = list(set(slugify_cat(c) for c in cats_raw)) or ["other"]
        raw = name_of(url)
        name = " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize()
                        for w in clean(expand(raw)).split()) or "Product " + pid
        slug = slug_of(raw) or "product-" + pid
        primary_slug = all_slugs[0]
        primary_name = CATEGORY_NAMES.get(primary_slug, primary_slug.replace("-"," ").title())
        lname = name.lower()
        customizable = not any(k in lname for k in (
            "retro","jacket","windbreaker","hoodie","tracksuit","training",
            "suit","shorts","kids","youth","junior"))
        recovered_products.append({
            "id": pid, "slug": slug, "name": name,
            "price": price_for(name),
            "category": primary_name, "categorySlug": primary_slug,
            "categories": all_slugs,
            "subtags": classify(name),
            "images": saved, "sourceUrl": url,
            "customizable": customizable,
            "sizes": ["S","M","L","XL","XXL"],
        })
        if i % 20 == 0:
            print(f"[{i}/{len(missing_ids)}] recovered {len(recovered_products)}", flush=True)
    except Exception as e:
        pass

mfp.close()
print("recovered:", len(recovered_products))

# append to products.json
p.extend(recovered_products)
# dedupe by slug
seen = set()
final = []
for x in p:
    if x["slug"] in seen: continue
    seen.add(x["slug"])
    final.append(x)
final.sort(key=lambda x: x["name"].lower())
json.dump(final, open(OUT, "w"), separators=(",", ":"))
print("total products now:", len(final))

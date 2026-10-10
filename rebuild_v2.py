import json, re, os
from collections import Counter
from PIL import Image

MANIFEST = "okktt_manifest.jsonl"
OUT = "products.json"
IMAGES_DIR = "public/images"

appearances = Counter()
for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    for img in row.get("imgs", []):
        appearances[img] += 1

BANNERS = {img for img, n in appearances.items() if n >= 50}
print("banner images blacklisted:", len(BANNERS))

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
    except:
        return True

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

def sort_imgs(imgs):
    sized = []
    for img in imgs:
        path = os.path.join(IMAGES_DIR, img)
        sz = os.path.getsize(path) if os.path.exists(path) else 0
        sized.append((img, sz))
    sized.sort(key=lambda a: -a[1])
    return [img for img, _ in sized]

products = []; seen = set()
for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product","")
    imgs_raw = [i for i in row.get("imgs", []) if not is_badge(i)]
    if not imgs_raw: continue
    imgs = sort_imgs(imgs_raw)
    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)
    raw = name_of(url)
    name = " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize()
                    for w in clean(expand(raw)).split()) or "Product " + pid
    slug = slug_of(raw) or "product-" + pid
    if slug in seen: slug += "-" + pid
    seen.add(slug)
    lname = name.lower()
    customizable = not any(k in lname for k in (
        "retro","jacket","windbreaker","hoodie","tracksuit","training",
        "suit","shorts","kids","youth","junior"))
    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": price_for(name),
        "category": "Other", "categorySlug": "other",
        "categories": ["other"],
        "subtags": classify(name),
        "images": imgs,
        "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })

products.sort(key=lambda p: p["name"].lower())
json.dump(products, open(OUT,"w"), separators=(",", ":"))
print("REBUILT:", len(products), "products")
print("banners filtered:", len(BANNERS))
print()
print("first 5 products:")
for x in products[:5]:
    print(" ", x["name"][:55])
    print("   imgs:", len(x["images"]), "| first:", x["images"][0])

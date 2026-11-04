import json, re, os, requests, time
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import io, hashlib
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.okktt.com"
OUT = "public/images"
MANIFEST = "okktt_manifest.jsonl"
CATMAP = "product_categories_full.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0",
    "Referer": BASE + "/",
}
sess = requests.Session()
sess.headers.update(HEADERS)

print("1. Loading existing products...")
p = json.load(open("products.json"))
existing_ids = set(x["id"] for x in p)
print(f"Existing: {len(existing_ids)}")

print("2. Crawling ALL categories to find every product...")
categories = []
if os.path.exists("categories.txt"):
    with open("categories.txt") as f:
        for line in f:
            m = re.search(r'href="([^"]+)"', line)
            if m: categories.append(urljoin(BASE, m.group(1)))

if not categories:
    r = sess.get(f"{BASE}/Products/list-r1.html")
    s = BeautifulSoup(r.text, "html.parser")
    for a in s.find_all("a", href=True):
        if re.match(r"^/[^/]+-c\d+(?:-\d+)?\.html$", a["href"]):
            categories.append(urljoin(BASE, a["href"]))

print(f"Found {len(categories)} categories to scan.")
catmap = json.load(open(CATMAP))
new_products_found = []

def process_category(cat_url):
    found = []
    url = cat_url
    seen_urls = set()
    for _ in range(20):
        if not url or url in seen_urls: break
        seen_urls.add(url)
        try:
            r = sess.get(url, timeout=20)
            if r.status_code != 200: break
            s = BeautifulSoup(r.text, "html.parser")
            
            for a in s.find_all("a", href=True):
                u = urljoin(BASE, a["href"])
                m = re.search(r"-p(\d+)\.html$", u)
                if m:
                    pid = m.group(1)
                    if pid not in existing_ids:
                        found.append((u, pid))
            
            m = re.search(r"-c(\d+)(?:-(\d+))?\.html$", url)
            if not m: break
            cid = m.group(1)
            cur = int(m.group(2)) if m.group(2) else 1
            want = f"-c{cid}-{cur + 1}.html"
            
            next_url = None
            for a in s.find_all("a", href=True):
                u = urljoin(BASE, a["href"])
                if u.endswith(want):
                    next_url = u
                    break
            url = next_url
        except:
            break
    return found

print("Scanning categories with 6 workers...")
unique_new = set()
with ThreadPoolExecutor(max_workers=6) as ex:
    for results in ex.map(process_category, categories):
        for u, pid in results:
            unique_new.add((u, pid))

print(f"Found {len(unique_new)} new products to add.")

print("3. Fetching images for new products...")
mfp = open(MANIFEST, "a")

def fetch_new_product(item):
    u, pid = item
    try:
        r = sess.get(u, timeout=20)
        if r.status_code != 200: return None
        html = r.text
        
        imgs = re.findall(r'data_pic="(https://cdn\.staticyy\.com/100530/[^"]+)"', html)
        clean_imgs = []
        for i in imgs:
            clean = i.split("?")[0]
            if clean not in clean_imgs: clean_imgs.append(clean)
            
        if not clean_imgs: return None
        
        saved = []
        for img_url in clean_imgs[:8]:
            try:
                rr = sess.get(img_url, timeout=20)
                if rr.status_code == 200 and "image" in rr.headers.get("Content-Type",""):
                    im = Image.open(io.BytesIO(rr.content))
                    if im.mode in ("P", "RGBA"): im = im.convert("RGB")
                    w, h = im.size
                    if w > 500: im = im.resize((500, int(h*500/w)), Image.LANCZOS)
                    name = hashlib.md5(img_url.encode()).hexdigest()[:16] + ".jpg"
                    path = os.path.join(OUT, name)
                    if not os.path.exists(path):
                        im.save(path, "JPEG", quality=70, optimize=True)
                    saved.append(name)
            except: pass
            
        return (u, pid, saved)
    except:
        return None

new_db_entries = []
with ThreadPoolExecutor(max_workers=8) as ex:
    for i, res in enumerate(ex.map(fetch_new_product, unique_new), 1):
        if res:
            u, pid, saved = res
            path = u.rstrip("/").split("/")[-1]
            path = re.sub(r"\.html?$", "", path)
            path = re.sub(r"-p\d+$", "", path)
            name = path.replace("-", " ").title()
            name = re.sub(r"[\u4e00-\u9fff]+", "", name)
            name = re.sub(r"[^\w\s\-\.]", "", name).strip()
            
            if any(bad in name.upper() for bad in ["NO BADGE", "RACISM", "FOUNDATION", "UCL"]):
                continue
                
            slug = re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-")
            
            raw_cats = catmap.get(pid, [])
            slugs = []
            for c in raw_cats:
                key = c.lower().strip().replace("-", " ")
                if key == "premier league": slugs.append("premier-league")
                elif key == "la liga": slugs.append("la-liga")
                elif key == "serie a": slugs.append("serie-a")
                elif key == "bundesliga": slugs.append("bundesliga")
                elif key == "national team": slugs.append("national-team")
                
            if not slugs: slugs = ["other"]
            
            new_db_entries.append({
                "id": pid, "slug": slug, "name": name,
                "price": 34.99, 
                "category": slugs[0], "categorySlug": slugs[0],
                "categories": list(set(slugs)),
                "images": saved, "sourceUrl": u,
                "customizable": True,
                "sizes": ["S","M","L","XL","XXL"],
            })
            mfp.write(json.dumps({"product": u, "imgs": saved}) + "\n")
            mfp.flush()
            
        if i % 50 == 0:
            print(f"Processed {i}/{len(unique_new)} new products...")

mfp.close()

p.extend(new_db_entries)
json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Done! Total products now: {len(p)}")

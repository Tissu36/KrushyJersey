import os, re, json, time, hashlib, threading, random, requests, io
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

BASE = "https://www.okktt.com"
OUT = "public/images"
MANIFEST = "okktt_manifest.jsonl"
PRODUCTS_FILE = "okktt_products.txt"
MAX_W = 800
STORE_CDN = "cdn.staticyy.com/100530/"
WORKERS = 4
os.makedirs(OUT, exist_ok=True)

COOKIE_STR = ""

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-GB,en;q=0.9",
    "Referer": BASE + "/",
    "Connection": "keep-alive",
}
if COOKIE_STR:
    HEADERS["Cookie"] = COOKIE_STR

sess = requests.Session()
sess.headers.update(HEADERS)

products = [l.strip() for l in open(PRODUCTS_FILE) if l.strip()]
print("products to fetch:", len(products))

done = set()
if os.path.exists(MANIFEST):
    for line in open(MANIFEST):
        try:
            done.add(json.loads(line)["product"])
        except: pass
print("resume: already done", len(done))

mfp = open(MANIFEST, "a")
lock = threading.Lock()

def extract(html):
    s = BeautifulSoup(html, "html.parser")
    urls = set()
    for tag in s.find_all(["img", "source", "a"]):
        for attr in ("src","data-src","data-lazy","data-original","data-srcset","srcset","data-pic","data_pic","href"):
            v = tag.get(attr)
            if not v or STORE_CDN not in v: continue
            if "w_210" in v: continue
            clean = v.split("?")[0]
            if clean.startswith("//"): clean = "https:" + clean
            if clean.startswith("http"): urls.add(clean)
    for tag in s.find_all(style=True):
        for m in re.findall(r'url\(["\']?([^"\')]+)["\']?\)', tag["style"]):
            if STORE_CDN in m and "w_210" not in m:
                clean = m.split("?")[0]
                if clean.startswith("//"): clean = "https:" + clean
                if clean.startswith("http"): urls.add(clean)
    return urls

def dl(u):
    try:
        r = sess.get(u, timeout=25)
        ct = r.headers.get("Content-Type", "")
        if r.status_code != 200 or not ct.startswith("image"): return None
        try:
            im = Image.open(io.BytesIO(r.content))
            if im.mode in ("P","RGBA","LA"): im = im.convert("RGB")
            w, h = im.size
            if w > MAX_W:
                im = im.resize((MAX_W, int(h * MAX_W / w)), Image.LANCZOS)
            name = hashlib.md5(u.encode()).hexdigest()[:16] + ".jpg"
            p = os.path.join(OUT, name)
            if not os.path.exists(p):
                im.save(p, "JPEG", quality=82, optimize=True)
            return name
        except Exception:
            ext = os.path.splitext(urlparse(u).path)[1] or ".jpg"
            name = hashlib.md5(u.encode()).hexdigest()[:16] + ext
            p = os.path.join(OUT, name)
            if not os.path.exists(p):
                with open(p, "wb") as f:
                    f.write(r.content)
            return name
    except Exception:
        return None

def worker(purl):
    try:
        r = sess.get(purl, timeout=25)
        if r.status_code != 200:
            return {"product": purl, "status": r.status_code}
        imgs = [f for f in (dl(u) for u in extract(r.text)) if f]
        return {"product": purl, "imgs": imgs}
    except Exception as e:
        return {"product": purl, "error": str(e)}

todo = [p for p in products if p not in done]
print("todo:", len(todo))

with ThreadPoolExecutor(max_workers=WORKERS) as ex:
    for i, res in enumerate(ex.map(worker, todo), 1):
        with lock:
            mfp.write(json.dumps(res) + "\n")
            mfp.flush()
        if i % 25 == 0:
            print("[{}/{}] files: {}".format(i, len(todo), len(os.listdir(OUT))))
        time.sleep(random.uniform(0.05, 0.15))

mfp.close()
print("DONE. total files:", len(os.listdir(OUT)))

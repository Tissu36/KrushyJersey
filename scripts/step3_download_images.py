import sys, re, os, time, hashlib, threading, requests, io
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
sys.path.insert(0, ".")
from okktt_config import COOKIE_STR, BASE, UA

OUT = "public/images"
MANIFEST = "okktt_manifest.jsonl"
os.makedirs(OUT, exist_ok=True)

s = requests.Session()
s.headers.update({
    "User-Agent": UA,
    "Referer": BASE + "/",
    "Cookie": COOKIE_STR,
    "Accept": "text/html,image/avif,image/webp,image/*,*/*;q=0.8",
})

products = [l.strip() for l in open("okktt_products.txt", encoding="utf-8") if l.strip()]
print("products:", len(products))

done = set()
if os.path.exists(MANIFEST):
    for line in open(MANIFEST, encoding="utf-8"):
        try: done.add(__import__("json").loads(line)["product"])
        except: pass
print("resume: already done", len(done))

import json
mfp = open(MANIFEST, "a", encoding="utf-8")
lock = threading.Lock()
STORE_CDN = "cdn.staticyy.com/100530/"

def extract(html):
    soup = BeautifulSoup(html, "html.parser")
    urls = set()
    for tag in soup.find_all(["img", "source", "a"]):
        for attr in ("src", "data-src", "data-lazy", "data-original",
                     "data-srcset", "srcset", "data-pic", "data_pic", "href"):
            v = tag.get(attr)
            if not v or STORE_CDN not in v: continue
            if "w_210" in v: continue
            clean = v.split("?")[0]
            if clean.startswith("//"): clean = "https:" + clean
            if clean.startswith("http"): urls.add(clean)
    for tag in soup.find_all(style=True):
        for m in re.findall(r'url\(["\']?([^"\')]+)["\']?\)', tag["style"]):
            if STORE_CDN in m and "w_210" not in m:
                clean = m.split("?")[0]
                if clean.startswith("//"): clean = "https:" + clean
                if clean.startswith("http"): urls.add(clean)
    return urls

def dl(u):
    try:
        r = s.get(u, timeout=25)
        ct = r.headers.get("Content-Type","")
        if r.status_code != 200 or not ct.startswith("image"): return None
        try:
            im = Image.open(io.BytesIO(r.content))
            if im.mode in ("P","RGBA","LA"): im = im.convert("RGB")
            w,h = im.size
            if w > 800: im = im.resize((800, int(h*800/w)), Image.LANCZOS)
            name = hashlib.md5(u.encode()).hexdigest()[:16] + ".jpg"
            p = os.path.join(OUT, name)
            if not os.path.exists(p):
                im.save(p, "JPEG", quality=82, optimize=True)
            return name
        except Exception:
            return None
    except Exception:
        return None

def worker(purl):
    try:
        r = s.get(purl, timeout=25)
        if r.status_code != 200: return {"product": purl, "status": r.status_code}
        imgs = [f for f in (dl(u) for u in extract(r.text)) if f]
        return {"product": purl, "imgs": imgs}
    except Exception as e:
        return {"product": purl, "error": str(e)[:60]}

todo = [p for p in products if p not in done]
with ThreadPoolExecutor(max_workers=6) as ex:
    for i, res in enumerate(ex.map(worker, todo), 1):
        with lock:
            mfp.write(json.dumps(res) + "\n")
            mfp.flush()
        if i % 100 == 0:
            print("[" + str(i) + "/" + str(len(todo)) + "] files: " + str(len(os.listdir(OUT))))

mfp.close()
print()
print("done. total files:", len(os.listdir(OUT)))

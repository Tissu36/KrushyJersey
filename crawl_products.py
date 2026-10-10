import re, json, time, requests, threading
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.okktt.com"
START = BASE + "/Products/list-r1.html"
OUT = "okktt_products.txt"
CATS_OUT = "categories.txt"

# if you have a fresh PHPSESSID from Chrome, paste it below. Otherwise leave as-is and we'll get one.
COOKIE_STR = ""

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-GB,en;q=0.9",
    "Referer": BASE + "/",
}

sess = requests.Session()
sess.headers.update(HEADERS)
if COOKIE_STR:
    sess.headers["Cookie"] = COOKIE_STR

r = sess.get(START, timeout=25)
print("status:", r.status_code, "| len:", len(r.text))
if r.status_code == 401 or "Unauthorized" in r.text[:300]:
    print("401 - need a cookie. Open okktt.com in Chrome, devtools > Network > copy cookie header.")
    raise SystemExit

soup = BeautifulSoup(r.text, "html.parser")
categories = set()
for a in soup.find_all("a", href=True):
    h = a["href"]
    if re.match(r"^/[^/]+-c\d+(?:-\d+)?\.html$", h):
        categories.add(urljoin(BASE, h))
print("categories found:", len(categories))

with open(CATS_OUT, "w") as f:
    for c in sorted(categories):
        f.write(c + "\n")

PRODUCT_RE = re.compile(r"-p\d+\.html$")
product_urls = set()

def grab_products(html, page_url):
    s = BeautifulSoup(html, "html.parser")
    out = set()
    for a in s.find_all("a", href=True):
        u = urljoin(page_url, a["href"])
        if PRODUCT_RE.search(urlparse(u).path):
            out.add(u)
    return out

def find_next(html, page_url):
    m = re.search(r"-c(\d+)(?:-(\d+))?\.html$", urlparse(page_url).path)
    if not m: return None
    cid = m.group(1)
    cur = int(m.group(2)) if m.group(2) else 1
    want = "-c{}-{}.html".format(cid, cur + 1)
    s = BeautifulSoup(html, "html.parser")
    for a in s.find_all("a", href=True):
        u = urljoin(page_url, a["href"])
        if urlparse(u).path.endswith(want):
            return u
    return None

lock = threading.Lock()

def walk_category(cat_url):
    url = cat_url
    seen = set()
    added = 0
    while url and url not in seen:
        seen.add(url)
        try:
            rr = sess.get(url, timeout=25)
            if rr.status_code != 200: break
            new = grab_products(rr.text, url)
            with lock:
                product_urls.update(new)
            added += len(new)
            url = find_next(rr.text, url)
            time.sleep(0.15)
        except Exception as e:
            print("err", url, e); break
    return added

with ThreadPoolExecutor(max_workers=5) as ex:
    for i, added in enumerate(ex.map(walk_category, sorted(categories)), 1):
        if i % 20 == 0:
            print("[{}/{}] total products: {}".format(i, len(categories), len(product_urls)))

with open(OUT, "w") as f:
    f.write("\n".join(sorted(product_urls)))
print()
print("DONE. products:", len(product_urls), "-> okktt_products.txt")
print("categories saved -> categories.txt")

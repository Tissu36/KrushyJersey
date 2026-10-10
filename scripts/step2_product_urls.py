import sys, re, time, requests, threading
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, ".")
from okktt_config import COOKIE_STR, BASE, UA

s = requests.Session()
s.headers.update({"User-Agent": UA, "Referer": BASE + "/", "Cookie": COOKIE_STR})

with open("categories.txt", encoding="utf-8") as f:
    cats = [l.strip() for l in f if l.strip()]
print("categories:", len(cats))

PRODUCT_RE = re.compile(r"-p\d+\.html?$")
products = set()
lock = threading.Lock()

def find_next(html, page_url):
    m = re.search(r"-c(\d+)(?:-(\d+))?\.html$", urlparse(page_url).path)
    if not m: return None
    cid = m.group(1)
    cur = int(m.group(2)) if m.group(2) else 1
    want = "-c{}-{}.html".format(cid, cur + 1)
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        u = urljoin(page_url, a["href"])
        if urlparse(u).path.endswith(want):
            return u
    return None

def walk(cat_url):
    url = cat_url
    seen = set()
    count = 0
    while url and url not in seen:
        seen.add(url)
        try:
            r = s.get(url, timeout=25)
            if r.status_code != 200: break
            soup = BeautifulSoup(r.text, "html.parser")
            new = set()
            for a in soup.find_all("a", href=True):
                u = urljoin(BASE, a["href"])
                if PRODUCT_RE.search(urlparse(u).path):
                    new.add(u)
            with lock:
                products.update(new)
            count += len(new)
            url = find_next(r.text, url)
            time.sleep(0.1)
        except Exception as e:
            print("err", url, str(e)[:60])
            break
    return count

with ThreadPoolExecutor(max_workers=5) as ex:
    for i, c in enumerate(ex.map(walk, cats), 1):
        if i % 20 == 0:
            print("[" + str(i) + "/" + str(len(cats)) + "] total: " + str(len(products)))

with open("okktt_products.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(sorted(products)))
print()
print("total products:", len(products))
print("saved okktt_products.txt")

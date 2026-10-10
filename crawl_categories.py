import re, json, time, requests, threading
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.okktt.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0", "Referer": BASE + "/"}
sess = requests.Session()
sess.headers.update(HEADERS)

cats = []
with open("categories.txt") as f:
    for line in f:
        line = line.strip()
        if not line: continue
        if line.startswith("http"):
            cats.append(line)
        else:
            m = re.search(r'href="([^"]+)"', line)
            if m: cats.append(urljoin(BASE, m.group(1)))

print("categories:", len(cats), flush=True)

PRODUCT_RE = re.compile(r"-p(\d+)\.html?$")
mapping = {}
lock = threading.Lock()

def find_next(html, page_url):
    m = re.search(r"-c(\d+)(?:-(\d+))?\.html$", urlparse(page_url).path)
    if not m: return None
    cid = m.group(1); cur = int(m.group(2)) if m.group(2) else 1
    want = "-c{}-{}.html".format(cid, cur + 1)
    s = BeautifulSoup(html, "html.parser")
    for a in s.find_all("a", href=True):
        u = urljoin(page_url, a["href"])
        if urlparse(u).path.endswith(want): return u
    return None

def cat_name(url):
    m = re.match(r"^/(.+)-c\d+(?:-\d+)?\.html$", urlparse(url).path)
    return m.group(1).replace("-", " ").replace("%C2%A0", " ").strip() if m else url

def walk(cat_url):
    name = cat_name(cat_url)
    url = cat_url; seen = set(); count = 0
    while url and url not in seen:
        seen.add(url)
        try:
            r = sess.get(url, timeout=25)
            if r.status_code != 200: break
            s = BeautifulSoup(r.text, "html.parser")
            for a in s.find_all("a", href=True):
                u = urljoin(BASE, a["href"])
                m = PRODUCT_RE.search(urlparse(u).path)
                if m:
                    pid = m.group(1)
                    with lock:
                        mapping.setdefault(pid, [])
                        if name not in mapping[pid]:
                            mapping[pid].append(name)
                    count += 1
            url = find_next(r.text, url)
            time.sleep(0.1)
        except Exception as e:
            break
    return name, count

with ThreadPoolExecutor(max_workers=5) as ex:
    for i, (name, c) in enumerate(ex.map(walk, cats), 1):
        if i % 30 == 0:
            print("[{}/{}] {} ({} mapped)".format(i, len(cats), name, len(mapping)), flush=True)

json.dump(mapping, open("product_categories_full.json", "w"), separators=(",", ":"))
print("DONE. mapped:", len(mapping))

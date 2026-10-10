import re, json, time, requests, threading, os
from concurrent.futures import ThreadPoolExecutor

BASE = "https://www.okktt.com"
PRODUCTS = "products.json"
OUT = "hero_order.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0", "Referer": BASE + "/"}
sess = requests.Session()
sess.headers.update(HEADERS)

products = json.load(open(PRODUCTS))
print("products:", len(products), flush=True)

done = {}
if os.path.exists(OUT):
    done = json.load(open(OUT))
    print("resume:", len(done), flush=True)

lock = threading.Lock()
mfp = open("hero_order.jsonl", "a")

def process(item):
    pid = item["id"]
    url = item["sourceUrl"]
    if pid in done: return None
    try:
        r = sess.get(url, timeout=25)
        if r.status_code != 200: return None
        html = r.text
        pics = re.findall(r'data_pic="(https://cdn\.staticyy\.com/100530/[^"]+)"', html)
        clean = []
        seen = set()
        for p in pics:
            p2 = p.split("?")[0]
            if p2 not in seen:
                seen.add(p2); clean.append(p2)
        return {"pid": pid, "thumbs": clean}
    except: return None

todo = [p for p in products if p["id"] not in done]
print("todo:", len(todo), flush=True)

with ThreadPoolExecutor(max_workers=5) as ex:
    for i, res in enumerate(ex.map(process, todo), 1):
        if res:
            with lock:
                mfp.write(json.dumps(res) + "\n")
                mfp.flush()
                done[res["pid"]] = res
        if i % 200 == 0:
            print("[{}/{}] done: {}".format(i, len(todo), len(done)), flush=True)

mfp.close()
json.dump(done, open(OUT, "w"), separators=(",", ":"))
print("DONE. saved:", OUT)

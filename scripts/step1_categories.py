import sys, re, time, requests
sys.path.insert(0, ".")
from okktt_config import COOKIE_STR, BASE, UA

s = requests.Session()
s.headers.update({"User-Agent": UA, "Referer": BASE + "/", "Cookie": COOKIE_STR})

r = s.get(BASE + "/Products/list-r1.html", timeout=25)
print("status:", r.status_code, "len:", len(r.text))

cats = set()
for m in re.finditer(r'href="(/[^"]*-c\d+(?:-\d+)?\.html)"', r.text):
    cats.add(BASE + m.group(1))

print("categories found:", len(cats))
open("categories.txt", "w", encoding="utf-8").write("\n".join(sorted(cats)))
print("saved categories.txt")

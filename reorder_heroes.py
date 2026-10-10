import json, hashlib, os

PRODUCTS = "products.json"
HERO = "hero_order.json"
IMAGES_DIR = "public/images"

p = json.load(open(PRODUCTS))
hero_data = json.load(open(HERO))

# crawler hashes URLs to filenames: md5(url)[:16] + .jpg
# but wait - our crawl saves as md5(full_url_with_query)[:16] + .jpg
# hero_order stores URLs without query. Let's try both.

def url_to_hash_nq(url):
    """md5 of URL without query"""
    return hashlib.md5(url.encode()).hexdigest()[:16]

reordered = 0
no_data = 0
no_match = 0

for x in p:
    pid = x["id"]
    h = hero_data.get(pid)
    if not h or not h.get("thumbs"):
        no_data += 1
        continue
    thumb_urls = h["thumbs"]
    # convert thumb URLs to hashes
    ordered_hashes = [url_to_hash_nq(u) for u in thumb_urls]
    # find matches in x["images"]
    ordered = []
    for hsh in ordered_hashes:
        for img in x["images"]:
            if img.startswith(hsh):
                if img not in ordered:
                    ordered.append(img)
                break
    if not ordered:
        no_match += 1
        continue
    # thumbs first (in order), then any leftover images
    leftover = [i for i in x["images"] if i not in ordered]
    new_order = ordered + leftover
    if new_order != x["images"]:
        x["images"] = new_order
        reordered += 1

json.dump(p, open(PRODUCTS, "w"), separators=(",", ":"))
print("total products:", len(p))
print("reordered:", reordered)
print("no hero data:", no_data)
print("thumbs didn't match saved files:", no_match)
print()
print("sample first 3:")
for x in p[:3]:
    print(" ", x["name"][:55])
    print("   first img:", x["images"][0] if x["images"] else "NONE")

import json, re, os

MANIFEST = "okktt_manifest.jsonl"
CATMAP = "product_categories_full.json"
OUT = "products.json"

# map every category name (lowercase) to its slug
CATEGORY_MAP = {
  "national team": "national-team",
  "premier league": "premier-league",
  "la liga": "la-liga",
  "serie a": "serie-a",
  "bundesliga": "bundesliga",
  "ligue 1": "ligue-1-mcdonalds",
  "kits": "kits",
  "retro jerseys": "retro-jerseys",
  "casual clothing": "casual-clothing",
  "jacket windbreaker": "jackets",
  "jacket   windbreaker": "jackets",
  "mlb": "mlb", "nba": "nba", "nfl": "nfl", "nhl": "nhl",
  "rugby": "rugby", "f1": "f1", "mls": "mls",
  "brasileiro s%C3%A9rie  a": "brasileiro-serie-a",
  "mexigo liga": "mexican-liga",
  "other american and asia clubs": "other-american-asia",
  "other european clubs": "other-european",
  "primeira liga eredlvlse": "primeira-liga",
  "scottish premiership": "scottish-premiership",
  "saudi arabia clubs": "saudi-arabia-clubs",
  "turkey austria clubs": "turkey-austria",
  "mls other cluber": "mls-other",
  "spain": "spain", "italy": "italy", "germany": "germany", "france": "france",
  "england": "england", "portugal": "portugal", "brazil": "brazil",
  "argentina": "argentina", "mexico": "mexico",
  "uruguay colombia venezuela": "uruguay-colombia",
  "other clubs spain": "other-spain",
  "other brazil clubs": "other-brazil",
  "italy other clubs": "other-italy",
  "chile league": "chile",
  "chile south america": "chile-south",
  "argentinian league": "argentina-league",
  "korea asia": "korea",
  "japan": "japan", "japan clubs": "japan-clubs",
  "usa": "usa", "canada north america": "canada",
  "egypt africa": "egypt",
  "morocco algeria": "morocco",
  "netherlands": "netherlands", "belgium poland croatia": "belgium",
  "norway austria ireland": "norway",
  "wales scotland denmark": "wales",
  "denmark croatia clubs": "denmark",
  "ireland czech republic clubs": "ireland",
  "australia new zealand": "australia",
  "australian and africa club": "australia-africa",
  "other clubs in the americas": "other-americas",
  "europe other": "europe-other",
  "paraguay peru clubs": "paraguay",
  "colombian other clubs": "colombia",
  "uruguay clubs": "uruguay",
  "mexico other clubs": "mexico-other",
  "israel league": "israel",
  "all star and leisure": "all-star",
  "nba pants": "nba-pants",
  "nba t shirt": "nba-tshirt",
  "efl championship and other": "efl",
  "france other clubs": "other-france",
  "rma": "rma", "bar": "bar", "psg": "psg", "ars": "ars",
  "man utd": "man-utd", "man city": "man-city", "liverpool": "liverpool",
  "chelsea": "chelsea", "tottenham": "tottenham", "everton": "everton",
  "newcastle": "newcastle", "aston villa": "aston-villa", "west ham": "west-ham",
  "acm": "acm", "int": "int", "juv": "juv", "napoli": "napoli", "roma": "roma",
  "lazio": "lazio", "atalanta": "atalanta", "fiorentina": "fiorentina",
  "torino": "torino", "genoa": "genoa", "sampdoria": "sampdoria",
  "parma": "parma", "como": "como", "venezia fc": "venezia",
  "atm": "atm", "real betis": "real-betis", "real sociedad": "real-sociedad",
  "sevilla almeria": "sevilla", "villarreal": "villarreal", "valencia": "valencia",
  "bilbao": "bilbao", "osasuna": "osasuna", "celta espanyol": "celta",
  "malaga albacete": "malaga", "leganes granada": "leganes",
  "zaragoza": "zaragoza", "valladolid": "valladolid", "cadiz": "cadiz",
  "oviedo": "oviedo", "girona elche": "girona",
  "bayern": "bayern", "dortmund": "dortmund", "rb leipzig": "rb-leipzig",
  "bayer 04 leverkusen": "leverkusen", "eintracht frankfurt": "frankfurt",
  "borussia m%C3%B6nchengladbach": "gladbach", "werder bremen": "werder",
  "vfB stuttgart": "stuttgart", "vfb stuttgart": "stuttgart",
  "schalke 04": "schalke", "hertha berlin": "hertha",
  "fc köln": "koln", "fc k%C3%B6ln": "koln", "hamburger": "hamburger",
  "vfl wolfsburg": "wolfsburg", "fc union berlin": "union-berlin",
  "st pauli": "st-pauli", "1899 hoffenheim": "hoffenheim",
  "bundesliga other": "bundesliga-other",
  "celtic": "celtic", "rangers": "rangers", "aberdeen": "aberdeen",
  "dundee f c": "dundee",
  "psv eindhoven": "psv", "feyenoord rotterdam": "feyenoord",
  "twente": "twente", "sc heerenveen": "heerenveen", "fc groningen": "groningen",
  "benfica": "benfica", "fc porto": "porto", "sporting lisbon": "sporting",
  "de braga": "braga", "fc alverca": "alverca",
  "galatasaray": "galatasaray", "fenerbahce": "fenerbahce",
  "be%C5%9Fikta%C5%9F": "besiktas",
  "monaco": "monaco", "lyon": "lyon", "marseille": "marseille",
  "lille": "lille", "nice": "nice", "nantes": "nantes", "rennes": "rennes",
  "stade rennais": "rennes", "rc lens": "lens", "strasbourg": "strasbourg",
  "saint etienne": "saint-etienne", "bordeaux": "bordeaux",
  "toulouse": "toulouse",
  "al nassr fc": "al-nassr", "al hilal": "al-hilal",
  "ittihad club": "ittihad", "al ahli fc": "al-ahli",
  "inter miami": "inter-miami", "la galaxy": "la-galaxy",
  "new york city": "nycfc", "new york red bulls": "nyrb",
  "atlanta united": "atlanta", "chicago fire": "chicago",
  "minnesota united": "minnesota", "nashville sc": "nashville",
  "portland timbers": "portland", "orlando city": "orlando",
  "austin fc": "austin", "auStin fc": "austin",
  "charlotte": "charlotte", "dallas fc": "dallas",
  "houston dynamo": "houston",
  "flamengo": "flamengo", "corinthians": "corinthians",
  "santos fc": "santos", "palmeiras": "palmeiras", "cruzeiro": "cruzeiro",
  "atletico mineiro": "atletico-mineiro", "botafogo": "botafogo",
  "fluminense": "fluminense", "vasco da": "vasco",
  "sao paulo fc": "sao-paulo", "internacional": "internacional",
  "gr%C3%Aamio": "gremio", "bahia": "bahia", "recife": "recife",
  "bragantino": "bragantino", "vit%C3%B3ria": "vitoria",
  "boca juniors": "boca-juniors", "river plate": "river-plate",
  "san lorenzo": "san-lorenzo", "newell s old boys": "newells",
  "atletico nacional": "atletico-nacional", "millonarios f%C3%BAtbol": "millonarios",
  "sport emelec": "emelec", "colo colo": "colo-colo",
  "universidad de chile": "u-chile", "universidad cat%C3%B3lica": "u-catolica",
  "palestino": "palestino", "chivas": "chivas", "america": "america",
  "cruz azul": "cruz-azul", "pumas unam": "pumas", "tigres uanl": "tigres",
  "monterrey": "monterrey", "toluca": "toluca", "necaxa": "necaxa",
  "atlas fc": "atlas", "leon": "leon", "santos laguna": "santos-laguna",
  "tijuana": "tijuana", "pachuca": "pachuca", "puebla fc": "puebla",
  "cd olimpia": "olimpia", "motagua": "motagua", "municipal": "municipal",
  "jorge campos": "jorge-campos", "personalized customization": "custom",
  "aja%C3%97": "ajax",
  "salzburg": "salzburg", "dinamo zagreb": "dinamo", "copenhagen": "copenhagen",
  "anderlecht": "anderlecht", "paok": "paok", "cork city": "cork",
  "spezia calcio": "spezia", "cagliari": "cagliari",
  "beitar jerusalem": "beitar", "hapoel haifa": "hapoel-haifa",
  "hapoel tel aviv": "hapoel-ta", "hapoel be er sheva": "hapoel-bs",
  "hapoel petah tikva": "hapoel-pt",
  # NBA teams
  "lakers": "lakers", "warriors": "warriors", "spurs": "spurs",
  "bulls": "bulls", "rockets": "rockets", "kings": "kings", "suns": "suns",
  "nuggets": "nuggets", "76ers": "76ers", "celtics": "celtics",
  "dream team": "dream-team", "hornets": "hornets", "magic": "magic",
  "heat": "heat", "okc": "okc", "grizzlies": "grizzlies", "jazz": "jazz",
  "raptors": "raptors", "nets": "nets", "trail blazers": "blazers",
  "bucks": "bucks", "indiana pacers": "pacers", "wizards": "wizards",
  "pistons": "pistons", "pelicans": "pelicans",
  "la": "la", "mitchellness": "mitchellness",
}

CATEGORY_NAMES = {
  "national-team": "National Teams", "premier-league": "Premier League",
  "la-liga": "La Liga", "serie-a": "Serie A", "bundesliga": "Bundesliga",
  "ligue-1-mcdonalds": "Ligue 1 McDonald's",
  "retro-jerseys": "Retro Jerseys", "casual-clothing": "Casual Clothing",
  "jackets": "Jackets", "kits": "Kits",
  "mlb": "MLB", "nba": "NBA", "nfl": "NFL", "nhl": "NHL",
  "rugby": "Rugby", "f1": "F1", "mls": "MLS",
  "brasileiro-serie-a": "Brasileiro Série A", "mexican-liga": "Mexican Liga",
  "other-american-asia": "Other American & Asia Clubs",
  "other-european": "Other European Clubs",
  "primeira-liga": "Primeira Liga & Eredivisie",
  "scottish-premiership": "Scottish Premiership",
  "saudi-arabia-clubs": "Saudi Arabia Clubs",
  "turkey-austria": "Turkey & Austria Clubs",
}

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

catmap = json.load(open(CATMAP))
products = []; seen = set()
for line in open(MANIFEST):
    try: row = json.loads(line)
    except: continue
    url = row.get("product",""); imgs = row.get("imgs", [])
    if not imgs: continue
    m = re.search(r"-p(\d+)\.html?$", url)
    if not m: continue
    pid = m.group(1)
    raw = name_of(url)
    name = " ".join(w if (w.isdigit() or w.isupper()) else w.capitalize()
                    for w in clean(expand(raw)).split()) or "Product " + pid
    slug = slug_of(raw) or "product-" + pid
    if slug in seen: slug += "-" + pid
    seen.add(slug)
    cats_raw = catmap.get(pid, [])
    # slug-ify ALL categories
    all_slugs = []
    for c in cats_raw:
        key = c.lower().strip()
        if key in CATEGORY_MAP:
            s = CATEGORY_MAP[key]
            if s not in all_slugs: all_slugs.append(s)
    if not all_slugs: all_slugs = ["other"]
    primary_slug = all_slugs[0]
    primary_name = CATEGORY_NAMES.get(primary_slug, primary_slug.replace("-", " ").title())
    lname = name.lower()
    customizable = not any(k in lname for k in (
        "retro","jacket","windbreaker","hoodie","tracksuit","training",
        "suit","shorts","kids","youth","junior"))
    products.append({
        "id": pid, "slug": slug, "name": name,
        "price": price_for(name),
        "category": primary_name, "categorySlug": primary_slug,
        "categories": all_slugs,
        "subtags": classify(name),
        "images": imgs, "sourceUrl": url,
        "customizable": customizable,
        "sizes": ["S","M","L","XL","XXL"],
    })

products.sort(key=lambda p: p["name"].lower())
json.dump(products, open(OUT,"w"), separators=(",", ":"))
print("FINAL:", len(products), "products")
from collections import Counter
c = Counter()
for x in products:
    for s in x["categories"]:
        c[s] += 1
print("top categories (products can be in multiple):")
for k, n in c.most_common(30):
    print("  {} {}".format(str(n).rjust(5), k))

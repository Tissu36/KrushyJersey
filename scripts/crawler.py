import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# --- CONFIGURATION ---
# REPLACE with the actual OKKTT URL for new jerseys
BASE_URL = "https://okktt.com/new-arrivals" 
PRODUCTS_FILE = "products.json"
IMAGES_DIR = "public/images"

def fetch_new_products():
    print(f"Fetching: {BASE_URL}")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    try:
        response = requests.get(BASE_URL, headers=headers, timeout=20)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching page: {e}")
        return []
        
    soup = BeautifulSoup(response.text, 'html.parser')
    new_products = []
    
    # --- PLACEHOLDER: You must inspect OKKTT's HTML to find the correct tags/classes ---
    # Example: product_cards = soup.find_all('div', class_='product-card-class-name')
    product_cards = soup.find_all('div', class_='product-item') # Placeholder class
    
    for card in product_cards:
        try:
            # Extract Name, Price, and Image URL from the card
            name = card.find('h2').text.strip() # Placeholder tag
            price_text = card.find('span', class_='price').text.strip() # Placeholder tag
            img_tag = card.find('img')
            img_url = img_tag['src'] if img_tag else None
            
            # Clean price (e.g., "$45.00" -> 45.00)
            price = float(price_text.replace('$', '').replace(',', '').strip())
            
            new_products.append({
                "name": name,
                "price": price,
                "image_url": img_url
            })
        except Exception as e:
            print(f"Skipping a card due to parsing error: {e}")
            
    return new_products

def download_images(products):
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)
        
    downloaded = 0
    for p in products:
        if not p.get('image_url'): continue
        
        # Create a unique filename based on the product name
        filename = p['name'].lower().replace(' ', '-').replace('/', '') + '.jpg'
        filepath = os.path.join(IMAGES_DIR, filename)
        
        if os.path.exists(filepath):
            continue # Image already exists
            
        try:
            print(f"Downloading: {filename}")
            img_res = requests.get(p['image_url'], stream=True, timeout=15)
            img_res.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in img_res.iter_content(chunk_size=8192):
                    f.write(chunk)
            downloaded += 1
            p['local_image'] = filename # Save the local filename
        except Exception as e:
            print(f"Failed to download {filename}: {e}")
            
    print(f"Downloaded {downloaded} new images.")
    return products

def update_database(new_products):
    if not os.path.exists(PRODUCTS_FILE):
        print("products.json not found. Cannot update.")
        return
        
    with open(PRODUCTS_FILE, 'r') as f:
        db = json.load(f)
        
    existing_slugs = {p['slug'] for p in db}
    added_count = 0
    
    for p in new_products:
        # Generate a slug from the name
        slug = p['name'].lower().replace(' ', '-').replace('/', '')
        
        if slug in existing_slugs:
            continue # Skip if already in DB
            
        new_id = str(int(datetime.now().timestamp() * 1000)) # Simple unique ID
        
        product_entry = {
            "id": new_id,
            "slug": slug,
            "name": p['name'],
            "price": p['price'],
            "category": "Other",
            "categorySlug": "other", # You might want to add logic to detect league
            "categories": ["other"],
            "images": [p.get('local_image', '')],
            "sourceUrl": BASE_URL,
            "customizable": True,
            "sizes": ["S", "M", "L", "XL"]
        }
        
        db.append(product_entry)
        existing_slugs.add(slug)
        added_count += 1
        
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(db, f, indent=2)
        
    print(f"Added {added_count} new products to the database.")

if __name__ == "__main__":
    print("🚀 Starting weekly crawl...")
    products = fetch_new_products()
    if products:
        products_with_images = download_images(products)
        update_database(products_with_images)
    else:
        print("No new products found.")
    print("✅ Crawl finished.")

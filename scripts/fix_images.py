import json
import os
import struct

def get_jpeg_size(file_path):
    with open(file_path, 'rb') as f:
        f.read(2) # Skip SOI
        b = f.read(1)
        try:
            w, h = 0, 0
            while b:
                while b != b'\xff': b = f.read(1)
                b = f.read(1)
                if b in (b'\xc0', b'\xc1', b'\xc2', b'\xc3'):
                    f.read(3)
                    h, w = struct.unpack('>HH', f.read(4))
                    return w, h
                else:
                    f.read(struct.unpack('>H', f.read(2))[0] - 2)
                b = f.read(1)
        except Exception:
            pass
    return 0, 0

print("Loading products.json...")
with open('products.json', 'r') as f:
    products = json.load(f)

print(f"Processing {len(products)} products...")
updated = 0

for p in products:
    if not p.get('images') or len(p['images']) <= 1:
        continue
        
    valid_images = []
    for img_name in p['images']:
        # Check both possible local paths
        img_path = os.path.join('public', 'images', img_name)
        if not os.path.exists(img_path):
            img_path = os.path.join('public', img_name.lstrip('/'))
            
        if os.path.exists(img_path):
            w, h = get_jpeg_size(img_path)
            ratio = h / w if w > 0 else 0
            valid_images.append((img_name, ratio))
        else:
            valid_images.append((img_name, 0)) # Fallback

    valid_images.sort(key=lambda x: x[1], reverse=True)
    
    new_images = [img[0] for img in valid_images]
    if new_images != p['images']:
        p['images'] = new_images
        updated += 1

print(f"✅ Successfully reordered images for {updated} products.")
with open('products.json', 'w') as f:
    json.dump(products, f, indent=2)

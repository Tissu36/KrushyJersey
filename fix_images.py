import json, os

# Get the exact filenames that are actually on the server
image_dir = "public/images"
if not os.path.exists(image_dir):
    print("Images folder not found locally, skipping fix.")
    exit()

real_files = set(os.listdir(image_dir))
print(f"Real files on server: {len(real_files)}")

p = json.load(open("products.json"))
fixed = 0

for x in p:
    new_imgs = []
    for img in x.get("images", []):
        # Strip any accidental 'images/' prefix
        clean_img = img.replace("images/", "")
        
        # If the exact file exists, keep it
        if clean_img in real_files:
            new_imgs.append(clean_img)
        else:
            # Sometimes there are case differences, try finding it
            matches = [f for f in real_files if f.lower() == clean_img.lower()]
            if matches:
                new_imgs.append(matches[0])
                fixed += 1
            else:
                pass # Image is completely missing
                
    x["images"] = new_imgs

json.dump(p, open("products.json", "w"), separators=(",", ":"))
print(f"Fixed {fixed} image paths to match server exactly.")

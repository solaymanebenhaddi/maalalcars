import os, shutil

src_base = r'C:\Users\benjk\Downloads\Dossier Maalal Cars (1)\Dossier Maalal Cars'
dst_base = r'c:\Users\benjk\Desktop\MAALALCARS\public\temp_cars'
os.makedirs(dst_base, exist_ok=True)

folders = sorted([f for f in os.listdir(src_base) if os.path.isdir(os.path.join(src_base, f)) and f != 'ads'])

html_cards = []

for f in folders:
    folder_src = os.path.join(src_base, f)
    imgs = [i for i in os.listdir(folder_src) if i.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    # Copy up to 3 images into public/temp_cars/<folder_safe>/
    f_safe = f.replace(' ', '_').replace('-', '_')
    f_dst = os.path.join(dst_base, f_safe)
    os.makedirs(f_dst, exist_ok=True)

    img_tags = []
    # Pick front, back, and any carte grise / side
    selected_imgs = imgs[:4]
    for idx, img in enumerate(selected_imgs):
        src_img = os.path.join(folder_src, img)
        dst_img_name = f"img_{idx}.jpg"
        dst_img = os.path.join(f_dst, dst_img_name)
        if not os.path.exists(dst_img):
            shutil.copy2(src_img, dst_img)
        img_tags.append(f'<div class="img-box"><img src="/temp_cars/{f_safe}/{dst_img_name}" /><span class="label">{img[:30]}</span></div>')

    html_cards.append(f'''
    <div class="card" id="folder-{f_safe}">
      <h2>{f} <span class="badge">{len(imgs)} photos</span></h2>
      <div class="gallery">
        {''.join(img_tags)}
      </div>
    </div>
    ''')

html_content = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Maalal Cars Image Inspector</title>
  <style>
    body {{ background: #0b0d13; color: #fff; font-family: sans-serif; padding: 20px; }}
    h1 {{ color: #ef233c; margin-bottom: 20px; }}
    .card {{ background: #161a23; border: 1px solid #2a3242; border-radius: 12px; padding: 16px; margin-bottom: 20px; }}
    .card h2 {{ margin: 0 0 12px 0; font-size: 18px; color: #f1f5f9; display: flex; align-items: center; gap: 10px; }}
    .badge {{ background: #ef233c; color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 10px; }}
    .gallery {{ display: flex; gap: 12px; flex-wrap: wrap; }}
    .img-box {{ position: relative; width: 280px; height: 210px; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }}
    .img-box img {{ width: 100%; height: 100%; object-fit: contain; }}
    .label {{ position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); font-size: 10px; padding: 4px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; }}
  </style>
</head>
<body>
  <h1>MAALAL CARS — Audit Visuel des 25 Dossiers Photos</h1>
  {''.join(html_cards)}
</body>
</html>
'''

with open(r'c:\Users\benjk\Desktop\MAALALCARS\public\gallery.html', 'w', encoding='utf-8') as out:
    out.write(html_content)

print(f"Generated gallery.html with {len(folders)} folders and copied photos into public/temp_cars/")

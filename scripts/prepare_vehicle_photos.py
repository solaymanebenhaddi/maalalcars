import os, json
from PIL import Image

SRC_BASE = r'C:\Users\benjk\Downloads\Dossier Maalal Cars (1)\Dossier Maalal Cars'
PUBLIC_VEHICLES = r'c:\Users\benjk\Desktop\MAALALCARS\public\vehicles'
STORAGE_VEHICLES = r'c:\Users\benjk\Desktop\MAALALCARS\storage\vehicles'

os.makedirs(PUBLIC_VEHICLES, exist_ok=True)
os.makedirs(STORAGE_VEHICLES, exist_ok=True)

MAPPINGS = [
  {
    "folder": "1- MERCEDES C220",
    "vehicleId": "cmtwpptce00b4uya3e970z588",
    "slug": "mercedes-c220-2015",
    "code": "V-2026-0088"
  },
  {
    "folder": "2- SKODA OCTAVIA",
    "vehicleId": "cmtwppt9v00b0uya3c91w9vvy",
    "slug": "skoda-octavia-2023",
    "code": "V-2026-0078"
  },
  {
    "folder": "3- HYNDAI TUCSON",
    "vehicleId": "cmtwpprnp0078uya3wphivz4k",
    "slug": "hyundai-tucson-2022",
    "code": "V-2026-0060"
  },
  {
    "folder": "4- VOLKSWAGEN T-ROC",
    "vehicleId": "cmtwppsvk00a5uya359jfrd2m",
    "slug": "vw-troc-2023",
    "code": "V-2026-0081"
  },
  {
    "folder": "5- RENAULT CLIO 5",
    "vehicleId": "cmtwppsxm00aauya3wz4j0ai7",
    "slug": "renault-clio5-2024",
    "code": "V-2026-0082"
  },
  {
    "folder": "6- HYUNDAI I10",
    "vehicleId": "cmtwppsez0091uya3kol9qdab",
    "slug": "hyundai-i10-2021",
    "code": "V-2026-0073"
  },
  {
    "folder": "7- KIA PICANTO",
    "vehicleId": "cmtwpprxn007xuya3otgohxsw",
    "slug": "kia-picanto-2022",
    "code": "V-2026-0065"
  },
  {
    "folder": "8- DACIA DUSTER",
    "vehicleId": "cmtwppr8s0069uya35rizedhc",
    "slug": "dacia-duster-2023-gris",
    "code": "V-2026-0053"
  },
  {
    "folder": "9- RANGE ROVER EVOQUE",
    "vehicleId": "cmtwpptvp00ciuya3due53wnz",
    "slug": "range-rover-evoque-2018",
    "code": "V-2026-0098"
  },
  {
    "folder": "10- JEEP CHEROKEE",
    "vehicleId": "cmtwppqqr0050uya3q6zo9i2l",
    "slug": "jeep-cherokee-2016",
    "code": "V-2026-0044"
  },
  {
    "folder": "11- AUDI Q8",
    "vehicleId": "cmtwppr3g005uuya36e6yi4u8",
    "slug": "audi-q8-2023",
    "code": "V-2026-0050"
  },
  {
    "folder": "12 - BMW 218",
    "vehicleId": "cmtwppsae008ruya39v4j4lsm",
    "slug": "bmw-218-2023",
    "code": "V-2026-0071"
  },
  {
    "folder": "13- MERCEDES A220",
    "vehicleId": "cmtwppr6x0064uya3jk14xtqk",
    "slug": "mercedes-a220-2019",
    "code": "V-2026-0052"
  },
  {
    "folder": "14- SKODA OCTAVIA",
    "vehicleId": "cmtwpps3a008cuya3h48j6d0g",
    "slug": "skoda-octavia-2019-bleu",
    "code": "V-2026-0068"
  },
  {
    "folder": "15- RANGE ROVER - EVOQUE DYNAMIQUE",
    "vehicleId": "cmtwppqa0003ruya3lsvsr088",
    "slug": "range-rover-evoque-2023",
    "code": "V-2026-0035"
  },
  {
    "folder": "16- RENAULT MEGANE",
    "vehicleId": "cmtwpptr100c3uya38m0z64v6",
    "slug": "renault-megane-2018",
    "code": "V-2026-0096"
  },
  {
    "folder": "17- HYUNDAI TUCSON",
    "vehicleId": "cmtwpprl70073uya3nrioxalp",
    "slug": "hyundai-tucson-2023-noir",
    "code": "V-2026-0059"
  },
  {
    "folder": "18- MERCEDES GLC 250",
    "vehicleId": "cmtwpptng00bpuya325608s4y",
    "slug": "mercedes-glc250-2019",
    "code": "V-2026-0093"
  },
  {
    "folder": "19- VOLSWAGEN TOUAREG",
    "vehicleId": "cmtwpppcw001juya3pzy072tp",
    "slug": "vw-touareg-2023",
    "code": "V-2026-0019"
  },
  {
    "folder": "20- DACIA DUSTER",
    "vehicleId": "cmtwpprbe006euya3ui56p5ax",
    "slug": "dacia-duster-2023-vert",
    "code": "V-2026-0054"
  },
  {
    "folder": "21- RANGE ROVER - EVOQUE",
    "vehicleId": "cmtwppql3004luya3yumyqdl4",
    "slug": "range-rover-evoque-2023-noir",
    "code": "V-2026-0041"
  },
  {
    "folder": "22- JEEP RENEGEDE",
    "vehicleId": "cmtwppr54005zuya3qxcn68lz",
    "slug": "jeep-renegade-2019",
    "code": "V-2026-0051"
  },
  {
    "folder": "Dacia Duster 2",
    "vehicleId": "cmtwppsno009luya38mh477fy",
    "slug": "dacia-duster-2023-nardeau",
    "code": "V-2026-0077"
  },
  {
    "folder": "Volkswagen TIGOUAN 2023",
    "vehicleId": "cmtwpptch00b9uya3o806lzbh",
    "slug": "vw-tiguan-2023",
    "code": "V-2026-0089"
  }
]

def optimize_image(src_path, dst_path, max_dim=1280, quality=82):
    try:
        with Image.open(src_path) as img:
            img = img.convert('RGB')
            w, h = img.size
            if max(w, h) > max_dim:
                if w > h:
                    new_w = max_dim
                    new_h = int(h * (max_dim / w))
                else:
                    new_h = max_dim
                    new_w = int(w * (max_dim / h))
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            img.save(dst_path, 'WEBP', quality=quality)
            return True
    except Exception as e:
        print(f"Error optimizing {src_path}: {e}")
        return False

processed_results = []
total_optimized = 0

for item in MAPPINGS:
    folder_dir = os.path.join(SRC_BASE, item["folder"])
    if not os.path.exists(folder_dir):
        print(f"Directory not found: {folder_dir}")
        continue

    files = sorted([f for f in os.listdir(folder_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))])
    # Up to 8 high quality photos per vehicle
    selected = files[:8]
    
    vehicle_photos = []
    for idx, filename in enumerate(selected):
        src_file = os.path.join(folder_dir, filename)
        out_name = f"{item['slug']}-{idx+1}.webp"
        
        pub_dst = os.path.join(PUBLIC_VEHICLES, out_name)
        storage_dst = os.path.join(STORAGE_VEHICLES, out_name)

        if optimize_image(src_file, pub_dst):
            # Also copy to storage
            try:
                import shutil
                shutil.copy2(pub_dst, storage_dst)
            except Exception:
                pass

            total_optimized += 1
            vehicle_photos.append({
                "url": f"/vehicles/{out_name}",
                "isPrimary": (idx == 0),
                "order": idx,
                "category": "EXTERIEUR"
            })

    processed_results.append({
        "vehicleId": item["vehicleId"],
        "folder": item["folder"],
        "code": item["code"],
        "photos": vehicle_photos
    })
    print(f"[OK] [{item['code']}] {item['folder']}: {len(vehicle_photos)} photos processed -> /vehicles/{item['slug']}-*.webp")

with open(r'c:\Users\benjk\Desktop\MAALALCARS\scripts\processed-photos.json', 'w', encoding='utf-8') as f:
    json.dump(processed_results, f, indent=2)

print(f"\nTotal photos optimized: {total_optimized} across {len(processed_results)} vehicles!")

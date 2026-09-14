import os, json
import cv2
import numpy as np
from PIL import Image

preview_base = r'c:\Users\benjk\Desktop\MAALALCARS\storage\temp\preview'
folders = sorted([f for f in os.listdir(preview_base) if os.path.isdir(os.path.join(preview_base, f))])

def get_image_color(img_path):
    try:
        img = cv2.imread(img_path)
        if img is None:
            return "UNKNOWN"
        # Crop center 40% where car body typically sits
        h, w, _ = img.shape
        cy, cx = h // 2, w // 2
        dy, dx = int(h * 0.2), int(w * 0.2)
        crop = img[cy-dy:cy+dy, cx-dx:cx+dx]

        # Convert to HSV
        hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
        h_vals, s_vals, v_vals = hsv[:,:,0], hsv[:,:,1], hsv[:,:,2]

        mean_s = np.mean(s_vals)
        mean_v = np.mean(v_vals)
        mean_h = np.mean(h_vals)

        # Classification heuristics
        if mean_v < 60:
            return "NOIR (Black)"
        elif mean_v > 180 and mean_s < 45:
            return "BLANC / BLANCHE (White)"
        elif mean_s < 40:
            if mean_v > 120:
                return "GRIS CLAIR / ARGENT (Silver/Light Grey)"
            else:
                return "GRIS SOURIS / NARDEAU (Dark Grey)"
        else:
            if 90 <= mean_h <= 130:
                return "BLEU (Blue)"
            elif 35 <= mean_h <= 85:
                return "VERT / VERT MILITAIRE (Green)"
            elif 10 <= mean_h <= 25:
                return "ORANGE / BEIGE / CHAMPAGNE"
            elif mean_h < 10 or mean_h > 160:
                return "ROUGE (Red)"
            else:
                return f"H:{int(mean_h)} S:{int(mean_s)} V:{int(mean_v)}"
    except Exception as e:
        return f"ERR:{e}"

print("=== FOLDER CAR VISUAL CHARACTERISTICS ===")
for f in folders:
    folder_path = os.path.join(preview_base, f)
    imgs = [i for i in os.listdir(folder_path) if i.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    colors = [get_image_color(os.path.join(folder_path, img)) for img in imgs]
    print(f"\nFolder: '{f}'")
    for img, c in zip(imgs, colors):
        print(f"  - {img}: {c}")

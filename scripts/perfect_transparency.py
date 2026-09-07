from PIL import Image
import numpy as np

# Load original uploaded image
src = r"C:\Users\benjk\.gemini\antigravity-ide\brain\9973ed63-3df3-44e3-b4a0-88e2ee26fea8\.user_uploaded\media_1788347940218.png"
img = Image.open(src).convert("RGBA")
arr = np.array(img)

# Convert all dark pixels (where r, g, b are all low) to completely transparent
# Calculate brightness
r = arr[:, :, 0].astype(float)
g = arr[:, :, 1].astype(float)
b = arr[:, :, 2].astype(float)
max_val = np.maximum(np.maximum(r, g), b)

# Anything with max RGB < 35 is pure black background -> alpha 0
# For transition zone between 35 and 70, smoothly interpolate alpha
alpha = np.zeros_like(max_val, dtype=np.uint8)
mask_solid = max_val >= 60
mask_trans = (max_val > 25) & (max_val < 60)

alpha[mask_solid] = 255
alpha[mask_trans] = ((max_val[mask_trans] - 25) / (60 - 25) * 255).astype(np.uint8)

arr[:, :, 3] = alpha

result_img = Image.fromarray(arr, "RGBA")
# Crop tightly to non-zero alpha bounding box
bbox = result_img.getbbox()
if bbox:
    result_img = result_img.crop(bbox)

# Save to public and brain
result_img.save(r"c:\Users\benjk\Desktop\MAALALCARS\public\logo.png", "PNG")
result_img.save(r"c:\Users\benjk\Desktop\MAALALCARS\public\logo-icon.png", "PNG")
result_img.save(r"c:\Users\benjk\Desktop\MAALALCARS\public\maalal-logo.png", "PNG")
result_img.save(r"C:\Users\benjk\.gemini\antigravity-ide\brain\9973ed63-3df3-44e3-b4a0-88e2ee26fea8\logo_clean_transparent.png", "PNG")

# Also render on pure red, pure blue, and pure white test backgrounds to verify 100% transparency
for bg_color, name in [((255, 255, 255), "white"), ((0, 100, 200), "blue"), ((30, 30, 40), "dark")]:
    bg = Image.new("RGBA", (result_img.width + 40, result_img.height + 40), bg_color + (255,))
    bg.paste(result_img, (20, 20), result_img)
    bg.save(rf"C:\Users\benjk\.gemini\antigravity-ide\brain\9973ed63-3df3-44e3-b4a0-88e2ee26fea8\test_on_{name}.png")

print("Cropped Size:", result_img.size)
print("Transparency processing complete!")

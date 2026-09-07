import os
from PIL import Image, ImageFilter

def make_transparent(source_path, dest_paths):
    img = Image.open(source_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # Determine brightness / intensity of the pixel
        intensity = max(r, g, b)
        
        # Black background removal with smooth anti-aliased edge
        if intensity < 12:
            new_data.append((0, 0, 0, 0))
        elif intensity < 40:
            # Smooth alpha fade for antialiasing
            alpha = int(((intensity - 12) / (40 - 12)) * 255)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    
    # Save to all destination paths
    for dest in dest_paths:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        img.save(dest, "PNG")
        print(f"Saved transparent logo to: {dest}")

if __name__ == "__main__":
    src = r"C:\Users\benjk\.gemini\antigravity-ide\brain\9973ed63-3df3-44e3-b4a0-88e2ee26fea8\.user_uploaded\media_1788347940218.png"
    targets = [
        r"c:\Users\benjk\Desktop\MAALALCARS\public\logo.png",
        r"c:\Users\benjk\Desktop\MAALALCARS\public\logo-icon.png",
        r"c:\Users\benjk\Desktop\MAALALCARS\public\maalal-logo.png",
        r"C:\Users\benjk\.gemini\antigravity-ide\brain\9973ed63-3df3-44e3-b4a0-88e2ee26fea8\logo_transparent.png"
    ]
    make_transparent(src, targets)

import os
from PIL import Image
from pathlib import Path

# Config
INPUT_DIR = Path("public/sequence")
OUTPUT_DIR = Path("Sequence-1920x1080")
TARGET_SIZE = (1920, 1080)
RESAMPLING_METHOD = Image.Resampling.LANCZOS

def upscale_frames():
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Get all frames
    frames = sorted(list(INPUT_DIR.glob("*.webp")))
    if not frames:
        print(f"No .webp files found in {INPUT_DIR}")
        return

    print(f"Found {len(frames)} frames. Starting upscaling to {TARGET_SIZE}...")
    
    for i, frame_path in enumerate(frames):
        try:
            with Image.open(frame_path) as img:
                # Upscale using high-quality Lanczos resampling
                upscaled_img = img.resize(TARGET_SIZE, RESAMPLING_METHOD)
                
                # Construct output path (maintain original filename)
                output_path = OUTPUT_DIR / frame_path.name
                
                # Save upscaled frame
                upscaled_img.save(output_path, "WEBP", quality=95)
                
                if (i + 1) % 10 == 0 or (i + 1) == len(frames):
                    print(f"Progress: {i + 1}/{len(frames)}")
        except Exception as e:
            print(f"Error processing {frame_path.name}: {e}")

if __name__ == "__main__":
    upscale_frames()

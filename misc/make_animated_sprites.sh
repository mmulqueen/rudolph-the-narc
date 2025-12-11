#!/bin/bash
# Script to create animated PNGs from spritesheet assets
# Spritesheets are 2 frames side by side (32px width per frame)
# Uses nearest-neighbor scaling for crisp pixel art

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SPRITES_DIR="$PROJECT_ROOT/public/assets/sprites"
OUTPUT_DIR="$SCRIPT_DIR/animated_sprites"
TEMP_DIR="$SCRIPT_DIR/temp_frames"

# Scale factor for output (4x = 128px width per frame)
SCALE=4

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$TEMP_DIR"

# Clean temp directory
rm -f "$TEMP_DIR"/*

echo "Creating animated PNGs from trimmed sprites..."

# Process each trimmed spritesheet
for spritesheet in "$SPRITES_DIR"/*_trimmed.png; do
    filename=$(basename "$spritesheet")
    base_name="${filename%_trimmed.png}"
    output_file="$OUTPUT_DIR/${base_name}.png"

    echo "Processing $filename..."

    # Get dimensions using ffprobe
    dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$spritesheet")
    width=$(echo "$dimensions" | cut -d',' -f1)
    height=$(echo "$dimensions" | cut -d',' -f2)
    frame_width=$((width / 2))

    # Calculate scaled dimensions
    scaled_width=$((frame_width * SCALE))
    scaled_height=$((height * SCALE))

    # Extract frame 1 (left half), scale with nearest neighbor, preserve alpha
    ffmpeg -y -i "$spritesheet" \
        -vf "crop=${frame_width}:${height}:0:0,scale=${scaled_width}:${scaled_height}:flags=neighbor,format=rgba" \
        -frames:v 1 \
        -f image2 "$TEMP_DIR/frame_0.png" 2>/dev/null

    # Extract frame 2 (right half), scale with nearest neighbor, preserve alpha
    ffmpeg -y -i "$spritesheet" \
        -vf "crop=${frame_width}:${height}:${frame_width}:0,scale=${scaled_width}:${scaled_height}:flags=neighbor,format=rgba" \
        -frames:v 1 \
        -f image2 "$TEMP_DIR/frame_1.png" 2>/dev/null

    # Create animated PNG from frames (2 fps = 0.5s per frame)
    ffmpeg -y -framerate 2 \
        -i "$TEMP_DIR/frame_%d.png" \
        -f apng -plays 0 \
        "$output_file" 2>/dev/null

    echo "  -> Created $output_file (${scaled_width}x${scaled_height})"
done

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "Done! Animated sprites saved to: $OUTPUT_DIR"
echo ""
echo "Generated files:"
ls -la "$OUTPUT_DIR"

#!/bin/bash
# Script to create an optimized animated PNG from a video file
# Uses ffmpeg with palette generation for best compression

set -e

# Default values
INPUT=""
OUTPUT="playthrough.png"
WIDTH=270
HEIGHT=429
FPS=2
COLORS=64
DURATION=""  # Empty means full video

usage() {
    echo "Usage: $0 -i input.mp4 [-o output.png] [-w width] [-h height] [-f fps] [-c colors] [-d duration]"
    echo ""
    echo "Options:"
    echo "  -i  Input video file (required)"
    echo "  -o  Output APNG file (default: playthrough.png)"
    echo "  -w  Output width (default: 270)"
    echo "  -h  Output height (default: 429)"
    echo "  -f  Output framerate (default: 2)"
    echo "  -c  Number of colors in palette (default: 64)"
    echo "  -d  Duration in seconds, e.g. '48.5' for first half (default: full video)"
    echo ""
    echo "Example:"
    echo "  $0 -i cap.mp4 -o playthrough.png -c 64 -d 48.5"
    exit 1
}

while getopts "i:o:w:h:f:c:d:" opt; do
    case $opt in
        i) INPUT="$OPTARG" ;;
        o) OUTPUT="$OPTARG" ;;
        w) WIDTH="$OPTARG" ;;
        h) HEIGHT="$OPTARG" ;;
        f) FPS="$OPTARG" ;;
        c) COLORS="$OPTARG" ;;
        d) DURATION="$OPTARG" ;;
        *) usage ;;
    esac
done

if [ -z "$INPUT" ]; then
    echo "Error: Input file is required"
    usage
fi

if [ ! -f "$INPUT" ]; then
    echo "Error: Input file not found: $INPUT"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_PALETTE=$(mktemp --suffix=.png)

# Build duration filter if specified
DURATION_FILTER=""
if [ -n "$DURATION" ]; then
    DURATION_FILTER="-t $DURATION"
fi

echo "Creating animated PNG from: $INPUT"
echo "  Output: $OUTPUT"
echo "  Size: ${WIDTH}x${HEIGHT}"
echo "  FPS: $FPS"
echo "  Colors: $COLORS"
[ -n "$DURATION" ] && echo "  Duration: ${DURATION}s"

# Step 1: Generate optimal palette from video
echo ""
echo "Step 1/2: Generating ${COLORS}-color palette..."
ffmpeg -y -i "$INPUT" $DURATION_FILTER \
    -vf "fps=$FPS,scale=${WIDTH}:${HEIGHT}:flags=lanczos,palettegen=max_colors=${COLORS}" \
    "$TEMP_PALETTE" 2>/dev/null

# Step 2: Create APNG using the palette
echo "Step 2/2: Creating animated PNG..."
ffmpeg -y -i "$INPUT" -i "$TEMP_PALETTE" $DURATION_FILTER \
    -lavfi "fps=$FPS,scale=${WIDTH}:${HEIGHT}:flags=lanczos[x];[x][1:v]paletteuse=dither=none" \
    -f apng -plays 0 \
    "$OUTPUT" 2>/dev/null

# Cleanup
rm -f "$TEMP_PALETTE"

# Report results
SIZE=$(ls -lh "$OUTPUT" | awk '{print $5}')
FRAMES=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$OUTPUT" 2>/dev/null || echo "?")

echo ""
echo "Done!"
echo "  Output: $OUTPUT"
echo "  Size: $SIZE"
echo "  Frames: $FRAMES"

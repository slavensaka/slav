#!/bin/bash

# Array of working Unsplash photo IDs
photos=(
  "photo-1461749280684-dccba630e2f6"  # coding
  "photo-1498050108023-c5249f4df085"  # coding laptop
  "photo-1484417894907-623942c8ee29"  # code on screen
  "photo-1517694712202-14dd9538aa97"  # laptop on desk
  "photo-1504868584819-f8e8b4b6d7e3"  # programming
  "photo-1515879218367-8466d910aaa4"  # code editor
  "photo-1550439062-609e1531270e"  # tech workspace
  "photo-1526374965328-7f61d4dc18c5"  # data visualization
  "photo-1531297484001-80022131f5a1"  # tech background
  "photo-1488590528505-98d2b5aba04b"  # technology
)

counter=0
for file in 2025/*.md 2026/*.md; do
  if [ -f "$file" ]; then
    # Cycle through photos
    photo_id="${photos[$((counter % ${#photos[@]}))]}"
    img_url="https://images.unsplash.com/${photo_id}?w=1600&h=900&fit=crop&q=80"
    
    # Remove existing image line
    sed -i '/^image:/d' "$file"
    
    # Add new image line after description
    awk -v img="$img_url" '
      /^description:/ { print; print "image: \"" img "\""; next }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    
    counter=$((counter + 1))
  fi
done

echo "Updated all posts with real Unsplash photo URLs"

#!/bin/bash

# Additional images for remaining posts
images=(
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=1600&h=900&fit=crop&q=80"
)

# Files that need images
files=(
  "./2026/01-24__post-1.md"
  "./2026/01-21__post-2.md"
  "./2026/01-18__post-3.md"
  "./2026/01-15__post-4.md"
  "./2026/01-12__post-5.md"
  "./2026/01-09__post-6.md"
  "./2026/01-06__post-7.md"
  "./2026/01-03__post-8.md"
)

count=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    image_url="${images[$count]}"
    if ! grep -q "^image:" "$file"; then
      sed -i "/^description:/a image: \"$image_url\"" "$file"
      echo "Added image to: $file"
    else
      echo "Skipping $file - already has image"
    fi
    count=$((count + 1))
  fi
done

echo "Fixed images for remaining posts!"

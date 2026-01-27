#!/bin/bash

# Array of high quality Unsplash images
images=(
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1564760290292-23341e4df6ec?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1588200908342-23b585c03e26?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1531306760863-an1f7d8e36b6?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1503290801093-d6badb6d5b8f?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1518418787025-3e20d9a37ccb?w=1600&h=900&fit=crop&q=80"
  "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1600&h=900&fit=crop&q=80"
)

count=0
for file in $(find . -name "*.md" -type f ! -name "*first-post*" | sort); do
  if [ -f "$file" ]; then
    # Check if it already has image field
    if grep -q "^image:" "$file"; then
      echo "Skip: $file (already has image)"
    else
      # Get image URL
      img_idx=$((count % ${#images[@]}))
      image_url="${images[$img_idx]}"
      
      # Add image field after description using awk
      awk -v img="image: \"$image_url\"" '
        /^description:/ { print; print img; next }
        { print }
      ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
      
      echo "Added image to: $file"
    fi
    count=$((count + 1))
  fi
done

echo "Processed $count posts!"

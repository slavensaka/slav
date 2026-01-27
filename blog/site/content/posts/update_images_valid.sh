#!/bin/bash

# Update all posts with valid Unsplash Source URLs
for file in 2025/*.md 2026/*.md; do
  if [ -f "$file" ]; then
    # Extract the title to determine image category
    title=$(grep "^title:" "$file" | head -1)
    
    # Determine category based on title keywords
    if echo "$title" | grep -iE "web|javascript|react|vue|frontend" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?web,development"
    elif echo "$title" | grep -iE "mobile|ios|android|flutter" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?mobile,technology"
    elif echo "$title" | grep -iE "ai|machine|learning|neural" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?artificial,intelligence"
    elif echo "$title" | grep -iE "cloud|aws|azure|devops" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?cloud,computing"
    elif echo "$title" | grep -iE "security|cyber|encryption" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?cybersecurity,technology"
    elif echo "$title" | grep -iE "data|database|sql|analytics" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?data,analytics"
    elif echo "$title" | grep -iE "crypto|blockchain|bitcoin" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?cryptocurrency,technology"
    elif echo "$title" | grep -iE "iot|embedded|hardware" > /dev/null; then
      img_url="https://source.unsplash.com/1600x900/?technology,electronics"
    else
      img_url="https://source.unsplash.com/1600x900/?technology,coding"
    fi
    
    # Remove existing image line if present
    sed -i '/^image:/d' "$file"
    
    # Add new image line after description
    awk -v img="$img_url" '
      /^description:/ { print; print "image: \"" img "\""; next }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    
    echo "Updated: $file with $img_url"
  fi
done

echo "All posts updated with valid Unsplash Source URLs"

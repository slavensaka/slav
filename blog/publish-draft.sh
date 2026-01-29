#!/bin/bash

# Quick script to publish draft to blog
# Usage: ./publish-draft.sh drafts/my-post.md

if [ -z "$1" ]; then
  echo "Usage: ./publish-draft.sh <draft-file>"
  echo "Example: ./publish-draft.sh drafts/learning-nextjs.md"
  exit 1
fi

DRAFT_FILE="$1"
FILENAME=$(basename "$DRAFT_FILE" .md)
CURRENT_DATE=$(date +%Y-%m-%d)
YEAR=$(date +%Y)

# Create year folder if not exists
mkdir -p "site/content/posts/$YEAR"

# Generate new filename with date
NEW_FILE="site/content/posts/$YEAR/${CURRENT_DATE//-/__}__${FILENAME}.md"

# Copy file
cp "$DRAFT_FILE" "$NEW_FILE"

echo "✅ Published to: $NEW_FILE"
echo ""
echo "Next steps:"
echo "1. Open $NEW_FILE"
echo "2. Change 'draft: true' to 'draft: false'"
echo "3. Review and adjust content"
echo "4. Run Hugo build: cd site && ../hugo.exe --cleanDestinationDir -d ../../portfolio/blog"
echo "5. Commit and push to deploy"

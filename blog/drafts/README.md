# Blog Drafts - Quick Start Guide

This folder is for writing and drafting blog posts with VS Code.

## Quick Workflow

### 1. Create New Post

1. Create new `.md` file in `drafts/` folder
2. Type `blogpost` and press `Tab` to insert template
3. Fill in title, description, tags

### 2. Add Screenshots While Learning

1. Take screenshot: `Win + Shift + S` (Windows) or `Cmd + Shift + 4` (Mac)
2. In VS Code, press `Ctrl + Shift + Alt + V` (custom shortcut for Paste Image)
3. Screenshot automatically saves to `site/assets/images/` with markdown inserted

**Note:** Don't use regular `Ctrl + V` - that will paste in wrong location!

### 3. Write Content

- Markdown preview: `Ctrl + Shift + V` or click preview icon
- Use snippets:
  - `section` + Tab → New section with heading
  - `code` + Tab → Code block
  - `img` + Tab → Image markdown

### 4. Move to Production

When ready to publish:

```bash
# 1. Change draft status to false in frontmatter
draft: false

# 2. Move file to content/posts/YEAR/ folder
mv drafts/my-post.md site/content/posts/2026/01-28__my-post.md

# 3. Build and deploy
cd site
../hugo.exe --cleanDestinationDir -d ../../portfolio/blog
cd ../..
git add .
git commit -m "Add blog post: My Post"
git push
```

## Installed Extensions

- **Markdown All in One** - Keyboard shortcuts, TOC, preview
- **Paste Image** - Screenshot pasting with Ctrl+Alt+V
- **Markdown Preview Enhanced** - Better preview

## Tips

- Images auto-saved to `site/assets/images/` with post name prefix
- Hugo auto-converts to WebP on build (750x quality 75)
- Use relative image paths: `images/filename.png`
- Preview shows how post will look on blog

## Example Screenshot Workflow

1. You're reading documentation
2. Screenshot important part: Win+Shift+S
3. Switch to VS Code
4. Ctrl+Shift+Alt+V → image inserted and saved automatically
5. Continue writing notes
6. Repeat

**Important:** Use `Ctrl+Shift+Alt+V` (Paste Image), NOT regular `Ctrl+V`!

No need to manually save images or write markdown paths!

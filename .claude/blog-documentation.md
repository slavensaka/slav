# Blog System Documentation - PehTheme Hugo

## Quick Reference

- **Location**: `c:\wamp\www\slav\blog\site`
- **Theme**: PehTheme Hugo (minimalist, TailwindCSS-based)
- **Hugo Version**: v0.141.0-extended
- **Server URL**: http://localhost:1313/
- **Current Status**: Server running in background

## Directory Structure

```
c:\wamp\www\slav\blog/
├── site/                           # Active blog installation
│   ├── content/                   # All blog content
│   │   ├── about.md              # About page
│   │   └── posts/                # Blog posts organized by year
│   │       ├── 2022/
│   │       ├── 2023/
│   │       └── 2026/
│   ├── assets/images/            # Blog images
│   ├── themes/pehtheme-hugo/     # Theme files
│   ├── hugo.toml                 # Main configuration
│   ├── hugo.exe                  # Hugo executable v0.141.0
│   ├── package.json              # npm dependencies (TailwindCSS)
│   └── node_modules/             # npm packages
├── layouts/                       # Theme templates
│   ├── _default/                 # Default layouts
│   │   ├── baseof.html          # Base template
│   │   ├── home.html            # Homepage
│   │   ├── single.html          # Single post (2-column)
│   │   └── list.html            # List pages with pagination
│   └── partials/                 # Reusable components
│       ├── header.html, menu.html    # Navigation
│       ├── footer.html               # Footer
│       └── content/                  # Content components
├── assets/                        # Theme assets
│   ├── css/main.css             # TailwindCSS compiled (~2150 lines)
│   └── js/insertoggle.js        # Toggle functionality
├── static/                        # Static files (favicons)
├── archetypes/                    # Content templates
└── exampleSite/                   # Reference implementation
```

## Creating New Blog Posts

### Method 1: Using Hugo Command (Recommended)

```bash
cd c:/wamp/www/slav/blog/site
./hugo.exe new posts/YYYY/MM-DD__Title-With-Dashes.md
```

### File Naming Convention
- Format: `posts/YYYY/MM-DD__Title-With-Dashes.md`
- Example: `posts/2026/01-27__my-first-post.md`

### Post Template (YAML Front Matter)

```yaml
---
title: "Your Post Title"
date: 2026-01-27T16:54:55+01:00
slug: /custom-url/
description: SEO description (max 160 characters)
image: images/your-featured-image.jpg
caption: Photo credit or caption
categories:
  - category1
  - category2
tags:
  - tag1
  - tag2
  - tag3
draft: false
---

Your content here in Markdown format...

## Headings

Paragraph text with **bold** and *italic*.

### Subheadings

- List item 1
- List item 2

[Link text](https://example.com)

![Image alt](images/photo.jpg)

```code
// Code blocks
```
```

## Configuration (hugo.toml)

Location: `c:\wamp\www\slav\blog\site\hugo.toml`

### Site Settings
```toml
baseURL = 'https://your-domain.com/'
languageCode = 'en-us'
title = 'Your Blog Title'
theme = 'pehtheme-hugo'

summaryLength = '20'           # Words in preview (≈160 chars)
googleAnalytics = 'G-MEASUREMENT_ID'
disqusShortname = 'your-disqus-shortname'
```

### Parameters
```toml
[params]
  description = 'Site meta description for SEO'
  mainSections = 'posts'       # Main content section
```

### Author Settings
```toml
[author]
  name = 'Your Name'
  bio = 'Your bio description'
  avatar = '/images/your-photo.jpg'
  twitter = 'https://twitter.com/username'
```

### Pagination
```toml
[pagination]
  pagerSize = 6                # Posts per page
```

### Menu Configuration
```toml
[menu]
  [[menu.main]]
    name = 'Home'
    pageRef = '/'
    weight = 10
  [[menu.main]]
    name = 'About'
    pageRef = '/about'
    weight = 15
  [[menu.main]]
    name = 'Tags'
    pageRef = '/tags'
    weight = 20
```

## Front Matter Fields

### Required Fields
- `title` - Post title (displayed at top of post)
- `date` - Publication date/time (ISO format)
- `draft` - true/false (set to false to publish)

### Optional Fields
- `slug` - Custom URL path (e.g., `/my-custom-url/`)
- `description` - SEO description (max 160 chars), shows in previews
- `image` - Featured image path (relative to assets)
- `caption` - Image attribution or caption text
- `categories` - Array of categories (taxonomy)
- `tags` - Array of tags (taxonomy)

## Working with Images

### Adding Images
1. Place images in: `c:\wamp\www\slav\blog\site\assets\images\`
2. Reference in post: `image: images/your-image.jpg`

### Available Example Images
- brent-cox-ydGRmobx5jA-unsplash.jpg
- daniele-colucci-OtXJhYjbKeg-unsplash.jpg
- daniele-colucci-Smeer5L0tXM-unsplash.jpg
- default-placeholder.png
- javardh-2q6C5zDJOsg-unsplash.jpg
- lionel-hesry-UNd3lRKhwSw-unsplash.jpg
- nadine-shaabana-ZPP-zP8HYG0-unsplash.jpg
- nasa-astronaut-unsplash.jpg
- nasa-Ed2AELHKYBw-unsplash.jpg
- nasa-rTZW4f02zY8-unsplash.jpg

## Hugo Commands

### Development Server
```bash
cd c:/wamp/www/slav/blog/site
./hugo.exe server --bind 0.0.0.0 --port 1313
```
Server runs at: http://localhost:1313/
- Auto-reload enabled
- Fast render mode active
- Watches for file changes

### Create New Post
```bash
cd c:/wamp/www/slav/blog/site
./hugo.exe new posts/2026/01-27__post-title.md
```

### Build for Production
```bash
cd c:/wamp/www/slav/blog/site
./hugo.exe
```
Output directory: `public/` (ready to deploy)

### Check Hugo Version
```bash
./hugo.exe version
```
Current: `hugo v0.141.0-e7bd51698e5c3778a86003018702b1a7dcb9559a+extended`

## Theme Features

### PehTheme Hugo Capabilities
- **Minimalist Design** - Clean, content-focused interface
- **TailwindCSS** - Utility-first CSS framework
- **Featured Posts** - Tag posts with "feature" for homepage highlighting
- **Two-Column Layout** - Main content area + sidebar
- **Responsive** - Mobile-first design approach
- **No JavaScript Dependencies** - Pure HTML/CSS (optional toggle.js)
- **SEO Optimized** - Proper meta tags, semantic HTML5
- **Fast Performance** - Static site generation, no database
- **Reading Time** - Auto-calculated from content
- **Social Sharing** - Built-in social media link integration
- **Related Posts** - "Recommended for You" section on single posts
- **Pagination** - Configurable posts per page
- **Tag/Category Browsing** - Full taxonomy support
- **Newsletter** - Newsletter signup component
- **Sidebar Widgets** - Recent posts, ads/banners

### Layout Components
- `baseof.html` - Base HTML wrapper for all pages
- `home.html` - Homepage with featured and recent posts
- `single.html` - Individual post view (2-column layout)
- `list.html` - Post lists with pagination
- `terms.html` - Tag and category pages

### Partial Components
- `header.html`, `menu.html` - Navigation system
- `footer.html` - Footer section
- `content/card.html` - Post card component
- `content/aside.html` - Sidebar widgets
- `content/breadcrumb.html` - Breadcrumb navigation
- `content/newsletter.html` - Newsletter form
- `content/social-media.html` - Social sharing buttons

## Complete Workflow

### Creating and Publishing a Post

1. **Create Post**
   ```bash
   cd c:/wamp/www/slav/blog/site
   ./hugo.exe new posts/2026/01-27__my-post.md
   ```

2. **Edit Content**
   - Open the created file in your editor
   - Fill in the front matter (title, description, image, etc.)
   - Write content in Markdown below the front matter

3. **Add Images (if needed)**
   - Place images in `assets/images/`
   - Reference: `image: images/my-image.jpg`

4. **Publish**
   - Change `draft: true` to `draft: false`
   - Save the file

5. **Preview**
   - Server auto-reloads at http://localhost:1313/
   - View your post immediately

6. **Build for Production** (when ready to deploy)
   ```bash
   ./hugo.exe
   ```
   - Generates static files in `public/` directory

## npm Scripts

Location: `blog/site/package.json`

```json
{
  "scripts": {
    "dev": "postcss input.css -o assets/css/main.css --watch",
    "build": "postcss input.css -o assets/css/main.css"
  }
}
```

### Commands
- `npm run dev` - Watch and rebuild TailwindCSS
- `npm run build` - Build TailwindCSS for production

## Dependencies

- **TailwindCSS** v3.3.3 - Utility-first CSS
- **PostCSS** - CSS transformation
- **Autoprefixer** - Auto-add vendor prefixes

## Markdown Syntax Reference

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Alt text](images/photo.jpg)
```

### Lists
```markdown
- Unordered list item 1
- Unordered list item 2

1. Ordered list item 1
2. Ordered list item 2
```

### Code Blocks
````markdown
```javascript
function example() {
  console.log("Hello");
}
```
````

### Blockquotes
```markdown
> This is a blockquote
> Multiple lines
```

## Current Status

- **Hugo**: v0.141.0-extended installed
- **Server**: Running at http://localhost:1313/
- **Theme**: PehTheme Hugo
- **Content**: 50+ pages with example posts
- **Auto-reload**: Enabled
- **Build time**: ~130ms per change
- **Example post created**: `/posts/2026/01-27__my-first-post.md`

## Tips & Best Practices

1. **File Naming**: Always use the `YYYY/MM-DD__Title-With-Dashes.md` format
2. **Images**: Optimize images before adding (use WebP or compressed JPG)
3. **SEO**: Always fill in the `description` field (160 chars max)
4. **Categories**: Use 1-2 categories per post
5. **Tags**: Use 3-5 relevant tags per post
6. **Drafts**: Keep `draft: true` while writing, set to `false` to publish
7. **Slugs**: Use short, descriptive URLs in the `slug` field
8. **Server**: The dev server auto-reloads, no need to restart

## Troubleshooting

### Server not starting
```bash
# Check if Hugo is in the directory
ls hugo.exe

# If missing, copy from temp
cp /tmp/hugo.exe c:/wamp/www/slav/blog/site/
```

### Post not showing
- Check `draft: false` in front matter
- Ensure date is not in the future
- Verify file is in `content/posts/YYYY/` directory

### Images not loading
- Verify image is in `assets/images/` directory
- Check image path in front matter: `image: images/filename.jpg`
- Ensure image file name matches exactly (case-sensitive)

### Build errors
```bash
# Check Hugo version
./hugo.exe version

# Should be v0.141.0 or newer
```

## Related Files

- Configuration: `blog/site/hugo.toml`
- Content: `blog/site/content/posts/`
- Images: `blog/site/assets/images/`
- Theme: `blog/site/themes/pehtheme-hugo/`
- Output: `blog/site/public/` (after build)

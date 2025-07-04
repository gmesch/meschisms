# Meschisms Slide Viewer App

A simple React + TypeScript slide viewer that loads slides from YAML files and renders markdown content with syntax highlighting.

## Features

- Displays slides defined in YAML files
- Each slide supports markdown formatting with syntax highlighting
- Navigate slides with the ↑ and ↓ arrow keys
- Dynamic content loading via URL parameters
- URL synchronization - current slide is reflected in the URL
- Start at any specific slide via URL parameter
- Built with React 18 and TypeScript
- Webpack build system

## Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Serve the built app locally (required for testing)
npm run serve
```

## How to Run

**Important**: This app requires an HTTP server to work properly due to dynamic content loading. You cannot simply open the HTML file directly in a browser.

1. **Build the app**: `npm run build`
2. **Serve locally**: `npm run serve` (opens http://localhost:8080)
3. **Or use any HTTP server**: Serve the `dist` directory with any web server

## How it works

- The app loads `content.yaml` by default from the `dist` directory
- You can specify a different content file using the `?content=` URL parameter
- You can specify a starting slide using the `?slide=` URL parameter
- Each slide has a `title` and `text` (markdown) in the YAML file
- The app displays the current slide and renders its markdown as HTML with syntax highlighting
- Use the up/down arrow keys to move between slides
- The URL automatically updates to reflect the current slide

## Usage Examples

- **Default content, first slide**: `http://localhost:8080` (loads `content.yaml`, starts at slide 1)
- **Custom content**: `http://localhost:8080?content=my-slides.yaml` (loads `my-slides.yaml`, starts at slide 1)
- **Start at specific slide**: `http://localhost:8080?slide=3` (loads `content.yaml`, starts at slide 4)
- **Custom content and slide**: `http://localhost:8080?content=my-slides.yaml&slide=2` (loads `my-slides.yaml`, starts at slide 3)
- **Subdirectory content**: `http://localhost:8080?content=slides/presentation.yaml`

## URL Parameters

- `content`: Specifies the YAML file to load (default: `content.yaml`)
- `slide`: Specifies the starting slide number (0-based, default: 0)

## Content File Format

Your YAML file should follow this structure:

```yaml
title: Your Presentation Title
slides:
  - title: First Slide Title
    text: |
      # Markdown content here
      
      ```bash
      echo "Code with syntax highlighting"
      ```
      
  - title: Second Slide Title
    text: |
      More markdown content...
```

## TypeScript

- Strict type checking enabled
- React.FC type annotations for components
- Proper event handler typing
- TypeScript configuration optimized for React development

## Project Structure

```
src/
├── index.tsx        # Application entry point
├── SlideViewer.tsx  # Main slide viewer component
├── yaml.d.ts        # TypeScript declarations for YAML imports
content.yaml         # Default slide content (YAML)
dist/
├── bundle.js        # Built application
├── content.yaml     # Copied content file
└── index.html       # HTML entry point
``` 
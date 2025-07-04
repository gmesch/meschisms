# Meschisms Slide Viewer App

A simple React + TypeScript slide viewer that loads slides from a YAML file and renders markdown content.

## Features

- Displays slides defined in `content.yaml`
- Each slide supports markdown formatting
- Navigate slides with the ↑ and ↓ arrow keys
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
```

## How it works

- Edit `content.yaml` to add or change slides. Each slide has a `title` and `text` (markdown).
- The app displays the current slide and renders its markdown as HTML.
- Use the up/down arrow keys to move between slides.

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
content.yaml         # Slide content (YAML)
``` 
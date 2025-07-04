#!/usr/bin/env bash

echo "Checking for Node.js and npm..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "Node.js and npm found. Building TypeScript React slide viewer..."
    
    echo "Installing dependencies..."
    npm install
    
    echo "Running TypeScript type check..."
    if npm run type-check; then
        echo "✅ TypeScript type check passed"
    else
        echo "❌ TypeScript type check failed"
        exit 1
    fi
    
    echo "Building TypeScript React slide viewer with webpack..."
    if npm run build; then
        echo "✅ Build completed successfully"
    else
        echo "❌ Build failed"
        exit 1
    fi
    
    echo ""
    echo "🎉 TypeScript React slide viewer build complete!"
    echo ""
    echo "To open the slide viewer:"
    echo "1. Open index.html in your web browser"
    echo "2. Or run: open index.html (on macOS)"
    echo "3. Or run: xdg-open index.html (on Linux)"
    echo ""
    echo "Slides are loaded from content.yaml and support markdown formatting."
    echo "Use the ↑ and ↓ arrow keys to navigate between slides."
    echo ""
    echo "Development commands:"
    echo "- To rebuild after changes: npm run build"
    echo "- For development with auto-rebuild: npm run dev"
    echo "- To run type checking only: npm run type-check"
else
    echo "❌ Error: Node.js or npm not found."
    echo ""
    echo "This TypeScript React application requires Node.js and npm to build."
    echo "Please install Node.js from https://nodejs.org/ and try again."
    exit 1
fi 
#!/usr/bin/env bash

echo "Checking for Node.js and npm..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo "Node.js and npm found. Building React application..."
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building React application with webpack..."
    npm run build
    
    echo ""
    echo "Build complete! The React application is ready to run."
    echo ""
    echo "To open the React application:"
    echo "1. Open index.html in your web browser"
    echo "2. Or run: open index.html (on macOS)"
    echo "3. Or run: xdg-open index.html (on Linux)"
    echo ""
    echo "Use the ↑ and ↓ arrow keys to increment/decrement the number."
    echo ""
    echo "To rebuild after changes, run: npm run build"
    echo "For development with auto-rebuild, run: npm run dev"
else
    echo "Node.js or npm not found. Using standalone HTML version..."
    echo ""
    echo "The standalone counter application is ready to run!"
    echo ""
    echo "To open the application:"
    echo "1. Open counter.html in your web browser"
    echo "2. Or run: open counter.html (on macOS)"
    echo "3. Or run: xdg-open counter.html (on Linux)"
    echo ""
    echo "Use the ↑ and ↓ arrow keys to increment/decrement the number."
    echo ""
    echo "Note: This is a standalone HTML file that doesn't require Node.js or webpack."
    echo "If you want to use the React version, please install Node.js first."
fi 
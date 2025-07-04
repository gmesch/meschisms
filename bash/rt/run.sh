#!/usr/bin/env bash

# Build the app
npm install
npm run build

# Serve the dist directory with SPA fallback
npx http-server dist -p 8080 --spa

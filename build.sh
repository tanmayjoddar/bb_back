#!/bin/bash
# Build script for Brain Battle Backend

echo "Building Brain Battle Backend..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Compile TypeScript to JavaScript
echo "Compiling TypeScript..."
npx tsc

# Create qrcodes directory in dist
echo "Creating qrcodes directory..."
mkdir -p dist/qrcodes

echo "Build completed successfully!"

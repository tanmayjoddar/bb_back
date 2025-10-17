# Build script for Brain Battle Backend (Windows)

Write-Host "Building Brain Battle Backend..."

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

# Compile TypeScript to JavaScript
Write-Host "Compiling TypeScript..."
npx tsc

# Create qrcodes directory in dist
Write-Host "Creating qrcodes directory..."
New-Item -ItemType Directory -Path "dist\qrcodes" -Force

Write-Host "Build completed successfully!"

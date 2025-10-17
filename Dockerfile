# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create qrcodes directory
RUN mkdir -p qrcodes

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]

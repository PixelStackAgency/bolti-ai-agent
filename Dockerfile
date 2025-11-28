FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci
RUN cd backend && npm ci && cd ..
RUN cd frontend && npm ci && cd ..

# Copy application code
COPY . .

# Build frontend
RUN cd frontend && npm run build && cd ..

# Expose ports
EXPOSE 5000 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Start backend server
CMD ["npm", "start"]

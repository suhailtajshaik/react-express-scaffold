# Stage 1: Build the React application
FROM node:20-alpine AS client-build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source code and static files
COPY . .

# Build the application (outputs to /app/dist which maps to ../dist/client)
RUN npm run build

# At this point:
# /app/dist/client/ contains the built React app
# /app/static/ contains custom static files (templates, assets)

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY --from=client-build /app/../nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=client-build /app/dist/client /usr/share/nginx/html

# Copy static files
COPY --from=client-build /app/static /usr/share/nginx/html/static

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

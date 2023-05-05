FROM node:20-alpine3.17

# Set env to production
ENV NODE_ENV production

# Initialize working directory
WORKDIR /usr/src/app

# Prepare for installing dependencies
COPY ["package.json", "package-lock.json", "./"]

# Install dependencies
RUN npm install

# Copy source file
COPY . .

# Expose listening port
EXPOSE 8000

# Starting scripts
CMD node server.js
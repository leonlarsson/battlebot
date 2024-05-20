FROM node:20

# Set the working directory
WORKDIR /app

# Copy the lock and package file
COPY package*.json . 

# Install dependencies
RUN npm install

COPY . .

CMD ["node", "dist/index.ts"]
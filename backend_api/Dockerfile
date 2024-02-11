# Use the official Node.js 14 image as a parent image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining backend code to the working directory
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
# Use the official Node.js 14 image as a parent image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining frontend code to the working directory
COPY . .

# Expose port 3000
EXPOSE 443

# Command to run the application
CMD ["npm", "start"]
# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
RUN apk add --no-cache bash

# Copy rest of the app
COPY . .
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh


# Expose the port your app runs on
EXPOSE 5000
#install sequelize cli
RUN npm install --global sequelize-cli

# Start the application
CMD ["npm", "start"]


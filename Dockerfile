# Use the official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY ./src/package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally (optional, but helpful for tools)
RUN npm install -g typescript

# Copy the rest of the application code
COPY ./src .

# Expose the port the application will run on
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "run", "dev"]
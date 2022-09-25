# Use the Alpine Linux distro with node.js installed
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json file
COPY package*.json ./

# This will run a command on the docker image
RUN npm install

# Copy everything in the current directory to the /app folder in the image (typical for node apps)
COPY . /app

ENV PORT=8080

EXPOSE 8080

# Run the app.js program using node
CMD ["npm", "start"]

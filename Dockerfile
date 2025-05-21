# Use the Alpine Linux distro with node.js installed
FROM node:lts-alpine

# Allow a port number we want the app to run on to be passed in.  use 8080 by default
ARG port_number=8080

# Set the working directory
WORKDIR /app

# Copy package.json file
COPY package*.json ./

# This will run a command on the docker image
RUN npm install

# Copy everything in the current directory to the /app folder in the image (typical for node apps)
COPY . /app

ENV PORT=$port_number

EXPOSE $port_number

# Run the app.js program using node
CMD ["npm", "start"]

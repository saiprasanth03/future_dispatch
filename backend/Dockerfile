FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to install dependencies and copy files
USER root

# Create app directory
WORKDIR /usr/src/app

# Set Puppeteer environment variables to use the pre-installed Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install packages
RUN npm ci

# Bundle app source
COPY . .

# Set correct permissions
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to the non-privileged user to run Puppeteer securely
USER pptruser

EXPOSE 5000

CMD [ "node", "server.js" ]

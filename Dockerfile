FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Bundle APP files
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL error
ENV NPM_CONFIG_PRODUCTION true
ENV NODE_ENV production
RUN npm install --production

RUN ls -la

CMD [ "node", "build/", "index.js" ]
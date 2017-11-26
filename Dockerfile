FROM keymetrics/pm2:8

# Create app directory
WORKDIR /usr/src/app

# Bundle APP files
COPY . .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

RUN ls -la

CMD ["pm2-docker", "start", "pm2.json"]
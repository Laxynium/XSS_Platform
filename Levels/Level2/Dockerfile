# pull official base image
FROM node:16.13.0-alpine AS buildFront

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY ./front/package.json ./front/package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY ./front/. .

### STAGE 2: Build server ###
FROM node:16.13.0-alpine AS buildServer
WORKDIR /usr/src/app
COPY ./server/package.json ./server/package-lock.json ./
RUN npm install
COPY ./server/. .
COPY --from=buildFront /usr/src/app/build /usr/src/app/public

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /app \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app

# USER pptruser
CMD npm run build
CMD [ "node", "server.js" ]

## start app
#CMD ["npm", "start"]
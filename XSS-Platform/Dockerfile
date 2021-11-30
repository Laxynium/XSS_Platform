### STAGE 1: Build front ###
FROM node:16.13.0-alpine AS buildFront
WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
 FROM nginx:1.21.4-alpine
 COPY nginx.conf /etc/nginx/nginx.conf
 COPY --from=buildFront /usr/src/app/dist/XSS-Platform /usr/share/nginx/html

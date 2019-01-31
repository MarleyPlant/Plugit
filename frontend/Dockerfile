FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --only=prod
COPY . .
EXPOSE 8080
CMD ["npm", "start"]

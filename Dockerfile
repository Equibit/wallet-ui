FROM node:7.9

RUN mkdir -p /home/www/wallet-ui
WORKDIR /home/www/wallet-ui

COPY package.json .
RUN yarn --ignore-engines

COPY . /home/www/wallet-ui

EXPOSE 8082
CMD [ "npm", "start" ]
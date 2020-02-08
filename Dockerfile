FROM node:10-alpine

COPY /dist/ .

RUN npm install
EXPOSE 3000

CMD ["npm", "start"]
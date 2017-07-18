FROM node:8

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "run", "start"]
FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get upgrade && apt-get install -y ffmpeg

RUN npm install

EXPOSE 3000
ENV PORT 3000
ENV port 3000

COPY . .

CMD [ "npm", "run", "start" ]
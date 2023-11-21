FROM node:18

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .
# COPY ./.env.example ./.env

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "build"]
FROM node:18

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lockb ./

RUN npm install -g bun
RUN bun install

COPY . .
# COPY ./.env.example ./.env

RUN bun run build

EXPOSE 3000

ENTRYPOINT [ "bun", "./build/index.js"]
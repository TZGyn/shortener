FROM docker.io/oven/bun

RUN mkdir /shortener-backend
WORKDIR /shortener-backend

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install --production

COPY . .

EXPOSE 3000
ENV NODE_ENV production

ENTRYPOINT [ "bun", "run", "./src/index.ts" ]

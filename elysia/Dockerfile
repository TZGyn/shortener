FROM docker.io/oven/bun

RUN mkdir /shortener-backend
WORKDIR /shortener-backend

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "bun", "run", "./src/index.ts" ]

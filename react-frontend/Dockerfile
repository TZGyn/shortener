FROM docker.io/oven/bun

RUN mkdir /shortener-frontend
WORKDIR /shortener-frontend

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

ENTRYPOINT [ "bun", "run", "preview", "--host" ]

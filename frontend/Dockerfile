FROM oven/bun:latest

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install

COPY . .
# COPY ./.env.example ./.env

RUN bun run build

EXPOSE 3000

ENTRYPOINT ["bun", "--bun", "run", "build"]

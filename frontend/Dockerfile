FROM oven/bun:latest

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lockb ./

COPY . .
# COPY ./.env.example ./.env

RUN bun install

RUN bun run db:migrate

RUN bun run build

EXPOSE 3000

ENTRYPOINT ["bun", "--bun", "run", "build"]

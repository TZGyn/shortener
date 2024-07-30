FROM oven/bun:1.1.20

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lockb ./

COPY . .
# COPY ./.env.example ./.env

RUN bun install

ARG DATABASE_URL

RUN bun run db:migrate

RUN bun run build

EXPOSE 3000

ENTRYPOINT ["bun", "--bun", "run", "build"]

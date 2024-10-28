FROM node:22

WORKDIR /app

RUN npm install -g bun

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install

COPY . .
# COPY ./.env.example ./.env

ARG DATABASE_URL

RUN DATABASE_URL=$DATABASE_URL npm run db:migrate

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "build"]


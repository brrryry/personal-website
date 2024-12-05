FROM node:20-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git

RUN npm config set ignore-scripts true

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run build && pnpm prune --production

EXPOSE 3000

CMD ["npm", "start"]
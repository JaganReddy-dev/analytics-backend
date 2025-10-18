FROM node:22.20.0-slim
WORKDIR /app
COPY . .
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "app.js"]
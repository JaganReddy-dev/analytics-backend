# Use Node.js LTS version
FROM node:22-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

FROM base AS dependencies
RUN yarn install --immutable


FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn prisma generate


FROM base AS production
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn workspaces focus --production && \
    yarn cache clean --all
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/prisma/migrations ./prisma/migrations
COPY --from=build /app/app.js ./
COPY --from=build /app/tracker.js ./
COPY --from=build /app/config ./config
COPY --from=build /app/middleware ./middleware
COPY --from=build /app/openapi ./openapi
COPY --from=build /app/routes ./routes
COPY --from=build /app/schemas ./schemas
COPY --from=build /app/services ./services
COPY --from=build /app/utils ./utils
COPY --from=build /app/public ./public

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "app.js"]

# FROM node:22-alpine
# WORKDIR /app
# RUN apk add --no-cache openssl
# COPY package.json yarn.lock .yarnrc.yml ./
# COPY . .
# RUN yarn workspaces focus --production
# EXPOSE 4000
# ENV NODE_ENV=production
# CMD ["node", "app.js"]
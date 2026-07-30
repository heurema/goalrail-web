# The site is static, so the image is a web server with the built files already
# inside it and nothing else.
#
# Building here rather than at pod start is the whole point. The previous
# deployment ran `npm ci` and `vite build` in init containers every time a pod
# started, so a node reboot at 3am needed npm and GitHub to be reachable before
# the site could come back. Now a restart is a pull and an exec.

FROM node:22-alpine AS build
WORKDIR /app

# Dependencies change far less often than sources, so they get their own layer.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# The build runs `tsc -b` first, so a type error fails here rather than shipping.
RUN npm run build && test -f dist/index.html

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /srv/goalrail
# A malformed config fails the build instead of crash-looping in the cluster.
RUN nginx -t

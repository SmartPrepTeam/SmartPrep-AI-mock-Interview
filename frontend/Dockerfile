# pull official base image
FROM node:18 as build

# Set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Silent clean install of npm
RUN npm ci --silent

# Copy environment config
COPY .env.docker .env

# add app
COPY . /app/

# Build production
RUN npm run build

# Start the app on port 3006
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3006
# Configure nginx to listen on port 3006
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
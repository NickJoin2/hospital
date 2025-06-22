FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@11.4.2
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
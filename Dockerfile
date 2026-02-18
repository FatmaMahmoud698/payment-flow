FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8085
EXPOSE 4000
CMD ["npm", "run", "start"]
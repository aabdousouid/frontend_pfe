FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
# ✅ Use dist/sakai-ng/browser (Angular >=17) or dist/sakai-ng (Angular <=16)
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

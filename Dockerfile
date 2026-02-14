# Étape 1: Build de l'application React
FROM node:20-alpine AS builder

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie tout le code source
COPY . .

# Build l'application pour la production
RUN npm run build

# Étape 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copie les fichiers buildés depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port 80
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]

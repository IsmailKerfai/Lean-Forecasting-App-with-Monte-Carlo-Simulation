# Build Stage
# Verwende ein leichtgewichtiges Node.js-Image auf Basis von Alpine Linux
FROM node:18-alpine AS build-step

# Setze das Arbeitsverzeichnis innerhalb des Containers
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json-Dateien ins Arbeitsverzeichnis
# Dies ermöglicht es, nur die Abhängigkeiten zu installieren, wenn sich diese Dateien ändern.
COPY package*.json ./

# Installiere die Abhängigkeiten, die im package.json definiert sind
RUN npm install

# Kopiere den restlichen Quellcode ins Arbeitsverzeichnis
COPY . .


# Exponiere den Port 4200, damit der Entwicklungsserver erreichbar ist
EXPOSE 4200

# Starte die Anwendung im Entwicklungsmodus und mache sie von außen zugänglich
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

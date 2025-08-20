# Imagen ARM (mantengo la tuya)
FROM arm64v8/node:20

WORKDIR /app

# Espera a Postgres
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Instalar deps con cache
COPY package*.json ./

# Instalación limpia dentro del contenedor (no copies node_modules del host)
RUN npm ci --no-audit --no-fund
# Recompila binarios nativos por si el lock traía el artefacto incorrecto
RUN npm rebuild esbuild --platform=linux --arch=arm64 --force
# Si necesitás rollup arm64, instalalo aquí (sin ensuciar package-lock):
RUN npm i @rollup/rollup-linux-arm64-gnu --no-save || true

# Copiar código
COPY . .

# Build de la app (no toca la DB)
RUN npm run build || true

EXPOSE 6000

# IMPORTANTE:
# Las migraciones y el seed se hacen al arrancar el contenedor,
# NO durante el build. DATABASE_URL vendrá del compose.
CMD ["/bin/sh", "-lc", "\
  /wait-for-it.sh db:5432 -- \
  npm run db:push && \
  npm run db:seed && \
  npm start \
"]
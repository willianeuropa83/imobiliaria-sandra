FROM python:3.12-slim

# Dependências do sistema para Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar requirements e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instalar browsers do Playwright (para scraping de portais com JS)
RUN playwright install --with-deps chromium

# Copiar código do imoveis-app
COPY . .

# Criar pasta de dados e logs se não existir
RUN mkdir -p data logs

EXPOSE 8000

# Arrancar o FastAPI
# Criar pasta de fotos
RUN mkdir -p photos

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

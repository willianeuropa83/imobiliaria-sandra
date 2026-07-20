#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Deploy — Imobiliária Sandra
# Subdomínio: imobiliaria.comprasvalore.com.br
# Servidor: Hetzner 178.104.3.153
# ═══════════════════════════════════════════════════════════
# PASSO 0 (MANUAL - já feito?):
#   Criar registo DNS:  A  imobiliaria.comprasvalore.com.br → 178.104.3.153
#
# USO:
#   chmod +x deploy.sh
#   ./deploy.sh              # Deploy completo
#   ./deploy.sh --ssl-only   # Apenas obter/activar SSL
#   ./deploy.sh --update     # Apenas rebuild + restart
# ═══════════════════════════════════════════════════════════

set -euo pipefail

# ─── Configuração ───
SERVER="root@178.104.3.153"
SSH_KEY="/tmp/hetzner_key"
DOMAIN="imobiliaria.comprasvalore.com.br"
REMOTE_DIR="/opt/imobiliaria-sandra"
LOCAL_PROJECT="$(cd "$(dirname "$0")/.." && pwd)"

# Cores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ─── Verificar chave SSH ───
if [ ! -f "$SSH_KEY" ]; then
    if [ -f "$LOCAL_PROJECT/../SSH/hetzner_key" ]; then
        cp "$LOCAL_PROJECT/../SSH/hetzner_key" "$SSH_KEY"
        chmod 600 "$SSH_KEY"
        log "Chave SSH copiada para /tmp"
    else
        err "Chave SSH não encontrada. Copiar COWORK AI/SSH/hetzner_key para /tmp/hetzner_key"
    fi
fi

SSH_CMD="ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10"
SCP_CMD="scp -i $SSH_KEY -o StrictHostKeyChecking=no"

# ─── Testar conexão ───
$SSH_CMD $SERVER "echo OK" > /dev/null 2>&1 || err "Sem conexão SSH ao servidor"
log "Conexão SSH OK"

# ─── Função: SSL Only ───
ssl_only() {
    log "A obter certificado SSL para $DOMAIN..."
    $SSH_CMD $SERVER "cd $REMOTE_DIR/deploy && docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --email willian.europa83@gmail.com --agree-tos --no-eff-email"

    log "A activar configuração HTTPS no nginx..."
    # Descomentar o bloco HTTPS e activar o redirect
    $SSH_CMD $SERVER "cd $REMOTE_DIR/deploy/nginx/conf.d && sed -i 's/^    # location \/ {/    location \/ {/' imobiliaria.conf && sed -i 's/^    #     return 301/        return 301/' imobiliaria.conf && sed -i 's/^    # }/    }/' imobiliaria.conf"
    # Descomentar o bloco server 443
    $SSH_CMD $SERVER "cd $REMOTE_DIR/deploy/nginx/conf.d && sed -i 's/^# server {/server {/' imobiliaria.conf && sed -i 's/^#     /    /g' imobiliaria.conf && sed -i 's/^# }/}/' imobiliaria.conf"
    # Comentar o bloco HTTP proxy (já não necessário)
    $SSH_CMD $SERVER "cd $REMOTE_DIR/deploy && docker compose exec nginx nginx -s reload"

    log "SSL activado!"
}

# ─── Função: Update ───
update_only() {
    log "A reconstruir e reiniciar serviços..."
    $SSH_CMD $SERVER "cd $REMOTE_DIR/deploy && docker compose down && docker compose up -d --build"
    log "Serviços reiniciados"
}

# ─── Parsear argumentos ───
if [ "${1:-}" = "--ssl-only" ]; then
    ssl_only
    exit 0
fi
if [ "${1:-}" = "--update" ]; then
    update_only
    exit 0
fi

# ═══════════════════════════════════════
# DEPLOY COMPLETO
# ═══════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════"
echo "  Deploy — Imobiliária Sandra"
echo "  Servidor: 178.104.3.153"
echo "  Domínio:  $DOMAIN"
echo "═══════════════════════════════════════════"
echo ""

# 1. Criar estrutura no servidor
log "1/7 — A criar directórios no servidor..."
$SSH_CMD $SERVER "mkdir -p $REMOTE_DIR"

# 2. Sincronizar ficheiros (excluindo node_modules, __pycache__, .git, data)
log "2/7 — A copiar ficheiros para o servidor..."
rsync -avz --progress \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    --exclude 'data/*.db' \
    --exclude 'logs/*' \
    --exclude 'photos/*' \
    --exclude '.env.local' \
    "$LOCAL_PROJECT/" "$SERVER:$REMOTE_DIR/"

# 3. Copiar o imoveis-app para dentro de deploy/backend (o Dockerfile espera lá)
log "3/7 — A copiar imoveis-app para o backend do deploy..."
$SSH_CMD $SERVER "
    # Copiar código do imoveis-app para deploy/backend/
    cp -r $REMOTE_DIR/../imoveis-app/backend/ $REMOTE_DIR/deploy/backend/backend/ 2>/dev/null || true
    cp -r $REMOTE_DIR/../imoveis-app/scrapers/ $REMOTE_DIR/deploy/backend/scrapers/ 2>/dev/null || true
    cp $REMOTE_DIR/../imoveis-app/run.py $REMOTE_DIR/deploy/backend/ 2>/dev/null || true
    cp $REMOTE_DIR/../imoveis-app/scrape_runner.py $REMOTE_DIR/deploy/backend/ 2>/dev/null || true
    cp $REMOTE_DIR/../imoveis-app/clean_inactive_ads.py $REMOTE_DIR/deploy/backend/ 2>/dev/null || true
    cp $REMOTE_DIR/../imoveis-app/db_maintenance.py $REMOTE_DIR/deploy/backend/ 2>/dev/null || true
    cp $REMOTE_DIR/../imoveis-app/import_from_excel.py $REMOTE_DIR/deploy/backend/ 2>/dev/null || true
" 2>/dev/null

# Se o imoveis-app não existe no servidor, copiar do local
if ! $SSH_CMD $SERVER "test -f $REMOTE_DIR/deploy/backend/scrape_runner.py" 2>/dev/null; then
    warn "imoveis-app não encontrado no servidor. A copiar do PC local..."
    IMOVEIS_LOCAL="$(cd "$LOCAL_PROJECT/../imoveis-app" 2>/dev/null && pwd)"
    if [ -d "$IMOVEIS_LOCAL" ]; then
        rsync -avz --progress \
            -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
            --exclude 'node_modules' --exclude '__pycache__' --exclude '*.pyc' \
            --exclude 'data/*.db' --exclude 'logs/*' --exclude 'photos/*' \
            "$IMOVEIS_LOCAL/backend/" "$SERVER:$REMOTE_DIR/deploy/backend/backend/"
        rsync -avz --progress \
            -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
            --exclude '__pycache__' --exclude '*.pyc' \
            "$IMOVEIS_LOCAL/scrapers/" "$SERVER:$REMOTE_DIR/deploy/backend/scrapers/"
        $SCP_CMD "$IMOVEIS_LOCAL/run.py" "$SERVER:$REMOTE_DIR/deploy/backend/"
        $SCP_CMD "$IMOVEIS_LOCAL/scrape_runner.py" "$SERVER:$REMOTE_DIR/deploy/backend/"
        $SCP_CMD "$IMOVEIS_LOCAL/clean_inactive_ads.py" "$SERVER:$REMOTE_DIR/deploy/backend/" 2>/dev/null || true
        $SCP_CMD "$IMOVEIS_LOCAL/db_maintenance.py" "$SERVER:$REMOTE_DIR/deploy/backend/" 2>/dev/null || true
        log "imoveis-app copiado do PC"
    else
        err "imoveis-app não encontrado localmente em $IMOVEIS_LOCAL"
    fi
fi

# 4. Verificar se nginx na porta 80 já existe (Freqtrade ou outro)
log "4/7 — A verificar portas..."
PORT80=$($SSH_CMD $SERVER "ss -tlnp | grep ':80 ' | head -1" 2>/dev/null || true)
if [ -n "$PORT80" ]; then
    warn "Porta 80 já ocupada: $PORT80"
    warn "Se for outro serviço, pode ser necessário ajustar. Continuando..."
fi

# 5. Build e arranque
log "5/7 — A construir e arrancar os containers..."
$SSH_CMD $SERVER "cd $REMOTE_DIR/deploy && docker compose up -d --build" 2>&1

# 6. Verificar estado
log "6/7 — A verificar estado dos containers..."
sleep 10
$SSH_CMD $SERVER "cd $REMOTE_DIR/deploy && docker compose ps"

# 7. Testar endpoint
log "7/7 — A testar endpoints..."
HTTP_CODE=$($SSH_CMD $SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/stats" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    log "Backend API respondendo (HTTP $HTTP_CODE)"
else
    warn "Backend API retornou HTTP $HTTP_CODE — verificar logs: docker compose logs backend"
fi

HTTP_CODE=$($SSH_CMD $SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    log "Frontend respondendo (HTTP $HTTP_CODE)"
else
    warn "Frontend retornou HTTP $HTTP_CODE — verificar logs: docker compose logs frontend"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  Deploy concluído!"
echo ""
echo "  PRÓXIMOS PASSOS:"
echo "  1. Configurar DNS (se ainda não feito):"
echo "     A  imobiliaria.comprasvalore.com.br → 178.104.3.153"
echo ""
echo "  2. Após DNS propagar (~5min), obter SSL:"
echo "     ./deploy.sh --ssl-only"
echo ""
echo "  3. Aceder: http://$DOMAIN"
echo "═══════════════════════════════════════════"

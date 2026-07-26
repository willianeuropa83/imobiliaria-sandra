#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Setup Cron — Atualização diária dos imóveis
# Executar no servidor Hetzner (uma vez, após deploy)
# ═══════════════════════════════════════════════════════════
# Agenda:
#   07:00 — Scraping completo (todos os portais)
#   07:45 — Limpeza de anúncios inativos
#   03:00 (segunda) — Renovação SSL
# ═══════════════════════════════════════════════════════════

set -euo pipefail

REMOTE_DIR="/opt/imobiliaria-sandra"
LOG_DIR="$REMOTE_DIR/deploy/cron-logs"
mkdir -p "$LOG_DIR"

# Criar script de scraping diário
cat > "$REMOTE_DIR/deploy/daily-scrape.sh" << 'SCRIPT'
#!/bin/bash
# Scraping diário — todos os portais
LOG_DIR="/opt/imobiliaria-sandra/deploy/cron-logs"
LOG_FILE="$LOG_DIR/scrape_$(date +%Y%m%d_%H%M).log"

echo "=== Início do scraping: $(date) ===" >> "$LOG_FILE"

cd /opt/imobiliaria-sandra/deploy

# Executar scraping dentro do container backend
docker compose exec -T backend python scrape_runner.py >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

echo "=== Fim do scraping: $(date) | Exit: $EXIT_CODE ===" >> "$LOG_FILE"

# Limpar logs com mais de 30 dias
find "$LOG_DIR" -name "scrape_*.log" -mtime +30 -delete 2>/dev/null

exit $EXIT_CODE
SCRIPT

# Criar script de limpeza de inativos
cat > "$REMOTE_DIR/deploy/daily-cleanup.sh" << 'SCRIPT'
#!/bin/bash
# Limpeza de anúncios inativos (marca como ativo=false os que desapareceram)
LOG_DIR="/opt/imobiliaria-sandra/deploy/cron-logs"
LOG_FILE="$LOG_DIR/cleanup_$(date +%Y%m%d_%H%M).log"

echo "=== Início da limpeza: $(date) ===" >> "$LOG_FILE"

cd /opt/imobiliaria-sandra/deploy

docker compose exec -T backend python clean_inactive_ads.py >> "$LOG_FILE" 2>&1

echo "=== Fim da limpeza: $(date) ===" >> "$LOG_FILE"
SCRIPT

chmod +x "$REMOTE_DIR/deploy/daily-scrape.sh"
chmod +x "$REMOTE_DIR/deploy/daily-cleanup.sh"

# Instalar crontab
(crontab -l 2>/dev/null | grep -v 'imobiliaria-sandra'; cat << CRON
# ─── Imobiliária Sandra — Atualização diária ───
# Scraping completo às 07:00
0 7 * * * $REMOTE_DIR/deploy/daily-scrape.sh
# Limpeza de inativos às 07:45
45 7 * * * $REMOTE_DIR/deploy/daily-cleanup.sh
# Renovação SSL (segunda às 03:00)
0 3 * * 1 cd $REMOTE_DIR/deploy && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
CRON
) | crontab -

echo ""
echo "Cron configurado:"
crontab -l | grep imobiliaria
echo ""
echo "Logs em: $LOG_DIR/"

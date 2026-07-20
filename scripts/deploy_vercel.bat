@echo off
REM ═══════════════════════════════════════════════
REM  Deploy Vercel — Imobiliária Sandra
REM  Exporta dados + push para GitHub = auto-deploy
REM  Agendar no Task Scheduler: diariamente às 07:15
REM  (15 min depois do scraping das 07:00)
REM ═══════════════════════════════════════════════

echo [%date% %time%] Inicio do deploy...

REM Caminhos
set PROJECT_DIR=C:\Users\Hot_D\Desktop\COWORK AI\IMOBILIARIA SANDRA
set IMOVEIS_APP=C:\Users\Hot_D\Desktop\COWORK AI\imoveis-app
set FRONTEND_DIR=%PROJECT_DIR%\app\frontend
set EXPORT_SCRIPT=%PROJECT_DIR%\scripts\export_data.py

REM 1. Exportar dados do SQLite para JSON
echo [%date% %time%] Exportando dados...
python "%EXPORT_SCRIPT%" --db "%IMOVEIS_APP%\data\imoveis.db" --output "%FRONTEND_DIR%\public\data\imoveis_data.json"
if errorlevel 1 (
    echo [ERRO] Falha na exportacao de dados
    exit /b 1
)

REM 2. Git add + commit + push
echo [%date% %time%] Fazendo push para GitHub...
cd /d "%PROJECT_DIR%"
git add app/frontend/public/data/imoveis_data.json
git commit -m "dados: atualizacao diaria %date%" 2>nul
git push origin main 2>nul

if errorlevel 1 (
    echo [AVISO] Push falhou ou nada para commitar
) else (
    echo [OK] Push concluido - Vercel vai fazer deploy automatico
)

echo [%date% %time%] Fim do deploy.

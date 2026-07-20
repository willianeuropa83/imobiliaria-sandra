@echo off
REM ═══════════════════════════════════════════════
REM  Deploy Vercel — Imobiliária Sandra
REM  Exporta dados + deploy direto via Vercel CLI
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

REM 2. Deploy direto via Vercel CLI
echo [%date% %time%] Deploy para Vercel...
cd /d "%FRONTEND_DIR%"
vercel --prod --yes
if errorlevel 1 (
    echo [ERRO] Deploy falhou
    exit /b 1
)

echo [OK] Deploy concluido com sucesso
echo [%date% %time%] Fim do deploy.

"""
Export Data — Exporta dados do imoveis-app SQLite para JSON estático
================================================================
Uso:
    python export_data.py                    # Exporta para o frontend
    python export_data.py --output outro.json  # Exporta para ficheiro específico

Este script lê a BD SQLite do imoveis-app e gera um ficheiro JSON
que o Next.js usa como fonte de dados (API routes internas na Vercel).

Executado automaticamente após cada scraping diário (07:00).
"""

import os
import sys
import json
import sqlite3
from datetime import datetime

# ─── Caminhos ───
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)

# Base de dados do imoveis-app
IMOVEIS_APP_DIR = os.path.join(os.path.dirname(PROJECT_DIR), "imoveis-app")
DB_PATH = os.path.join(IMOVEIS_APP_DIR, "data", "imoveis.db")

# Destino: public/data/ do frontend Next.js
DEFAULT_OUTPUT = os.path.join(PROJECT_DIR, "app", "frontend", "public", "data", "imoveis_data.json")


def export_data(db_path: str, output_path: str):
    """Exporta todos os imóveis ativos e inativos do SQLite para JSON."""

    if not os.path.exists(db_path):
        print(f"[ERRO] Base de dados não encontrada: {db_path}")
        sys.exit(1)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Obter todos os imóveis (ativos e inativos — o frontend filtra)
    cursor.execute("""
        SELECT id, titulo, preco, preco_texto, tipologia,
               area_util as area, quartos, casas_banho,
               distrito, concelho, localizacao as morada,
               descricao, url, portal, portal_id, estado,
               tipo_vendedor, nome_vendedor,
               aceita_corretores, restricao_texto,
               primeiro_visto as data_publicacao,
               ultima_actualizacao as data_scraping, ativo,
               latitude, longitude, certificado_energetico
        FROM imoveis
        ORDER BY ultima_actualizacao DESC
    """)

    imoveis = []
    for row in cursor.fetchall():
        imovel = dict(row)

        # Converter booleans do SQLite (0/1) para true/false
        for campo in ['ativo']:
            if campo in imovel and imovel[campo] is not None:
                imovel[campo] = bool(imovel[campo])

        # Obter fotos do imóvel
        cursor2 = conn.cursor()
        cursor2.execute("SELECT url_original as url FROM fotos WHERE imovel_id = ? ORDER BY ordem", (imovel['id'],))
        imovel['fotos'] = [f['url'] for f in cursor2.fetchall()]

        imoveis.append(imovel)

    conn.close()

    # Construir o ficheiro de dados
    data = {
        "imoveis": imoveis,
        "ultima_atualizacao": datetime.now().isoformat(),
        "total_exportados": len(imoveis),
        "total_ativos": sum(1 for i in imoveis if i.get('ativo')),
        "total_inativos": sum(1 for i in imoveis if not i.get('ativo')),
    }

    # Criar directório se não existir
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Escrever JSON (compact para reduzir tamanho)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    # Tamanho do ficheiro
    size_mb = os.path.getsize(output_path) / (1024 * 1024)

    print(f"[OK] Exportados {len(imoveis)} imóveis ({data['total_ativos']} ativos)")
    print(f"[OK] Ficheiro: {output_path} ({size_mb:.2f} MB)")
    print(f"[OK] Última atualização: {data['ultima_atualizacao']}")

    return data


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Exportar dados do imoveis-app para JSON")
    parser.add_argument("--db", default=DB_PATH, help="Caminho da BD SQLite")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Ficheiro JSON de destino")
    args = parser.parse_args()

    export_data(args.db, args.output)

from dataclasses import dataclass
from datetime import datetime, timedelta
from math import radians, sin, cos, sqrt, atan2

RAIO_METROS = 500          # reports dentro deste raio contam como "mesma zona"
JANELA_MINUTOS = 10        # janela de tempo para agrupar reports
MINIMO_REPORTS = 3         # nº de reports para confirmar alerta automático

@dataclass
class SOSReport:
    lat: float
    lon: float
    timestamp: datetime
    fonte: str              # "web" ou "ussd"

# Armazenamento em memória para o hackathon (troca por SQLite/Redis se sobrar tempo)
reports_recentes: list[SOSReport] = []


def distancia_metros(lat1, lon1, lat2, lon2) -> float:
    """Fórmula de Haversine — distância real entre 2 pontos GPS."""
    R = 6371000
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


def registar_sos(lat: float, lon: float, fonte: str) -> dict:
    """Regista um novo SOS e verifica se a zona deve ser marcada como crítica."""
    agora = datetime.utcnow()
    novo = SOSReport(lat, lon, agora, fonte)
    reports_recentes.append(novo)

    # limpa reports fora da janela de tempo
    limite = agora - timedelta(minutes=JANELA_MINUTOS)
    reports_recentes[:] = [r for r in reports_recentes if r.timestamp >= limite]

    # conta quantos reports estão dentro do raio deste novo SOS
    vizinhos = [
        r for r in reports_recentes
        if distancia_metros(lat, lon, r.lat, r.lon) <= RAIO_METROS
    ]

    zona_confirmada = len(vizinhos) >= MINIMO_REPORTS

    return {
        "recebido": True,
        "reports_na_zona": len(vizinhos),
        "zona_confirmada": zona_confirmada,   # -> dispara alerta em massa se True
    }
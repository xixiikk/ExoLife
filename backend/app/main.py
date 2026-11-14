from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from functools import lru_cache
from app.habitability import build_ranking
from app.habitable_zone import analyze_habitable_zones
from app.exolife_score import build_exolife_ranking

import httpx

from app.nasa_api import fetch_exoplanets


app = FastAPI(
    title="ExoLife API",
    description="Анализ экзопланет на основе данных NASA",
    version="1.0.0",
)

# Разрешаем React обращаться к Python-серверу
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):517[0-9]$",
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "ExoLife API работает!",
        "status": "online",
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Повторные запросы берут данные из памяти сервера.
# Кэш обновляется после перезапуска сервера.
@lru_cache(maxsize=1)
def load_planets():
    return fetch_exoplanets()


@app.get("/api/planets")
def get_planets():
    try:
        planets = load_planets()

        return {
            "source": "NASA Exoplanet Archive",
            "count": len(planets),
            "planets": planets,
        }

    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail=f"Не удалось получить данные NASA: {error}",
        )
@app.get("/api/ranking")
def get_ranking():
    try:
        planets = load_planets()
        ranking = build_ranking(planets, limit=50)

        return {
            "source": "NASA Exoplanet Archive",
            "metric": "interior_esi",
            "description": "Предварительный рейтинг физического сходства",
            "count": len(ranking),
            "ranking": ranking,
        }

    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail=f"Ошибка получения рейтинга: {error}"
        )

@app.get("/api/habitable-zones")
def get_habitable_zones():
    try:
        planets = load_planets()
        results = analyze_habitable_zones(planets)

        summary = {
            "in_zone": 0,
            "too_hot": 0,
            "too_cold": 0,
            "unknown": 0,
        }

        for planet in results:
            summary[planet["status"]] += 1

        candidates = [
            planet for planet in results
            if planet["status"] == "in_zone"
        ]

        return {
            "source": "NASA Exoplanet Archive",
            "method": "Kopparapu 2014 - conservative 1 Earth mass",
            "total": len(results),
            "summary": summary,
            "count": len(candidates),
            "candidates": candidates,
        }

    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail=f"Ошибка анализа зоны обитаемости: {error}"
        )
@app.get("/api/exolife-ranking")
def get_exolife_ranking():
    try:
        planets = load_planets()
        ranking = build_exolife_ranking(
            planets, limit=50
        )

        return {
            "source": "NASA Exoplanet Archive",
            "metric": "experimental_exolife_score",
            "method": "70% Interior ESI + 30% HZ flux score",
            "count": len(ranking),
            "ranking": ranking,
        }

    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(
            status_code=503,
            detail=f"Ошибка расчёта ExoLife: {error}"
        )
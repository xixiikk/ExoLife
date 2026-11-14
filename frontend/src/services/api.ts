// Адрес нашего Python-сервера
const API_URL = "/api";
// ==========================================
// 1. КАТАЛОГ ЭКЗОПЛАНЕТ NASA
// ==========================================

export interface Exoplanet {
  pl_name: string;
  hostname: string | null;
  pl_rade: number | null;
  pl_bmasse: number | null;
  pl_orbper: number | null;
  pl_eqt: number | null;
  pl_orbeccen: number | null;
  st_teff: number | null;
  disc_year: number | null;
  discoverymethod: string | null;
  pl_insol: number | null;
  pl_bmassprov: string | null;
}

export interface PlanetsResponse {
  source: string;
  count: number;
  planets: Exoplanet[];
}

export async function fetchPlanets(): Promise<PlanetsResponse> {
  const response = await fetch(`${API_URL}/planets`);

  if (!response.ok) {
    throw new Error("Ошибка загрузки каталога NASA");
  }

  return response.json();
}


// ==========================================
// 2. РЕЙТИНГ INTERIOR ESI
// ==========================================

export interface RankedPlanet {
  name: string;
  hostname: string | null;
  radius: number | null;
  mass: number | null;
  equilibrium_temperature: number | null;
  insolation: number | null;
  eccentricity: number | null;
  interior_esi: number;
}

export interface RankingResponse {
  source: string;
  metric: string;
  description: string;
  count: number;
  ranking: RankedPlanet[];
}

export async function fetchRanking(): Promise<RankingResponse> {
  const response = await fetch(`${API_URL}/ranking`);

  if (!response.ok) {
    throw new Error(
      "Ошибка загрузки TOP-50: " + response.status
    );
  }

  return response.json();
}

// ==========================================
// 3. ЗОНА ОБИТАЕМОСТИ
// ==========================================

export interface HabitableZonesResponse {
  total: number;
  count: number;
  summary: {
    in_zone: number;
    too_hot: number;
    too_cold: number;
    unknown: number;
  };
}

export async function fetchHabitableZones(): Promise<HabitableZonesResponse> {
  const response = await fetch(
    `${API_URL}/habitable-zones`
  );

  if (!response.ok) {
    throw new Error("Ошибка загрузки зоны обитаемости");
  }

  return response.json();
}

// ==========================================
// 4. КОМПЛЕКСНЫЙ РЕЙТИНГ EXOLIFE
// ==========================================

export interface ExoLifePlanet {
  name: string;
  hostname: string | null;
  radius: number;
  mass: number;
  insolation: number;
  stellar_temperature: number;
  eccentricity: number | null;
  zone_status: string;
  interior_esi: number;
  flux_score: number;
  exolife_score: number;
}

export interface ExoLifeRankingResponse {
  source: string;
  metric: string;
  method: string;
  count: number;
  ranking: ExoLifePlanet[];
}

export async function fetchExoLifeRanking(): Promise<ExoLifeRankingResponse> {
  const response = await fetch(
    `${API_URL}/exolife-ranking`
  );

  if (!response.ok) {
    throw new Error("Ошибка загрузки комплексного рейтинга");
  }

  return response.json();
}
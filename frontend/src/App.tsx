
import { useEffect, useState } from "react";

import Header from "./components/Header";
import PlanetCard from "./components/PlanetCard";
import RankingPanel from "./components/RankingPanel";
import ExoplanetChart from "./components/ExoplanetChart";
import PlanetTypesChart from "./components/PlanetTypesChart";
import HabitableZonePanel from "./components/HabitableZonePanel";
import ExoplanetCatalog from "./components/ExoplanetCatalog";

import {
  fetchPlanets,
  fetchHabitableZones,
  fetchRanking,
  type Exoplanet,
  type HabitableZonesResponse,
  type RankedPlanet,
} from "./services/api";

function App() {
  // 1. Каталог NASA
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Зона обитаемости
  const [zones, setZones] =
    useState<HabitableZonesResponse | null>(null);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [zonesError, setZonesError] = useState("");

  // 3. Единый TOP-50 по Interior ESI
  const [ranking, setRanking] = useState<RankedPlanet[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState("");

  // 4. Выбранная планета
  const [selectedPlanetName, setSelectedPlanetName] =
    useState<string | null>(null);

  const selectedPlanet =
    ranking.find((planet) => planet.name === selectedPlanetName) ??
    ranking[0] ??
    null;

  // 5. Загружаем данные NASA
  useEffect(() => {
    let active = true;

    async function loadPlanets() {
      try {
        const result = await fetchPlanets();

        if (active) {
          setPlanets(result.planets);
          setError("");
        }
      } catch {
        if (active) {
          setError("Не удалось загрузить каталог NASA");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    async function loadZones() {
      try {
        const result = await fetchHabitableZones();

        if (active) {
          setZones(result);
          setZonesError("");
        }
      } catch {
        if (active) {
          setZonesError(
            "Не удалось загрузить статистику зоны обитаемости"
          );
        }
      } finally {
        if (active) {
          setZonesLoading(false);
        }
      }
    }

    async function loadRanking() {
      try {
        const result = await fetchRanking();

        if (active) {
          setRanking(result.ranking);
          setRankingError("");
        }
      } catch {
        if (active) {
          setRankingError("Не удалось загрузить TOP-50 экзопланет");
        }
      } finally {
        if (active) {
          setRankingLoading(false);
        }
      }
    }

    void loadPlanets();
    void loadZones();
    void loadRanking();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111a2e] text-white">
      <Header />

      <main
        id="overview"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8 sm:px-6"
      >
        {/* Заголовок */}
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.25em] text-cyan-400">
            ExoLife / Mission Control
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Exoplanet Discoveries Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Аналитическая платформа исследования экзопланет
            и оценки их потенциальной обитаемости.
          </p>
        </div>

        {/* Статус NASA API */}
        <div className="mb-6 rounded-xl border border-cyan-500/20 bg-[#293a54] p-4">
          {loading ? (
            <p className="text-cyan-300">
              Загрузка данных NASA...
            </p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-green-400">
                ● NASA API подключён
              </span>

              <span className="text-white">
                Загружено экзопланет:{" "}
                <strong className="text-cyan-300">
                  {planets.length.toLocaleString("ru-RU")}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Описание научной методики */}
        <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
          TOP-50 построен по индексу Interior ESI.
          Он показывает физическое сходство планет с Землёй,
          но не подтверждает их пригодность для жизни.
        </div>

        {/* Основной дашборд */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Карточка выбранной планеты */}
          <div className="min-w-0 lg:col-span-2">
            <PlanetCard planet={selectedPlanet} />
          </div>

          {/* Интерактивный TOP-50 */}
          <div className="min-w-0 lg:col-span-3">
            <RankingPanel
              planets={ranking}
              loading={rankingLoading}
              error={rankingError}
              selectedPlanetName={selectedPlanet?.name ?? null}
              onSelectPlanet={(planet) =>
                setSelectedPlanetName(planet.name)
              }
            />
          </div>

          {/* График NASA */}
          <div
           id="analytics"
           className="min-w-0 scroll-mt-24 lg:col-span-3"
          >
           <ExoplanetChart planets={planets} />
          </div>

          {/* Типы экзопланет */}
          <div className="min-w-0 lg:col-span-2">
            <PlanetTypesChart planets={planets} />
          </div>

          {/* Зона обитаемости */}
          <div className="min-w-0 lg:col-span-5">
            <HabitableZonePanel
              data={zones}
              loading={zonesLoading}
              error={zonesError}
            />
          </div>
        </div>

        {/* Каталог NASA */}
        <div className="mt-8">
          <ExoplanetCatalog planets={planets} />
        </div>
        {/* О проекте */}
<section
  id="about"
  className="mt-8 scroll-mt-24 rounded-2xl border border-cyan-500/20 bg-[#172338] p-6 sm:p-8"
>
  <h2 className="text-2xl font-bold text-white">
    О проекте ExoLife
  </h2>

  <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
    ExoLife — аналитическая платформа для исследования
    экзопланет на основе данных NASA Exoplanet Archive.
    Мы объединяем научные расчёты, рейтинг физического
    сходства с Землёй и визуализацию астрономических данных.
  </p>

  <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
    Interior ESI оценивает сходство радиуса и плотности
    планеты с Землёй. Отдельная модель определяет
    положение планет относительно расчётной зоны
    обитаемости.
  </p>

  <a
    href="https://exoplanetarchive.ipac.caltech.edu/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-5 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
  >
    Источник данных: NASA Exoplanet Archive ↗
  </a>
</section>
        {/* Подвал */}
        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          ExoLife © 2026 · NASA Exoplanet Archive
        </footer>
      </main>
    </div>
  );
}

export default App;

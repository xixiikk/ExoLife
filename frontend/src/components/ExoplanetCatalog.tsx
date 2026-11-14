import { useMemo, useState } from "react";
import { Search, Database, ChevronLeft, ChevronRight } from "lucide-react";
import type { Exoplanet } from "../services/api";

interface Props {
  planets: Exoplanet[];
}

const PAGE_SIZE = 12;

function formatNumber(value: number | null, digits = 2) {
  if (value === null || !Number.isFinite(value)) {
    return "Нет данных";
  }

  return value.toLocaleString("ru-RU", {
    maximumFractionDigits: digits,
  });
}

export default function ExoplanetCatalog({ planets }: Props) {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("all");
  const [maxRadius, setMaxRadius] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  // Получаем список методов обнаружения из NASA
  const methods = useMemo(() => {
    return [...new Set(
      planets
        .map((p) => p.discoverymethod)
        .filter((m): m is string => Boolean(m))
    )].sort();
  }, [planets]);

  // Поиск, фильтрация и сортировка
  const filteredPlanets = useMemo(() => {
    const result = planets.filter((planet) => {
      const matchesSearch = planet.pl_name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesMethod =
        method === "all" ||
        planet.discoverymethod === method;

      const matchesRadius =
        maxRadius === "all" ||
        (planet.pl_rade !== null &&
          planet.pl_rade > 0 &&
          planet.pl_rade <= Number(maxRadius));

      return matchesSearch && matchesMethod && matchesRadius;
    });

    result.sort((a, b) => {
      if (sortBy === "radius") {
        return (a.pl_rade ?? Infinity) -
          (b.pl_rade ?? Infinity);
      }

      if (sortBy === "mass") {
        return (a.pl_bmasse ?? Infinity) -
          (b.pl_bmasse ?? Infinity);
      }

      if (sortBy === "year") {
        return (b.disc_year ?? -Infinity) -
          (a.disc_year ?? -Infinity);
      }

      return a.pl_name.localeCompare(b.pl_name);
    });

    return result;
  }, [planets, search, method, maxRadius, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlanets.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visiblePlanets = filteredPlanets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <section
      id="catalog"
      className="scroll-mt-8 rounded-2xl border border-white/10 bg-[#293a54] p-6"
    >
      {/* Заголовок */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Каталог экзопланет
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Исследуйте подтверждённые экзопланеты NASA
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-3 text-cyan-300">
          <Database size={20} />
          <span className="font-semibold">
            {planets.length.toLocaleString("ru-RU")}
          </span>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#172338] px-4 py-3">
        <Search size={20} className="text-cyan-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Например, TRAPPIST-1 e или Kepler..."
          aria-label="Поиск экзопланеты"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Фильтры */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <select
          aria-label="Метод обнаружения"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
            setPage(1);
          }}
          className="min-w-0 rounded-xl border border-white/10 bg-[#172338] p-3 text-sm text-white"
        >
          <option value="all">Все методы обнаружения</option>
          {methods.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Максимальный радиус"
          value={maxRadius}
          onChange={(e) => {
            setMaxRadius(e.target.value);
            setPage(1);
          }}
          className="min-w-0 rounded-xl border border-white/10 bg-[#172338] p-3 text-sm text-white"
        >
          <option value="all">Любой радиус</option>
          <option value="1.25">До 1,25 R⊕</option>
          <option value="2">До 2 R⊕</option>
          <option value="6">До 6 R⊕</option>
        </select>

        <select
          aria-label="Сортировка каталога"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="min-w-0 rounded-xl border border-white/10 bg-[#172338] p-3 text-sm text-white"
        >
          <option value="name">По названию</option>
          <option value="radius">По радиусу</option>
          <option value="mass">По массе</option>
          <option value="year">По году открытия</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-slate-400">
        Найдено:{" "}
        <span className="font-semibold text-cyan-300">
          {filteredPlanets.length.toLocaleString("ru-RU")}
        </span>
      </p>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#172338] text-slate-300">
            <tr>
              <th className="p-4">Экзопланета</th>
              <th className="p-4">Радиус R⊕</th>
              <th className="p-4">Масса M⊕</th>
              <th className="p-4">Период, дни</th>
              <th className="p-4">Год открытия</th>
              <th className="p-4">Метод</th>
            </tr>
          </thead>

          <tbody>
            {visiblePlanets.map((planet) => (
              <tr
                key={planet.pl_name}
                className="border-t border-white/10 transition-colors hover:bg-white/5"
              >
                <td className="p-4 font-medium text-cyan-300">
                  {planet.pl_name}
                </td>

                <td className="p-4 text-slate-200">
                  {formatNumber(planet.pl_rade)}
                </td>

                <td className="p-4 text-slate-200">
                  {formatNumber(planet.pl_bmasse)}
                </td>

                <td className="p-4 text-slate-200">
                  {formatNumber(planet.pl_orbper)}
                </td>

                <td className="p-4 text-slate-200">
                  {planet.disc_year ?? "—"}
                </td>

                <td className="p-4 text-slate-300">
                  {planet.discoverymethod ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visiblePlanets.length === 0 && (
          <p className="p-8 text-center text-slate-400">
            По выбранным фильтрам планеты не найдены.
          </p>
        )}
      </div>

      {/* Переключение страниц */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-400">
          Страница {currentPage} из {totalPages}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="rounded-lg border border-white/10 bg-[#172338] p-2 text-cyan-300 transition hover:bg-white/10 disabled:opacity-30"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="rounded-lg border border-white/10 bg-[#172338] p-2 text-cyan-300 transition hover:bg-white/10 disabled:opacity-30"
            aria-label="Следующая страница"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
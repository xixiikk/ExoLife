import { Trophy } from "lucide-react";
import type { RankedPlanet } from "../services/api";

interface Props {
  planets: RankedPlanet[];
  loading: boolean;
  error: string;
  selectedPlanetName: string | null;
  onSelectPlanet: (planet: RankedPlanet) => void;
}

export default function RankingPanel({
  planets,
  loading,
  error,
  selectedPlanetName,
  onSelectPlanet,
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#293a54] p-6">

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          TOP-50 экзопланет
        </h2>
        <Trophy size={22} className="text-cyan-400" />
      </div>

      <p className="mb-6 text-sm text-slate-400">
        Выберите планету, чтобы изучить её характеристики
      </p>

      {loading && (
        <p className="py-10 text-center text-cyan-300">
          Загрузка рейтинга NASA...
        </p>
      )}

      {!loading && error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && planets.length === 0 && (
        <p className="py-8 text-center text-slate-400">
          Нет планет с достаточными данными.
        </p>
      )}

      {!loading && !error && planets.length > 0 && (
        <div className="exolife-scrollbar max-h-[430px] space-y-2 overflow-y-auto pr-2">

          {planets.slice(0, 50).map((planet, index) => {
            const isSelected =
              planet.name === selectedPlanetName;

            return (
              <button
                key={planet.name}
                type="button"
                onClick={() => onSelectPlanet(planet)}
                aria-pressed={isSelected}
                className={
                  "w-full rounded-xl border p-3 text-left transition-all duration-200 " +
                  (isSelected
                    ? "border-cyan-400/60 bg-cyan-500/10"
                    : "border-transparent hover:border-white/10 hover:bg-white/5")
                }
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm text-white">
                    <span className="mr-2 text-cyan-400">
                      {index + 1}.
                    </span>
                    {planet.name}
                  </span>

                  <span className="shrink-0 text-sm font-bold text-cyan-300">
                    {planet.interior_esi.toFixed(4)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#172338]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, planet.interior_esi * 100)
                      )}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

    </section>
  );
}
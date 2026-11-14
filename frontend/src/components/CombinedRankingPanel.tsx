import { useState } from "react";
import { Trophy, Info } from "lucide-react";
import type {
  ExoLifePlanet,
  RankedPlanet,
} from "../services/api";

interface Props {
  planets: ExoLifePlanet[];
  expandedPlanets: RankedPlanet[];
  loading: boolean;
  error: string;
  expandedLoading: boolean;
  expandedError: string;
  selectedPlanetName: string | null;
  onSelectPlanet: (planet: ExoLifePlanet) => void;
}

export default function CombinedRankingPanel({
  planets,
  expandedPlanets,
  loading,
  error,
  expandedLoading,
  expandedError,
  selectedPlanetName,
  onSelectPlanet,
}: Props) {
  const [mode, setMode] = useState<"combined" | "interior">("combined");

  const isCombined = mode === "combined";
  const currentLoading = isCombined ? loading : expandedLoading;
  const currentError = isCombined ? error : expandedError;

  const displayedPlanets = isCombined
    ? planets.map((planet) => ({
        name: planet.name,
        score: planet.exolife_score,
        esi: planet.interior_esi,
        flux: planet.insolation,
        original: planet,
      }))
    : expandedPlanets.map((planet) => ({
        name: planet.name,
        score: planet.interior_esi,
        esi: planet.interior_esi,
        flux: planet.insolation,
        original: null,
      }));

  return (
    <section className="rounded-2xl border border-white/10 bg-[#293a54] p-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          ExoLife TOP-50
        </h2>
        <Trophy className="text-cyan-400" size={23} />
      </div>

      <p className="mb-5 text-sm text-slate-400">
        Рейтинг кандидатов на основе данных NASA
      </p>

      {/* Переключатель режимов */}
      <div className="mb-6 flex gap-2 rounded-xl bg-[#172338] p-1">
        <button
          type="button"
          onClick={() => setMode("combined")}
          className={
            "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition " +
            (isCombined
              ? "bg-cyan-500/20 text-cyan-300"
              : "text-slate-400 hover:text-white")
          }
        >
          Комплексный ExoLife
        </button>

        <button
          type="button"
          onClick={() => setMode("interior")}
          className={
            "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition " +
            (!isCombined
              ? "bg-cyan-500/20 text-cyan-300"
              : "text-slate-400 hover:text-white")
          }
        >
          Interior ESI TOP-50
        </button>
      </div>

      {currentLoading && (
        <p className="py-10 text-center text-cyan-300">
          Загрузка рейтинга...
        </p>
      )}

      {!currentLoading && currentError && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {currentError}
        </p>
      )}

      {!currentLoading && !currentError && displayedPlanets.length === 0 && (
        <p className="py-8 text-center text-slate-400">
          Кандидаты с достаточными данными не найдены.
        </p>
      )}

      {!currentLoading && !currentError && displayedPlanets.length > 0 && (
        <div className="max-h-[430px] space-y-2 overflow-y-auto pr-2">
          {displayedPlanets.map((planet, index) => {
            const selected =
              isCombined && planet.name === selectedPlanetName;

            return (
              <button
                key={planet.name}
                type="button"
                onClick={() => {
                  if (planet.original) {
                    onSelectPlanet(planet.original);
                  }
                }}
                disabled={!planet.original}
                aria-pressed={selected}
                className={
                  "w-full rounded-xl border p-3 text-left transition " +
                  (selected
                    ? "border-cyan-400/60 bg-cyan-500/10"
                    : "border-transparent hover:bg-white/5") +
                  (!planet.original ? " cursor-default" : "")
                }
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-white">
                    <span className="mr-2 text-cyan-400">
                      {index + 1}.
                    </span>
                    {planet.name}
                  </span>

                  <span className="text-sm font-bold text-cyan-300">
                    {planet.score.toFixed(4)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#172338]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, planet.score * 100)
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Interior ESI: {planet.esi.toFixed(3)}
                  {planet.flux != null && (
                    <span className="ml-3">
                      Поток: {planet.flux.toFixed(2)} S⊕
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
        <Info size={16} className="shrink-0 text-cyan-400" />

        <p>
          {isCombined
            ? "Экспериментальная оценка ExoLife: 70% Interior ESI и 30% близость потока к центру зоны обитаемости. Не является вероятностью жизни."
            : "Interior ESI оценивает сходство радиуса и плотности с Землёй. Этот рейтинг не учитывает обязательное нахождение в зоне обитаемости."}
        </p>
      </div>
    </section>
  );
}
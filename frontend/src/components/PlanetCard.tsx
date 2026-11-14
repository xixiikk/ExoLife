
import { Orbit } from "lucide-react";
import type { RankedPlanet } from "../services/api";

interface Props {
  planet: RankedPlanet | null;
}

function formatValue(
  value: number | null | undefined,
  digits = 2
) {
  if (value == null || !Number.isFinite(value)) {
    return "Нет данных";
  }

  return value.toLocaleString("ru-RU", {
    maximumFractionDigits: digits,
  });
}

export default function PlanetCard({ planet }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#293a54] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Избранная экзопланета
        </h2>

        <Orbit className="text-cyan-400" size={22} />
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {/* Анимированная планета */}
        <div className="group relative flex h-44 w-44 shrink-0 items-center justify-center">
          <div className="planet-glow absolute h-36 w-36 rounded-full bg-fuchsia-500/40 blur-3xl" />

          <div className="planet-float relative z-10">
            <img
              src="/images/exoplanet.png"
              alt="Художественная визуализация экзопланеты"
              className="h-44 w-44 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Характеристики выбранной планеты */}
        <div className="w-full min-w-0 space-y-4">
          {planet ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Название планеты
                </p>

                <h3 className="mt-1 break-words text-xl font-bold text-white">
                  {planet.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Звезда: {planet.hostname ?? "Нет данных"}
                </p>
              </div>

              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span className="text-sm text-slate-400">Радиус</span>
                <span className="text-sm text-white">
                  {formatValue(planet.radius)} R⊕
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span className="text-sm text-slate-400">Масса</span>
                <span className="text-sm text-white">
                  {formatValue(planet.mass)} M⊕
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span className="text-sm text-slate-400">
                  Равновесная температура
                </span>
                <span className="text-sm text-white">
                  {formatValue(planet.equilibrium_temperature, 1)} K
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span className="text-sm text-slate-400">
                  Поток излучения
                </span>
                <span className="text-sm text-white">
                  {formatValue(planet.insolation)} S⊕
                </span>
              </div>

              <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span className="text-sm text-slate-400">
                  Эксцентриситет
                </span>
                <span className="text-sm text-white">
                  {formatValue(planet.eccentricity, 3)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-400">
                  Interior ESI
                </span>

                <span className="text-lg font-bold text-cyan-300">
                  {formatValue(planet.interior_esi, 4)}
                </span>
              </div>
            </>
          ) : (
            <p className="py-6 text-sm text-slate-400">
              Выберите планету из TOP-50.
            </p>
          )}
        </div>
      </div>

    </section>
  );
}

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
} from "recharts";

import type { Exoplanet } from "../services/api";

interface Props {
  planets: Exoplanet[];
}

// Красивое оформление чисел на осях
function formatAxis(value: number) {
  const realValue = Math.pow(10, value);

  if (realValue >= 1000000) {
    return (realValue / 1000000).toFixed(0) + "M";
  }

  if (realValue >= 1000) {
    return (realValue / 1000).toFixed(0) + "k";
  }

  if (realValue >= 1) {
    return realValue.toFixed(0);
  }

  return realValue.toPrecision(1);
}

export default function ExoplanetChart({ planets }: Props) {
  // Оставляем только планеты с положительными
  // и конечными значениями массы и периода.
  const chartData = planets
    .filter(
      (planet) =>
        planet.pl_bmasse != null &&
        planet.pl_orbper != null &&
        Number.isFinite(planet.pl_bmasse) &&
        Number.isFinite(planet.pl_orbper) &&
        planet.pl_bmasse > 0 &&
        planet.pl_orbper > 0
    )
    .map((planet) => ({
      name: planet.pl_name,
      period: planet.pl_orbper!,
      mass: planet.pl_bmasse!,
      logPeriod: Math.log10(planet.pl_orbper!),
      logMass: Math.log10(planet.pl_bmasse!),
    }));

  const xValues = chartData.map((p) => p.logPeriod);
  const yValues = chartData.map((p) => p.logMass);

  const xMin = Math.floor(Math.min(...xValues));
  const xMax = Math.ceil(Math.max(...xValues));
  const yMin = Math.floor(Math.min(...yValues));
  const yMax = Math.ceil(Math.max(...yValues));

  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-[#293a54] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Exoplanet Census
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Масса и орбитальный период экзопланет NASA
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <span className="text-cyan-300">
            ● {chartData.length} планет с измерениями
          </span>

          <span className="text-slate-400">
            Логарифмическая шкала
          </span>
        </div>
      </div>

      <div className="h-[350px] min-w-0">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Недостаточно данных для графика
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 10,
                right: 20,
                bottom: 20,
                left: 5,
              }}
            >
              <CartesianGrid
                stroke="#40516b"
                strokeDasharray="3 3"
                opacity={0.5}
              />

              <XAxis
                type="number"
                dataKey="logPeriod"
                domain={[xMin, xMax]}
                allowDataOverflow
                tickFormatter={formatAxis}
                stroke="#9fb3cd"
                tick={{ fontSize: 11 }}
                label={{
                  value: "Орбитальный период (дни)",
                  position: "insideBottom",
                  offset: -12,
                  fill: "#9fb3cd",
                  fontSize: 11,
                }}
              />

              <YAxis
                type="number"
                dataKey="logMass"
                domain={[yMin, yMax]}
                allowDataOverflow
                tickFormatter={formatAxis}
                stroke="#9fb3cd"
                tick={{ fontSize: 11 }}
                width={55}
                label={{
                  value: "Масса (M⊕)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#9fb3cd",
                  fontSize: 11,
                }}
              />

              <ZAxis range={[12, 12]} />

              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const p = payload[0]?.payload as
                    | (typeof chartData)[number]
                    | undefined;

                  if (!p) return null;

                  return (
                    <div className="rounded-xl border border-white/20 bg-[#172338] p-3 text-sm text-white shadow-xl">
                      <p className="mb-2 font-semibold text-cyan-300">
                        {p.name}
                      </p>
                      <p>Масса: {p.mass.toLocaleString("ru-RU")} M⊕</p>
                      <p>
                        Период: {p.period.toLocaleString("ru-RU")} дней
                      </p>
                    </div>
                  );
                }}
              />

              <Scatter
                name="Экзопланеты NASA"
                data={chartData}
                fill="#67e8f9"
                fillOpacity={0.65}
                isAnimationActive={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Источник: NASA Exoplanet Archive · Масса в массах Земли
      </p>
    </section>
  );
}
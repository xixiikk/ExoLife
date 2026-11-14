import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Exoplanet } from "../services/api";

interface Props {
  planets: Exoplanet[];
}

const categories = [
  { name: "Земного размера", color: "#fbbf24" },
  { name: "Суперземли", color: "#8b5cf6" },
  { name: "Нептунового размера", color: "#47d7e8" },
  { name: "Гиганты", color: "#f472b6" },
  { name: "Не определено", color: "#64748b" },
];

function classifyPlanet(radius: number | null): number {
  if (radius === null || !Number.isFinite(radius) || radius <= 0) {
    return 4;
  }

  if (radius < 1.25) return 0;
  if (radius < 2) return 1;
  if (radius < 6) return 2;

  return 3;
}

export default function PlanetTypesChart({ planets }: Props) {
  const counts = [0, 0, 0, 0, 0];

  planets.forEach((planet) => {
    const category = classifyPlanet(planet.pl_rade);
    counts[category]++;
  });

  const chartData = categories.map((category, index) => ({
    ...category,
    value: counts[index],
  }));

  const total = planets.length;

  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-[#293a54] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">
          Типы экзопланет
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Распределение по радиусам из NASA
        </p>

        <p className="mt-2 text-xs text-cyan-300">
          Всего в каталоге: {total.toLocaleString("ru-RU")}
        </p>
      </div>

      <div className="relative h-[260px]">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            Ожидание данных NASA...
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    Number(value).toLocaleString("ru-RU"),
                    String(name),
                  ]}
                  contentStyle={{
                    backgroundColor: "#172338",
                    border: "1px solid #40516b",
                    borderRadius: 10,
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {total.toLocaleString("ru-RU")}
              </span>
              <span className="text-xs text-slate-400">
                ЭКЗОПЛАНЕТ
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {chartData.map((item) => {
          const percentage =
            total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-medium text-white">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

    
    </section>
  );
}
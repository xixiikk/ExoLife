import { Sun } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { HabitableZonesResponse } from "../services/api";

interface Props {
  data: HabitableZonesResponse | null;
  loading: boolean;
  error: string;
}

const colors = ["#4ade80", "#fb7185", "#60a5fa", "#64748b"];

export default function HabitableZonePanel({
  data,
  loading,
  error,
}: Props) {
  const chartData = data
    ? [
        { name: "В зоне обитаемости", value: data.summary.in_zone },
        { name: "Слишком горячие", value: data.summary.too_hot },
        { name: "Слишком холодные", value: data.summary.too_cold },
        { name: "Недостаточно данных", value: data.summary.unknown },
      ]
    : [];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#293a54] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Habitable Zone
        </h2>
        <Sun className="text-amber-300" size={24} />
      </div>

      <p className="mt-2 text-sm text-slate-400">
        Анализ зоны обитаемости по данным NASA
      </p>

      {loading && (
        <p className="py-10 text-cyan-300">
          Анализируем данные NASA...
        </p>
      )}

      {!loading && error && (
        <p className="py-10 text-red-300">{error}</p>
      )}

      {!loading && !error && data && (
        <>
          <div className="relative mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={colors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-green-400">
                {data.summary.in_zone}
              </span>
              <span className="text-xs text-slate-400">
                В ЗОНЕ
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 rounded-lg bg-[#1b2940] p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-xs text-slate-300">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm font-bold text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Проверено экзопланет: {data.total}
          </p>
        </>
      )}

    </section>
  );
}
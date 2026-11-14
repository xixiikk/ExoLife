// Демонстрационные данные для проверки интерфейса.
// Не являются результатом расчётов NASA.

export const demoPlanets = [
  { name: "TRAPPIST-1 e", score: 88 },
  { name: "Proxima Centauri b", score: 82 },
  { name: "Kepler-186 f", score: 76 },
  { name: "TOI-700 d", score: 71 },
  { name: "Kepler-442 b", score: 68 },
];

export const demoScatter = Array.from(
  { length: 120 },
  (_, i) => ({
    period: 1 + ((i * 37) % 365),
    mass: 0.5 + ((i * 19) % 120) / 10,
  })
);

export const demoTypes = [
  { name: "Суперземли", value: 35, color: "#47d7e8" },
  { name: "Газовые гиганты", value: 30, color: "#8b5cf6" },
  { name: "Нептуноподобные", value: 25, color: "#f472b6" },
  { name: "Землеподобные", value: 10, color: "#fbbf24" },
];
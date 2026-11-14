import {
  Orbit,
  LayoutDashboard,
  Globe2,
  ChartNoAxesCombined,
  Info,
} from "lucide-react";

const navigation = [
  {
    label: "Обзор",
    href: "#overview",
    icon: LayoutDashboard,
  },
  {
    label: "Аналитика",
    href: "#analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Экзопланеты",
    href: "#catalog",
    icon: Globe2,
  },
  {
    label: "О проекте",
    href: "#about",
    icon: Info,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111a2e]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#overview"
          className="flex items-center gap-3 text-xl font-bold text-white"
        >
          <Orbit className="text-cyan-400" size={28} />
          <span>
            Exo<span className="text-cyan-400">Life</span>
          </span>
        </a>

        <nav
          aria-label="Основная навигация"
          className="flex flex-wrap items-center gap-2"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all duration-200 hover:bg-cyan-500/10 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
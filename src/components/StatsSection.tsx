'use client';

import { useEffect, useState } from 'react';

interface Stat {
  value: string;
  label: string;
  key?: string;
}

export function StatsSection({ stats }: { stats: Stat[] }) {
  const [displayStats, setDisplayStats] = useState(stats);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Calcular quantas horas passaram desde uma data de início
    const startDate = new Date('2024-06-11T00:00:00').getTime();
    const now = new Date().getTime();
    const hoursPassed = Math.floor((now - startDate) / (1000 * 60 * 60));

    // Atualizar stats com o contador dinâmico
    const updated = stats.map(stat => {
      if (stat.key === 'providers') {
        return { ...stat, value: String(hoursPassed) };
      }
      return stat;
    });

    setDisplayStats(updated);

    // Atualizar a cada hora
    const interval = setInterval(() => {
      const newHoursPassed = Math.floor((new Date().getTime() - startDate) / (1000 * 60 * 60));
      setDisplayStats(prev =>
        prev.map(stat => {
          if (stat.key === 'providers') {
            return { ...stat, value: String(newHoursPassed) };
          }
          return stat;
        })
      );
    }, 1000 * 60 * 60); // Atualizar a cada 1 hora

    return () => clearInterval(interval);
  }, [stats]);

  if (!mounted) {
    return (
      <section className="bg-primary-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-yellow-400">...</div>
                <div className="text-sm text-primary-300 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {displayStats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-yellow-400">{s.value}</div>
              <div className="text-sm text-primary-300 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

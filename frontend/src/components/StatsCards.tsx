import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats | null;
}

export const StatsCards: React.FC<Props> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Total de Personas
        </p>
        <div className="flex items-baseline justify-between mt-2">
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.totalPersonas}
          </h3>
          <span className="text-xs text-slate-400 font-medium">Registros en catálogo</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Total de Domicilios
        </p>
        <div className="flex items-baseline justify-between mt-2">
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.totalDomicilios}
          </h3>
          <span className="text-xs text-slate-400 font-medium">Direcciones asociadas</span>
        </div>
      </div>
    </div>
  );
};
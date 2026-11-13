import { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { ChecklistItem, DEFAULT_CHECKLIST } from '../data/manualData';

interface OperationalChecklistProps {
  checkedIds: string[];
  onToggleItem: (id: string) => void;
  onResetChecklist: () => void;
}

type CadenceFilter = 'Tutte' | ChecklistItem['cadence'];

export function OperationalChecklist({
  checkedIds,
  onToggleItem,
  onResetChecklist,
}: OperationalChecklistProps) {
  const [cadenceFilter, setCadenceFilter] = useState<CadenceFilter>('Tutte');

  const visibleItems = DEFAULT_CHECKLIST.filter((item) =>
    cadenceFilter === 'Tutte' ? true : item.cadence === cadenceFilter
  );

  const doneCount = DEFAULT_CHECKLIST.filter((item) =>
    checkedIds.includes(item.id)
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <div className="text-xs text-slate-500 mb-2">
          Routine Amministrativa · ninjutsuacademy.top
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Checklist Operativa del Maestro
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Controlli consigliati per mantenere aggiornati corsi, iscrizioni allievi, prenotazioni prova e quote gratuite Firebase. Lo stato resta salvato nel browser.
            </p>
          </div>
          <div className="font-mono tabular-nums text-sm font-semibold text-slate-900 shrink-0">
            Completate: {doneCount} / {DEFAULT_CHECKLIST.length}
          </div>
        </div>
      </div>

      {/* Controlli filtro cadenza e reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtra attività per frequenza"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
        >
          {(['Tutte', 'Giornaliera', 'Settimanale', 'Mensile'] as CadenceFilter[]).map(
            (cad) => {
              const active = cadenceFilter === cad;
              return (
                <button
                  key={cad}
                  type="button"
                  onClick={() => setCadenceFilter(cad)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cad}
                </button>
              );
            }
          )}
        </div>

        <button
          type="button"
          onClick={onResetChecklist}
          className="min-h-[38px] px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Ripristina controlli</span>
        </button>
      </div>

      {/* Lista attività */}
      <ul className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white overflow-hidden">
        {visibleItems.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onToggleItem(item.id)}
                aria-pressed={isChecked}
                className="w-full text-left p-5 hover:bg-slate-50 transition-colors flex items-start gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-red-600"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-white border-slate-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block text-xs text-slate-500 mb-1">
                    Frequenza: {item.cadence} · Ruolo: {item.role}
                  </span>
                  <span
                    className={`block text-base font-semibold ${
                      isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="block text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.instruction}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

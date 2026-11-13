import { useState, useEffect } from 'react';
import { EDITOR_TABS, EditorTabSpec } from '../data/manualData';

interface EditorTabSimulatorProps {
  initialTabId?: string;
}

export function EditorTabSimulator({ initialTabId = 'brand' }: EditorTabSimulatorProps) {
  const [selectedTabId, setSelectedTabId] = useState<string>(initialTabId);

  useEffect(() => {
    setSelectedTabId(initialTabId);
  }, [initialTabId]);

  const activeTab: EditorTabSpec =
    EDITOR_TABS.find((t) => t.id === selectedTabId) ?? EDITOR_TABS[0];

  return (
    <section
      aria-label="Mappa interattiva delle 14 schede di Modifica Sito"
      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
    >
      {/* Intestazione che richiama la barra scura del Pannello Maestro di ninjutsuacademy.top */}
      <div className="bg-[#0c0e14] text-slate-100 px-4 py-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Mappa Interattiva · Pannello “Modifica Sito” (14 Schede)
            </h3>
            <p className="text-xs text-slate-400">
              Seleziona una scheda reale dell’editor di ninjutsuacademy.top per vederne campi e regole
            </p>
          </div>
          <span className="font-mono text-xs text-amber-400 tabular-nums">
            Scheda {activeTab.order} / 14
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Le 14 schede dell'editor Modifica Sito"
          className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap pb-1"
        >
          {EDITOR_TABS.map((tab) => {
            const isSelected = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTabId(tab.id)}
                className={`min-h-[34px] px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-mono tabular-nums mr-1.5 opacity-75">
                  {tab.order}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dettaglio della scheda selezionata */}
      <div role="tabpanel" className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Ruolo richiesto: {activeTab.requiredRole}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-700">{activeTab.firestoreTarget}</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mt-1">
              {activeTab.order}. {activeTab.label}
            </h4>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{activeTab.purpose}</p>

        <div>
          <div className="text-xs font-semibold text-slate-900 mb-2">
            Campi modificabili in questa scheda
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {activeTab.fields.map((field) => (
              <li key={field} className="flex items-start gap-2.5">
                <span className="text-red-600 font-mono text-xs mt-1" aria-hidden="true">
                  —
                </span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div>
            <div className="font-semibold text-slate-900 mb-1">Gestione Media & Peso</div>
            <p className="text-slate-600 leading-relaxed">{activeTab.mediaNote}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900 mb-1">Pubblicazione & Controllo</div>
            <p className="text-slate-600 leading-relaxed">{activeTab.publishRule}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ClipboardCheck, Search, X } from 'lucide-react';
import { RoleFilter } from '../data/manualData';

interface WorkspaceToolbarProps {
  query: string;
  onQueryChange: (val: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (role: RoleFilter) => void;
  activeView: 'chapter' | 'checklist';
  onOpenChecklist: () => void;
  checklistDoneCount: number;
  checklistTotalCount: number;
  filteredCount: number;
  totalCount: number;
}

const ROLE_OPTIONS: { id: RoleFilter; label: string }[] = [
  { id: 'all', label: 'Tutti i Ruoli' },
  { id: 'maestro', label: 'Maestro' },
  { id: 'super_admin', label: 'Super Admin' },
];

export function WorkspaceToolbar({
  query,
  onQueryChange,
  roleFilter,
  onRoleFilterChange,
  activeView,
  onOpenChecklist,
  checklistDoneCount,
  checklistTotalCount,
  filteredCount,
  totalCount,
}: WorkspaceToolbarProps) {
  return (
    <div className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Ricerca live */}
        <div className="relative flex-1 min-w-0">
          <label htmlFor="manual-search" className="sr-only">
            Cerca nel manuale amministratore
          </label>
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="manual-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cerca scheda, comando o errore (es. Base64, Kyu, Prenotazioni)..."
            className="w-full min-h-[40px] pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Azzera ricerca"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controlli ruolo e checklist */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap sm:flex-nowrap">
          <div
            role="group"
            aria-label="Filtra per ruolo amministratore"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            {ROLE_OPTIONS.map((opt) => {
              const active = roleFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onRoleFilterChange(opt.id)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenChecklist}
            aria-pressed={activeView === 'checklist'}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'checklist'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Routine</span>
            <span className="font-mono tabular-nums opacity-80">
              {checklistDoneCount}/{checklistTotalCount}
            </span>
          </button>
        </div>
      </div>

      {(query.trim() !== '' || roleFilter !== 'all') && (
        <div className="max-w-4xl mx-auto mt-2.5 flex items-center justify-between text-xs text-slate-500">
          <span>
            Capitoli visibili:{' '}
            <strong className="font-mono tabular-nums text-slate-800">
              {filteredCount}
            </strong>{' '}
            su {totalCount}
          </span>
          <button
            type="button"
            onClick={() => {
              onQueryChange('');
              onRoleFilterChange('all');
            }}
            className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
          >
            Ripristina filtri
          </button>
        </div>
      )}
    </div>
  );
}

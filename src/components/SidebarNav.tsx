import { Check, ClipboardCheck, X } from 'lucide-react';
import {
  CATEGORY_LABELS,
  ChapterCategory,
  ManualChapter,
} from '../data/manualData';

interface SidebarNavProps {
  chapters: ManualChapter[];
  totalChaptersCount: number;
  selectedChapterId: string;
  activeView: 'chapter' | 'checklist';
  completedIds: string[];
  progress: { completedCount: number; totalCount: number; percentage: number };
  onSelectChapter: (chapterId: string) => void;
  onSelectChecklist: () => void;
  onCloseMobile?: () => void;
}

const CATEGORY_ORDER: ChapterCategory[] = ['access', 'editor', 'operations', 'cloud'];

export function SidebarNav({
  chapters,
  totalChaptersCount,
  selectedChapterId,
  activeView,
  completedIds,
  progress,
  onSelectChapter,
  onSelectChecklist,
  onCloseMobile,
}: SidebarNavProps) {
  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200">
      {onCloseMobile && (
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Indice Capitoli</span>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Chiudi menu laterale"
            className="min-h-[44px] min-w-[44px] -mr-2 inline-flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Progresso lettura */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-baseline justify-between gap-2 text-xs text-slate-600 mb-2">
          <span className="font-medium text-slate-800">Avanzamento manuale</span>
          <span className="font-mono tabular-nums text-slate-700">
            {progress.completedCount}/{progress.totalCount} · {progress.percentage}%
          </span>
        </div>
        <div
          className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Percentuale completamento lettura manuale"
        >
          <div
            className="h-full bg-red-600 transition-all duration-200"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Sito: ninjutsuacademy.top · CSEN n. 42887
        </div>
      </div>

      {/* Indice capitoli */}
      <nav
        aria-label="Indice capitoli del manuale"
        className="flex-1 overflow-y-auto p-4 pb-6 space-y-6"
      >
        {chapters.length === 0 ? (
          <p className="text-xs text-slate-500 px-2 py-4">
            Nessun capitolo corrisponde ai filtri attivi ({totalChaptersCount} totali).
          </p>
        ) : (
          CATEGORY_ORDER.map((cat) => {
            const items = chapters.filter((c) => c.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <div className="px-2 pb-2 text-xs font-semibold text-slate-500">
                  {CATEGORY_LABELS[cat]}
                </div>
                <ul className="space-y-1">
                  {items.map((chapter) => {
                    const isSelected =
                      activeView === 'chapter' && selectedChapterId === chapter.id;
                    const isCompleted = completedIds.includes(chapter.id);

                    return (
                      <li key={chapter.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectChapter(chapter.id);
                            onCloseMobile?.();
                          }}
                          aria-current={isSelected ? 'page' : undefined}
                          className={`w-full text-left px-2.5 py-2.5 rounded-lg text-sm transition-colors flex items-start gap-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                            isSelected
                              ? 'bg-red-50 text-red-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span
                            className={`font-mono tabular-nums text-xs mt-0.5 shrink-0 ${
                              isSelected ? 'text-red-700' : 'text-slate-400'
                            }`}
                          >
                            {chapter.number}
                          </span>
                          <span className="flex-1 leading-snug">{chapter.title}</span>
                          {isCompleted && (
                            <Check
                              className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                              aria-label="Letto"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </nav>

      {/* Accesso rapido Checklist Operativa */}
      <div className="p-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            onSelectChecklist();
            onCloseMobile?.();
          }}
          aria-current={activeView === 'checklist' ? 'page' : undefined}
          className={`w-full min-h-[42px] px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
            activeView === 'checklist'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Checklist Operativa</span>
        </button>
      </div>
    </aside>
  );
}

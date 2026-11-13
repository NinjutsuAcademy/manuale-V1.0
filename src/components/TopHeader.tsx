import { Menu, Printer, X } from 'lucide-react';
import { ChapterCategory } from '../data/manualData';

interface TopHeaderProps {
  activeCategory: ChapterCategory;
  onSelectCategory: (category: ChapterCategory) => void;
  onPrint: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const NAV_ITEMS: { id: ChapterCategory; label: string }[] = [
  { id: 'access', label: 'Accesso & Ruoli' },
  { id: 'editor', label: 'Editor 14 Tab' },
  { id: 'operations', label: 'Allievi & Prenotazioni' },
  { id: 'cloud', label: 'Media & Cloud' },
];

export function TopHeader({
  activeCategory,
  onSelectCategory,
  onPrint,
  mobileMenuOpen,
  onToggleMobileMenu,
}: TopHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zona 1: Wordmark singolo su una riga */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden min-h-[44px] min-w-[44px] -ml-2 inline-flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? 'Chiudi indice capitoli' : 'Apri indice capitoli'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('access');
            }}
            className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Manuale Admin · Ninjutsu Academy
          </a>
        </div>

        {/* Zona 2: 4 link testuali concisi su singola riga */}
        <nav
          aria-label="Sezioni principali"
          className="hidden lg:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                  isActive
                    ? 'border-red-600 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: 1 azione primaria */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onPrint}
            aria-label="Stampa o esporta manuale in PDF"
            className="min-h-[40px] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Stampa / PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
}

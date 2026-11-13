import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  DocumentManualView,
  triggerBlobDownload,
} from './components/DocumentManualView';
import {
  DEFAULT_CHECKLIST,
  EDITOR_TABS,
  MANUAL_CHAPTERS,
  ROLE_MATRIX,
  TROUBLESHOOTING_ROWS,
} from './data/manualData';
import { createManualPdfDocument } from './utils/pdfExport';

const MANUAL_PAYLOAD = {
  chapters: MANUAL_CHAPTERS,
  editorTabs: EDITOR_TABS,
  roles: ROLE_MATRIX,
  troubleshooting: TROUBLESHOOTING_ROWS,
  checklist: DEFAULT_CHECKLIST,
};

export default function App() {
  const [exportMessage, setExportMessage] = useState<string>('');

  const handleDownloadPdf = () => {
    const { blob, pageCount } = createManualPdfDocument(MANUAL_PAYLOAD);
    triggerBlobDownload(blob, 'Manuale_Amministratore_NinjutsuAcademy.pdf');
    setExportMessage(
      `File PDF scaricato con successo (${pageCount} pagine A4: Manuale_Amministratore_NinjutsuAcademy.pdf).`
    );
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Barra superiore minima 3 zone per navigazione rapida nel documento e download PDF */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          <a
            href="#top"
            className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap truncate"
          >
            Manuale Admin · Ninjutsu Academy
          </a>

          <nav
            aria-label="Sezioni del documento"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#indice"
              className="py-1 hover:text-slate-900 hover:underline whitespace-nowrap shrink-0"
            >
              Indice
            </a>
            <a
              href="#cap-accesso-ruoli"
              className="py-1 hover:text-slate-900 hover:underline whitespace-nowrap shrink-0"
            >
              Accesso &amp; Ruoli
            </a>
            <a
              href="#appendice-schede"
              className="py-1 hover:text-slate-900 hover:underline whitespace-nowrap shrink-0"
            >
              14 Schede
            </a>
            <a
              href="#appendice-checklist"
              className="py-1 hover:text-slate-900 hover:underline whitespace-nowrap shrink-0"
            >
              Checklist
            </a>
          </nav>

          <button
            type="button"
            onClick={handleDownloadPdf}
            aria-label="Scarica manuale in PDF"
            className="min-h-[40px] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Salva PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        <DocumentManualView
          onDownloadPdf={handleDownloadPdf}
          exportMessage={exportMessage}
          onExportMessage={setExportMessage}
        />
      </main>
    </div>
  );
}

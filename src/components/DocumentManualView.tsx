import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import dojoBannerImg from '../assets/images/dojo_manual_banner_1794574641903.jpg';
import {
  DEFAULT_CHECKLIST,
  EDITOR_TABS,
  MANUAL_CHAPTERS,
  ROLE_MATRIX,
  TROUBLESHOOTING_ROWS,
} from '../data/manualData';
import {
  buildFullManualMarkdown,
  buildWordHtmlDocument,
} from '../utils/documentExport';

interface DocumentManualViewProps {
  onDownloadPdf: () => void;
  exportMessage: string;
  onExportMessage: (msg: string) => void;
}

const PAYLOAD = {
  chapters: MANUAL_CHAPTERS,
  editorTabs: EDITOR_TABS,
  roles: ROLE_MATRIX,
  troubleshooting: TROUBLESHOOTING_ROWS,
  checklist: DEFAULT_CHECKLIST,
};

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DocumentManualView({
  onDownloadPdf,
  exportMessage,
  onExportMessage,
}: DocumentManualViewProps) {
  const [bannerError, setBannerError] = useState(false);

  const handleDownloadWord = () => {
    const html = buildWordHtmlDocument(PAYLOAD);
    triggerBlobDownload(
      new Blob([html], { type: 'application/msword;charset=utf-8' }),
      'Manuale_Amministratore_NinjutsuAcademy.doc'
    );
    onExportMessage(
      'File Word (.doc) scaricato: aprilo con Microsoft Word, LibreOffice Writer o Google Docs.'
    );
  };

  const handleDownloadMarkdown = () => {
    const md = buildFullManualMarkdown(PAYLOAD);
    triggerBlobDownload(
      new Blob([md], { type: 'text/markdown;charset=utf-8' }),
      'Manuale_Amministratore_NinjutsuAcademy.md'
    );
    onExportMessage('File Markdown (.md) scaricato con successo.');
  };

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Barra esportazione documento */}
      <div className="no-print mb-6 bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <div className="font-semibold text-slate-900 text-sm">
            Documento Completo · Formato A4
          </div>
          <div className="mt-0.5">
            Scarica direttamente il manuale in formato PDF, Word (.doc) o Markdown (.md).
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Scarica PDF (.pdf)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Scarica Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Scarica .MD</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div
          role="status"
          className="no-print mb-6 px-4 py-3 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg"
        >
          {exportMessage}
        </div>
      )}

      {/* Foglio A4 continuo */}
      <article className="print-sheet bg-white border border-slate-200 shadow-sm rounded-xl px-6 sm:px-14 py-10 sm:py-14 space-y-12">
        {/* Frontespizio documento */}
        <header className="pb-8 border-b-2 border-slate-900 space-y-6">
          <div className="text-xs font-mono text-slate-500">
            DOCUMENTO OPERATIVO UFFICIALE · REV. NOVEMBRE 2026 · CSEN N. 42887
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Manuale d’Uso del Pannello Amministratore
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              Guida operativa completa per Maestri e Super Admin del sito{' '}
              <span className="font-mono text-slate-900 font-medium">
                www.ninjutsuacademy.top
              </span>
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div>
              <dt className="font-semibold text-slate-500">Associazione</dt>
              <dd className="text-slate-900 mt-1">
                ASD Ninjutsu Academy Grottaglie · Riconosciuta CONI
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Sede &amp; Segreteria</dt>
              <dd className="text-slate-900 mt-1">
                Via Pacinotti 19, 74023 Grottaglie (TA) · 329 428 8782
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Infrastruttura Cloud</dt>
              <dd className="font-mono text-slate-900 mt-1">
                Firebase Auth · Cloud Firestore · Firebase Storage
              </dd>
            </div>
          </dl>

          <figure className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            {!bannerError ? (
              <img
                src={dojoBannerImg}
                alt="Planimetria editoriale del Dojo ASD Ninjutsu Academy Grottaglie"
                referrerPolicy="no-referrer"
                onError={() => setBannerError(true)}
                className="w-full h-48 sm:h-60 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-sm text-slate-600">
                ASD Ninjutsu Academy Grottaglie — Manuale Pannello Amministratore
              </div>
            )}
          </figure>
        </header>

        {/* Indice generale */}
        <section id="indice" aria-label="Indice del documento" className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Indice Generale</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm border-y border-slate-200 py-5">
            {MANUAL_CHAPTERS.map((ch) => (
              <li key={ch.id} className="flex items-baseline justify-between gap-2">
                <a
                  href={`#cap-${ch.id}`}
                  className="text-slate-800 hover:text-red-700 hover:underline transition-colors truncate"
                >
                  <span className="font-mono tabular-nums text-slate-500 mr-2">
                    {ch.number}.
                  </span>
                  {ch.title}
                </a>
                <span className="text-xs text-slate-400 shrink-0">
                  {ch.requiredRole}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-2">
              <a
                href="#appendice-schede"
                className="text-slate-800 hover:text-red-700 hover:underline transition-colors"
              >
                <span className="font-mono text-slate-500 mr-2">App. A</span>
                Riferimento 14 Schede Editor
              </a>
            </li>
            <li className="flex items-baseline justify-between gap-2">
              <a
                href="#appendice-checklist"
                className="text-slate-800 hover:text-red-700 hover:underline transition-colors"
              >
                <span className="font-mono text-slate-500 mr-2">App. B</span>
                Checklist Operativa del Maestro
              </a>
            </li>
          </ol>
        </section>

        {/* Tutti i 14 capitoli in sequenza */}
        <div className="space-y-12">
          {MANUAL_CHAPTERS.map((chapter) => (
            <section
              key={chapter.id}
              id={`cap-${chapter.id}`}
              className="pt-8 border-t border-slate-200 space-y-5 scroll-mt-20"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span className="font-mono tabular-nums font-semibold text-red-700">
                    CAPITOLO {chapter.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{chapter.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Ruolo minimo: {chapter.requiredRole}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {chapter.number}. {chapter.title}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {chapter.summary}
                </p>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs">
                <div>
                  <dt className="font-semibold text-slate-500">Obiettivo</dt>
                  <dd className="text-slate-900 mt-1">{chapter.goal}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Percorso nel pannello</dt>
                  <dd className="font-mono text-slate-800 mt-1">{chapter.panelPath}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Risultato</dt>
                  <dd className="text-slate-900 mt-1">{chapter.outcome}</dd>
                </div>
              </dl>

              <ol className="space-y-3 pl-0">
                {chapter.steps.map((step, idx) => (
                  <li
                    key={step.title}
                    className="avoid-break flex items-start gap-3.5 text-sm"
                  >
                    <span className="font-mono tabular-nums text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 w-6 h-6 rounded inline-flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900">
                        {step.title}
                        {step.uiControl && (
                          <span className="font-mono text-xs font-normal text-slate-500 ml-2">
                            [{step.uiControl}]
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {chapter.showRoleMatrix && (
                <div className="avoid-break overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                        <th className="py-2.5 px-3">Ruolo</th>
                        <th className="py-2.5 px-3">Area Tutorial</th>
                        <th className="py-2.5 px-3">Modifica Sito</th>
                        <th className="py-2.5 px-3">Allievi &amp; Prenotazioni</th>
                        <th className="py-2.5 px-3">Multi-Dojo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ROLE_MATRIX.map((row) => (
                        <tr key={row.roleKey}>
                          <td className="py-2.5 px-3 align-top">
                            <div className="font-semibold text-slate-900">
                              {row.displayLabel}
                            </div>
                            <div className="font-mono text-slate-500">
                              {row.roleKey}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 align-top">
                            {row.tutorialArea}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 align-top">
                            {row.siteEditor}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 align-top">
                            {row.studentsBookings}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 align-top">
                            {row.multiTenant}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chapter.showTroubleshooting && (
                <div className="avoid-break overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                        <th className="py-2.5 px-3">Codice Errore</th>
                        <th className="py-2.5 px-3">Sintomo &amp; Causa</th>
                        <th className="py-2.5 px-3">Soluzione Operativa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {TROUBLESHOOTING_ROWS.map((row) => (
                        <tr key={row.code}>
                          <td className="py-2.5 px-3 font-mono font-semibold text-red-700 align-top whitespace-nowrap">
                            {row.code}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 align-top">
                            <div className="font-medium">{row.symptom}</div>
                            <div className="text-slate-500 mt-0.5">{row.cause}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 align-top">
                            {row.resolution}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {chapter.warnings.map((w) => (
                <div
                  key={w.title}
                  className="avoid-break border border-slate-200 bg-slate-50 rounded-lg px-4 py-3 text-xs text-slate-800"
                >
                  <strong>
                    {w.severity} — {w.title}:
                  </strong>{' '}
                  {w.description}
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Appendice A: Tabella completa delle 14 schede */}
        <section
          id="appendice-schede"
          className="pt-8 border-t-2 border-slate-900 space-y-4 scroll-mt-20"
        >
          <div>
            <div className="text-xs font-mono text-slate-500">APPENDICE A</div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Riferimento Completo delle 14 Schede “Modifica Sito”
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Elenco integrale delle schede del Pannello Maestro con percorso dati su Cloud Firestore e regole di gestione media.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <th className="py-2.5 px-3">Scheda</th>
                  <th className="py-2.5 px-3">Campi Principali &amp; Destinazione Cloud</th>
                  <th className="py-2.5 px-3">Media &amp; Pubblicazione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {EDITOR_TABS.map((tab) => (
                  <tr key={tab.id} className="avoid-break">
                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {tab.order}. {tab.label}
                      </div>
                      <div className="text-slate-500 mt-0.5">{tab.requiredRole}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 align-top space-y-1">
                      <div>{tab.purpose}</div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {tab.firestoreTarget}
                      </div>
                      <ul className="list-disc pl-4 text-slate-600 space-y-0.5 pt-1">
                        {tab.fields.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-3 text-slate-700 align-top space-y-1.5">
                      <div>
                        <span className="font-semibold text-slate-900">Media: </span>
                        {tab.mediaNote}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">Regola: </span>
                        {tab.publishRule}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Appendice B: Checklist Operativa */}
        <section
          id="appendice-checklist"
          className="pt-8 border-t border-slate-200 space-y-4 scroll-mt-20"
        >
          <div>
            <div className="text-xs font-mono text-slate-500">APPENDICE B</div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Checklist Operativa di Manutenzione
            </h2>
          </div>

          <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
            {DEFAULT_CHECKLIST.map((item) => (
              <li key={item.id} className="avoid-break p-4 text-sm flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-slate-400 text-base leading-none mt-0.5"
                >
                  [ ]
                </span>
                <div>
                  <div className="text-xs text-slate-500">
                    {item.cadence} · {item.role}
                  </div>
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                    {item.instruction}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Fine Documento — Manuale Amministratore www.ninjutsuacademy.top
          </span>
          <span>ASD Ninjutsu Academy Grottaglie · CSEN n. 42887</span>
        </footer>
      </article>
    </div>
  );
}

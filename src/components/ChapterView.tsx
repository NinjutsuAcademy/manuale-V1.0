import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import dojoBannerImg from '../assets/images/dojo_manual_banner_1794574641903.jpg';
import {
  ManualChapter,
  ROLE_MATRIX,
  TROUBLESHOOTING_ROWS,
} from '../data/manualData';
import { EditorTabSimulator } from './EditorTabSimulator';
import { FirestoreSimulator } from './FirestoreSimulator';

interface ChapterViewProps {
  chapter: ManualChapter;
  isCompleted: boolean;
  onToggleCompleted: (id: string) => void;
  prevChapter?: ManualChapter;
  nextChapter?: ManualChapter;
  onSelectChapter: (id: string) => void;
}

export function ChapterView({
  chapter,
  isCompleted,
  onToggleCompleted,
  prevChapter,
  nextChapter,
  onSelectChapter,
}: ChapterViewProps) {
  const [bannerError, setBannerError] = useState(false);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Testata editoriale del capitolo */}
      <header className="pb-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-mono tabular-nums text-slate-700 font-medium">
            Capitolo {chapter.number}
          </span>
          <span aria-hidden="true">·</span>
          <span>{chapter.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>Ruolo minimo: {chapter.requiredRole}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{chapter.readMinutes} min di lettura</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
          {chapter.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          {chapter.summary}
        </p>

        {/* Catena Obiettivo -> Percorso -> Risultato */}
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-sm">
          <div>
            <dt className="text-xs font-semibold text-slate-500">Obiettivo operativo</dt>
            <dd className="text-slate-900 mt-1 leading-snug">{chapter.goal}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Percorso nel pannello</dt>
            <dd className="font-mono text-xs text-slate-800 mt-1 leading-relaxed">
              {chapter.panelPath}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-slate-500">Risultato visibile</dt>
            <dd className="text-slate-900 mt-1 leading-snug">{chapter.outcome}</dd>
          </div>
        </dl>
      </header>

      {/* Illustrazione editoriale sul primo capitolo */}
      {chapter.id === 'accesso-ruoli' && (
        <figure className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          {!bannerError ? (
            <img
              src={dojoBannerImg}
              alt="Planimetria editoriale del Dojo ASD Ninjutsu Academy Grottaglie"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
              className="w-full h-56 sm:h-72 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-72 bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-lg font-semibold text-slate-800">
                ASD Ninjutsu Academy · Grottaglie (TA)
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Manuale Operativo Pannello Amministratore
              </p>
            </div>
          )}
          <figcaption className="px-4 py-2.5 text-xs text-slate-500 border-t border-slate-200">
            Manuale ufficiale per Maestri e Super Admin · Gestione portale www.ninjutsuacademy.top (Via Pacinotti 19, Grottaglie · CSEN / CONI)
          </figcaption>
        </figure>
      )}

      {/* Procedura passo-passo */}
      <section aria-label="Procedura passo passo" className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Procedura operativa passo per passo
        </h2>
        <ol className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
          {chapter.steps.map((step, idx) => (
            <li key={step.title} className="p-5 sm:p-6 flex items-start gap-4">
              <span className="font-mono tabular-nums text-sm font-semibold text-red-700 bg-red-50 border border-red-200 w-7 h-7 rounded-md inline-flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  {step.uiControl && (
                    <span className="font-mono text-xs text-slate-600">
                      Comando: {step.uiControl}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Tabella Ruoli (Capitolo 01) */}
      {chapter.showRoleMatrix && (
        <section aria-label="Matrice dei ruoli e permessi" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Matrice dei ruoli su ninjutsuacademy.top
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Ogni profilo autenticato tramite Google Sign-In riceve permessi specifici su Firestore e sulle schede di modifica.
            </p>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Ruolo</th>
                  <th className="py-3 px-4">Area Tutorial</th>
                  <th className="py-3 px-4">Modifica Sito (14 Tab)</th>
                  <th className="py-3 px-4">Allievi & Prenotazioni</th>
                  <th className="py-3 px-4">Multi-Dojo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ROLE_MATRIX.map((row) => (
                  <tr key={row.roleKey} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900">{row.displayLabel}</div>
                      <div className="font-mono text-xs text-slate-500 mt-0.5">
                        {row.roleKey}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {row.tutorialArea}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {row.siteEditor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {row.studentsBookings}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {row.multiTenant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Simulatore 14 Schede Editor */}
      {chapter.showEditorTabs && (
        <EditorTabSimulator initialTabId={chapter.editorTabFocusId} />
      )}

      {/* Simulatore Quote & Cache Firestore */}
      {chapter.showFirestoreSimulator && <FirestoreSimulator />}

      {/* Tabella Diagnostica Errori */}
      {chapter.showTroubleshooting && (
        <section aria-label="Risoluzione errori Firebase frequenti" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Diagnostica errori Firebase Auth, Storage & Firestore
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Riferimento rapido ai messaggi di errore gestiti dal pannello amministratore.
            </p>
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Codice / Segnale</th>
                  <th className="py-3 px-4">Sintomo nel pannello</th>
                  <th className="py-3 px-4">Soluzione operativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TROUBLESHOOTING_ROWS.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-red-700 align-top whitespace-nowrap">
                      {row.code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 align-top">
                      <div className="font-medium">{row.symptom}</div>
                      <div className="text-xs text-slate-500 mt-1">Causa: {row.cause}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 align-top">
                      {row.resolution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Avvertenze e buone pratiche (senza bordi laterali spessi o pillole) */}
      {chapter.warnings.length > 0 && (
        <section aria-label="Avvertenze operative" className="space-y-3">
          {chapter.warnings.map((w) => {
            const boxStyle =
              w.severity === 'Bloccante'
                ? 'bg-red-50/70 border-red-200 text-red-950'
                : w.severity === 'Attenzione'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-slate-100/80 border-slate-200 text-slate-900';

            return (
              <div key={w.title} className={`border rounded-xl p-5 ${boxStyle}`}>
                <div className="text-xs font-semibold mb-1">
                  {w.severity} · {w.title}
                </div>
                <p className="text-sm leading-relaxed opacity-90">{w.description}</p>
              </div>
            );
          })}
        </section>
      )}

      {/* Barra inferiore: completamento capitolo + navigazione */}
      <footer className="no-print pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onToggleCompleted(chapter.id)}
          aria-pressed={isCompleted}
          className={`min-h-[42px] px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <span>
            {isCompleted ? 'Capitolo segnato come letto' : 'Segna capitolo come letto'}
          </span>
        </button>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {prevChapter && (
            <button
              type="button"
              onClick={() => onSelectChapter(prevChapter.id)}
              className="min-h-[42px] px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Precedente</span>
            </button>
          )}
          {nextChapter && (
            <button
              type="button"
              onClick={() => onSelectChapter(nextChapter.id)}
              className="min-h-[42px] px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Prossimo: {nextChapter.number}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}

import { useState } from 'react';
import {
  estimateFirestoreImpact,
  formatItalianBytes,
  SPARK_DAILY_READ_LIMIT,
} from '../utils/manualLogic';

export function FirestoreSimulator() {
  const [cacheTtlMinutes, setCacheTtlMinutes] = useState<number>(15);
  const [retentionDays, setRetentionDays] = useState<number>(60);
  const [dailyAdminSessions, setDailyAdminSessions] = useState<number>(6);
  const [expiredClosedDocsCount, setExpiredClosedDocsCount] = useState<number>(25);
  const [base64CoversCount, setBase64CoversCount] = useState<number>(4);
  const [autoOffloadBase64OnSave, setAutoOffloadBase64OnSave] = useState<boolean>(true);

  const estimate = estimateFirestoreImpact({
    cacheTtlMinutes,
    retentionDays,
    dailyAdminSessions,
    activeDocsCount: 65,
    expiredClosedDocsCount,
    base64CoversCount,
    autoOffloadBase64OnSave,
  });

  const statusText =
    estimate.statusLevel === 'nominal'
      ? 'Stato: Ottimale'
      : estimate.statusLevel === 'warning'
      ? 'Stato: Attenzione'
      : 'Stato: Critico';

  const statusTone =
    estimate.statusLevel === 'nominal'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : estimate.statusLevel === 'warning'
      ? 'text-amber-800 bg-amber-50 border-amber-200'
      : 'text-red-800 bg-red-50 border-red-200';

  return (
    <section
      aria-label="Simulatore Politica Database e Memoria Firestore"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Simulatore Politica Memoria & Quote Spark
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Prova come i parametri reali di <span className="font-mono">ninjutsu_fs_policy_</span> influenzano letture e peso
          </p>
        </div>
        <div className={`px-3 py-1.5 text-xs font-semibold border rounded-lg whitespace-nowrap shrink-0 ${statusTone}`}>
          {statusText}
        </div>
      </div>

      {/* Controlli simulazione */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="sim-ttl" className="font-medium text-slate-800">
              cacheTtlMinutes (Cache locale)
            </label>
            <span className="font-mono tabular-nums text-slate-900 font-semibold">
              {cacheTtlMinutes} min
            </span>
          </div>
          <input
            id="sim-ttl"
            type="range"
            min={1}
            max={120}
            value={cacheTtlMinutes}
            onChange={(e) => setCacheTtlMinutes(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1">
            Predefinito: 15 min (range consentito 1–1440)
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="sim-retention" className="font-medium text-slate-800">
              retentionDays (Conservazione chiusi)
            </label>
            <span className="font-mono tabular-nums text-slate-900 font-semibold">
              {retentionDays} giorni
            </span>
          </div>
          <input
            id="sim-retention"
            type="range"
            min={7}
            max={365}
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <p className="text-xs text-slate-500 mt-1">
            Predefinito: 60 giorni su prenotazioni completate/annullate
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="sim-sessions" className="font-medium text-slate-800">
              Aperture giornaliere pannello Admin
            </label>
            <span className="font-mono tabular-nums text-slate-900 font-semibold">
              {dailyAdminSessions} / giorno
            </span>
          </div>
          <input
            id="sim-sessions"
            type="range"
            min={1}
            max={50}
            value={dailyAdminSessions}
            onChange={(e) => setDailyAdminSessions(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="sim-base64" className="font-medium text-slate-800">
              Copertine Base64 pesanti rilevate
            </label>
            <span className="font-mono tabular-nums text-slate-900 font-semibold">
              {base64CoversCount} immagini
            </span>
          </div>
          <input
            id="sim-base64"
            type="range"
            min={0}
            max={25}
            value={base64CoversCount}
            onChange={(e) => setBase64CoversCount(Number(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200">
        <label className="inline-flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={autoOffloadBase64OnSave}
            onChange={(e) => setAutoOffloadBase64OnSave(e.target.checked)}
            className="w-4 h-4 accent-red-600 rounded cursor-pointer"
          />
          <span>
            Attiva <span className="font-mono text-xs">autoOffloadBase64OnSave</span> (sposta su Firebase Storage)
          </span>
        </label>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="sim-expired" className="text-slate-600">
            Record scaduti:
          </label>
          <input
            id="sim-expired"
            type="number"
            min={0}
            max={500}
            value={expiredClosedDocsCount}
            onChange={(e) =>
              setExpiredClosedDocsCount(Math.max(0, Math.min(500, Number(e.target.value) || 0)))
            }
            className="w-20 px-2.5 py-1.5 border border-slate-200 rounded-md font-mono tabular-nums text-slate-900 bg-slate-50"
          />
        </div>
      </div>

      {/* Output metriche tabulari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
        <div>
          <div className="text-xs text-slate-500">Letture stimate / giorno</div>
          <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
            {estimate.estimatedDailyReads.toLocaleString('it-IT')}
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            su {SPARK_DAILY_READ_LIMIT.toLocaleString('it-IT')} ({estimate.readQuotaPercent}%)
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Peso stimato Firestore</div>
          <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
            {formatItalianBytes(estimate.estimatedStorageBytes)}
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            {estimate.storageQuotaPercent}% di 1 GiB
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Spazio recuperabile</div>
          <div className="text-lg font-semibold font-mono tabular-nums text-emerald-700 mt-1">
            {formatItalianBytes(estimate.reclaimableBytes)}
          </div>
          <div className="text-xs text-slate-500">dopo pulizia / offload</div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Peso finale previsto</div>
          <div className="text-lg font-semibold font-mono tabular-nums text-slate-900 mt-1">
            {formatItalianBytes(estimate.projectedStorageBytesAfterCleanup)}
          </div>
          <div className="text-xs text-slate-500">documenti puliti</div>
        </div>
      </div>

      <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
        <strong>Indicazione operativa:</strong> {estimate.recommendation}
      </p>
    </section>
  );
}

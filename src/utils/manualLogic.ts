import { EditorTabSpec, ManualChapter, RoleFilter } from '../data/manualData';

export interface FirestorePolicyInput {
  cacheTtlMinutes: number;
  retentionDays: number;
  dailyAdminSessions: number;
  activeDocsCount: number;
  expiredClosedDocsCount: number;
  base64CoversCount: number;
  autoOffloadBase64OnSave: boolean;
}

export interface FirestoreImpactEstimate {
  estimatedDailyReads: number;
  readQuotaPercent: number;
  estimatedStorageBytes: number;
  reclaimableBytes: number;
  projectedStorageBytesAfterCleanup: number;
  storageQuotaPercent: number;
  statusLevel: 'nominal' | 'warning' | 'critical';
  recommendation: string;
}

export const SPARK_DAILY_READ_LIMIT = 50_000;
export const SPARK_STORAGE_BYTE_LIMIT = 1_073_741_824; // 1 GiB

/**
 * Filtra i capitoli del manuale per query di ricerca testuale e filtro ruolo.
 */
export function filterManualChapters(
  chapters: ManualChapter[],
  query: string,
  roleFilter: RoleFilter
): ManualChapter[] {
  const normalizedQuery = query.trim().toLowerCase();

  return chapters.filter((chapter) => {
    if (roleFilter === 'maestro' && chapter.requiredRole !== 'Maestro') {
      return false;
    }
    if (roleFilter === 'super_admin' && chapter.requiredRole !== 'Super Admin') {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      chapter.number,
      chapter.title,
      chapter.summary,
      chapter.goal,
      chapter.panelPath,
      chapter.outcome,
      chapter.categoryLabel,
      ...chapter.keywords,
      ...chapter.steps.map((s) => `${s.title} ${s.detail} ${s.uiControl ?? ''}`),
      ...chapter.warnings.map((w) => `${w.title} ${w.description}`),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

/**
 * Filtra le 14 schede dell'Editor Modifica Sito per testo o ruolo.
 */
export function filterEditorTabs(
  tabs: EditorTabSpec[],
  query: string,
  roleFilter: RoleFilter
): EditorTabSpec[] {
  const q = query.trim().toLowerCase();
  return tabs.filter((tab) => {
    if (roleFilter === 'maestro' && tab.requiredRole !== 'Maestro') {
      return false;
    }
    if (roleFilter === 'super_admin' && tab.requiredRole !== 'Super Admin') {
      return false;
    }
    if (!q) return true;
    const text = [
      tab.order,
      tab.label,
      tab.purpose,
      tab.firestoreTarget,
      ...tab.fields,
    ]
      .join(' ')
      .toLowerCase();
    return text.includes(q);
  });
}

/**
 * Calcola il progresso di lettura e consultazione del manuale.
 */
export function calculateReadingProgress(
  completedIds: string[],
  totalChapters: number
): { completedCount: number; totalCount: number; percentage: number } {
  if (totalChapters <= 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0 };
  }
  const uniqueValid = new Set(completedIds);
  const completedCount = Math.min(uniqueValid.size, totalChapters);
  const percentage = Math.round((completedCount / totalChapters) * 100);
  return { completedCount, totalCount: totalChapters, percentage };
}

/**
 * Modella in modo deterministico l'impatto delle impostazioni Database & Memoria
 * sulle quote gratuite Spark di Cloud Firestore.
 */
export function estimateFirestoreImpact(
  input: FirestorePolicyInput
): FirestoreImpactEstimate {
  const ttl = Math.max(1, Math.min(1440, Math.round(input.cacheTtlMinutes)));
  const retention = Math.max(7, Math.min(365, Math.round(input.retentionDays)));
  const sessions = Math.max(1, Math.min(200, Math.round(input.dailyAdminSessions)));
  const activeDocs = Math.max(0, Math.round(input.activeDocsCount));
  const expiredDocs = Math.max(0, Math.round(input.expiredClosedDocsCount));
  const base64Covers = Math.max(0, Math.round(input.base64CoversCount));

  // Un cache TTL piu' alto riduce le riletture ripetute nella stessa giornata operativa.
  const refreshesPerSession = Math.max(1, Math.ceil(60 / ttl));
  const docsPerRefresh = activeDocs + expiredDocs + 25;
  const estimatedDailyReads = sessions * refreshesPerSession * docsPerRefresh;
  const readQuotaPercent = Math.min(
    100,
    Number(((estimatedDailyReads / SPARK_DAILY_READ_LIMIT) * 100).toFixed(2))
  );

  // Ogni documento testuale medio ~ 1.6 KB, ogni copertina Base64 ~ 180 KB.
  const avgDocBytes = 1600;
  const avgBase64Bytes = 180_000;
  const currentBase64Bytes = base64Covers * avgBase64Bytes;
  const estimatedStorageBytes =
    (activeDocs + expiredDocs) * avgDocBytes + currentBase64Bytes;

  // Record oltre retention vengono ripuliti; se autoOffloadBase64OnSave e' attivo, i Base64 vengono liberati.
  const retentionMultiplier = retention <= 60 ? 1 : Math.max(0.25, 60 / retention);
  const reclaimableExpiredBytes = Math.round(
    expiredDocs * avgDocBytes * retentionMultiplier
  );
  const reclaimableBase64Bytes = input.autoOffloadBase64OnSave
    ? currentBase64Bytes
    : 0;
  const reclaimableBytes = reclaimableExpiredBytes + reclaimableBase64Bytes;

  const projectedStorageBytesAfterCleanup = Math.max(
    0,
    estimatedStorageBytes - reclaimableBytes
  );
  const storageQuotaPercent = Math.min(
    100,
    Number(((estimatedStorageBytes / SPARK_STORAGE_BYTE_LIMIT) * 100).toFixed(3))
  );

  let statusLevel: 'nominal' | 'warning' | 'critical' = 'nominal';
  let recommendation =
    'Configurazione ottimale: cache TTL equilibrata e documenti leggeri con soli URL Storage.';

  if (readQuotaPercent >= 75 || base64Covers >= 15) {
    statusLevel = 'critical';
    recommendation =
      'Soglia critica: alza cacheTtlMinutes ad almeno 15–30 minuti e attiva subito lo spostamento Base64 su Firebase Storage.';
  } else if (readQuotaPercent >= 35 || expiredDocs >= 30 || base64Covers > 0) {
    statusLevel = 'warning';
    recommendation =
      'Attenzione consigliata: esegui un Backup JSON e avvia la pulizia dei record chiusi o l’offload delle copertine Base64.';
  }

  return {
    estimatedDailyReads,
    readQuotaPercent,
    estimatedStorageBytes,
    reclaimableBytes,
    projectedStorageBytesAfterCleanup,
    storageQuotaPercent,
    statusLevel,
    recommendation,
  };
}

export function formatItalianBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

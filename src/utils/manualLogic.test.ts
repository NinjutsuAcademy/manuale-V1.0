import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReadingProgress,
  estimateFirestoreImpact,
  filterEditorTabs,
  filterManualChapters,
  formatItalianBytes,
} from './manualLogic';
import { EDITOR_TABS, MANUAL_CHAPTERS } from '../data/manualData';

test('filterManualChapters returns all chapters when query is empty and role is all', () => {
  const result = filterManualChapters(MANUAL_CHAPTERS, '', 'all');
  assert.equal(result.length, MANUAL_CHAPTERS.length);
});

test('filterManualChapters filters accurately by search keyword (case-insensitive)', () => {
  const base64Hits = filterManualChapters(MANUAL_CHAPTERS, 'Base64', 'all');
  assert.ok(base64Hits.some((c) => c.id === 'database-memoria'));

  const kyuHits = filterManualChapters(MANUAL_CHAPTERS, '9° Kyu', 'all');
  assert.ok(kyuHits.some((c) => c.id === 'editor-kyu-orari-faq'));
});

test('filterManualChapters enforces roleFilter for Super Admin vs Maestro', () => {
  const superAdminOnly = filterManualChapters(MANUAL_CHAPTERS, '', 'super_admin');
  assert.ok(superAdminOnly.length > 0);
  assert.ok(superAdminOnly.every((c) => c.requiredRole === 'Super Admin'));

  const maestroOnly = filterManualChapters(MANUAL_CHAPTERS, '', 'maestro');
  assert.ok(maestroOnly.length > 0);
  assert.ok(maestroOnly.every((c) => c.requiredRole === 'Maestro'));
});

test('filterEditorTabs returns all 14 real editor tabs on default filter', () => {
  const result = filterEditorTabs(EDITOR_TABS, '', 'all');
  assert.equal(result.length, 14);
  assert.equal(result[0].label, 'Brand & Navbar');
  assert.equal(result[13].label, 'Database & Memoria');
});

test('calculateReadingProgress computes unique completion percentage', () => {
  assert.deepEqual(calculateReadingProgress([], 14), {
    completedCount: 0,
    totalCount: 14,
    percentage: 0,
  });

  assert.deepEqual(
    calculateReadingProgress(['accesso-ruoli', 'accesso-ruoli', 'barra-rapida'], 14),
    {
      completedCount: 2,
      totalCount: 14,
      percentage: 14,
    }
  );
});

test('estimateFirestoreImpact lowers daily reads when cacheTtlMinutes increases', () => {
  const lowCache = estimateFirestoreImpact({
    cacheTtlMinutes: 2,
    retentionDays: 60,
    dailyAdminSessions: 10,
    activeDocsCount: 80,
    expiredClosedDocsCount: 20,
    base64CoversCount: 0,
    autoOffloadBase64OnSave: true,
  });

  const highCache = estimateFirestoreImpact({
    cacheTtlMinutes: 30,
    retentionDays: 60,
    dailyAdminSessions: 10,
    activeDocsCount: 80,
    expiredClosedDocsCount: 20,
    base64CoversCount: 0,
    autoOffloadBase64OnSave: true,
  });

  assert.ok(highCache.estimatedDailyReads < lowCache.estimatedDailyReads);
});

test('estimateFirestoreImpact reclaims Base64 cover bytes when autoOffloadBase64OnSave is true', () => {
  const withOffload = estimateFirestoreImpact({
    cacheTtlMinutes: 15,
    retentionDays: 60,
    dailyAdminSessions: 4,
    activeDocsCount: 40,
    expiredClosedDocsCount: 10,
    base64CoversCount: 5,
    autoOffloadBase64OnSave: true,
  });

  const withoutOffload = estimateFirestoreImpact({
    cacheTtlMinutes: 15,
    retentionDays: 60,
    dailyAdminSessions: 4,
    activeDocsCount: 40,
    expiredClosedDocsCount: 10,
    base64CoversCount: 5,
    autoOffloadBase64OnSave: false,
  });

  assert.ok(withOffload.reclaimableBytes > withoutOffload.reclaimableBytes);
  assert.ok(withOffload.projectedStorageBytesAfterCleanup < withOffload.estimatedStorageBytes);
});

test('formatItalianBytes formats B, KB, and MB cleanly', () => {
  assert.equal(formatItalianBytes(512), '512 B');
  assert.equal(formatItalianBytes(2048), '2.0 KB');
  assert.equal(formatItalianBytes(2 * 1024 * 1024), '2.00 MB');
});

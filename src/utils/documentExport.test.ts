import test from 'node:test';
import assert from 'node:assert/strict';
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
} from './documentExport';

const payload = {
  chapters: MANUAL_CHAPTERS,
  editorTabs: EDITOR_TABS,
  roles: ROLE_MATRIX,
  troubleshooting: TROUBLESHOOTING_ROWS,
  checklist: DEFAULT_CHECKLIST,
};

test('buildFullManualMarkdown includes all 14 chapters and 14 editor tabs', () => {
  const md = buildFullManualMarkdown(payload);
  assert.ok(md.includes('# Manuale Operativo del Pannello Amministratore'));
  for (const ch of MANUAL_CHAPTERS) {
    assert.ok(md.includes(`## ${ch.number}. ${ch.title}`), `Missing chapter ${ch.number}`);
  }
  for (const tab of EDITOR_TABS) {
    assert.ok(md.includes(`### ${tab.order}. ${tab.label}`), `Missing tab ${tab.order}`);
  }
  assert.ok(md.includes('storage/unauthorized'));
  assert.ok(md.includes('super_admin'));
});

test('buildWordHtmlDocument generates valid Word-compatible HTML with A4 print rules', () => {
  const doc = buildWordHtmlDocument(payload);
  assert.ok(doc.includes('urn:schemas-microsoft-com:office:word'));
  assert.ok(doc.includes('@page { size: A4;'));
  assert.ok(doc.includes('14. Database &amp; Memoria') || doc.includes('14. Database & Memoria'));
  assert.ok(doc.includes('storage/quota-exceeded'));
});

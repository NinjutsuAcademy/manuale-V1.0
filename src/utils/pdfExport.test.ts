import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CHECKLIST,
  EDITOR_TABS,
  MANUAL_CHAPTERS,
  ROLE_MATRIX,
  TROUBLESHOOTING_ROWS,
} from '../data/manualData';
import { createManualPdfDocument, sanitizePdfText } from './pdfExport';

const payload = {
  chapters: MANUAL_CHAPTERS,
  editorTabs: EDITOR_TABS,
  roles: ROLE_MATRIX,
  troubleshooting: TROUBLESHOOTING_ROWS,
  checklist: DEFAULT_CHECKLIST,
};

test('sanitizePdfText normalizes smart punctuation and removes unsupported CJK glyphs while keeping Italian accents', () => {
  const input = 'L’arte “Nin” (武神館) · € 100 — à è é ì ò ù';
  const cleaned = sanitizePdfText(input);
  assert.ok(cleaned.includes("L'arte \"Nin\""));
  assert.ok(cleaned.includes('à è é ì ò ù'));
  assert.ok(!cleaned.includes('武'));
});

test('createManualPdfDocument generates a valid multi-page PDF binary', () => {
  const result = createManualPdfDocument(payload);
  const header = new TextDecoder().decode(result.bytes.slice(0, 7));
  assert.equal(header, '%PDF-1.');
  assert.ok(result.pageCount >= 4, `Expected at least 4 PDF pages, got ${result.pageCount}`);
  assert.ok(result.bytes.byteLength > 10_000, 'Expected substantial PDF byte size');
});

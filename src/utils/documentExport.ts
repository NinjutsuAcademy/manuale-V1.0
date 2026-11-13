import {
  ChecklistItem,
  EditorTabSpec,
  ManualChapter,
  RolePermissionRow,
  TroubleshootingRow,
} from '../data/manualData';

export interface ManualDocumentPayload {
  chapters: ManualChapter[];
  editorTabs: EditorTabSpec[];
  roles: RolePermissionRow[];
  troubleshooting: TroubleshootingRow[];
  checklist: ChecklistItem[];
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Genera il manuale completo in formato Markdown pronto per il download (.md).
 */
export function buildFullManualMarkdown(payload: ManualDocumentPayload): string {
  const lines: string[] = [];

  lines.push('# Manuale Operativo del Pannello Amministratore — ninjutsuacademy.top');
  lines.push('');
  lines.push('**Ente:** ASD Ninjutsu Academy Grottaglie (Affiliazione CSEN n. 42887 · Albo CONI)  ');
  lines.push('**Sede:** Via Pacinotti 19, 74023 Grottaglie (TA)  ');
  lines.push('**Portale:** https://www.ninjutsuacademy.top  ');
  lines.push('**Destinatari:** Maestri (Admin Dojo) e Super Admin  ');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Indice dei Contenuti');
  lines.push('');
  for (const ch of payload.chapters) {
    lines.push(`- **${ch.number}. ${ch.title}** _(${ch.requiredRole})_`);
  }
  lines.push('- **Appendice A.** Scheda tecnica completa delle 14 Tab di Modifica Sito');
  lines.push('- **Appendice B.** Checklist Operativa del Maestro');
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const ch of payload.chapters) {
    lines.push(`## ${ch.number}. ${ch.title}`);
    lines.push('');
    lines.push(
      `> **Sezione:** ${ch.categoryLabel} | **Ruolo minimo:** ${ch.requiredRole} | **Percorso:** \`${ch.panelPath}\``
    );
    lines.push('');
    lines.push(ch.summary);
    lines.push('');
    lines.push(`- **Obiettivo operativo:** ${ch.goal}`);
    lines.push(`- **Risultato visibile:** ${ch.outcome}`);
    lines.push('');
    lines.push('### Procedura passo per passo');
    lines.push('');
    ch.steps.forEach((step, index) => {
      const cmd = step.uiControl ? ` _(Comando: \`${step.uiControl}\`)_` : '';
      lines.push(`${index + 1}. **${step.title}**${cmd}`);
      lines.push(`   ${step.detail}`);
    });
    lines.push('');

    if (ch.showRoleMatrix) {
      lines.push('### Matrice dei Ruoli e Permessi');
      lines.push('');
      lines.push('| Ruolo | Identificativo | Area Tutorial | Modifica Sito (14 Tab) | Allievi & Prenotazioni | Multi-Dojo |');
      lines.push('| --- | --- | --- | --- | --- | --- |');
      for (const r of payload.roles) {
        lines.push(
          `| ${r.displayLabel} | \`${r.roleKey}\` | ${r.tutorialArea} | ${r.siteEditor} | ${r.studentsBookings} | ${r.multiTenant} |`
        );
      }
      lines.push('');
    }

    if (ch.showTroubleshooting) {
      lines.push('### Diagnostica Errori Firebase Auth, Storage & Firestore');
      lines.push('');
      lines.push('| Codice / Segnale | Sintomo | Causa | Soluzione operativa |');
      lines.push('| --- | --- | --- | --- |');
      for (const t of payload.troubleshooting) {
        lines.push(`| \`${t.code}\` | ${t.symptom} | ${t.cause} | ${t.resolution} |`);
      }
      lines.push('');
    }

    if (ch.warnings.length > 0) {
      for (const w of ch.warnings) {
        lines.push(`**${w.severity} — ${w.title}:** ${w.description}`);
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  lines.push('## Appendice A. Riferimento Completo delle 14 Schede “Modifica Sito”');
  lines.push('');
  for (const tab of payload.editorTabs) {
    lines.push(`### ${tab.order}. ${tab.label}`);
    lines.push(`- **Destinazione Cloud:** \`${tab.firestoreTarget}\``);
    lines.push(`- **Ruolo richiesto:** ${tab.requiredRole}`);
    lines.push(`- **Scopo:** ${tab.purpose}`);
    lines.push('- **Campi modificabili:**');
    for (const f of tab.fields) {
      lines.push(`  - ${f}`);
    }
    lines.push(`- **Gestione Media:** ${tab.mediaNote}`);
    lines.push(`- **Regola di pubblicazione:** ${tab.publishRule}`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Appendice B. Checklist Operativa del Maestro');
  lines.push('');
  for (const item of payload.checklist) {
    lines.push(`- [ ] **[${item.cadence} · ${item.role}] ${item.title}** — ${item.instruction}`);
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Genera un documento HTML compatibile con Microsoft Word / LibreOffice Writer (.doc).
 */
export function buildWordHtmlDocument(payload: ManualDocumentPayload): string {
  const chaptersHtml = payload.chapters
    .map((ch) => {
      const stepsHtml = ch.steps
        .map(
          (step, i) => `
          <li>
            <strong>${i + 1}. ${escapeHtml(step.title)}</strong>${
            step.uiControl
              ? ` <code>[Comando: ${escapeHtml(step.uiControl)}]</code>`
              : ''
          }<br/>
            <span>${escapeHtml(step.detail)}</span>
          </li>`
        )
        .join('\n');

      const roleTableHtml = ch.showRoleMatrix
        ? `
        <h3>Matrice dei Ruoli</h3>
        <table>
          <thead>
            <tr>
              <th>Ruolo</th>
              <th>Area Tutorial</th>
              <th>Modifica Sito</th>
              <th>Allievi &amp; Prenotazioni</th>
              <th>Multi-Dojo</th>
            </tr>
          </thead>
          <tbody>
            ${payload.roles
              .map(
                (r) => `
              <tr>
                <td><strong>${escapeHtml(r.displayLabel)}</strong><br/><code>${escapeHtml(r.roleKey)}</code></td>
                <td>${escapeHtml(r.tutorialArea)}</td>
                <td>${escapeHtml(r.siteEditor)}</td>
                <td>${escapeHtml(r.studentsBookings)}</td>
                <td>${escapeHtml(r.multiTenant)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>`
        : '';

      const troubleshootingHtml = ch.showTroubleshooting
        ? `
        <h3>Diagnostica Errori Firebase</h3>
        <table>
          <thead>
            <tr>
              <th>Codice</th>
              <th>Sintomo</th>
              <th>Soluzione</th>
            </tr>
          </thead>
          <tbody>
            ${payload.troubleshooting
              .map(
                (t) => `
              <tr>
                <td><code>${escapeHtml(t.code)}</code></td>
                <td>${escapeHtml(t.symptom)} (${escapeHtml(t.cause)})</td>
                <td>${escapeHtml(t.resolution)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>`
        : '';

      const warningsHtml = ch.warnings
        .map(
          (w) => `
        <p class="notice"><strong>${escapeHtml(w.severity)} — ${escapeHtml(w.title)}:</strong> ${escapeHtml(w.description)}</p>`
        )
        .join('');

      return `
      <section>
        <h2>${escapeHtml(ch.number)}. ${escapeHtml(ch.title)}</h2>
        <p class="meta">Sezione: ${escapeHtml(ch.categoryLabel)} | Ruolo minimo: ${escapeHtml(ch.requiredRole)} | Percorso: <code>${escapeHtml(ch.panelPath)}</code></p>
        <p>${escapeHtml(ch.summary)}</p>
        <p><strong>Obiettivo:</strong> ${escapeHtml(ch.goal)}<br/><strong>Risultato:</strong> ${escapeHtml(ch.outcome)}</p>
        <ol>${stepsHtml}</ol>
        ${roleTableHtml}
        ${troubleshootingHtml}
        ${warningsHtml}
      </section>`;
    })
    .join('\n');

  const tabsHtml = payload.editorTabs
    .map(
      (tab) => `
      <tr>
        <td><strong>${escapeHtml(tab.order)}. ${escapeHtml(tab.label)}</strong></td>
        <td><code>${escapeHtml(tab.firestoreTarget)}</code></td>
        <td>${escapeHtml(tab.purpose)}<br/><em>Media:</em> ${escapeHtml(tab.mediaNote)}</td>
      </tr>`
    )
    .join('');

  const checklistHtml = payload.checklist
    .map(
      (item) => `
      <li>&#9744; <strong>[${escapeHtml(item.cadence)} · ${escapeHtml(item.role)}] ${escapeHtml(item.title)}</strong> — ${escapeHtml(item.instruction)}</li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="it">
<head>
  <meta charset="utf-8" />
  <title>Manuale Operativo Pannello Amministratore - ninjutsuacademy.top</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.5; font-size: 11pt; }
    h1 { font-size: 20pt; color: #991b1b; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px; }
    h2 { font-size: 14pt; color: #0f172a; margin-top: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { font-size: 11.5pt; color: #1e293b; margin-top: 14px; }
    .meta { font-size: 9.5pt; color: #475569; }
    .notice { background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; }
    code { font-family: Consolas, monospace; font-size: 9.5pt; background: #f1f5f9; padding: 1px 4px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 14px 0; font-size: 9.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-weight: bold; }
    ol, ul { padding-left: 18px; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <h1>Manuale Operativo Pannello Amministratore — ninjutsuacademy.top</h1>
  <p class="meta">ASD Ninjutsu Academy Grottaglie · Via Pacinotti 19, Grottaglie (TA) · Affiliazione CSEN n. 42887 · Albo CONI</p>
  ${chaptersHtml}
  <h2>Appendice A. Schede Editor “Modifica Sito” (14 Tab)</h2>
  <table>
    <thead>
      <tr>
        <th>Scheda</th>
        <th>Percorso Cloud</th>
        <th>Funzione e Media</th>
      </tr>
    </thead>
    <tbody>${tabsHtml}</tbody>
  </table>
  <h2>Appendice B. Checklist Operativa del Maestro</h2>
  <ul>${checklistHtml}</ul>
</body>
</html>`;
}

import { jsPDF } from 'jspdf';
import { ManualDocumentPayload } from './documentExport';

/**
 * Converte caratteri non supportati dal font standard Latin-1 di jsPDF
 * (virgolette tipografiche, trattini lunghi, ideogrammi) in equivalenti puliti.
 */
export function sanitizePdfText(input: string): string {
  return input
    .replaceAll('\u2018', "'")
    .replaceAll('\u2019', "'")
    .replaceAll('\u201C', '"')
    .replaceAll('\u201D', '"')
    .replaceAll('\u2014', '-')
    .replaceAll('\u2013', '-')
    .replaceAll('\u2026', '...')
    .replaceAll('\u00B7', '-')
    .replaceAll('\u2192', '->')
    .replaceAll('\u27F6', '->')
    // Rimuove eventuali caratteri CJK / simboli fuori Latin-1 mantenendo lettere accentate italiane
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '')
    .replace(/\s+\)/g, ')')
    .replace(/\(\s+/g, '(')
    .replace(/,\s*,+/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface GeneratedPdfResult {
  blob: Blob;
  bytes: Uint8Array;
  pageCount: number;
}

/**
 * Genera un documento PDF A4 multipagina pronto per il download diretto.
 */
export function createManualPdfDocument(
  payload: ManualDocumentPayload
): GeneratedPdfResult {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 20;
  let y = margin;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimit) {
      doc.addPage();
      y = margin;
    }
  };

  const writeWrapped = (
    text: string,
    options: {
      size?: number;
      bold?: boolean;
      color?: [number, number, number];
      indent?: number;
      lineHeight?: number;
      spaceAfter?: number;
    } = {}
  ) => {
    const size = options.size ?? 10;
    const lineHeight = options.lineHeight ?? size * 0.48;
    const indent = options.indent ?? 0;
    const color = options.color ?? [30, 41, 59];

    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);

    const clean = sanitizePdfText(text);
    const lines = doc.splitTextToSize(clean, contentWidth - indent) as string[];

    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      doc.text(line, margin + indent, y);
      y += lineHeight;
    }
    if (options.spaceAfter) {
      y += options.spaceAfter;
    }
  };

  // --- Frontespizio ---
  writeWrapped('DOCUMENTO OPERATIVO UFFICIALE - REV. NOVEMBRE 2026', {
    size: 8.5,
    bold: true,
    color: [185, 28, 28],
    spaceAfter: 3,
  });

  writeWrapped("Manuale d'Uso del Pannello Amministratore", {
    size: 20,
    bold: true,
    color: [15, 23, 42],
    lineHeight: 9,
    spaceAfter: 2,
  });

  writeWrapped(
    'Guida operativa completa per Maestri e Super Admin di www.ninjutsuacademy.top',
    {
      size: 11,
      color: [71, 85, 105],
      spaceAfter: 4,
    }
  );

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  writeWrapped(
    'Ente: ASD Ninjutsu Academy Grottaglie | Affiliazione CSEN n. 42887 - Albo CONI',
    { size: 9.5, bold: true, color: [15, 23, 42], spaceAfter: 1.5 }
  );
  writeWrapped(
    'Sede: Via Pacinotti 19, 74023 Grottaglie (TA) | Tel/WhatsApp: 329 428 8782 | Email: academyninjutsu@gmail.com',
    { size: 9, color: [71, 85, 105], spaceAfter: 1.5 }
  );
  writeWrapped(
    'Infrastruttura Cloud: Firebase Authentication (Google Sign-In) - Cloud Firestore - Firebase Storage',
    { size: 9, color: [71, 85, 105], spaceAfter: 7 }
  );

  // --- Indice Generale ---
  writeWrapped('Indice Generale', {
    size: 13,
    bold: true,
    color: [15, 23, 42],
    spaceAfter: 3,
  });

  for (const ch of payload.chapters) {
    writeWrapped(`${ch.number}. ${ch.title} (${ch.requiredRole})`, {
      size: 9.5,
      color: [51, 65, 85],
      indent: 2,
      lineHeight: 4.6,
      spaceAfter: 0.5,
    });
  }
  writeWrapped('Appendice A. Riferimento Completo delle 14 Schede "Modifica Sito"', {
    size: 9.5,
    color: [51, 65, 85],
    indent: 2,
    lineHeight: 4.6,
    spaceAfter: 0.5,
  });
  writeWrapped('Appendice B. Checklist Operativa di Manutenzione', {
    size: 9.5,
    color: [51, 65, 85],
    indent: 2,
    lineHeight: 4.6,
    spaceAfter: 6,
  });

  // --- Tutti i 14 Capitoli ---
  for (const ch of payload.chapters) {
    ensureSpace(26);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    writeWrapped(
      `CAPITOLO ${ch.number} - ${ch.categoryLabel} - Ruolo minimo: ${ch.requiredRole}`,
      {
        size: 8.5,
        bold: true,
        color: [185, 28, 28],
        spaceAfter: 1.5,
      }
    );

    writeWrapped(`${ch.number}. ${ch.title}`, {
      size: 13,
      bold: true,
      color: [15, 23, 42],
      lineHeight: 6,
      spaceAfter: 2,
    });

    writeWrapped(ch.summary, {
      size: 9.5,
      color: [51, 65, 85],
      spaceAfter: 2.5,
    });

    writeWrapped(`Obiettivo: ${ch.goal}`, {
      size: 9,
      bold: true,
      color: [30, 41, 59],
      indent: 2,
      spaceAfter: 1,
    });
    writeWrapped(`Percorso nel pannello: ${ch.panelPath}`, {
      size: 9,
      color: [71, 85, 105],
      indent: 2,
      spaceAfter: 1,
    });
    writeWrapped(`Risultato visibile: ${ch.outcome}`, {
      size: 9,
      color: [30, 41, 59],
      indent: 2,
      spaceAfter: 3,
    });

    ch.steps.forEach((step, idx) => {
      const cmdLabel = step.uiControl ? ` [Comando: ${step.uiControl}]` : '';
      writeWrapped(`${idx + 1}. ${step.title}${cmdLabel}`, {
        size: 9.5,
        bold: true,
        color: [15, 23, 42],
        indent: 2,
        spaceAfter: 0.8,
      });
      writeWrapped(step.detail, {
        size: 9.2,
        color: [51, 65, 85],
        indent: 6,
        spaceAfter: 2,
      });
    });

    if (ch.showRoleMatrix) {
      ensureSpace(18);
      writeWrapped('Matrice Ruoli e Permessi:', {
        size: 10,
        bold: true,
        color: [15, 23, 42],
        spaceAfter: 2,
      });
      for (const r of payload.roles) {
        writeWrapped(
          `- ${r.displayLabel} (${r.roleKey}): Tutorial = ${r.tutorialArea}; Editor = ${r.siteEditor}; Allievi = ${r.studentsBookings}; Multi-Dojo = ${r.multiTenant}.`,
          {
            size: 8.8,
            color: [51, 65, 85],
            indent: 3,
            spaceAfter: 1.5,
          }
        );
      }
      y += 2;
    }

    if (ch.showTroubleshooting) {
      ensureSpace(18);
      writeWrapped('Diagnostica Errori Firebase:', {
        size: 10,
        bold: true,
        color: [15, 23, 42],
        spaceAfter: 2,
      });
      for (const t of payload.troubleshooting) {
        writeWrapped(`[${t.code}] ${t.symptom}`, {
          size: 9,
          bold: true,
          color: [185, 28, 28],
          indent: 3,
          spaceAfter: 0.8,
        });
        writeWrapped(`Causa: ${t.cause} | Soluzione: ${t.resolution}`, {
          size: 8.8,
          color: [51, 65, 85],
          indent: 5,
          spaceAfter: 2,
        });
      }
    }

    for (const w of ch.warnings) {
      writeWrapped(`${w.severity} - ${w.title}: ${w.description}`, {
        size: 8.8,
        bold: false,
        color: [120, 53, 15],
        indent: 2,
        spaceAfter: 2,
      });
    }
  }

  // --- Appendice A: 14 Schede Editor ---
  doc.addPage();
  y = margin;
  writeWrapped('APPENDICE A', {
    size: 8.5,
    bold: true,
    color: [185, 28, 28],
    spaceAfter: 1.5,
  });
  writeWrapped('Riferimento Completo delle 14 Schede "Modifica Sito"', {
    size: 14,
    bold: true,
    color: [15, 23, 42],
    spaceAfter: 4,
  });

  for (const tab of payload.editorTabs) {
    ensureSpace(22);
    writeWrapped(`${tab.order}. ${tab.label} (${tab.requiredRole}) - ${tab.firestoreTarget}`, {
      size: 10,
      bold: true,
      color: [15, 23, 42],
      spaceAfter: 1,
    });
    writeWrapped(tab.purpose, {
      size: 9,
      color: [51, 65, 85],
      indent: 3,
      spaceAfter: 1,
    });
    writeWrapped(`Campi: ${tab.fields.join(' | ')}`, {
      size: 8.5,
      color: [71, 85, 105],
      indent: 3,
      spaceAfter: 1,
    });
    writeWrapped(`Media: ${tab.mediaNote} | Regola: ${tab.publishRule}`, {
      size: 8.5,
      color: [71, 85, 105],
      indent: 3,
      spaceAfter: 3.5,
    });
  }

  // --- Appendice B: Checklist ---
  ensureSpace(35);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  writeWrapped('APPENDICE B - Checklist Operativa di Manutenzione', {
    size: 13,
    bold: true,
    color: [15, 23, 42],
    spaceAfter: 3,
  });

  for (const item of payload.checklist) {
    writeWrapped(`[ ] [${item.cadence} - ${item.role}] ${item.title}`, {
      size: 9.5,
      bold: true,
      color: [15, 23, 42],
      indent: 2,
      spaceAfter: 0.8,
    });
    writeWrapped(item.instruction, {
      size: 9,
      color: [51, 65, 85],
      indent: 6,
      spaceAfter: 2.2,
    });
  }

  // Numerazione pagine su tutte le pagine
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Manuale Amministratore - www.ninjutsuacademy.top - ASD Ninjutsu Academy Grottaglie',
      margin,
      pageHeight - 10
    );
    doc.text(
      `Pagina ${p} / ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  const arrayBuffer = doc.output('arraybuffer');
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes], { type: 'application/pdf' });

  return { blob, bytes, pageCount };
}

export type RoleAccess = 'Maestro' | 'Super Admin';
export type RoleFilter = 'all' | 'maestro' | 'super_admin';
export type ChapterCategory = 'access' | 'editor' | 'operations' | 'cloud';

export interface ManualStep {
  title: string;
  detail: string;
  uiControl?: string;
}

export interface ManualWarning {
  severity: 'Attenzione' | 'Bloccante' | 'Buona Pratica';
  title: string;
  description: string;
}

export interface ManualChapter {
  id: string;
  number: string;
  category: ChapterCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  goal: string;
  panelPath: string;
  outcome: string;
  requiredRole: RoleAccess;
  readMinutes: number;
  keywords: string[];
  steps: ManualStep[];
  warnings: ManualWarning[];
  showRoleMatrix?: boolean;
  showEditorTabs?: boolean;
  editorTabFocusId?: string;
  showFirestoreSimulator?: boolean;
  showTroubleshooting?: boolean;
}

export interface EditorTabSpec {
  id: string;
  order: string;
  label: string;
  requiredRole: RoleAccess;
  firestoreTarget: string;
  purpose: string;
  fields: string[];
  mediaNote: string;
  publishRule: string;
}

export interface RolePermissionRow {
  roleKey: string;
  displayLabel: string;
  authSource: string;
  publicSite: string;
  tutorialArea: string;
  siteEditor: string;
  studentsBookings: string;
  multiTenant: string;
}

export interface TroubleshootingRow {
  code: string;
  symptom: string;
  cause: string;
  resolution: string;
}

export interface ChecklistItem {
  id: string;
  cadence: 'Giornaliera' | 'Settimanale' | 'Mensile';
  role: RoleAccess;
  title: string;
  instruction: string;
}

export const CATEGORY_LABELS: Record<ChapterCategory, string> = {
  access: 'Fondamenti & Accesso',
  editor: 'Editor Sito (14 Schede)',
  operations: 'Allievi & Prenotazioni',
  cloud: 'Media, Cloud & Backup',
};

export const ROLE_MATRIX: RolePermissionRow[] = [
  {
    roleKey: 'super_admin',
    displayLabel: 'Super Admin',
    authSource: 'Google Sign-In autorizzato a livello globale',
    publicSite: 'Accesso completo e anteprima live',
    tutorialArea: 'Accesso illimitato + pubblicazione video',
    siteEditor: 'Tutte le 14 schede su ogni Dojo',
    studentsBookings: 'Approva allievi, blocca profili, gestisce prenotazioni',
    multiTenant: 'Crea nuovi Dojo, cambia sede attiva, assegna Maestri',
  },
  {
    roleKey: 'isTenantAdmin',
    displayLabel: 'Maestro (Admin Dojo)',
    authSource: 'tenantRoles[dojoId] = admin',
    publicSite: 'Accesso completo + pulsanti Modifica contestuali',
    tutorialArea: 'Carica, modifica ed elimina video tutorial',
    siteEditor: 'Tutte le 14 schede del proprio Dojo',
    studentsBookings: 'Approva iscrizioni, assegna gradi Kyu, gestisce prove',
    multiTenant: 'Opera esclusivamente sul proprio Dojo assegnato',
  },
  {
    roleKey: 'isApprovedStudent',
    displayLabel: 'Allievo Approvato',
    authSource: 'Google Sign-In + isApproved: true',
    publicSite: 'Consultazione pubblica e prenotazione stage',
    tutorialArea: 'Visione video tutorial sbloccati per grado Kyu',
    siteEditor: 'Nessun accesso',
    studentsBookings: 'Sola visualizzazione del proprio profilo e grado',
    multiTenant: 'Solo Dojo di appartenenza',
  },
  {
    roleKey: 'suspended',
    displayLabel: 'Utente Sospeso / Bloccato',
    authSource: 'isBlocked: true o status: suspended',
    publicSite: 'Sola navigazione pubblica',
    tutorialArea: 'Accesso revocato con visualizzazione motivo blocco',
    siteEditor: 'Nessun accesso',
    studentsBookings: 'Accesso inibito',
    multiTenant: 'Nessun accesso operativo',
  },
];

export const EDITOR_TABS: EditorTabSpec[] = [
  {
    id: 'brand',
    order: '01',
    label: 'Brand & Navbar',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site',
    purpose: 'Configura identità visiva, logo ufficiale nella barra superiore, nome della scuola e sottotitolo di affiliazione.',
    fields: [
      'Logo ufficiale dell’Accademia (caricamento su Firebase Storage)',
      'Nome scuola (es. ASD NINJUTSU ACADEMY)',
      'Sottotitolo affiliazione (es. Grottaglie · Affiliata CSEN)',
      'Etichette voci di navigazione e pulsante CTA rapido',
    ],
    mediaNote: 'Usa PNG trasparente o WebP quadrato (max 250 KB) per evitare ritardi nella barra superiore.',
    publishRule: 'Premere Salva Modifiche: l’aggiornamento si propaga istantaneamente su Cloud Firestore.',
  },
  {
    id: 'hero',
    order: '02',
    label: 'Home / Hero',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione hero)',
    purpose: 'Gestisce la testata principale della home page, il messaggio di benvenuto, l’immagine ufficiale e i 4 riquadri informativi.',
    fields: [
      'Badge superiore (es. ASD Ninjutsu Academy · Grottaglie · CSEN & CONI)',
      'Titolo principale H1 e sottotitolo descrittivo',
      'Immagine ufficiale della testata + didascalia kanji (武神館)',
      '4 schede sintetiche (9 Scuole Storiche, Dai 6 ai 65+ Anni, Mattina & Sera, CSEN / CONI)',
    ],
    mediaNote: 'Preferire immagini 4:3 o 16:9 caricate via Galleria / Firebase Storage invece di stringhe Base64.',
    publishRule: 'Modificabile anche direttamente dalla home tramite il pulsante "Modifica Sezione Hero & Immagine (Pannello Maestro)".',
  },
  {
    id: 'about',
    order: '03',
    label: 'Chi Siamo & Scuole',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione about)',
    purpose: 'Aggiorna storia del Ninjutsu, metodologia educativa, biografia degli istruttori CSEN (M° Leo Caleandro) e i 9 Ryu-ha storici.',
    fields: [
      'Introduzione e testi dei 4 tab informativi (Origine Shinobi, Metodologia, Istruttori, 9 Ryu-ha)',
      'Foto del tatami e didascalia "Taijutsu: l’arte del corpo"',
      'Profilo tecnico e qualifiche CONI / CSEN del Maestro',
    ],
    mediaNote: 'Le foto verticali o 4:3 del dojo devono essere compresse prima del caricamento.',
    publishRule: 'Verifica il contrasto del testo didascalia sopra la fotografia dopo il salvataggio.',
  },
  {
    id: 'courses',
    order: '04',
    label: 'Corsi',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (array courses)',
    purpose: 'Aggiunge, modifica o rimuove i corsi ufficiali del Dojo (Gioco Ninja Bambini, Ragazzi, Adulti, Ninja Fitness, Difesa Personale, Tiro con l’Arco).',
    fields: [
      'Titolo corso, carattere giapponese decorativo e fascia di accesso',
      'Categoria filtro (Ninjutsu & Tradizione, Ninja Fitness & Difesa, Tiro con l’Arco)',
      'Descrizione sintetica e lista punti "Cosa imparerai"',
      'Giorni e orari settimanali + immagine dedicata del corso',
    ],
    mediaNote: 'Ogni corso ha una copertina dedicata; se rimossa viene ripristinata l’immagine predefinita.',
    publishRule: 'Usa "Nuovo Corso Academy" per creare una scheda vuota; controlla sempre che la categoria corrisponda ai filtri pubblici.',
  },
  {
    id: 'events',
    order: '05',
    label: 'Eventi & Stage',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (array events)',
    purpose: 'Pubblica seminari di Kobudo, sessioni d’esame Kyu, workshop gratuiti di difesa personale e masterclass regionali.',
    fields: [
      'Titolo evento e categoria (Stage Tecnico, Esami Kyu, Difesa Personale, Seminario Armi)',
      'Data, fascia oraria (es. 09:30 – 13:00) e sede esatta',
      'Badge destinatari, dettagli quota/attrezzatura e descrizione tecnica',
    ],
    mediaNote: 'Rimuovi o aggiorna regolarmente gli eventi passati per mantenere il calendario credibile.',
    publishRule: 'Il pulsante "Elimina questo evento" rimuove subito la scheda dal calendario pubblico dopo il salvataggio.',
  },
  {
    id: 'program',
    order: '06',
    label: 'Programma Kyu',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione program)',
    purpose: 'Gestisce i requisiti tecnici ufficiali dal 9° Kyu (Cintura Gialla) al 1° Kyu (Cintura Marrone 2 Stelle) e il PDF federale scaricabile.',
    fields: [
      'Titolo sezione e note didattiche del M° Leo Caleandro',
      'Elenco tecniche per ogni livello (9° Kyu -> 1° Kyu)',
      'Regole d’esame annuali (max 2 passaggi Kyu all’anno)',
      'URL o file PDF del Programma Tecnico Completo',
    ],
    mediaNote: 'Carica il PDF ufficiale aggiornato per assicurarti che il pulsante "Scarica PDF Programma Completo" funzioni sempre.',
    publishRule: 'Controlla l’allineamento tra i nomi dei gradi qui definiti e le cinture assegnabili agli allievi in Area Riservata.',
  },
  {
    id: 'certifications',
    order: '07',
    label: 'Certificazioni CSEN',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione certifications)',
    purpose: 'Espone i riconoscimenti ufficiali CSEN (n. 42887), l’iscrizione al Registro CONI e la certificazione sanitaria BLS-D & Dojo Cardio-Protetto.',
    fields: [
      'Numero di affiliazione CSEN e codice albo CONI',
      'Descrizione abilitazione sanitaria BLS-D e defibrillatore in sede',
      'Link esterno di verifica su www.csen.it',
    ],
    mediaNote: 'Evita documenti sensibili personali nelle immagini pubbliche dei diplomi.',
    publishRule: 'Aggiorna annualmente l’anno di rinnovo dell’affiliazione sportiva.',
  },
  {
    id: 'schedule',
    order: '08',
    label: 'Orari & Sede',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione schedule)',
    purpose: 'Centralizza indirizzo (Via Pacinotti 19, Grottaglie), coordinate GPS, turni mattina/sera, avviso weekend e recapiti WhatsApp/telefono.',
    fields: [
      'Tabella turni giornalieri (Lunedì–Venerdì, mattina 08:00–10:00 e sera 17:00–22:00)',
      'Avviso weekend (Sabato e Domenica riservati a seminari/chiuso al pubblico)',
      'Numero WhatsApp / Telefono (329 428 8782), Email (academyninjutsu@gmail.com)',
      'Coordinate geografiche e link Google Maps',
    ],
    mediaNote: 'Non cambiare il formato numerico del telefono (senza spazi extra nel link tel:/wa.me).',
    publishRule: 'Se modifichi l’orario di un corso nella scheda Corsi, ricordati di allineare anche questa tabella riepilogativa.',
  },
  {
    id: 'philosophy',
    order: '09',
    label: 'Filosofia Godai',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione philosophy)',
    purpose: 'Cura i testi dei Cinque Elementi (Chi Terra, Sui Acqua, Ka Fuoco, Fu Vento, Ku Vuoto) e la citazione tradizionale del Dojo.',
    fields: [
      'Descrizione dei 5 elementi e ideogrammi kanji (地, 水, 火, 風, 空)',
      'Citazione centrale e attribuzione della scuola',
    ],
    mediaNote: 'Contenuto puramente testuale ad alto impatto visivo.',
    publishRule: 'Mantieni testi concisi (2–3 righe per elemento) per non sbilanciare la griglia su desktop.',
  },
  {
    id: 'faq',
    order: '10',
    label: 'FAQ',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (array faq)',
    purpose: 'Aggiunge, modifica o elimina le risposte alle domande frequenti di principianti, genitori e praticanti sul tatami.',
    fields: [
      'Domanda (visibile nella barra espandibile)',
      'Risposta dettagliata (es. abbigliamento, sicurezza bambini, documenti iscrizione)',
    ],
    mediaNote: 'Nessun media richiesto.',
    publishRule: 'Usa il pulsante "Elimina questa FAQ" per rimuovere domande obsolete; non lasciare voci con domanda vuota.',
  },
  {
    id: 'sponsors',
    order: '11',
    label: 'Sponsor & Social',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sponsors & socials)',
    purpose: 'Gestisce i partner locali (Main Partner, Partner Tecnico, Convenzione) con i relativi loghi e i 5 canali social ufficiali del Dojo.',
    fields: [
      'Nome sponsor, livello (Main Partner / Partner Tecnico / Convenzione) e descrizione sconto',
      'Logo sponsor su Firebase Storage e URL sito partner',
      'Link Instagram, Facebook, YouTube, TikTok e WhatsApp diretto',
    ],
    mediaNote: 'Quando rimuovi un logo sponsor, il pannello consente di cancellare il file da Firebase Storage per non sprecare spazio.',
    publishRule: 'Verifica che ogni URL social inizi con https:// prima di pubblicare.',
  },
  {
    id: 'footer',
    order: '12',
    label: 'Footer',
    requiredRole: 'Maestro',
    firestoreTarget: 'tenants/{dojoId}/config/site (sezione footer)',
    purpose: 'Imposta testo istituzionale a piè di pagina, badge CSEN/CONI, anno di copyright e dominio mostrato in chiusura.',
    fields: [
      'Descrizione associativa ASD e finalità statutarie',
      'Etichette Codice CSEN Ufficiale e Albo CONI',
      'Riga copyright (es. © 2026 Ninjutsu Academy Grottaglie)',
    ],
    mediaNote: 'Usa l’elenco link già sincronizzato con gli anchor ID delle sezioni (#corsi, #orari-dojo).',
    publishRule: 'Aggiornare l’anno di copyright all’inizio di ogni stagione sportiva.',
  },
  {
    id: 'images',
    order: '13',
    label: 'Galleria Immagini',
    requiredRole: 'Maestro',
    firestoreTarget: 'gs://ninjutsuacademy.firebasestorage.app',
    purpose: 'Esplora i file salvati nel bucket Firebase Storage, copia URL diretti e verifica automaticamente se un file è in uso prima di eliminarlo.',
    fields: [
      'Elenco file caricati su Firebase Storage con anteprima e peso in KB/MB',
      'Controllo dipendenze: verifica se l’immagine è usata nel sito o in una videolezione',
      'Azioni: Copia URL Firebase Storage / Elimina definitivamente',
    ],
    mediaNote: 'Se un’immagine è referenziata in una sezione o in un tutorial video, il sistema mostra un avviso esplicito prima dell’eliminazione.',
    publishRule: 'Elimina periodicamente vecchie locandine di stage conclusi per mantenere leggero il bucket.',
  },
  {
    id: 'firestore',
    order: '14',
    label: 'Database & Memoria',
    requiredRole: 'Maestro',
    firestoreTarget: 'localStorage (ninjutsu_fs_policy_) + Cloud Firestore',
    purpose: 'Monitora le quote giornaliere gratuite Spark (50k letture, 20k scritture, 1 GiB), regola cache TTL, converte copertine Base64 ed esporta backup JSON.',
    fields: [
      'Cache TTL in minuti (cacheTtlMinutes: predefinito 15 min, range 1–1440)',
      'Giorni di conservazione record chiusi (retentionDays: 60 gg, range 7–365)',
      'Interruttori: Pulizia automatica al login Admin & Offload automatico Base64 su Storage',
      'Esportazione backup JSON e pulizia manuale record scaduti',
    ],
    mediaNote: 'La funzione autoOffloadBase64OnSave sposta automaticamente le immagini Base64 pesanti dai documenti Firestore a Firebase Storage.',
    publishRule: 'Eseguire sempre un backup JSON prima di lanciare una pulizia massiva dei record completati/annullati.',
  },
];

export const TROUBLESHOOTING_ROWS: TroubleshootingRow[] = [
  {
    code: 'storage/unauthorized',
    symptom: 'Impossibile elencare o caricare file nella scheda Galleria Immagini.',
    cause: 'Sessione Firebase Auth scaduta oppure utente autenticato privo del ruolo Maestro / Super Admin nel tenant attivo.',
    resolution: 'Effettua il logout e rientra con "Accedi" usando l’account Google associato al profilo Maestro; se persiste, chiedi al Super Admin la verifica di tenantRoles.',
  },
  {
    code: 'storage/quota-exceeded',
    symptom: 'Errore durante il caricamento di nuove foto o copertine video.',
    cause: 'Spazio di archiviazione gratuito del bucket Firebase Storage esaurito.',
    resolution: 'Apri la scheda Galleria Immagini, individua file pesanti non referenziati da sezioni o tutorial e rimuovili definitivamente.',
  },
  {
    code: 'storage/object-not-found',
    symptom: 'Avviso durante la cancellazione di un logo sponsor o copertina.',
    cause: 'Il file risultava già assente o precedentemente rimosso da Firebase Storage.',
    resolution: 'Conferma comunque il ripristino del riferimento predefinito nel pannello per pulire il collegamento rotto su Firestore.',
  },
  {
    code: 'Documento Firestore > 1 MiB / Base64',
    symptom: 'Lentezza nel salvataggio di corsi, sponsor o copertine video tutorial.',
    cause: 'Presenza di immagini codificate direttamente in Base64 dentro ai documenti Firestore.',
    resolution: 'Attiva "autoOffloadBase64OnSave" in Database & Memoria e salva nuovamente la scheda per migrare automaticamente i media su Firebase Storage.',
  },
  {
    code: 'Quota Letture Firestore Elevata',
    symptom: 'Consumo rapido delle 50.000 letture giornaliere gratuite.',
    cause: 'Cache TTL troppo bassa o aperture ripetute dell’elenco prenotazioni/allievi.',
    resolution: 'Imposta cacheTtlMinutes tra 15 e 60 minuti in Database & Memoria e archivia le prenotazioni completate oltre i 60 giorni.',
  },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-bookings',
    cadence: 'Giornaliera',
    role: 'Maestro',
    title: 'Verifica nuove Prenotazioni Lezione di Prova',
    instruction: 'Apri "Prenotazioni", contatta via WhatsApp i richiedenti in stato "in attesa" e aggiorna lo stato a "confermata" o "completata".',
  },
  {
    id: 'chk-students',
    cadence: 'Giornaliera',
    role: 'Maestro',
    title: 'Approva richieste iscrizione allievi',
    instruction: 'In "Allievi & Video", controlla eventuali nuove richieste Google Sign-In, assegna il grado Kyu corretto e attiva l’accesso all’Area Tutorial.',
  },
  {
    id: 'chk-events',
    cadence: 'Settimanale',
    role: 'Maestro',
    title: 'Aggiorna calendario Eventi & Stage e orari',
    instruction: 'Verifica nella scheda "Eventi & Stage" che non siano rimasti seminari già trascorsi e controlla eventuali avvisi weekend in "Orari & Sede".',
  },
  {
    id: 'chk-quota',
    cadence: 'Settimanale',
    role: 'Maestro',
    title: 'Controllo salute Database & Memoria',
    instruction: 'Nella scheda "Database & Memoria" verifica letture giornaliere, assenza di payload Base64 pesanti e numero di record scaduti pronti per la pulizia.',
  },
  {
    id: 'chk-backup',
    cadence: 'Mensile',
    role: 'Super Admin',
    title: 'Esportazione Backup JSON completo del Dojo',
    instruction: 'Scarica il file ninjutsu_firestore_backup_<dojoId>_<data>.json prima di eseguire pulizie definitive su prenotazioni e richieste archiviate.',
  },
];

export const MANUAL_CHAPTERS: ManualChapter[] = [
  {
    id: 'accesso-ruoli',
    number: '01',
    category: 'access',
    categoryLabel: 'Fondamenti & Accesso',
    title: 'Accesso Google Sign-In & Gerarchia Ruoli',
    summary: 'Come autenticarsi sul sito ninjutsuacademy.top e quali permessi distinguono Allievi, Maestri e Super Admin.',
    goal: 'Accedere al pannello di gestione con il proprio account Google riconosciuto dal Dojo.',
    panelPath: 'Header in alto a destra -> Pulsante "Accedi"',
    outcome: 'Compaiono il badge ruolo ("Maestro" o "Super Admin") e il pulsante "Modifica Sito".',
    requiredRole: 'Maestro',
    readMinutes: 4,
    keywords: ['accedi', 'google', 'login', 'ruoli', 'super admin', 'maestro', 'allievo', 'sospeso', 'permessi'],
    showRoleMatrix: true,
    steps: [
      {
        title: 'Avvia l’autenticazione dall’header pubblico',
        detail: 'Apri https://www.ninjutsuacademy.top e clicca sul pulsante "Accedi" nell’angolo superiore destro della barra di navigazione.',
        uiControl: 'Accedi',
      },
      {
        title: 'Seleziona l’account Google registrato',
        detail: 'Completa il flusso Google Identity Services (GSI). Il sistema verifica automaticamente il profilo nella raccolta Cloud Firestore "users" e legge i ruoli assegnati per il Dojo attivo.',
        uiControl: 'Google Sign-In',
      },
      {
        title: 'Verifica il badge ruolo attivo',
        detail: 'A login completato, al posto di "Accedi" apparirà la tua etichetta ("Maestro" oppure "Super Admin") insieme al pulsante "Modifica Sito" per aprire il Pannello Amministratore.',
        uiControl: 'Modifica Sito',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Account riconosciuto come "Allievo" invece di "Maestro"',
        description: 'Se hai appena cambiato indirizzo email Google, il nuovo profilo viene creato come allievo standard fino a quando un Super Admin non abilita il ruolo admin sul tenant.',
      },
    ],
  },
  {
    id: 'barra-rapida',
    number: '02',
    category: 'access',
    categoryLabel: 'Fondamenti & Accesso',
    title: 'Barra Rapida & Modifica Contestuale sul Sito',
    summary: 'Come sfruttare i pulsanti rapidi integrati nella pagina pubblica per modificare subito una singola sezione senza cercare tra i menu.',
    goal: 'Aprire il Pannello Maestro direttamente sulla sezione che vuoi aggiornare.',
    panelPath: 'Header "Modifica Sito" oppure pulsanti ambrati inline sulle sezioni',
    outcome: 'Il modale amministratore si apre già posizionato sulla scheda corretta.',
    requiredRole: 'Maestro',
    readMinutes: 3,
    keywords: ['barra', 'modifica sito', 'contestuale', 'hero', 'chi siamo', 'pannello maestro', 'scorciatoie'],
    steps: [
      {
        title: 'Usa i pulsanti contestuali direttamente in pagina',
        detail: 'Quando sei autenticato come Maestro o Super Admin, ogni blocco principale mostra un pulsante dedicato (ad esempio "Modifica Sezione Hero & Immagine (Pannello Maestro)" o "Modifica testi e foto della sezione Chi Siamo").',
        uiControl: 'Modifica Sezione Hero & Immagine',
      },
      {
        title: 'Accedi ai moduli operativi dall’Area Riservata',
        detail: 'Dalla barra interna del pannello puoi passare rapidamente alle viste operative: "Sponsor & Social", "Allievi & Video", "Prenotazioni" e "DB & Memoria".',
        uiControl: 'Allievi & Video · Prenotazioni',
      },
      {
        title: 'Chiudi in sicurezza a fine lavoro',
        detail: 'Prima di chiudere il pannello con l’icona X in alto a destra, assicurati di aver salvato le modifiche e controllato l’eventuale banner verde di conferma.',
        uiControl: 'Chiudi pannello modifica',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Aggiornamento immediato ai visitatori',
        description: 'Ogni salvataggio scrive in modo permanente sul Cloud Database: controlla sempre l’anteprima sul sito subito dopo aver chiuso il pannello.',
      },
    ],
  },
  {
    id: 'multi-dojo',
    number: '03',
    category: 'access',
    categoryLabel: 'Fondamenti & Accesso',
    title: 'Gestione Multi-Dojo & Creazione Sedi',
    summary: 'Funzionalità riservata al Super Admin per amministrare più sedi affiliate, cambiare Dojo attivo e isolare dati e prenotazioni.',
    goal: 'Passare da una sede all’altra o creare un nuovo tenant Dojo indipendente.',
    panelPath: 'Selettore Dojo (Super Admin) -> selectTenant / createTenant',
    outcome: 'Tutti i contenuti, gli allievi e le prenotazioni mostrati appartengono alla sede selezionata.',
    requiredRole: 'Super Admin',
    readMinutes: 4,
    keywords: ['super admin', 'tenant', 'multi-dojo', 'sedi', 'grottaglie', 'nuovo dojo'],
    steps: [
      {
        title: 'Apri il selettore sedi',
        detail: 'Con il profilo Super Admin attivo, clicca sul selettore tenant per visualizzare l’elenco completo di tutte le sedi configurate in "allTenants".',
        uiControl: 'Selettore Dojo',
      },
      {
        title: 'Cambia sede o crea un nuovo Dojo',
        detail: 'Seleziona una sede esistente per amministrarne i contenuti, oppure usa la creazione guidata per inizializzare un nuovo spazio isolato su Cloud Firestore.',
        uiControl: 'Nuovo Dojo',
      },
      {
        title: 'Verifica l’isolamento dei dati',
        detail: 'Le prenotazioni ("tenants/{id}/bookings") e le richieste d’iscrizione ("membership_requests") restano rigorosamente separate tra una sede e l’altra.',
        uiControl: 'Verifica Tenant Attivo',
      },
    ],
    warnings: [
      {
        severity: 'Bloccante',
        title: 'Attenzione al Dojo attivo prima di eliminare contenuti',
        description: 'Controlla sempre il nome del Dojo selezionato prima di modificare orari, corsi o fare pulizia record in Database & Memoria.',
      },
    ],
  },
  {
    id: 'editor-brand-hero',
    number: '04',
    category: 'editor',
    categoryLabel: 'Editor Sito (14 Schede)',
    title: 'Schede 01–02: Brand, Navbar & Home Hero',
    summary: 'Guida completa alle prime due schede dell’Editor per personalizzare logo, intestazione del sito, titolo H1, immagine Hero e 4 card statistiche.',
    goal: 'Aggiornare identità della testata, immagine principale e messaggi chiave sopra la piega.',
    panelPath: 'Modifica Sito -> Brand & Navbar / Home / Hero',
    outcome: 'La barra superiore e l’intera prima schermata di ninjutsuacademy.top riflettono i nuovi testi e media.',
    requiredRole: 'Maestro',
    readMinutes: 5,
    keywords: ['brand', 'navbar', 'logo', 'hero', 'home', 'titolo', 'immagine', '14 schede', 'editor'],
    showEditorTabs: true,
    editorTabFocusId: 'brand',
    steps: [
      {
        title: 'Configura Brand & Navbar (Scheda 01)',
        detail: 'Carica il logo ufficiale dell’ASD, verifica che il nome scuola sia leggibile su una sola riga e aggiorna il sottotitolo ("Grottaglie · Affiliata CSEN").',
        uiControl: 'Brand & Navbar',
      },
      {
        title: 'Modifica testi e immagine nella scheda Home / Hero (Scheda 02)',
        detail: 'Aggiorna il titolo principale, la descrizione introduttiva dei corsi e sostituisci la fotografia ufficiale caricandola direttamente su Firebase Storage.',
        uiControl: 'Home / Hero',
      },
      {
        title: 'Aggiorna i 4 riquadri informativi sotto la Hero',
        detail: 'Modifica i quattro box riepilogativi (Scuole Storiche, Fascia d’Età, Orari Mattina & Sera, Affiliazione CSEN/CONI) mantenendo testi brevi e uniformi.',
        uiControl: 'Salva Modifiche',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Mantenere titoli compatti',
        description: 'Evita titoli H1 troppo lunghi per non spingere i pulsanti "Prenota 1ª Lezione Gratuita" sotto il bordo inferiore degli schermi portatili.',
      },
    ],
  },
  {
    id: 'editor-about-philosophy-cert',
    number: '05',
    category: 'editor',
    categoryLabel: 'Editor Sito (14 Schede)',
    title: 'Schede 03, 07 & 09: Chi Siamo, Certificazioni & Godai',
    summary: 'Come aggiornare la storia delle 9 scuole tradizionali, il profilo del Maestro CSEN, le certificazioni CONI/BLS-D e i Cinque Elementi Godai.',
    goal: 'Mantenere aggiornati i contenuti istituzionali, storici e sanitari dell’Accademia.',
    panelPath: 'Modifica Sito -> Chi Siamo & Scuole / Certificazioni CSEN / Filosofia Godai',
    outcome: 'Le sezioni istituzionali mostrano dati federali e didattici verificati.',
    requiredRole: 'Maestro',
    readMinutes: 5,
    keywords: ['chi siamo', 'scuole', 'ryu-ha', 'certificazioni', 'csen', 'coni', 'bls-d', 'godai', 'filosofia'],
    showEditorTabs: true,
    editorTabFocusId: 'about',
    steps: [
      {
        title: 'Aggiorna i 4 pannelli di "Chi Siamo & Scuole"',
        detail: 'Modifica i testi per "L’Origine dello Shinobi", "Metodologia & Valori", "Istruttori & CSEN" e "I 9 Ryu-ha Storici", oltre alla fotografia del tatami.',
        uiControl: 'Chi Siamo & Scuole',
      },
      {
        title: 'Mantieni validi i codici in "Certificazioni CSEN"',
        detail: 'Verifica annualmente il numero di affiliazione CSEN (42887), la presenza nell’Albo CONI, i dettagli BLS-D & Dojo Cardio-Protetto e il link a csen.it.',
        uiControl: 'Certificazioni CSEN',
      },
      {
        title: 'Cura i testi della "Filosofia Godai"',
        detail: 'Rivedi le schede dei 5 elementi (Terra, Acqua, Fuoco, Vento, Vuoto) e la citazione finale della scuola.',
        uiControl: 'Filosofia Godai',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Coerenza dei codici federali',
        description: 'Se aggiorni il numero di affiliazione nella scheda Certificazioni CSEN, ricordati di allineare anche il testo nel Footer.',
      },
    ],
  },
  {
    id: 'editor-corsi-eventi',
    number: '06',
    category: 'editor',
    categoryLabel: 'Editor Sito (14 Schede)',
    title: 'Schede 04–05: Gestione Corsi & Calendario Eventi',
    summary: 'Come creare nuovi corsi, modificare i 6 corsi ufficiali e pubblicare Stage Tecnici, Esami Kyu e Workshop di Difesa Personale.',
    goal: 'Tenere sempre aggiornata l’offerta formativa e il calendario stagionale del Dojo.',
    panelPath: 'Modifica Sito -> Corsi / Eventi & Stage',
    outcome: 'Le schede pubbliche dei corsi e i filtri del calendario eventi si aggiornano in tempo reale.',
    requiredRole: 'Maestro',
    readMinutes: 6,
    keywords: ['corsi', 'nuovo corso', 'eventi', 'stage', 'esami kyu', 'difesa personale', 'seminario'],
    showEditorTabs: true,
    editorTabFocusId: 'courses',
    steps: [
      {
        title: 'Modifica o crea un corso nella scheda "Corsi"',
        detail: 'Seleziona un corso esistente (es. Gioco Ninja Bambini, Ninjutsu Adulti, Tiro con l’Arco) oppure premi "Nuovo Corso Academy". Compila categoria filtro, punti "Cosa imparerai", orario e foto.',
        uiControl: 'Nuovo Corso Academy',
      },
      {
        title: 'Pubblica seminari ed esami in "Eventi & Stage"',
        detail: 'Inserisci titolo, tipologia (Stage Tecnico, Esami Kyu, Difesa Personale, Seminario Armi), data, fascia oraria, sede e note sulla quota o attrezzatura fornita.',
        uiControl: 'Eventi & Stage',
      },
      {
        title: 'Archivia gli eventi conclusi',
        detail: 'Usa il pulsante "Elimina questo evento" una volta terminato lo stage per evitare che i visitatori vedano date passate.',
        uiControl: 'Elimina questo evento',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Categorie esatte per i filtri pubblici',
        description: 'Verifica sempre la categoria assegnata al corso o all’evento: un refuso impedisce al visitatore di trovarlo tramite i pulsanti filtro sopra la griglia.',
      },
    ],
  },
  {
    id: 'editor-kyu-orari-faq',
    number: '07',
    category: 'editor',
    categoryLabel: 'Editor Sito (14 Schede)',
    title: 'Schede 06, 08 & 10: Programma Kyu, Orari & FAQ',
    summary: 'Aggiornamento della didattica dal 9° al 1° Kyu con PDF allegato, gestione turni settimanali del Dojo e risposte alle domande frequenti.',
    goal: 'Fornire agli allievi programma d’esame aggiornato, orari affidabili e FAQ complete.',
    panelPath: 'Modifica Sito -> Programma Kyu / Orari & Sede / FAQ',
    outcome: 'Il programma tecnico, il PDF scaricabile, i turni del dojo e la sezione FAQ risultano allineati.',
    requiredRole: 'Maestro',
    readMinutes: 5,
    keywords: ['programma kyu', 'cintura', 'pdf', 'orari', 'sede', 'pacinotti', 'weekend', 'faq', 'whatsapp'],
    showEditorTabs: true,
    editorTabFocusId: 'program',
    steps: [
      {
        title: 'Aggiorna tecniche e PDF in "Programma Kyu"',
        detail: 'Seleziona ciascun grado dal 9° Kyu (Gialla) al 1° Kyu (Marrone 2 Stelle) per modificare le tecniche richieste e verifica il link al PDF completo del programma.',
        uiControl: 'Programma Kyu',
      },
      {
        title: 'Modifica turni e recapiti in "Orari & Sede"',
        detail: 'Aggiorna fasce orarie mattina/sera, l’avviso dedicato al weekend ("Modifica avviso del weekend con il Pannello Maestro") e i contatti rapidi (329 428 8782 / academyninjutsu@gmail.com).',
        uiControl: 'Orari & Sede',
      },
      {
        title: 'Gestisci le domande frequenti in "FAQ"',
        detail: 'Aggiungi nuove risposte su documenti d’iscrizione, corso inclusivo o abbigliamento, oppure rimuovi voci obsolete con "Elimina questa FAQ".',
        uiControl: 'Elimina questa FAQ',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Link PDF interrotto',
        description: 'Dopo aver sostituito il PDF del Programma Kyu, clicca su "Scarica PDF Programma Completo" sul sito pubblico per verificare che il download si apra senza errori 404.',
      },
    ],
  },
  {
    id: 'editor-sponsor-social-footer',
    number: '08',
    category: 'editor',
    categoryLabel: 'Editor Sito (14 Schede)',
    title: 'Schede 11–12: Sponsor, Canali Social & Footer',
    summary: 'Come inserire nuovi partner e convenzioni per i tesserati, aggiornare i link ai social ufficiali e gestire i testi istituzionali del piè di pagina.',
    goal: 'Valorizzare gli sponsor del territorio e mantenere corretti tutti i canali ufficiali del Dojo.',
    panelPath: 'Modifica Sito -> Sponsor & Social / Footer',
    outcome: 'Loghi partner, sconti tesserati, icone social e copyright nel footer sono aggiornati e funzionanti.',
    requiredRole: 'Maestro',
    readMinutes: 4,
    keywords: ['sponsor', 'partner', 'convenzioni', 'social', 'instagram', 'youtube', 'tiktok', 'footer', 'copyright'],
    showEditorTabs: true,
    editorTabFocusId: 'sponsors',
    steps: [
      {
        title: 'Gestisci partner e loghi in "Sponsor & Social"',
        detail: 'Aggiungi nome azienda, categoria (Main Partner, Partner Tecnico, Convenzione), descrizione del vantaggio per gli iscritti, URL ufficiale e logo caricato su Firebase Storage.',
        uiControl: 'Sponsor & Social',
      },
      {
        title: 'Rimuovi loghi obsoleti in modo pulito',
        detail: 'Usa "Cancella logo da Firebase Storage e rimuovi dallo sponsor" o "Elimina questo sponsor" per evitare file orfani nello spazio cloud.',
        uiControl: 'Elimina questo sponsor',
      },
      {
        title: 'Aggiorna canali social e testi "Footer"',
        detail: 'Verifica i collegamenti Instagram, Facebook, YouTube, TikTok e WhatsApp, quindi aggiorna nella scheda Footer l’anno di copyright e le diciture CSEN/CONI.',
        uiControl: 'Footer',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Dimensione loghi partner',
        description: 'Carica loghi sponsor su sfondo trasparente o uniforme (formato quadrato o 4:3) per evitare ritagli antiestetici nelle card.',
      },
    ],
  },
  {
    id: 'gestione-allievi',
    number: '09',
    category: 'operations',
    categoryLabel: 'Allievi & Prenotazioni',
    title: 'Approvazione Allievi, Gradi Kyu & Sospensioni',
    summary: 'Come gestire le richieste d’iscrizione al Dojo, promuovere gli allievi dopo gli esami di cintura e sospendere profili non più attivi.',
    goal: 'Controllare chi accede all’Area Riservata e mantenere aggiornato il grado di ogni praticante.',
    panelPath: 'Pannello Admin / Area Tutorial -> Allievi & Video (manage-students)',
    outcome: 'Solo gli allievi approvati accedono ai tutorial riservati al proprio livello Kyu.',
    requiredRole: 'Maestro',
    readMinutes: 5,
    keywords: ['allievi', 'approva', 'iscrizione', 'membership_requests', 'grado', 'kyu', 'cintura', 'sospeso', 'blocca'],
    steps: [
      {
        title: 'Apri la sezione "Allievi & Video"',
        detail: 'Accedi all’Area Riservata o al pulsante "Allievi & Video" nel pannello amministratore per vedere le richieste di iscrizione ("membership_requests") e la lista utenti del Dojo.',
        uiControl: 'Allievi & Video',
      },
      {
        title: 'Approva le richieste e imposta il grado Kyu',
        detail: 'Verifica nome e email dell’allievo, approva la richiesta ("isApproved: true") e assegna la cintura attuale (es. 9° Kyu Gialla, 8° Kyu Arancione, 1° Kyu Marrone o Cintura Nera).',
        uiControl: 'Approva Allievo',
      },
      {
        title: 'Gestisci eventuali sospensioni',
        detail: 'In caso di mancato rinnovo tessera CSEN o certificato medico scaduto, imposta lo stato su sospeso ("isBlocked: true") inserendo una motivazione chiara nel campo "blockedReason".',
        uiControl: 'Sospendi / Blocca Profilo',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Verifica prima di approvare',
        description: 'Controlla sempre l’identità dell’utente Google prima di approvare l’accesso ai contenuti tecnici riservati del Dojo.',
      },
    ],
  },
  {
    id: 'video-tutorial',
    number: '10',
    category: 'operations',
    categoryLabel: 'Allievi & Prenotazioni',
    title: 'Pubblicazione Video Tutorial Riservati',
    summary: 'Come caricare, modificare ed eliminare le videolezioni di Budo Taijutsu e Kobudo riservate agli allievi su Cloud Firestore.',
    goal: 'Arricchire l’Area Riservata con video tutorial catalogati per grado Kyu e con copertine leggere.',
    panelPath: 'Area Tutorial -> Allievi & Video -> Gestione Video',
    outcome: 'Gli allievi approvati visualizzano i video tutorial nella propria area riservata.',
    requiredRole: 'Maestro',
    readMinutes: 5,
    keywords: ['video', 'tutorial', 'area tutorial', 'copertina', 'youtube', 'firestore', 'allievi'],
    steps: [
      {
        title: 'Crea una nuova scheda video su Cloud Firestore',
        detail: 'Nell’area gestione video inserisci titolo della tecnica, grado Kyu di riferimento, descrizione didattica e URL del video (es. YouTube non in elenco o link streaming).',
        uiControl: 'Aggiungi Video Tutorial',
      },
      {
        title: 'Allega la copertina tramite Firebase Storage',
        detail: 'Carica un’immagine di anteprima leggera: il sistema salva solo l’URL di Firebase Storage su Firestore evitando documenti pesanti in Base64.',
        uiControl: 'Carica Copertina',
      },
      {
        title: 'Modifica o elimina videolezioni esistenti',
        detail: 'Usa "Modifica questo video su Cloud Firestore" per aggiornare grado o link, oppure "Elimina questo video da Cloud Firestore" e "Cancella copertina da Firebase Storage" per rimuoverlo.',
        uiControl: 'Modifica video · Elimina video',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Evita video MP4 giganti nel bucket Storage',
        description: 'Per i filmati lunghi preferisci il collegamento YouTube (non in elenco) nelle schede leggere Firestore e usa Firebase Storage solo per le copertine.',
      },
    ],
  },
  {
    id: 'prenotazioni-prova',
    number: '11',
    category: 'operations',
    categoryLabel: 'Allievi & Prenotazioni',
    title: 'Gestione Prenotazioni Lezioni di Prova',
    summary: 'Come consultare le richieste di prima lezione gratuita inviate dal sito, contattare gli interessati e aggiornare lo stato della prova.',
    goal: 'Non perdere nessun nuovo contatto interessato ai corsi del Dojo.',
    panelPath: 'Pannello Admin -> Prenotazioni (manage-bookings)',
    outcome: 'Ogni richiesta di prova ha uno stato tracciato e il contatto viene accolto sul tatami.',
    requiredRole: 'Maestro',
    readMinutes: 4,
    keywords: ['prenotazioni', 'prova gratuita', 'bookings', 'whatsapp', 'completata', 'annullata', 'stato'],
    steps: [
      {
        title: 'Consulta le nuove richieste in "Prenotazioni"',
        detail: 'Apri la vista "Prenotazioni" dal pannello amministratore per vedere nome, recapito telefonico/email, corso scelto (es. Gioco Ninja Bambini, Difesa Personale) e data di invio.',
        uiControl: 'Prenotazioni',
      },
      {
        title: 'Conferma giorno e abbigliamento su WhatsApp',
        detail: 'Contatta il richiedente per confermare la disponibilità del turno scelto e ricorda di portare tuta comoda e certificato/scarpe per gli spostamenti.',
        uiControl: 'Contatta / Conferma',
      },
      {
        title: 'Aggiorna lo stato finale',
        detail: 'A lezione svolta o disdetta, imposta lo stato su "completata" oppure "annullata". I record chiusi verranno poi ripuliti automaticamente trascorsi i giorni di retention configurati.',
        uiControl: 'Segna Completata / Annulla prenotazione',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Retention automatica sui record chiusi',
        description: 'Le prenotazioni segnate come "completata" o "annullata" più vecchie della soglia retentionDays (predefinito 60 giorni) vengono candidate alla pulizia automatica.',
      },
    ],
  },
  {
    id: 'galleria-storage',
    number: '12',
    category: 'cloud',
    categoryLabel: 'Media, Cloud & Backup',
    title: 'Scheda 13: Galleria Immagini & Firebase Storage',
    summary: 'Come gestire in sicurezza i file caricati su Firebase Storage, copiare URL diretti ed evitare di cancellare immagini usate sul sito.',
    goal: 'Mantenere il bucket Storage ordinato e libero da file inutilizzati senza rompere il sito.',
    panelPath: 'Modifica Sito -> Galleria Immagini',
    outcome: 'Ogni asset del sito risiede su Firebase Storage con URL validi e spazio sotto controllo.',
    requiredRole: 'Maestro',
    readMinutes: 4,
    keywords: ['galleria', 'immagini', 'firebase storage', 'bucket', 'url', 'elimina', 'in uso'],
    showEditorTabs: true,
    editorTabFocusId: 'images',
    steps: [
      {
        title: 'Esplora i file nel bucket del Dojo',
        detail: 'Apri la scheda "Galleria Immagini" per caricare l’elenco di tutte le immagini e copertine ospitate in gs://ninjutsuacademy.firebasestorage.app.',
        uiControl: 'Galleria Immagini',
      },
      {
        title: 'Copia l’URL diretto quando ti serve riutilizzare una foto',
        detail: 'Usa "Copia URL Firebase Storage" per incollare il collegamento sicuro dentro un nuovo corso, evento o scheda FAQ senza ricaricare un duplicato.',
        uiControl: 'Copia URL Firebase Storage',
      },
      {
        title: 'Elimina solo file non referenziati',
        detail: 'Prima di cancellare, il pannello controlla se il file è usato in una sezione o in un video tutorial. Se compare l’avviso di utilizzo attivo, annulla o sostituisci prima l’immagine nella scheda corrispondente.',
        uiControl: 'Elimina definitivamente questo file',
      },
    ],
    warnings: [
      {
        severity: 'Bloccante',
        title: 'Eliminazione irreversibile',
        description: 'La rimozione di un file da Firebase Storage è definitiva e non recuperabile dal cestino; controlla sempre l’avviso di utilizzo.',
      },
    ],
  },
  {
    id: 'database-memoria',
    number: '13',
    category: 'cloud',
    categoryLabel: 'Media, Cloud & Backup',
    title: 'Scheda 14: Database, Quote & Cache Firestore',
    summary: 'Come funzionano le quote gratuite giornaliere Cloud Firestore, la cache TTL locale, la pulizia record scaduti e l’offload automatico Base64.',
    goal: 'Far operare ninjutsuacademy.top sempre entro i limiti gratuiti del piano Firebase Spark.',
    panelPath: 'Modifica Sito -> Database & Memoria (o pulsante "DB & Memoria")',
    outcome: 'Letture giornaliere ridotte tramite cache e documenti leggeri senza blocchi Base64.',
    requiredRole: 'Maestro',
    readMinutes: 6,
    keywords: ['database', 'memoria', 'firestore', 'quota', 'cache', 'ttl', 'retention', 'base64', 'offload', 'pulizia'],
    showEditorTabs: true,
    editorTabFocusId: 'firestore',
    showFirestoreSimulator: true,
    steps: [
      {
        title: 'Controlla i contatori di utilizzo giornaliero',
        detail: 'Verifica nella vista "Database & Memoria" la stima di letture (limite 50.000/giorno), scritture (20.000/giorno), cancellazioni (20.000/giorno) e spazio occupato su 1 GiB.',
        uiControl: 'DB & Memoria',
      },
      {
        title: 'Regola Cache TTL e Retention',
        detail: 'Imposta "cacheTtlMinutes" (predefinito 15 minuti) per ridurre le letture ripetute durante la navigazione e "retentionDays" (predefinito 60 giorni) per archiviare/pulire vecchie prenotazioni concluse.',
        uiControl: 'Salva Politica Memoria',
      },
      {
        title: 'Mantieni attivo l’offload automatico Base64',
        detail: 'L’opzione "autoOffloadBase64OnSave" rileva immagini pesanti incollate come Base64 e le sposta su Firebase Storage liberando memoria nei documenti Firestore.',
        uiControl: 'Sposta Base64 su Storage',
      },
    ],
    warnings: [
      {
        severity: 'Attenzione',
        title: 'Pulizia al login Admin',
        description: 'Con "autoPruneOnAdminLogin" attivo, ogni 12 ore al massimo al login di un Maestro vengono ripuliti i record chiusi oltre la soglia di conservazione.',
      },
    ],
  },
  {
    id: 'backup-risoluzione-problemi',
    number: '14',
    category: 'cloud',
    categoryLabel: 'Media, Cloud & Backup',
    title: 'Backup JSON & Risoluzione Problemi Frequenti',
    summary: 'Procedura per esportare una copia JSON completa dei dati del Dojo e tabella diagnostica per gli errori Firebase più comuni.',
    goal: 'Mettere al sicuro i contenuti del sito prima di interventi importanti e risolvere subito eventuali errori.',
    panelPath: 'Database & Memoria -> Esporta Backup JSON',
    outcome: 'Archivio locale JSON scaricato e rapida soluzione autonoma in caso di errori Auth/Storage.',
    requiredRole: 'Super Admin',
    readMinutes: 5,
    keywords: ['backup', 'json', 'esporta', 'errore', 'troubleshooting', 'unauthorized', 'quota', 'risoluzione'],
    showTroubleshooting: true,
    steps: [
      {
        title: 'Scarica il Backup JSON prima di modifiche critiche',
        detail: 'Nella scheda "Database & Memoria", premi il comando di esportazione per salvare sul tuo computer il file ninjutsu_firestore_backup_<dojoId>_<data>.json con configurazione sito, prenotazioni e richieste.',
        uiControl: 'Esporta Backup JSON',
      },
      {
        title: 'Conserva i backup mensili in una cartella sicura',
        detail: 'Archivia il file JSON su Google Drive della segreteria o su disco esterno insieme all’ultimo PDF del Programma Tecnico Kyu.',
        uiControl: 'Archivio Segreteria',
      },
      {
        title: 'Consulta la tabella errori Firebase qui sotto',
        detail: 'In caso di messaggio rosso nel pannello (es. storage/unauthorized o quota-exceeded), confronta il codice nella matrice diagnostica e applica l’azione indicata.',
        uiControl: 'Tabella Diagnostica',
      },
    ],
    warnings: [
      {
        severity: 'Buona Pratica',
        title: 'Mai svuotare cache e record senza backup',
        description: 'Esegui sempre l’esportazione JSON prima di confermare qualsiasi operazione di eliminazione massiva sui record storici.',
      },
    ],
  },
];

"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch {} },
  sget(k) { try { return sessionStorage.getItem(k) } catch { return null } },
  sset(k, v) { try { sessionStorage.setItem(k, v) } catch {} },
};

/* =========================================================
   Copy. Everything visible exists in English and German.
   ========================================================= */
const T = {
  en: {
    skip: "Skip to content", bootKey: "press any key", bootSkip: "skip intro",
    heroComment: "// full-stack developer, cologne",
    h1: ["I build web products.", "From idea to deploy."],
    heroLede: "I trained as an architect, so I care about <strong>structure, details and the people</strong> who use what I build. Today I work across the stack with TypeScript, React, Next.js and Node, and I co-founded <strong>Heldio</strong>, an AI platform for language learning.",
    ctaWork: "See my work", nowOpen: "Open to work", gstBranch: "On branch main, open to work", gstBuild: "Heldio MVP", gstBased: "Cologne", ctaMail: "Copy email", avail: "Open to full-time roles and freelance projects",
    scroll: "scroll to read the source", problems: "0 problems",
    com: { role: "// frontend first", building: "// AI language learning", background: "// plans → pull requests", cat: "// do not wake", awake: "// meow", types: "// optional? no." },
    workMeta: "4 projects", workEyebrow: "// selected work",
    workTitle: 'Things I built <span class="soft">and learned the most from.</span>',
    workIntro: "A product I co-founded, a team project, a client site and a game. Each one taught me something I still use.",
    lsHint: "hover to preview, click to open", closeD: "close", drawing: "line drawing of the interface",
    role: "role", time: "time", context: "context", status: "status",
    live: "Open live site", code: "View source", prev: "previous project", next: "next project",
    aboutMeta: "since 2022", aboutEyebrow: "// about",
    aboutTitle: 'Architect by training. <span class="soft">Developer by choice.</span>',
    aboutBody: `<p>I started in architecture. Designing buildings taught me to think in systems, to care about details and to keep the people who use a space in mind. 3D tools pulled me into software, and I stayed.</p>
<p>Today I'm a <strong><span class="mk">**</span>full-stack developer<span class="mk">**</span></strong> near Cologne. I build web products with TypeScript, React, Next.js and Node, and I'm adding Python and Django on the backend. I co-founded <strong><span class="mk">**</span>Heldio<span class="mk">**</span></strong>, where AI turns a learner's real goal into a personal path.</p>
<p>I like small teams, readable code and products people actually use. I'm at my best when design and engineering sit at the same table.</p>`,
    f1: "languages spoken", f2: "projects shipped", f3: "commits since July",
    reveal: "render image", hide: "show ascii",
    logTitle: 'How I got here, <span class="soft">one commit at a time.</span>',
    revEyebrow: "// pull request #1: hire kamyar", revTitle: '3 approvals. <span class="soft">0 changes requested.</span>',
    approved: "approved these changes", teamProject: "team project", clientProject: "client project",
    stackMeta: "valid json", stackEyebrow: "// stack and services",
    stackTitle: 'What I work with <span class="soft">and where I can help.</span>',
    clickFold: "click ▾ to fold", mon: "Mon", wed: "Wed", fri: "Fri",
    heatNote: "v1 of this site, Jun to Sep 2026", less: "less", more: "more",
    stBest: "best day", stStreak: "day streak", stDays: "active days", commits: "commits", commit1: "commit", on: "on",
    contactMeta: "POST /api/contact", contactEyebrow: "// contact",
    contactTitle: 'Let\'s build <span class="soft">something good.</span>',
    contactIntro: "Looking for a developer for your team or a freelance project? Write me a few lines. I usually answer within a day.",
    where: "Troisdorf, near Cologne",
    namePh: '"Your name"', emailPh: '"you@company.com"', msgPh: '"What are you working on?"',
    privacy: 'I have read the <a href="#">privacy policy</a>',
    formHint: "all fields are required", send: "Run sendMessage()",
    errName: "name: expected at least 2 characters", errEmail: "email: not a valid email address",
    errMsg: "message: expected at least 10 characters", errPrivacy: "privacyAccepted: please confirm the privacy policy",
    outRun: "> sendMessage()", outFail: "✕ 1 problem found. Fix the fields above.", outFails: "problems found. Fix the fields above.",
    outPreview: "This is a design preview, so nothing was sent. On the live site this posts to the Netlify function.",
    footAbout: "Full-stack developer near Cologne. I designed and built this site myself. The cat reviewed it.",
    imprint: "Legal notice", privacyLink: "Privacy policy", build: "build passing",
    pNav: "navigate", pRun: "run", pClose: "close", palPh: "Type a command or search",
    gNav: "Navigate", gAct: "Actions", gLinks: "Links", empty: "No matching command",
    copied: "email copied to clipboard", themeD: "dark", themeL: "light",
    cmd: { work: "Go to work", about: "Go to about", stack: "Go to stack", contact: "Go to contact", top: "Back to top",
      mail: "Copy email", theme: "Toggle theme", lang: "Auf Deutsch wechseln", cat: "Wake the cat", replay: "Replay intro",
      gh: "Open GitHub", li: "Open LinkedIn" },
    meow: "Meow", catSleep: "asleep", catAwake: "awake", catLabel: "Wake the cat", catAwakeLabel: "The cat is awake",
    term: {
      help: "<b>help</b>       this list\n<b>whoami</b>     who is this\n<b>ls</b>         files on this site\n<b>open</b> work   jump to work, about, stack or contact\n<b>projects</b>   what I built\n<b>stack</b>      what I use\n<b>contact</b>    copy my email\n<b>cat</b>        wake the cat\n<b>theme</b>, <b>lang</b>, <b>date</b>, <b>clear</b>",
      whoami: "<b>Kamyar Zamanfar</b>, full-stack developer near Cologne.\nTypeScript, React, Next.js, Node. Co-founder of Heldio.",
      openUsage: "usage: open work | about | stack | contact", copied: "copied", cat: "meow. it is awake now, for a bit.",
      sudo: "[sudo] permission granted. opening contact.ts ...", sudoNo: "nice try. try: sudo hire-kamyar", tryHelp: "type help",
      hint: "type help, or try: sudo hire-kamyar" },
  },
  de: {
    skip: "Zum Inhalt springen", bootKey: "beliebige Taste", bootSkip: "Intro überspringen",
    heroComment: "// full-stack developer, köln",
    h1: ["Ich baue Web-Produkte.", "Von der Idee bis zum Deploy."],
    heroLede: "Ich habe Architektur studiert. Deshalb sind mir <strong>Struktur, Details und die Menschen</strong> wichtig, die nutzen, was ich baue. Heute arbeite ich über den ganzen Stack mit TypeScript, React, Next.js und Node. Außerdem habe ich <strong>Heldio</strong> mitgegründet, eine KI-Plattform zum Sprachenlernen.",
    ctaWork: "Projekte ansehen", nowOpen: "Offen für Jobs", gstBranch: "Auf Branch main, offen für neue Jobs", gstBuild: "Heldio-MVP", gstBased: "Köln", ctaMail: "E-Mail kopieren", avail: "Offen für Festanstellung und Freelance-Projekte",
    scroll: "scrollen, um den Quellcode zu lesen", problems: "0 Probleme",
    com: { role: "// erst Frontend", building: "// KI-Sprachenlernen", background: "// Pläne → Pull Requests", cat: "// nicht wecken", awake: "// miau", types: "// optional? nein." },
    workMeta: "4 Projekte", workEyebrow: "// ausgewählte Projekte",
    workTitle: 'Dinge, die ich gebaut <span class="soft">und am meisten daraus gelernt habe.</span>',
    workIntro: "Ein Produkt, das ich mitgegründet habe, ein Teamprojekt, eine Kundenseite und ein Spiel. Aus jedem habe ich etwas mitgenommen, das ich heute noch nutze.",
    lsHint: "Hover für Vorschau, Klick zum Öffnen", closeD: "schließen", drawing: "Strichzeichnung der Oberfläche",
    role: "Rolle", time: "Dauer", context: "Kontext", status: "Status",
    live: "Live-Seite öffnen", code: "Quellcode ansehen", prev: "vorheriges Projekt", next: "nächstes Projekt",
    aboutMeta: "seit 2022", aboutEyebrow: "// über mich",
    aboutTitle: 'Architekt von Haus aus. <span class="soft">Entwickler aus Überzeugung.</span>',
    aboutBody: `<p>Angefangen habe ich in der Architektur. Gebäude zu entwerfen hat mir beigebracht, in Systemen zu denken, auf Details zu achten und die Menschen im Blick zu behalten, die einen Raum nutzen. Über 3D-Tools bin ich zur Software gekommen und geblieben.</p>
<p>Heute bin ich <strong><span class="mk">**</span>Full-Stack-Entwickler<span class="mk">**</span></strong> in der Nähe von Köln. Ich baue Web-Produkte mit TypeScript, React, Next.js und Node, und im Backend kommen gerade Python und Django dazu. Ich habe <strong><span class="mk">**</span>Heldio<span class="mk">**</span></strong> mitgegründet, wo KI das echte Ziel von Lernenden in einen persönlichen Lernweg verwandelt.</p>
<p>Ich mag kleine Teams, lesbaren Code und Produkte, die Menschen wirklich nutzen. Am besten bin ich, wenn Design und Entwicklung am selben Tisch sitzen.</p>`,
    f1: "Sprachen", f2: "Projekte live", f3: "Commits seit Juli",
    reveal: "Bild rendern", hide: "ASCII zeigen",
    logTitle: 'Wie ich hierher kam, <span class="soft">Commit für Commit.</span>',
    revEyebrow: "// pull request #1: kamyar einstellen", revTitle: '3 Approvals. <span class="soft">0 Änderungswünsche.</span>',
    approved: "hat die Änderungen freigegeben", teamProject: "Teamprojekt", clientProject: "Kundenprojekt",
    stackMeta: "gültiges JSON", stackEyebrow: "// stack und leistungen",
    stackTitle: 'Womit ich arbeite <span class="soft">und wobei ich helfen kann.</span>',
    clickFold: "▾ klicken zum Einklappen", mon: "Mo", wed: "Mi", fri: "Fr",
    heatNote: "v1 dieser Seite, Jun bis Sep 2026", less: "weniger", more: "mehr",
    stBest: "bester Tag", stStreak: "Tage am Stück", stDays: "aktive Tage", commits: "Commits", commit1: "Commit", on: "am",
    contactMeta: "POST /api/contact", contactEyebrow: "// kontakt",
    contactTitle: 'Lass uns <span class="soft">etwas Gutes bauen.</span>',
    contactIntro: "Du suchst einen Entwickler für dein Team oder ein Freelance-Projekt? Schreib mir ein paar Zeilen. Ich antworte meistens innerhalb eines Tages.",
    where: "Troisdorf bei Köln",
    namePh: '"Dein Name"', emailPh: '"du@firma.de"', msgPh: '"Woran arbeitest du gerade?"',
    privacy: 'Ich habe die <a href="#">Datenschutzerklärung</a> gelesen',
    formHint: "alle Felder sind Pflicht", send: "sendMessage() ausführen",
    errName: "name: mindestens 2 Zeichen erwartet", errEmail: "email: keine gültige E-Mail-Adresse",
    errMsg: "message: mindestens 10 Zeichen erwartet", errPrivacy: "privacyAccepted: bitte die Datenschutzerklärung bestätigen",
    outRun: "> sendMessage()", outFail: "✕ 1 Problem gefunden. Bitte die Felder oben prüfen.", outFails: "Probleme gefunden. Bitte die Felder oben prüfen.",
    outPreview: "Das ist eine Design-Vorschau, es wurde nichts gesendet. Auf der Live-Seite geht die Nachricht an die Netlify-Function.",
    footAbout: "Full-Stack-Entwickler bei Köln. Diese Seite habe ich selbst entworfen und gebaut. Die Katze hat sie reviewt.",
    imprint: "Impressum", privacyLink: "Datenschutz", build: "Build erfolgreich",
    pNav: "navigieren", pRun: "ausführen", pClose: "schließen", palPh: "Befehl eingeben oder suchen",
    gNav: "Navigation", gAct: "Aktionen", gLinks: "Links", empty: "Kein passender Befehl",
    copied: "E-Mail in die Zwischenablage kopiert", themeD: "dunkel", themeL: "hell",
    cmd: { work: "Zu den Projekten", about: "Über mich", stack: "Zum Stack", contact: "Zum Kontakt", top: "Nach oben",
      mail: "E-Mail kopieren", theme: "Theme wechseln", lang: "Switch to English", cat: "Katze wecken", replay: "Intro erneut abspielen",
      gh: "GitHub öffnen", li: "LinkedIn öffnen" },
    meow: "Miau", catSleep: "schläft", catAwake: "wach", catLabel: "Katze wecken", catAwakeLabel: "Die Katze ist wach",
    term: {
      help: "<b>help</b>       diese Liste\n<b>whoami</b>     wer ist das\n<b>ls</b>         Dateien dieser Seite\n<b>open</b> work   springt zu work, about, stack oder contact\n<b>projects</b>   was ich gebaut habe\n<b>stack</b>      womit ich arbeite\n<b>contact</b>    E-Mail kopieren\n<b>cat</b>        Katze wecken\n<b>theme</b>, <b>lang</b>, <b>date</b>, <b>clear</b>",
      whoami: "<b>Kamyar Zamanfar</b>, Full-Stack-Entwickler bei Köln.\nTypeScript, React, Next.js, Node. Mitgründer von Heldio.",
      openUsage: "Nutzung: open work | about | stack | contact", copied: "kopiert", cat: "miau. sie ist jetzt wach, für kurz.",
      sudo: "[sudo] Zugriff erlaubt. Öffne contact.ts ...", sudoNo: "netter Versuch. Probier: sudo hire-kamyar", tryHelp: "tippe help",
      hint: "tippe help, oder probier: sudo hire-kamyar" },
  },
};
let lang = store.get("lang") === "de" ? "de" : "en";
const t = (k) => T[lang][k];

/* =========================================================
   Data
   ========================================================= */
const ICON = {
  "TypeScript": "typescript", "JavaScript": "javascript", "React": "react", "Next.js": "nextjs", "Angular": "angular",
  "RxJS": "rxjs", "Tailwind CSS": "tailwindcss", "Sass": "sass", "SCSS": "sass", "HTML": "html5", "CSS": "css3",
  "Node.js": "nodejs", "Node": "nodejs", "NestJS": "nestjs", "PostgreSQL": "postgresql", "Supabase": "supabase",
  "Python": "python", "Django": "django", "Git": "git", "GitHub": "github", "Figma": "figma", "VS Code": "vscode",
};
const INV = new Set(["nextjs", "github"]);
const icon = (n) => ICON[n] ? `<img src="a/stack/${ICON[n]}.svg" alt=""${INV.has(ICON[n]) ? ' class="inv"' : ""} width="14" height="14">` : "";

const PROJECTS = [
  { id: "heldio", art: "heldio", year: "2026", color: "var(--kw)", url: "heldio.app", px: "1440 × 900",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL"],
    links: [["live", "https://heldio.app/"]],
    en: { title: "Heldio", tag: "Language learning that starts from your real goal.",
      desc: "An AI-powered platform for contextual language learning. It turns real goals and personal context into a tailored path with practice, feedback and visible progress.",
      role: "Co-founder, frontend", time: "since 2026", ctx: "own startup", status: "in development",
      n1: ["problem", "Most language courses teach the same path to everyone, whatever the learner actually needs the language for."],
      n2: ["my part", "I lead the product concept, MVP scope and roadmap, and work on the architecture and the frontend of the web platform."] },
    de: { title: "Heldio", tag: "Sprachenlernen, das bei deinem echten Ziel beginnt.",
      desc: "Eine KI-Plattform für kontextbezogenes Sprachenlernen. Sie macht aus echten Zielen und persönlichem Kontext einen Lernweg mit Übung, Feedback und sichtbarem Fortschritt.",
      role: "Mitgründer, Frontend", time: "seit 2026", ctx: "eigenes Startup", status: "in Entwicklung",
      n1: ["problem", "Die meisten Sprachkurse lehren allen denselben Weg, egal wofür jemand die Sprache wirklich braucht."],
      n2: ["mein teil", "Ich verantworte Produktkonzept, MVP-Umfang und Roadmap und arbeite an der Architektur und am Frontend der Web-Plattform."] } },
  { id: "join", art: "join", year: "2026", color: "var(--prop)", url: "join.kamycoding.com", px: "1440 × 740",
    stack: ["Angular", "TypeScript", "SCSS", "Supabase", "RxJS"],
    links: [["live", "https://join.kamycoding.com"], ["code", "https://github.com/kamycoding/join-kanban"]],
    en: { title: "Join", tag: "A Kanban board for teams.",
      desc: "A responsive Kanban app with drag and drop, user accounts, guest access and contact management, built as a team.",
      role: "Frontend developer", time: "5 weeks", ctx: "team project", status: "live",
      n1: ["problem", "A team needs one place to plan tasks and move them through stages without losing track of who does what."],
      n2: ["my part", "I owned contact management: creating, editing, deleting and grouping contacts, the detail views and the validation logic."] },
    de: { title: "Join", tag: "Ein Kanban-Board für Teams.",
      desc: "Eine responsive Kanban-App mit Drag and Drop, Benutzerkonten, Gastzugang und Kontaktverwaltung, im Team gebaut.",
      role: "Frontend-Entwickler", time: "5 Wochen", ctx: "Teamprojekt", status: "live",
      n1: ["problem", "Ein Team braucht einen Ort, an dem es Aufgaben plant und durch Phasen bewegt, ohne den Überblick zu verlieren, wer was macht."],
      n2: ["mein teil", "Ich war für die Kontaktverwaltung zuständig: Kontakte anlegen, bearbeiten, löschen und gruppieren, die Detailansichten und die Validierung."] } },
  { id: "designer-portfolio", art: "designer", year: "2026", color: "var(--str)", url: "sogandasari.com", px: "1440 × 840",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    links: [["live", "https://www.sogandasari.com/"]],
    en: { title: "Designer portfolio", tag: "A portfolio for a UX/UI and product designer.",
      desc: "A personal portfolio that presents projects, design process and product thinking through a clear, modern and visual experience.",
      role: "Frontend developer", time: "4 months", ctx: "client project", status: "live",
      n1: ["goal", "Design work should be easy to explore without losing its personality."],
      n2: ["what I built", "Clear hierarchy, responsive layouts, smooth navigation and purposeful animation with Framer Motion."] },
    de: { title: "Designer-Portfolio", tag: "Ein Portfolio für eine UX/UI- und Produktdesignerin.",
      desc: "Ein persönliches Portfolio, das Projekte, Designprozess und Produktdenken klar, modern und visuell zeigt.",
      role: "Frontend-Entwickler", time: "4 Monate", ctx: "Kundenprojekt", status: "live",
      n1: ["ziel", "Designarbeit soll leicht zu entdecken sein, ohne ihre Persönlichkeit zu verlieren."],
      n2: ["was ich gebaut habe", "Klare Hierarchie, responsive Layouts, flüssige Navigation und gezielte Animationen mit Framer Motion."] } },
  { id: "el-pollo-loco", art: "pollo", year: "2026", color: "var(--num)", url: "elpolloloco.kamycoding.com", px: "720 × 480",
    stack: ["JavaScript", "HTML", "CSS"],
    links: [["live", "https://elpolloloco.kamycoding.com"], ["code", "https://github.com/kamycoding/El-Pollo-Loco"]],
    en: { title: "El Pollo Loco", tag: "A jump-and-run browser game.",
      desc: "Guide Pepe through a desert world, collect coins and Tabasco bottles, and face enemies along the way.",
      role: "Developer", time: "3 weeks", ctx: "solo project", status: "playable",
      n1: ["how it works", "Characters, enemies and game objects are reusable classes. Movement, animation and collisions run in the browser."],
      n2: ["what I learned", "Object-oriented JavaScript, a game loop and keeping state predictable when a lot happens every frame."] },
    de: { title: "El Pollo Loco", tag: "Ein Jump-and-Run-Spiel im Browser.",
      desc: "Führe Pepe durch eine Wüstenwelt, sammle Münzen und Tabasco-Flaschen und stell dich den Gegnern.",
      role: "Entwickler", time: "3 Wochen", ctx: "Soloprojekt", status: "spielbar",
      n1: ["so funktioniert's", "Figuren, Gegner und Spielobjekte sind wiederverwendbare Klassen. Bewegung, Animation und Kollisionen laufen im Browser."],
      n2: ["was ich gelernt habe", "Objektorientiertes JavaScript, eine Game-Loop und vorhersehbarer State, wenn in jedem Frame viel passiert."] } },
];

const COMMITS = [
  { hash: "e4c1a9f", refs: [["head", "HEAD → main"]], head: true, stack: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL"],
    en: { when: "2026 → today", scope: "feat(heldio):", title: "co-found an AI language learning platform", role: "Co-founder & Frontend Developer",
      p: "An AI-powered platform for contextual language learning. I lead the product concept, MVP scope and roadmap, and build the frontend of the responsive web platform.",
      diff: ["+ shaped the MVP from first concept to a working learning loop"] },
    de: { when: "2026 → heute", scope: "feat(heldio):", title: "KI-Plattform zum Sprachenlernen mitgründen", role: "Mitgründer & Frontend-Entwickler",
      p: "Eine KI-Plattform für kontextbezogenes Sprachenlernen. Ich verantworte Produktkonzept, MVP-Umfang und Roadmap und baue das Frontend der responsiven Web-Plattform.",
      diff: ["+ MVP vom ersten Konzept bis zur funktionierenden Lernschleife geformt"] } },
  { hash: "9b27d40", refs: [["br", "training"], ["tag", "frontend-cert"]], stack: ["Angular", "TypeScript", "Supabase", "Python", "Django"],
    en: { when: "ongoing", scope: "feat(developer-akademie):", title: "full-stack and AI software developer training", role: "Developer Akademie",
      p: "Intensive training with team projects, code reviews and real deadlines. Front-end part completed, now working through the backend and AI modules.",
      diff: ["+ front-end certificate, 18 Sep 2026", "+ shipped Join with a team"] },
    de: { when: "laufend", scope: "feat(developer-akademie):", title: "Weiterbildung zum Full-Stack- und KI-Softwareentwickler", role: "Developer Akademie",
      p: "Intensive Weiterbildung mit Teamprojekten, Code-Reviews und echten Deadlines. Der Frontend-Teil ist abgeschlossen, jetzt folgen Backend und KI.",
      diff: ["+ Frontend-Zertifikat, 18.09.2026", "+ Join im Team ausgeliefert"] } },
  { hash: "51f0c3e", refs: [], stack: ["React", "TypeScript"],
    en: { when: "Jun → Nov 2025", scope: "feat(osifyai):", title: "freelance frontend for medical AI software", role: "Freelance Frontend Developer",
      p: "AI software for medical practices. I worked on the design system and the React components behind the patient and doctor dashboards.",
      diff: ["+ reusable React components for patient and doctor dashboards"] },
    de: { when: "Jun → Nov 2025", scope: "feat(osifyai):", title: "Freelance-Frontend für medizinische KI-Software", role: "Freelance Frontend-Entwickler",
      p: "KI-Software für Arztpraxen. Ich habe am Designsystem und an den React-Komponenten für die Patienten- und Ärzte-Dashboards gearbeitet.",
      diff: ["+ wiederverwendbare React-Komponenten für Patienten- und Ärzte-Dashboards"] } },
  { hash: "2a8e6d1", refs: [], stack: [],
    en: { when: "Oct 2022 → Aug 2024", scope: "feat(tarahimo):", title: "co-found a branding startup", role: "Co-founder",
      p: "A branding startup. I looked after the website and the order flows for private and business customers.",
      diff: ["+ website and order forms for B2C and B2B"] },
    de: { when: "Okt 2022 → Aug 2024", scope: "feat(tarahimo):", title: "Branding-Startup mitgründen", role: "Mitgründer",
      p: "Ein Branding-Startup. Ich habe mich um die Website und die Bestellprozesse für Privat- und Geschäftskunden gekümmert.",
      diff: ["+ Website und Bestellformulare für B2C und B2B"] } },
  { hash: "0c0ffee", refs: [["tag", "root"]], stack: [],
    en: { when: "before 2022", scope: "chore:", title: "init, master's degree in architecture", role: "Architecture",
      p: "Floor plans, models and a lot of 3D software. That is where I first wanted to build the tools instead of just using them.", diff: [] },
    de: { when: "vor 2022", scope: "chore:", title: "init, Master in Architektur", role: "Architektur",
      p: "Grundrisse, Modelle und viel 3D-Software. Dort wollte ich zum ersten Mal die Werkzeuge bauen, statt sie nur zu benutzen.", diff: [] } },
];

const REVIEWS = [
  { name: "Max Belich", init: "MB", color: "var(--kw)", role: "Full Stack Developer", ctx: "teamProject",
    en: "Kamyar gave his all throughout the entire project. He invested a great deal of time and energy into moving the project forward, supporting his team, and helping whenever problems arose.",
    de: "Kamyar hat während des gesamten Projekts alles gegeben. Er hat viel Zeit und Energie investiert, um das Projekt voranzubringen, sein Team zu unterstützen und bei Problemen zu helfen." },
  { name: "Tobias Illner", init: "TI", color: "var(--prop)", role: "Full Stack Developer", ctx: "teamProject",
    en: "Kamyar always completed his tasks conscientiously and reliably. He actively offers his help and supports the team. Whenever something is unclear, he asks focused questions.",
    de: "Kamyar hat seine Aufgaben immer gewissenhaft und zuverlässig erledigt. Er bietet aktiv Hilfe an und unterstützt das Team. Wenn etwas unklar ist, stellt er gezielte Fragen." },
  { name: "Sogand Asari", init: "SA", color: "var(--str)", role: "Product Designer", ctx: "clientProject",
    en: "Kamyar created my portfolio website and guided the entire process with great professionalism and care. He was patient, precise, and always focused on finding the right solution for my needs.",
    de: "Kamyar hat meine Portfolio-Website gebaut und den ganzen Prozess mit viel Professionalität und Sorgfalt begleitet. Er war geduldig, präzise und hat immer die richtige Lösung für mich gesucht." },
];

const STACK = {
  frontend: ["TypeScript", "JavaScript", "React", "Next.js", "Angular", "RxJS", "Tailwind CSS", "Sass", "HTML", "CSS"],
  backend: ["Node.js", "NestJS", "PostgreSQL", "Supabase"],
  learning: ["Python", "Django"],
  tools: ["Git", "GitHub", "Figma", "VS Code"],
};

const SERVICES = {
  en: [["frontend()", "Frontend development", "Fast, accessible interfaces in React, Next.js or Angular, built from your design or together with you."],
    ["fullstack()", "Full-stack web apps", "From database to UI: APIs, auth and data with Node, NestJS, PostgreSQL or Supabase."],
    ["mvp()", "MVPs and products", "I help shape scope, roadmap and architecture, then build a first version real users can try."],
    ["fromFigma()", "Design to code", "Careful implementation of Figma designs, with design systems and reusable components."]],
  de: [["frontend()", "Frontend-Entwicklung", "Schnelle, barrierearme Oberflächen mit React, Next.js oder Angular, nach deinem Design oder gemeinsam entworfen."],
    ["fullstack()", "Full-Stack-Web-Apps", "Von der Datenbank bis zur UI: APIs, Auth und Daten mit Node, NestJS, PostgreSQL oder Supabase."],
    ["mvp()", "MVPs und Produkte", "Ich helfe bei Umfang, Roadmap und Architektur und baue eine erste Version, die echte Nutzer testen können."],
    ["fromFigma()", "Design to Code", "Sorgfältige Umsetzung von Figma-Designs, mit Designsystem und wiederverwendbaren Komponenten."]],
};

// Real daily commit counts from kamycoding/portfolio (v1).
const COMMITS_BY_DAY = {
  "2026-07-23": 1, "2026-07-24": 2, "2026-07-25": 4, "2026-07-26": 4, "2026-07-29": 2, "2026-07-30": 1,
  "2026-08-01": 2, "2026-08-03": 3, "2026-08-04": 9, "2026-08-05": 10, "2026-08-06": 9, "2026-08-07": 4,
  "2026-08-08": 11, "2026-08-09": 24, "2026-08-10": 20, "2026-08-11": 23, "2026-08-12": 6,
  "2026-09-15": 5, "2026-09-17": 20, "2026-09-18": 8,
};

/* =========================================================
   The cat. Lies on top of the editors, paws over the edge.
   ========================================================= */
const CAT_SVG = `<svg viewBox="0 0 140 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <text class="zz" x="62" y="20">z</text><text class="zz b" x="71" y="11">z</text>
  <path class="tail" d="M112 66 C123 70 125 84 119 94 C115 101 120 107 127 103"/>
  <g class="body-g">
    <g class="breathe">
      <path class="fill" d="M34 70 C30 52 44 40 66 38 C90 36 112 44 116 62 L117 70 Z"/>
      <path class="stripe" d="M78 41 q4 6 2 12 M90 43 q4 6 1 12 M101 48 q3 5 0 10"/>
    </g>
    <path class="ear" d="M21 37 L23 17 L36 28"/><path class="ear r" d="M43 28 L56 17 L57 37"/>
    <path class="fill" d="M18 46 C14 32 26 25 39 25 C53 25 62 32 60 46 C58 58 48 62 39 62 C28 62 20 58 18 46Z"/>
    <path d="M25.5 22.5 l2.5 5 M53 22.5 l-2.5 5" stroke-width="1.1" opacity=".6"/>
    <g class="shut"><path d="M27 43 q4 3 8 0"/><path d="M43 43 q4 3 8 0"/></g>
    <g class="open"><g class="lidblink">
      <ellipse cx="31" cy="42.5" rx="3.6" ry="3.9" stroke-width="1.3"/><ellipse cx="47" cy="42.5" rx="3.6" ry="3.9" stroke-width="1.3"/>
      <circle class="pupil" cx="31" cy="42.5" r="1.9" fill="var(--str)" stroke="none"/><circle class="pupil" cx="47" cy="42.5" r="1.9" fill="var(--str)" stroke="none"/>
    </g></g>
    <ellipse class="blush" cx="25" cy="51.5" rx="3.2" ry="1.8"/><ellipse class="blush" cx="53" cy="51.5" rx="3.2" ry="1.8"/>
    <path d="M37.4 49 l1.6 1.7 l1.6 -1.7 Z" fill="currentColor" stroke-width="1"/>
    <path d="M39 50.8 q-1.8 2.8 -4 1.4 M39 50.8 q1.8 2.8 4 1.4" stroke-width="1.2"/>
    <path d="M22 50 l-11 -2.5 M22 53 l-11 1.5 M56 50 l11 -2.5 M56 53 l11 1.5" stroke-width="1" opacity=".7"/>
    <path class="fill" d="M29.5 66 C27.5 75 39 77 39.5 67"/><path class="fill" d="M44.5 66 C42.5 75 54 77 54.5 67"/>
    <path d="M32 73 v1.6 M35 73.6 v1.6 M47 73 v1.6 M50 73.6 v1.6" stroke-width="1" opacity=".55"/>
  </g>
</svg>`;
let catAwake = false;
const cats = () => $$(".cat");
function setCatState(awake) {
  catAwake = awake;
  cats().forEach((c) => { c.classList.toggle("awake", awake); c.setAttribute("aria-label", awake ? t("catAwakeLabel") : t("catLabel")) });
  $("#catState").textContent = awake ? t("catAwake") : t("catSleep");
  if (curDoc === "kamyar") { renderCode(); const l = $('#code [data-i="9"]'); if (l && awake) l.classList.add("flash") }
}
function meow(text) {
  $$(".meow").forEach((m) => { m.textContent = text; m.classList.add("show") });
  clearTimeout(meow.t); meow.t = setTimeout(() => $$(".meow").forEach((m) => m.classList.remove("show")), 1800);
}
function wakeCats() {
  cats().forEach((c) => { c.classList.remove("purr", "stretch"); void c.offsetWidth; c.classList.add("stretch") });
  setCatState(true); meow(t("meow"));
  clearTimeout(wakeCats.t);
  wakeCats.t = setTimeout(() => setCatState(false), 7000);
}
function placeMeow(cat, m) {
  const r = parseFloat(getComputedStyle(cat).right), tp = parseFloat(getComputedStyle(cat).top);
  m.style.right = (r + cat.offsetWidth * .62) + "px"; m.style.top = (tp - 6) + "px";
}
cats().forEach((c) => {
  c.innerHTML = CAT_SVG;
  c.addEventListener("click", wakeCats);
  c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); wakeCats() } });
  // a slow hover while it sleeps gets a purr instead of a wake-up
  c.addEventListener("pointerenter", () => { c._p = setTimeout(() => { if (!catAwake) { c.classList.add("purr"); meow("prrr") } }, 650) });
  c.addEventListener("pointerleave", () => { clearTimeout(c._p); c.classList.remove("purr") });
});
const placeAllMeows = () => { placeMeow($("#cat1"), $("#meow1")); placeMeow($("#cat2"), $("#meow2")) };
placeAllMeows();
$("#catStatus").addEventListener("click", wakeCats);
// eyes follow the pointer while awake
let eyeRaf = 0, ex = 0, ey = 0;
addEventListener("pointermove", (e) => {
  ex = e.clientX; ey = e.clientY; if (!catAwake || eyeRaf) return;
  eyeRaf = requestAnimationFrame(() => {
    eyeRaf = 0;
    $$(".cat .pupil").forEach((p) => {
      const r = p.ownerSVGElement.getBoundingClientRect(), k = r.width / 140;
      const cx = r.left + +p.getAttribute("cx") * k, cy = r.top + +p.getAttribute("cy") * k;
      const a = Math.atan2(ey - cy, ex - cx), d = Math.min(1.6, Math.hypot(ex - cx, ey - cy) / 60);
      p.style.transform = `translate(${(Math.cos(a) * d).toFixed(2)}px,${(Math.sin(a) * d).toFixed(2)}px)`;
    });
  });
}, { passive: true });

/* =========================================================
   Hero code panel
   ========================================================= */
const TIPS = {
  role: { sig: "(property) role: string", en: "Started in frontend with React and Next.js, now building end to end with Node and PostgreSQL.", de: "Angefangen im Frontend mit React und Next.js, heute End-to-End mit Node und PostgreSQL." },
  based: { sig: "(property) based: Location", en: "Troisdorf, near Cologne. Remote or on site.", de: "Troisdorf bei Köln. Remote oder vor Ort." },
  stack: { sig: "(property) stack: readonly Tech[]", en: "What I use every day. The full list is in stack.json below.", de: "Was ich täglich nutze. Die ganze Liste steht weiter unten in stack.json." },
  building: { sig: '(property) building: "Heldio"', en: "Co-founder and frontend developer. Goal, plan, practice, feedback.", de: "Mitgründer und Frontend-Entwickler. Ziel, Plan, Übung, Feedback." },
  background: { sig: '(property) background: "Architecture"', en: "Master's in architecture, then co-founded Tarahimo, 2022 to 2024.", de: "Master in Architektur, danach Mitgründer von Tarahimo, 2022 bis 2024." },
  openTo: { sig: "(property) openTo: Role[]", en: "Full-time roles and freelance projects, remote or near Cologne.", de: "Festanstellung und Freelance-Projekte, remote oder rund um Köln." },
  cat: { sig: "(property) cat: Cat", en: "Owns the keyboard. Click the cat above the editor.", de: "Gehört die Tastatur. Klick auf die Katze über dem Editor." },
};
let curDoc = "kamyar";
function typesLines() {
  return [
    `<span class="kw">export type</span> Cat <span class="pun">=</span> { status<span class="pun">:</span> <span class="str">"asleep"</span> <span class="pun">|</span> <span class="str">"awake"</span> }`,
    ``,
    `<span class="kw">export interface</span> Developer {`,
    `  <span class="prop">role</span><span class="pun">:</span> <span class="kw">string</span>`,
    `  <span class="prop">based</span><span class="pun">:</span> <span class="kw">string</span>`,
    `  <span class="prop">stack</span><span class="pun">:</span> <span class="kw">readonly</span> <span class="kw">string</span>[]`,
    `  <span class="prop">building</span><span class="pun">:</span> <span class="kw">string</span>  <span class="com">${t("com").types}</span>`,
    `  <span class="prop">background</span><span class="pun">:</span> <span class="kw">string</span>`,
    `  <span class="prop">openTo</span><span class="pun">:</span> (<span class="str">"full-time"</span> <span class="pun">|</span> <span class="str">"freelance"</span>)[]`,
    `  <span class="prop">cat</span><span class="pun">:</span> Cat`,
    `}`,
  ];
}
function codeLines() {
  if (curDoc === "types") return typesLines();
  const c = t("com"), p = (k) => `<span class="prop hov" data-tip="${k}" tabindex="0">${k}</span>`;
  return [
    `<span class="kw">import</span> <span class="kw">type</span> { Developer } <span class="kw">from</span> <span class="str">"@/types"</span>`,
    ``,
    `<span class="kw">export const</span> kamyar <span class="pun">=</span> {`,
    `  ${p("role")}<span class="pun">:</span> <span class="str">"Full-stack developer"</span>,  <span class="com">${c.role}</span>`,
    `  ${p("based")}<span class="pun">:</span> <span class="str">"Cologne, DE"</span>,`,
    `  ${p("stack")}<span class="pun">:</span> [<span class="str">"TypeScript"</span>, <span class="str">"React"</span>, <span class="str">"Next.js"</span>, <span class="str">"Node"</span>],`,
    `  ${p("building")}<span class="pun">:</span> <span class="str">"Heldio"</span>,  <span class="com">${c.building}</span>`,
    `  ${p("background")}<span class="pun">:</span> <span class="str">"Architecture"</span>,  <span class="com">${c.background}</span>`,
    `  ${p("openTo")}<span class="pun">:</span> [<span class="str">"full-time"</span>, <span class="str">"freelance"</span>],`,
    `  ${p("cat")}<span class="pun">:</span> { status<span class="pun">:</span> <span class="str">"${catAwake ? "awake" : "asleep"}"</span> },  <span class="com">${catAwake ? c.awake : c.cat}</span>`,
    `} <span class="kw">satisfies</span> Developer`,
  ];
}
const code = $("#code");
const lineHTML = (l, i) => `<div class="line" data-i="${i}"><span class="n">${i + 1}</span><span>${l || " "}</span></div>`;
const CARET = '<span class="cc" aria-hidden="true"></span>';
function renderCode() { const ls = codeLines(); ls[ls.length - 1] += CARET; code.innerHTML = ls.map(lineHTML).join("") }
function typeCode() {
  if (reduce) { renderCode(); return }
  const ls = codeLines(); ls[ls.length - 1] += CARET; code.innerHTML = "";
  ls.forEach((l, i) => setTimeout(() => {
    code.insertAdjacentHTML("beforeend", lineHTML(l, i));
    const el = code.lastElementChild; el.style.opacity = 0;
    requestAnimationFrame(() => { el.style.transition = "opacity .3s"; el.style.opacity = 1 });
  }, 380 + i * 60));
}
$$(".ed-head [data-doc]").forEach((tb) => tb.addEventListener("click", () => {
  curDoc = tb.dataset.doc;
  $$(".ed-head [data-doc]").forEach((x) => { const on = x === tb; x.classList.toggle("on", on); x.setAttribute("aria-selected", on) });
  $("#edPath").textContent = curDoc === "types" ? "src/types/index.ts" : "src/people/kamyar.ts";
  code.setAttribute("aria-label", curDoc + ".ts"); renderCode();
}));
const tip = $("#tip"), heroEd = $("#heroEd");
function showTip(h) {
  const d = TIPS[h.dataset.tip]; tip.innerHTML = `<div class="sig">${d.sig}</div>${d[lang]}`;
  const er = heroEd.getBoundingClientRect(), r = h.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(r.left - er.left, er.width - 310)) + "px";
  tip.style.top = (r.bottom - er.top + 8) + "px"; tip.classList.add("show");
}
code.addEventListener("mouseover", (e) => { const h = e.target.closest(".hov"); if (h) showTip(h) });
code.addEventListener("mouseout", (e) => { if (e.target.closest(".hov")) tip.classList.remove("show") });
code.addEventListener("focusin", (e) => { const h = e.target.closest(".hov"); if (h) showTip(h) });
code.addEventListener("focusout", () => tip.classList.remove("show"));
code.addEventListener("mousemove", (e) => {
  const l = e.target.closest(".line"); if (!l) return;
  const col = Math.max(1, Math.round((e.clientX - l.getBoundingClientRect().left - 46) / 8.1));
  $("#cursorPos").textContent = `Ln ${+l.dataset.i + 1}, Col ${col}`;
});

/* headline: typed once after the intro, instant afterwards */
let typing = 0;
function setHeadline(animate) {
  const [a, b] = t("h1"), v = $("#h1v"); $("#h1sr").textContent = `${a} ${b}`;
  clearTimeout(typing);
  if (!animate || reduce) { v.innerHTML = `${a}<br><span class="soft">${b}</span><span class="caret"></span>`; return }
  let i = 0; const total = a.length + b.length;
  (function step() {
    const x = a.slice(0, Math.min(i, a.length)), y = i > a.length ? b.slice(0, i - a.length) : "";
    v.innerHTML = `${x}${i >= a.length ? "<br>" : ""}<span class="soft">${y}</span><span class="caret"></span>`;
    if (i++ < total) typing = setTimeout(step, i === a.length + 1 ? 260 : 26 + Math.random() * 34);
  })();
}

/* the dot grid lights up under the pointer, and the editor leans toward it a little */
(function () {
  const sec = $("#index"), ed = $("#heroEd"); let raf = 0, ev = null;
  if (reduce) return;
  sec.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return; ev = e; if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; const r = sec.getBoundingClientRect();
      sec.style.setProperty("--mx", (ev.clientX - r.left) + "px"); sec.style.setProperty("--my", (ev.clientY - r.top) + "px");
      if (innerWidth > 980) {
        const er = ed.getBoundingClientRect(), dx = (ev.clientX - (er.left + er.width / 2)) / innerWidth, dy = (ev.clientY - (er.top + er.height / 2)) / innerHeight;
        ed.style.setProperty("--ry", (dx * 5).toFixed(2) + "deg"); ed.style.setProperty("--rx", (-dy * 4).toFixed(2) + "deg");
      }
    });
  });
  sec.addEventListener("pointerleave", () => { sec.style.setProperty("--mx", "-999px"); ed.style.setProperty("--rx", "0deg"); ed.style.setProperty("--ry", "0deg") });
})();

/* Cursor: a dot that sits exactly on the pointer, and a ring that follows a little behind.
   Links grow the ring and say what a click does; text turns it into a caret. */
(function () {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = $("#cur"), ring = $(".mcur-ring", el), dot = $(".mcur-dot", el), label = $(".mcur-label", el);
  let x = -100, y = -100, rx = -100, ry = -100, on = false;
  document.documentElement.classList.add("has-cur");
  const LBL = () => ({ open: lang === "de" ? "öffnen" : "open", copy: lang === "de" ? "kopieren" : "copy", pet: lang === "de" ? "streicheln" : "pet", go: "go", ext: "↗", run: "run", fold: "fold" });
  function kind(t) {
    if (t.closest("input:not([type=checkbox]),textarea,[contenteditable],.tp-body,#code .line")) return ["text"];
    const c = t.closest(".cat"); if (c) return ["link", LBL().pet];
    const a = t.closest("a,button,[role=button],[role=option],label.check,.cell,.tg");
    if (!a) return [""];
    if (a.matches("#copyMail")) return ["link", LBL().copy];
    if (a.matches(".run")) return ["link", LBL().run];
    if (a.matches(".row button")) return ["link", LBL().open];
    if (a.matches("a[target=_blank]")) return ["link", LBL().ext];
    if (a.matches(".tg")) return ["link", LBL().fold];
    if (a.matches("a[href^='#']")) return ["link", LBL().go];
    return ["link", ""];
  }
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    if (!on) { on = true; rx = x; ry = y; el.classList.remove("hidden") }
    const [k, l] = kind(e.target);
    el.classList.toggle("link", k === "link"); el.classList.toggle("text", k === "text");
    if (k === "link") label.textContent = l || ""; 
  }, { passive: true });
  addEventListener("pointerdown", () => el.classList.add("down"));
  addEventListener("pointerup", () => el.classList.remove("down"));
  document.addEventListener("mouseleave", () => { on = false; el.classList.add("hidden") });
  (function loop() {
    const k = reduce ? 1 : .2; rx += (x - rx) * k; ry += (y - ry) * k;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
    requestAnimationFrame(loop);
  })();
})();

/* ticker */
(function () {
  const items = ["TypeScript", "React", "Next.js", "Node.js", "NestJS", "PostgreSQL", "Angular", "Tailwind CSS", "Supabase", "Python", "Django", "Figma", "Git"];
  const one = items.map((n) => `<span>${icon(n)}${n}</span>`).join("");
  $("#ticker").innerHTML = one + one;
})();

/* =========================================================
   Work: ls -la rows, a preview that follows the pointer, a peek drawer
   ========================================================= */
let current = 0;
// One cover, used in the list, the hover preview and the drawer, so every project is framed the same way.
function coverHTML(p, alt) {
  const d = p[lang];
  return `<div class="cover" style="--c:${p.color}">
    <span class="cv-mark tl"></span><span class="cv-mark tr"></span><span class="cv-mark bl"></span><span class="cv-mark br"></span>
    <span class="cv-label"><i></i>~/projects/${p.id}</span><span class="cv-status">${d.status}</span>
    <span class="cv-dim"><span>${p.px}</span></span>
    <div class="cv-win"><div class="cv-bar"><span class="cv-dots"><i></i><i></i><i></i></span>
      <span class="cv-url"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4.5" width="6" height="4.5" rx="1"/><path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5"/></svg>${p.url}</span><span style="width:24px"></span></div>
      <svg class="art" viewBox="0 0 640 360" preserveAspectRatio="xMidYMin meet" ${alt ? `role="img" aria-label="${d.title}, ${t("drawing")}"` : 'aria-hidden="true"'}>${ART[p.art]}</svg></div>
  </div>`;
}
function renderRows() {
  $("#projRows").innerHTML = PROJECTS.map((p, i) => {
    const d = p[lang];
    return `<li class="row" style="--c:${p.color}"><button data-i="${i}" aria-haspopup="dialog">
      <span class="perm">drwxr-xr-x</span>
      <span class="name">${p.id}<i>/</i></span>
      <span class="what"><b>${d.ctx}, ${p.year}</b>${d.tag}</span>
      <span class="meta"><span class="icons">${p.stack.slice(0, 4).map(icon).join("")}</span><span class="st">${d.status}</span></span>
      <span class="go" aria-hidden="true">→</span>
      <span class="thumb">${coverHTML(p, false)}</span>
    </button></li>`;
  }).join("");
}
const hprev = $("#hprev");
let px = 0, py = 0, tx = 0, ty = 0, hRaf = 0;
function followPrev() {
  // eased follow, so the card trails the pointer a little
  px += (tx - px) * .16; py += (ty - py) * .16;
  hprev.style.transform = `translate3d(${px}px,${py}px,0)`;
  if (hprev.classList.contains("show")) hRaf = requestAnimationFrame(followPrev);
}
$("#projRows").addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  const b = e.target.closest("button[data-i]"); if (!b) return;
  const p = PROJECTS[+b.dataset.i];
  if (hprev.dataset.id !== p.id) { hprev.dataset.id = p.id; hprev.innerHTML = coverHTML(p, false) }
  tx = Math.min(innerWidth - 360, e.clientX + 28); ty = Math.min(innerHeight - 260, Math.max(90, e.clientY - 110));
  if (!hprev.classList.contains("show")) { px = tx; py = ty; hprev.classList.add("show"); cancelAnimationFrame(hRaf); hRaf = requestAnimationFrame(followPrev) }
});
$("#projRows").addEventListener("pointerleave", () => hprev.classList.remove("show"));
$("#projRows").addEventListener("click", (e) => { const b = e.target.closest("button[data-i]"); if (b) { hprev.classList.remove("show"); openDrawer(+b.dataset.i, b) } });
$("#projRows").addEventListener("keydown", (e) => {
  const b = e.target.closest("button[data-i]"); if (!b) return;
  const i = +b.dataset.i, all = $$("#projRows button");
  if (e.key === "ArrowDown") { e.preventDefault(); all[(i + 1) % all.length].focus() }
  if (e.key === "ArrowUp") { e.preventDefault(); all[(i - 1 + all.length) % all.length].focus() }
});

const drawer = $("#drawer"), dpanel = $(".dpanel"); let opener = null;
function renderDrawer(animate) {
  const p = PROJECTS[current], d = p[lang];
  $("#dFile").textContent = `${p.id}/README.md`; $("#dPos").textContent = `${current + 1} / ${PROJECTS.length}`;
  $("#dPrev").setAttribute("aria-label", t("prev")); $("#dNext").setAttribute("aria-label", t("next")); $("#dClose").setAttribute("aria-label", t("closeD"));
  const links = p.links.map(([k, u]) => `<a class="btn${k === "live" ? " primary" : ""}" href="${u}" target="_blank" rel="noopener">${t(k)} ↗</a>`).join("");
  const body = $("#dBody");
  body.innerHTML = `
    ${coverHTML(p, true)}
    <div><h3 class="d-title" id="dTitle">${d.title}. <span>${d.tag}</span></h3><p class="d-desc">${d.desc}</p></div>
    <dl class="kv"><div><dt>${t("role")}</dt><dd>${d.role}</dd></div><div><dt>${t("time")}</dt><dd>${d.time}</dd></div><div><dt>${t("context")}</dt><dd>${d.ctx}</dd></div><div><dt>${t("status")}</dt><dd>${d.status}</dd></div></dl>
    <div class="p-notes"><div><h4>// ${d.n1[0]}</h4><p>${d.n1[1]}</p></div><div><h4>// ${d.n2[0]}</h4><p>${d.n2[1]}</p></div></div>
    <div class="stackrow">${p.stack.map((s) => `<span class="pill">${icon(s)}${s}</span>`).join("")}</div>
    <div class="links">${links}</div>`;
  body.scrollTop = 0;
  if (animate && !reduce) { body.classList.remove("swap"); void body.offsetWidth; body.classList.add("swap") }
}
function openDrawer(i, from) {
  opener = from || document.activeElement; current = i;
  drawer.hidden = false; drawer.classList.remove("closing"); document.body.classList.add("locked");
  renderDrawer(true); dpanel.focus();
}
function closeDrawer() {
  if (drawer.hidden) return;
  const done = () => { drawer.hidden = true; drawer.classList.remove("closing"); document.body.classList.remove("locked"); if (opener) opener.focus() };
  if (reduce) return done();
  drawer.classList.add("closing"); setTimeout(done, 240);
}
function stepDrawer(n) { current = (current + n + PROJECTS.length) % PROJECTS.length; renderDrawer(true) }
drawer.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeDrawer();
  const s = e.target.closest("[data-step]"); if (s) stepDrawer(+s.dataset.step);
});
drawer.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { e.preventDefault(); closeDrawer() }
  else if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); stepDrawer(1) }
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); stepDrawer(-1) }
  else if (e.key === "Tab") {
    // keep focus inside the dialog
    const f = $$("a,button", dpanel), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dpanel)) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
});

/* =========================================================
   About: ascii portrait, git log, reviews
   ========================================================= */
const photo = $("#photo"), frame = $("#frame"), asciiC = $("#ascii");
function drawAscii() {
  if (!photo.complete || !photo.naturalWidth) return;
  const r = frame.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  asciiC.width = r.width * dpr; asciiC.height = r.height * dpr;
  const g = asciiC.getContext("2d"); g.scale(dpr, dpr);
  const cw = 5.4, ch = 8.6, cols = Math.floor(r.width / cw), rows = Math.floor(r.height / ch);
  const s = document.createElement("canvas"); s.width = cols; s.height = rows;
  const sg = s.getContext("2d");
  // cover-fit the photo into the grid
  const ir = photo.naturalWidth / photo.naturalHeight, gr = (cols * cw) / (rows * ch);
  let sw = photo.naturalWidth, sh = photo.naturalHeight, sx = 0, sy = 0;
  if (ir > gr) { sw = sh * gr; sx = (photo.naturalWidth - sw) / 2 } else { sh = sw / gr; sy = (photo.naturalHeight - sh) / 2 }
  sg.drawImage(photo, sx, sy, sw, sh, 0, 0, cols, rows);
  let data; try { data = sg.getImageData(0, 0, cols, rows).data } catch { frame.classList.add("reveal"); return }
  // Stretch the tones first, the grey studio backdrop would otherwise fill the frame with noise.
  const lum = []; for (let i = 0; i < data.length; i += 4) lum.push((data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114) / 255);
  const sorted = [...lum].sort((a, b) => a - b), lo = sorted[Math.floor(sorted.length * .04)], hi = sorted[Math.floor(sorted.length * .985)];
  // A blurred copy gives local contrast, which keeps eyes and beard readable.
  const tiny = document.createElement("canvas"); tiny.width = Math.max(4, cols >> 3); tiny.height = Math.max(4, rows >> 3);
  tiny.getContext("2d").drawImage(s, 0, 0, tiny.width, tiny.height);
  const bc = document.createElement("canvas"); bc.width = cols; bc.height = rows; const bg = bc.getContext("2d");
  bg.imageSmoothingQuality = "high"; bg.drawImage(tiny, 0, 0, cols, rows);
  const bd = bg.getImageData(0, 0, cols, rows).data;
  const ramp = " .'`:-~=+*cxoO0#@";
  g.fillStyle = "#0A0E1A"; g.fillRect(0, 0, r.width, r.height);
  g.font = "500 8.4px 'Geist Mono', monospace"; g.textBaseline = "top";
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const j = y * cols + x, blur = (bd[j * 4] * .299 + bd[j * 4 + 1] * .587 + bd[j * 4 + 2] * .114) / 255;
    const n = Math.min(1, Math.max(0, (lum[j] - lo) / (hi - lo))), loc = Math.min(1, Math.max(0, (lum[j] - blur) * 3 + .5));
    const v = Math.pow(Math.min(1, Math.max(0, n * .6 + (loc - .5) * .9)), 1.4);
    const c = ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))];
    if (c === " ") continue;
    g.fillStyle = `rgba(230,232,238,${(.3 + v * .7).toFixed(2)})`;
    g.fillText(c, x * cw, y * ch);
  }
}
// The photo shows through a lens that follows the pointer.
frame.addEventListener("pointermove", (e) => {
  if (frame.classList.contains("reveal")) return;
  const r = frame.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  const m = `radial-gradient(circle 74px at ${x}px ${y}px, #000 96%, transparent 100%)`;
  photo.style.maskImage = m; photo.style.webkitMaskImage = m; photo.style.opacity = 1;
});
frame.addEventListener("pointerleave", () => { if (!frame.classList.contains("reveal")) photo.style.opacity = 0 });
$("#revealBtn").addEventListener("click", () => {
  const on = frame.classList.toggle("reveal");
  photo.style.maskImage = photo.style.webkitMaskImage = on ? "none" : "";
  photo.style.opacity = on ? 1 : 0;
  $("#revealBtn").textContent = on ? t("hide") : t("reveal");
});
photo.addEventListener("load", drawAscii);

function renderLog() {
  $("#gitlog").innerHTML = COMMITS.map((c) => {
    const d = c[lang];
    const refs = c.refs.map(([k, v]) => `<span class="ref ${k}">${v}</span>`).join("");
    return `<article class="commit${c.head ? " head" : ""}">
      <div class="when">${d.when}</div><div class="rail"><span class="node"></span></div>
      <div class="card"><div class="meta"><span class="hash">${c.hash}</span>${refs}<span class="when-m">${d.when}</span></div>
        <h3><span class="scope">${d.scope}</span>${d.title}</h3><div class="role">${d.role}</div>
        <p>${d.p}</p>${d.diff.length ? `<div class="diff">${d.diff.join("<br>")}</div>` : ""}
        ${c.stack.length ? `<div class="stackrow">${c.stack.map((s) => `<span class="pill">${icon(s)}${s}</span>`).join("")}</div>` : ""}
      </div></article>`;
  }).join("");
}
function renderReviews() {
  $("#reviews").innerHTML = REVIEWS.map((r) => `<article class="review">
    <div class="rh"><span class="av" style="background:${r.color}">${r.init}</span><div><b>${r.name}</b> <span>${t("approved")}</span></div></div>
    <blockquote>${r[lang]}</blockquote>
    <div class="rf"><span>${r.role}, ${t(r.ctx)}</span><span class="approved">✓ approved</span></div></article>`).join("");
}

/* =========================================================
   Stack: json tree, heatmap, services
   ========================================================= */
const folded = new Set();
function renderJson() {
  let n = 1; const ln = (h, cls = "") => `<div class="ln ${cls}"><span class="n">${n++}</span><span>${h}</span></div>`;
  let h = ln("{");
  const keys = Object.keys(STACK);
  keys.forEach((k, ki) => {
    const items = STACK[k], closed = folded.has(k);
    h += `<div class="grp${closed ? " closed" : ""}" data-k="${k}">`;
    h += ln(`  <button class="tg" aria-expanded="${!closed}" aria-label="fold ${k}">▾</button><span class="prop">"${k}"</span><span class="pun">:</span> [<span class="more"> ${items.length} items ]${ki < keys.length - 1 ? "," : ""}</span>`);
    h += `<div class="items">`;
    items.forEach((s, i) => { h += ln(`      ${icon(s)}<span class="str">"${s}"</span>${i < items.length - 1 ? "," : ""}`, `it ${k}`) });
    h += ln(`    ]${ki < keys.length - 1 ? "," : ""}`);
    h += `</div></div>`;
  });
  h += ln("}");
  $("#json").innerHTML = h;
}
$("#json").addEventListener("click", (e) => {
  const b = e.target.closest(".tg"); if (!b) return;
  const k = b.closest(".grp").dataset.k; folded.has(k) ? folded.delete(k) : folded.add(k); renderJson();
  $(`#json .grp[data-k="${k}"] .tg`).focus();
});

function renderHeat() {
  const start = new Date(2026, 5, 1), weeks = 17, cells = [], monthsAt = [];
  let total = 0, best = 0, days = 0, streak = 0, run = 0;
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const lv = (c) => c === 0 ? 0 : c < 4 ? 1 : c < 9 ? 2 : c < 16 ? 3 : 4;
  const fmt = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short" });
  for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
    const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
    const c = COMMITS_BY_DAY[key(dt)] || 0;
    total += c; best = Math.max(best, c); if (c) { days++; run++; streak = Math.max(streak, run) } else run = 0;
    if (d === 0 && (w === 0 || dt.getDate() <= 7)) monthsAt.push([w, dt]);
    cells.push(`<i class="cell" data-l="${lv(c)}" data-tip="${c} ${c === 1 ? t("commit1") : t("commits")} ${t("on")} ${fmt.format(dt)}"></i>`);
  }
  $("#cells").innerHTML = cells.join("");
  const mf = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", { month: "short" });
  $("#months").style.gridTemplateColumns = `repeat(${weeks},1fr)`;
  $("#months").innerHTML = Array.from({ length: weeks }, (_, w) => { const m = monthsAt.find(([x]) => x === w); return `<span>${m ? mf.format(m[1]) : ""}</span>` }).join("");
  $("#actTotal").textContent = `${total} ${t("commits")}`;
  $("#stBest").textContent = best; $("#stStreak").textContent = streak; $("#stDays").textContent = days;
}
const htip = $("#htip");
$("#cells").addEventListener("mouseover", (e) => {
  const c = e.target.closest(".cell"); if (!c) return;
  const r = c.getBoundingClientRect(); htip.textContent = c.dataset.tip; htip.style.opacity = 1;
  htip.style.left = Math.min(innerWidth - htip.offsetWidth - 8, r.left + r.width / 2 - htip.offsetWidth / 2) + "px"; htip.style.top = (r.top - 30) + "px";
});
$("#cells").addEventListener("mouseleave", () => (htip.style.opacity = 0));

function renderServices() {
  $("#services").innerHTML = SERVICES[lang].map(([fn, h, p]) => `<div class="svc"><span class="fn">${fn}</span><h3>${h}</h3><p>${p}</p></div>`).join("");
}

/* =========================================================
   Contact form, validated with the same rules as the server
   ========================================================= */
const form = $("#form"), out = $("#out"); let tried = false;
const F = { name: $("#f-name"), email: $("#f-email"), message: $("#f-message"), privacy: $("#f-privacy") };
function validate() {
  const v = { name: F.name.value.trim(), email: F.email.value.trim(), message: F.message.value.trim() };
  const errs = {};
  if (v.name.length < 2 || v.name.length > 80) errs.name = t("errName");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || v.email.length > 254) errs.email = t("errEmail");
  if (v.message.length < 10 || v.message.length > 2000) errs.message = t("errMsg");
  if (!F.privacy.checked) errs.privacy = t("errPrivacy");
  ["name", "email", "message", "privacy"].forEach((k) => {
    const row = $(`.fl[data-f="${k}"]`), e = $(`#e-${k}`), bad = tried && errs[k];
    row.classList.toggle("bad", !!bad); e.classList.toggle("show", !!bad); e.textContent = bad || "";
    const input = F[k]; input.setAttribute("aria-invalid", bad ? "true" : "false");
    if (bad) input.setAttribute("aria-describedby", `e-${k}`); else input.removeAttribute("aria-describedby");
  });
  return errs;
}
Object.values(F).forEach((el) => el.addEventListener("input", () => { if (tried) validate() }));
F.message.addEventListener("input", () => { $("#count").textContent = `${F.message.value.length} / 2000` });
form.addEventListener("submit", (e) => {
  e.preventDefault(); tried = true;
  const errs = validate(), n = Object.keys(errs).length;
  if (n) {
    out.innerHTML = `<div>${t("outRun")}</div><div class="err2">${n === 1 ? t("outFail") : `✕ ${n} ${t("outFails")}`}</div>`;
    F[Object.keys(errs)[0]].focus(); return;
  }
  const btn = $("#runBtn"); btn.disabled = true;
  out.innerHTML = `<div>${t("outRun")}</div><div class="dim">POST /api/contact …</div>`;
  setTimeout(() => {
    out.innerHTML = `<div>${t("outRun")}</div><div class="dim">POST /api/contact</div><div class="ok">✓ ${t("outPreview")}</div>`;
    btn.disabled = false; wakeCats();
  }, 900);
});
form.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") form.requestSubmit() });

/* =========================================================
   Language, theme
   ========================================================= */
function applyLang(l) {
  lang = l; store.set("lang", l); document.documentElement.lang = l;
  $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === l));
  $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === "string") el.textContent = v });
  $$("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  $$("[data-ph]").forEach((el) => (el.placeholder = t(el.dataset.ph)));
  setHeadline(false);
  $("#palIn").placeholder = t("palPh");
  $("#catState").textContent = catAwake ? t("catAwake") : t("catSleep");
  $("#themeName").textContent = theme() === "dark" ? t("themeD") : t("themeL");
  $("#revealBtn").textContent = frame.classList.contains("reveal") ? t("hide") : t("reveal");
  if (code.children.length) renderCode();
  renderRows(); hprev.dataset.id = ""; if (!drawer.hidden) renderDrawer(false); renderLog(); renderReviews(); renderJson(); renderHeat(); renderServices();
  if (tried) validate();
}
$$("[data-lang]").forEach((b) => b.addEventListener("click", () => applyLang(b.dataset.lang)));
const theme = () => document.documentElement.dataset.theme;
function toggleTheme() {
  const n = theme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = n; store.set("theme", n);
  $("#themeName").textContent = n === "dark" ? t("themeD") : t("themeL");
  drawRulers();
}
$("#themeBtn").addEventListener("click", toggleTheme);
$("#statusTheme").addEventListener("click", toggleTheme);

/* =========================================================
   Rulers, crosshair, scroll spy
   ========================================================= */
function drawRulers() {
  if (innerWidth <= 980) return;
  const cs = getComputedStyle(document.documentElement), tick = cs.getPropertyValue("--hair-3").trim(), txt = cs.getPropertyValue("--faint").trim();
  const dpr = devicePixelRatio || 1, R = 22, off = Math.round(scrollY);
  [[$("#rx"), innerWidth - R, R, true], [$("#ry"), R, innerHeight, false]].forEach(([c, w, h, horiz]) => {
    c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px";
    const g = c.getContext("2d"); g.scale(dpr, dpr); g.strokeStyle = tick; g.fillStyle = txt; g.font = "9px 'Geist Mono', monospace"; g.lineWidth = 1;
    const len = horiz ? w : h, shift = horiz ? 0 : off % 8, base = horiz ? 0 : off - shift;
    for (let p = -shift; p < len; p += 8) {
      const v = base + p + shift, big = v % 80 === 0, mid = v % 40 === 0, s = big ? 10 : mid ? 6 : 3; g.beginPath();
      if (horiz) { g.moveTo(p + .5, R); g.lineTo(p + .5, R - s) } else { g.moveTo(R, p + .5); g.lineTo(R - s, p + .5) }
      g.stroke();
      if (big && v > 0) { if (horiz) g.fillText(v, p + 3, 9); else { g.save(); g.translate(9, p + 3); g.rotate(-Math.PI / 2); g.fillText(v, 0, 0); g.restore() } }
    }
  });
}
const cv = $("#cv"), chh = $("#ch"), coord = $("#coord"), mx = $("#mx"), my = $("#my");
addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse" || innerWidth <= 980) return;
  const top = 56 + 22;
  if (e.clientY < top || e.clientX < 22 || e.clientY > innerHeight - 28) { document.body.classList.remove("pointing"); return }
  document.body.classList.add("pointing");
  document.body.classList.toggle("over-ui", !!e.target.closest(".editor,.rows,.review,input,textarea,button,a,.frame,.services"));
  cv.style.left = e.clientX + "px"; chh.style.top = e.clientY + "px"; mx.style.left = e.clientX + "px"; my.style.top = e.clientY + "px";
  coord.textContent = `x ${Math.round(e.clientX - 22)}  y ${Math.round(e.clientY - top + scrollY)}`;
  coord.style.left = (e.clientX + 12) + "px"; coord.style.top = (e.clientY + 12) + "px";
}, { passive: true });
document.addEventListener("mouseleave", () => document.body.classList.remove("pointing"));

const sections = $$("main > section");
let rafScroll = 0;
function onScroll() {
  cancelAnimationFrame(rafScroll);
  rafScroll = requestAnimationFrame(() => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    $("#scrollLn").textContent = "Ln " + (1 + Math.round(y / 24));
    let cur = sections[0];
    sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s });
    const id = cur.id;
    $$(".tab").forEach((tb) => { const on = tb.dataset.sec === id; tb.classList.toggle("on", on); on ? tb.setAttribute("aria-current", "location") : tb.removeAttribute("aria-current") });
    $("#curFile").textContent = cur.dataset.file;
    drawRulers();
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", () => { drawRulers(); drawAscii(); placeAllMeows() });

/* count up the facts once they are on screen */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return; io.unobserve(e.target);
  const el = e.target, to = +el.dataset.count;
  if (reduce) { el.textContent = to; return }
  const t0 = performance.now();
  (function f(n) { const p = Math.min(1, (n - t0) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f) })(t0);
}), { threshold: .6 });
$$("[data-count]").forEach((el) => io.observe(el));

/* =========================================================
   Command palette and shortcuts
   ========================================================= */
const go = (id) => document.getElementById(id).scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
function cmds() {
  const c = t("cmd");
  return [
    [t("gNav"), [[c.work, "G W", () => go("work")], [c.about, "G A", () => go("about")], [c.stack, "G S", () => go("stack")], [c.contact, "G C", () => go("contact")], [c.top, "G G", () => go("index")]]],
    [t("gAct"), [[c.mail, "C", copyMail], [c.theme, "T", toggleTheme], [c.lang, "L", () => applyLang(lang === "en" ? "de" : "en")], [c.cat, "M", wakeCats], [c.replay, "R", () => boot(true)]]],
    [t("gLinks"), [[c.gh, "↗", () => window.open("https://github.com/kamycoding", "_blank", "noopener")], [c.li, "↗", () => window.open("https://www.linkedin.com/in/kamyarzamanfar", "_blank", "noopener")]]],
  ];
}
const pal = $("#pal"), palIn = $("#palIn"), palList = $("#palList"); let sel = 0, flat = [], lastFocus = null;
function renderPal() {
  const q = palIn.value.trim().toLowerCase(); flat = []; let h = "";
  cmds().forEach(([g, items]) => {
    const m = items.filter(([n]) => n.toLowerCase().includes(q)); if (!m.length) return;
    h += `<li class="grp-t" role="presentation">${g}</li>`;
    m.forEach((it) => { const i = flat.length; flat.push(it); h += `<li role="option" id="pal-${i}" aria-selected="${i === sel}" data-i="${i}">${it[0]}<kbd>${it[1]}</kbd></li>` });
  });
  palList.innerHTML = h || `<li class="empty" role="presentation">${t("empty")}</li>`;
  palIn.setAttribute("aria-activedescendant", flat.length ? `pal-${sel}` : "");
  const s = $(`#pal-${sel}`); if (s) s.scrollIntoView({ block: "nearest" });
}
function openPal() { lastFocus = document.activeElement; pal.classList.add("open"); palIn.value = ""; sel = 0; renderPal(); palIn.focus() }
function closePal() { pal.classList.remove("open"); if (lastFocus) lastFocus.focus() }
function runSel(i) { const it = flat[i]; if (!it) return; closePal(); it[2]() }
$("#openPal").addEventListener("click", openPal);
pal.addEventListener("click", (e) => { if (e.target === pal) closePal(); const li = e.target.closest("li[data-i]"); if (li) runSel(+li.dataset.i) });
palList.addEventListener("mousemove", (e) => { const li = e.target.closest("li[data-i]"); if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; renderPal() } });
palIn.addEventListener("input", () => { sel = 0; renderPal() });
palIn.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, flat.length); renderPal() }
  else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + flat.length) % Math.max(1, flat.length); renderPal() }
  else if (e.key === "Enter") { e.preventDefault(); runSel(sel) }
  else if (e.key === "Escape") closePal();
  else if (e.key === "Tab") e.preventDefault();
});
let gPending = 0;
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("open") ? closePal() : openPal(); return }
  if (pal.classList.contains("open") || !drawer.hidden || !$("#boot").classList.contains("done")) return;
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest("input,textarea,select,[contenteditable]")) return;
  const k = e.key.toLowerCase();
  if (gPending && Date.now() - gPending < 900) {
    gPending = 0; const map = { w: "work", a: "about", s: "stack", c: "contact", g: "index" };
    if (map[k]) { e.preventDefault(); go(map[k]) } return;
  }
  if (k === "g") { gPending = Date.now(); return }
  if (k === "c") copyMail(); else if (k === "t") toggleTheme(); else if (k === "l") applyLang(lang === "en" ? "de" : "en");
  else if (k === "m") wakeCats(); else if (k === "?") openPal();
});

/* =========================================================
   Terminal in the hero
   ========================================================= */
const tpOut = $("#tpOut"), tpIn = $("#tpIn"), tpBody = $("#tpBody"); const hist = []; let hi = 0;
const esc = (x) => x.replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m]);
function tpPrint(html, cls = "o") { tpOut.insertAdjacentHTML("beforeend", `<div class="${cls}">${html}</div>`); tpBody.scrollTop = tpBody.scrollHeight }
const CMDS_T = ["help", "whoami", "ls", "open", "projects", "stack", "contact", "cat", "theme", "lang", "date", "clear", "sudo"];
function runCmd(raw) {
  const line = raw.trim(); tpPrint(`<span class="pr">~/kamyar.dev $</span> ${esc(line)}`, "o cmdl");
  if (!line) return;
  hist.push(line); hi = hist.length;
  const [c, ...args] = line.split(/\s+/), arg = args.join(" ").toLowerCase(), M = t("term");
  switch (c.toLowerCase()) {
    case "help": tpPrint(M.help); break;
    case "whoami": tpPrint(M.whoami); break;
    case "ls": tpPrint(`<b>work.tsx</b>  <b>about.md</b>  <b>stack.json</b>  <b>contact.ts</b>  README.md`); break;
    case "open": case "cd": {
      const map = { work: "work", "work.tsx": "work", about: "about", "about.md": "about", stack: "stack", "stack.json": "stack", contact: "contact", "contact.ts": "contact" };
      if (map[arg]) { tpPrint(`<span class="ok">→</span> ${map[arg]}`); setTimeout(() => go(map[arg]), 250) } else tpPrint(M.openUsage);
      break;
    }
    case "projects": tpPrint(PROJECTS.map((p) => `<b>${p.id}/</b>  ${p[lang].tag}`).join("\n")); break;
    case "stack": tpPrint(Object.entries(STACK).map(([k, v]) => `<b>${k}</b>: ${v.join(", ")}`).join("\n")); break;
    case "contact": case "email": copyMail(); tpPrint(`contact@kamycoding.com  <span class="ok">${M.copied}</span>`); break;
    case "cat": case "meow": wakeCats(); tpPrint(M.cat); break;
    case "theme": toggleTheme(); tpPrint(`theme: ${theme()}`); break;
    case "lang": applyLang(lang === "en" ? "de" : "en"); tpPrint(`lang: ${lang}`); break;
    case "date": tpPrint(new Date().toLocaleString(lang === "de" ? "de-DE" : "en-GB", { timeZone: "Europe/Berlin", dateStyle: "full", timeStyle: "short" }) + ", Cologne"); break;
    case "clear": tpOut.innerHTML = ""; break;
    case "sudo":
      if (arg.startsWith("hire")) { tpPrint(`<span class="ok">${M.sudo}</span>`); setTimeout(() => go("contact"), 700) }
      else tpPrint(M.sudoNo);
      break;
    default: tpPrint(`<span class="err">zsh: command not found: ${esc(c)}</span>  ${M.tryHelp}`);
  }
}
function termIntro() {
  if (tpOut.childElementCount) return;
  const cmd = "whoami"; let i = 0;
  const step = () => { tpIn.value = cmd.slice(0, ++i); if (i < cmd.length) setTimeout(step, 70); else setTimeout(() => { tpIn.value = ""; runCmd(cmd); tpPrint(`<span class="dim">${t("term").hint}</span>`) }, 260) };
  if (reduce) { runCmd(cmd); tpPrint(`<span class="dim">${t("term").hint}</span>`) } else setTimeout(step, 900);
}
tpIn.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { runCmd(tpIn.value); tpIn.value = "" }
  else if (e.key === "ArrowUp") { e.preventDefault(); if (hi > 0) tpIn.value = hist[--hi] || "" }
  else if (e.key === "ArrowDown") { e.preventDefault(); hi = Math.min(hist.length, hi + 1); tpIn.value = hist[hi] || "" }
  else if (e.key === "Tab") {
    const m = CMDS_T.filter((x) => x.startsWith(tpIn.value.trim().toLowerCase()));
    if (tpIn.value && m.length) { e.preventDefault(); if (m.length === 1) tpIn.value = m[0] + " "; else tpPrint(m.join("  ")) }
  }
  else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); tpOut.innerHTML = "" }
});
tpBody.addEventListener("click", () => { if (!getSelection().toString()) tpIn.focus({ preventScroll: true }) });

/* =========================================================
   Small things
   ========================================================= */
function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 1700) }
async function copyMail() { try { await navigator.clipboard.writeText("contact@kamycoding.com"); toast(t("copied")) } catch { toast("contact@kamycoding.com") } }
$("#copyMail").addEventListener("click", copyMail);
function tick() {
  const f = new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" }).format(new Date());
  $("#clock").textContent = f; $("#clock3").textContent = f; $("#clock2").textContent = f + " " + (new Date().toLocaleString("en", { timeZone: "Europe/Berlin", timeZoneName: "short" }).split(" ").pop());
}
tick(); setInterval(tick, 20000);
$("#year").textContent = new Date().getFullYear();
$("#modKey").textContent = isMac ? "⌘" : "Ctrl";
$("#runKey").textContent = isMac ? "⌘ ↵" : "Ctrl ↵";

/* =========================================================
   Boot: the site builds itself, once per session
   ========================================================= */
const BOOT = [
  [`<span class="dim">$</span> <b>pnpm build</b>`, 0],
  [`<span class="tri">▲</span> <b>kamyar.dev</b> <span class="dim">2.0.0</span>`, 140],
  [`<span class="dim">  - Environments: .env.production</span>`, 90],
  [``, 60],
  [`SPIN`, 90],
  [`  <span class="dim">resolve </span>   kamyar@latest<span class="dim r">38ms</span>`, 170],
  [`  <span class="dim">install </span>   architecture → software<span class="dim r">2022</span>`, 170],
  [`  <span class="dim">compile </span>   typescript, react, next.js<span class="dim r">412ms</span>`, 170],
  [`  <span class="dim">compile </span>   node, nestjs, postgresql<span class="dim r">306ms</span>`, 170],
  [`  <span class="dim">link    </span>   heldio <span class="dim">(co-founder)</span><span class="dim r">2026</span>`, 170],
  [`BAR`, 120],
  [`<span class="ok">✓</span> Generating static pages (5/5)`, 120],
  [``, 40],
  [`<b>Route (app)</b>`, 80],
  [`<span class="dim">┌</span> ○ /            <span class="dim">index.tsx</span>`, 60],
  [`<span class="dim">├</span> ○ /work        <span class="dim">4 projects</span>`, 60],
  [`<span class="dim">├</span> ○ /about       <span class="dim">since 2022</span>`, 60],
  [`<span class="dim">├</span> ○ /stack       <span class="dim">20 tools</span>`, 60],
  [`<span class="dim">└</span> ○ /contact     <span class="dim">open to work</span>`, 60],
  [``, 40],
  [`READY`, 160],
];
let bootTimers = [];
function boot(force) {
  const el = $("#boot"), term = $("#term");
  bootTimers.forEach(clearTimeout); bootTimers = [];
  const finish = () => {
    if (el.classList.contains("done") && !force) return;
    bootTimers.forEach(clearTimeout); el.classList.add("done");
    removeEventListener("keydown", keyFinish);
    document.body.classList.add("ready"); typeCode(); setHeadline(true); termIntro();
    force = false;
  };
  const keyFinish = (e) => { if (e.key !== "Tab") finish() };
  if (!force && reduce) { el.classList.add("done"); document.body.classList.add("ready"); renderCode(); termIntro(); return }
  el.classList.remove("done"); term.innerHTML = ""; document.body.classList.remove("ready");
  addEventListener("keydown", keyFinish); $("#skipBoot").onclick = finish;
  const t0 = performance.now(); let at = 200;
  const add = (html) => { const d = document.createElement("div"); d.className = "l"; d.innerHTML = html; term.appendChild(d); requestAnimationFrame(() => d.classList.add("in")); return d };
  BOOT.forEach(([h, gap]) => {
    at += gap;
    bootTimers.push(setTimeout(() => {
      if (h === "SPIN") {
        const d = add(`<span class="spin">⠋</span> Creating an optimized production build ...`);
        const fr = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"; let i = 0; const s = d.querySelector(".spin");
        const iv = setInterval(() => (s.textContent = fr[++i % fr.length]), 70);
        bootTimers.push(setTimeout(() => { clearInterval(iv); d.innerHTML = `<span class="ok">✓</span> Compiled successfully in ${((performance.now() - t0) / 1000 + .9).toFixed(1)}s` }, 1050));
      } else if (h === "BAR") {
        const d = add(`  <span class="bar"></span><span class="dim pc r">0%</span>`);
        const b = d.querySelector(".bar"), pc = d.querySelector(".pc"), s0 = performance.now();
        (function f(n) { const p = Math.min(1, (n - s0) / 420), k = Math.round(p * 28); b.textContent = "█".repeat(k) + "░".repeat(28 - k); pc.textContent = Math.round(p * 100) + "%"; if (p < 1) requestAnimationFrame(f) })(s0);
      } else if (h === "READY") {
        add(`<span class="ok">✓</span> <b>Ready</b> in ${((performance.now() - t0) / 1000).toFixed(2)}s`);
        bootTimers.push(setTimeout(finish, 650));
      } else add(h || " ");
    }, at));
  });
}

/* =========================================================
   Start
   ========================================================= */
applyLang(lang);
$("#themeName").textContent = theme() === "dark" ? t("themeD") : t("themeL");
document.fonts.ready.then(() => { drawRulers(); drawAscii(); onScroll(); boot(false) });

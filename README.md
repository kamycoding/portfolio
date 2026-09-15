<div align="center">
# Portfolio — Kamyar Zamanfar

**Production-grade personal portfolio**, built with Angular 21 & TypeScript.<br/>
Bilingual (DE / EN), fully responsive, designed in Figma — implemented pixel-close in code.

**[Live Site](https://www.kamycoding.com)** · **[LinkedIn](https://www.linkedin.com/in/kamyarzamanfar/)** · **[GitHub](https://github.com/kamycoding)**

</div>
---

## Overview

This repository contains the source code of my personal portfolio website — the central place where my work, my tech stack and my way of building products come together.

The goal was not just "a nice page", but a **maintainable, production-oriented frontend**: a clean component architecture, a real design-token system, container-query based layouts and full German/English localization.

---

## Features

| Feature                     | Description                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| **Standalone Architecture** | Angular standalone components — no legacy NgModules, explicit and tree-shakeable imports |
| **Bilingual (DE / EN)**     | Complete UI localization with an instant language switch                                 |
| **Fully Responsive**        | Mobile-first, refined for tablet, desktop and widescreen (≥ 1440px)                      |
| **Design Tokens**           | Central CSS custom properties for colors, typography and spacing                         |
| **Figma to Code**           | Implemented from a 1440px Figma base using container queries (`cqw`)                     |
| **Contact Form**            | Validated Angular form with real backend submission                                      |
| **Accessibility**           | Semantic HTML, focus states, alt texts, keyboard-navigable                               |
| **Performance**             | Optimized production build, lazy assets, minimal dependencies                            |

---

## Tech Stack

| Layer            | Technologies                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| **Core**         | Angular 21 · TypeScript · Angular Router · HTML5 · CSS3                                             |
| **Styling & UI** | Tailwind CSS · PostCSS · Component-scoped CSS (`:host`) · CSS Custom Properties · Container Queries |
| **Tooling**      | Angular CLI · Node.js · npm · Prettier · EditorConfig · Git                                         |
| **Testing**      | Vitest                                                                                              |
| **Design**       | Figma                                                                                               |

---

## Project Structure

```text
portfolio/
├── public/               # Static assets (images, icons, fonts)
├── src/
│   ├── app/
│   │   ├── shared/       # Reusable components, services, interfaces
│   │   ├── main-content/ # Page sections (Hero, About, Skills, Projects, Contact)
│   │   └── app.routes.ts
│   ├── styles.css        # Global styles & design tokens
│   └── main.ts           # Bootstrap
├── angular.json
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kamycoding/portfolio.git

# 2. Enter the project folder
cd portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app is now running at **http://localhost:4200/** and reloads automatically on file changes.

### Available Scripts

| Command         | Description                                     |
| --------------- | ----------------------------------------------- |
| `npm start`     | Start the local development server              |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run watch` | Build in watch mode (development configuration) |
| `npm test`      | Run unit tests with Vitest                      |

---

## Design

The complete UI was designed in **Figma** and implemented with a 1440px base width.
Above 1440px the content area keeps its width while the background spans the full viewport — the layout stays visually stable on ultra-wide screens instead of scaling endlessly.

---

## Roadmap

- [ ] Dark mode via design tokens
- [ ] Project detail pages with case studies
- [ ] Lighthouse & accessibility audit pass
- [ ] CI pipeline with GitHub Actions

---

## Contact

**Kamyar Zamanfar** — Frontend Developer, on the way to Full-Stack & AI

- Website: [www.kamycoding.com](https://www.kamycoding.com)
- LinkedIn: [in/kamyarzamanfar](https://www.linkedin.com/in/kamyarzamanfar/)
- Telegram: [@kamycoding](https://t.me/kamycoding)

---

## License

Released under the **MIT License** — see [`LICENSE`](LICENSE) for details.

The source code may be used and adapted freely.
Personal content — texts, photos, project descriptions and branding — remains the property of the author.

---

<div align="center">
**Built with care in Germany — God is in the details.**

</div>

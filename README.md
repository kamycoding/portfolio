# Kamyar Zamanfar Portfolio

Personal portfolio for [Kamyar Zamanfar](https://www.kamycoding.com), a Full-Stack Developer.

[Live site](https://www.kamycoding.com) · [LinkedIn](https://www.linkedin.com/in/kamyarzamanfar/) · [GitHub](https://github.com/kamycoding)

## Overview

The frontend is built with Angular 22, TypeScript, standalone components, and a responsive UI. It supports English and German localization and includes project detail pages.

The production site is hosted on Netlify. Contact form requests are sent to `/api/contact`, redirected to a Netlify Function, and forwarded to Brevo for email delivery. The `server/` directory is retained for local or alternative backend development and is not the current production contact backend.

## Project Structure

```text
portfolio/
├── public/                 # Static assets and EN/DE translation resources
├── src/app/
│   ├── core/               # Application-wide services and localization
│   ├── features/           # Domain data, models, and services
│   ├── layout/             # Header and footer
│   ├── pages/              # Home, legal, privacy, project, and error pages
│   ├── shared/             # Reusable UI and page-layout components
│   └── testing/            # Shared test utilities
├── netlify/                # Netlify Function and its tests
├── server/                 # Local or alternative Express backend
├── netlify.toml            # Netlify build and contact-endpoint redirect
├── package.json
└── README.md
```

## Development

Prerequisites: Node.js 20+ and npm 10+.

```bash
npm install
npm start
```

The development server runs at `http://localhost:4200/`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Angular development server. |
| `npm run build` | Create the Angular production build in `dist/portfolio/browser`. |
| `npm test` | Run Angular unit tests with Vitest. |
| `npm run lint` | Lint the Angular application. |
| `npm run test:functions` | Run Netlify contact-function tests with Vitest. |
| `npm run typecheck:functions` | Type-check the Netlify Function. |

The `server/` directory has its own scripts for its local or alternative backend, including `npm --prefix server test` for its contact integration test.

## License

The source code is licensed under the [MIT License](LICENSE). Personal photographs, KamyCoding branding and logos, portfolio text and copy, personal biography and content, project screenshots, custom design artwork, and original portfolio visual assets are excluded from the MIT license unless explicitly stated otherwise. Third-party assets remain subject to their respective owners' licenses and rights.

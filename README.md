# Portfolio

Angular 22 frontend with an Express backend for the contact form.

## Frontend

Install dependencies and start the development server:

```bash
npm install
npm start
```

The frontend is available at `http://localhost:4200/` and proxies `/api` requests to
`http://localhost:3000`.

Available checks:

```bash
npm run build
npm test -- --watch=false
npm run lint
```

## Backend

Create `server/.env` from `server/.env.example`, then install dependencies and start the
development server:

```bash
cd server
npm install
npm run dev
```

Available checks:

```bash
npm run build
npm test
npm run lint
```

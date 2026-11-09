# ADR 0002: No separate backend for the portfolio

- Status: Accepted
- Date: 2026-11-08

## Context

Kamyar is learning Python and Django and considered adding a Django backend to the portfolio.

## Options

1. Next.js only, with a small Netlify Function for the contact form.
2. Next.js frontend plus a separate Django API.

## Decision

Option 1. The portfolio is mostly static content. A Django backend would only serve the contact form, would need a second host and a second deploy, and recruiters would never see it. That is overengineering for this project.

Django skills are shown in a separate full-stack project (the invoicing tool), which appears in the portfolio as a case study.

## Consequences

- One deploy on Netlify, fast static pages, good SEO.
- The contact form stays a serverless function.
- If the portfolio ever needs real backend features (blog CMS, admin), revisit this ADR.

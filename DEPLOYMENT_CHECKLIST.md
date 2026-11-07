# Radium ERP prototype — deployment checklist

## Before pushing
- [ ] `npm install`
- [ ] `npm run build`
- [ ] Review the demo banner and ensure no sensitive customer or employee data is present.
- [ ] Confirm all browser routes load directly, including `/retail/pos`, `/platform/workflows`, `/platform/identity`, `/platform/integrations`, `/platform/analytics`, `/platform/audit`, `/platform/ai-governance`, `/ai/agents`, and `/integrations/aria`.
- [ ] Confirm forms and localStorage behaviour in a normal browser session.

## GitHub and Vercel
- [ ] Push the complete source to a GitHub repository owned by the deploying organization.
- [ ] Import the repository into Vercel.
- [ ] Framework: Vite; build: `npm run build`; output: `dist`.
- [ ] Review Vercel deployment protection and decide who may access the prototype.
- [ ] Deploy a preview and test direct route refreshes.
- [ ] Promote the reviewed deployment to production.
- [ ] Open the deployed URL in a private browser window and verify the expected access behaviour.
- [ ] Send the verified link to Marlon.

## Important boundary
This is a frontend ERP prototype. Its records are illustrative and browser-local. It does not have a production backend, database, server-side authentication/authorization, live ARIA connector, payment processor, or production integrations. Do not enter confidential data or treat it as an operational ERP system.

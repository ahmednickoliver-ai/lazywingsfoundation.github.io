FILE: README.txt
---------------------------------------------------------
Lazywings Lifeline Foundation — LLF Website (Desktop-first)
Project files (organized for mobile copy/paste or desktop):
---------------------------------------------------------
llf-site/
  public/
    index.html
    pages/
      executive.html
      impact25.html
      mission.html
      standsfor.html
    css/
      style.css
    js/
      app.js
    images/
      (place holder images)
  llf_data_node/
    messages.json
    subs.json
  server.js
  README.txt
  package.json
  .gitignore

Quick start (desktop)
---------------------
1. Ensure Node.js (v14+) & npm are installed.
2. From project root:
   npm install
   npm start
3. Visit http://localhost:3000

Quick start (front-end only)
----------------------------
1. Upload /public to GitHub and serve with GitHub Pages (docs or root).
2. Or open public/index.html locally (some interactive APIs won't work without backend).

APIs
----
POST /api/contact
  - body: JSON or form with { name, email, phone, organisation, topic, message }
  - response: { ok: true, data: { ... } }

POST /api/subscribe
  - body: { email }
  - response: { ok: true }

Dev notes
---------
- Replace placeholder images under public/images/ with real images.
- messages.json and subs.json are basic JSON stores for demo. Use a proper database for production.
- Add .env for secrets (do not commit). Include .env in .gitignore.
- Ensure server binds to process.env.PORT in deployment.

Author
------
LLF Web team — prepared for Ahmed
---------------------------------------------------------
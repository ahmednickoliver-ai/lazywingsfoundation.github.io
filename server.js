// FILE: server.js
// Node.js + Express backend for LLF site (single-file).
// Usage: npm install && node server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'llf_data_node');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Helpers
function readJson(filename){
  const p = path.join(DATA_DIR, filename);
  if(!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8') || '[]'); } catch(e){ return []; }
}
function appendJson(filename, record){
  const p = path.join(DATA_DIR, filename);
  const arr = readJson(filename);
  arr.push(record);
  fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf8');
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/static/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/static/images', express.static(path.join(__dirname, 'public', 'images')));

// Health
app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Serve pages
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get(['/executive', '/executive.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'executive.html')));
app.get(['/impact25', '/impact25.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'impact25.html')));
app.get(['/mission', '/mission.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'mission.html')));
app.get(['/standsfor', '/standsfor.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'standsfor.html')));
app.get(['/contact', '/contact.html'], (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'contact.html')));

// API: contact
app.post('/api/contact', (req, res) => {
  const { name, email, phone, organisation, topic, message } = req.body || {};
  if(!name || !email || !message) return res.status(400).json({ ok:false, error:'name,email,message required' });
  const rec = {
    id: Date.now(),
    name, email, phone: phone||'', organisation: organisation||'', topic: topic||'general', message,
    ip: req.ip, created: new Date().toISOString()
  };
  appendJson('messages.json', rec);
  return res.json({ ok:true, data: rec });
});

// API: subscribe
app.post('/api/subscribe', (req, res) => {
  const payload = req.body || {};
  const email = payload.email || payload.subEmail || '';
  if(!email) return res.status(400).json({ ok:false, error:'email required' });
  appendJson('subs.json', { email, created: new Date().toISOString(), ip: req.ip });
  return res.json({ ok:true });
});

// Admin endpoints to read stored data (for dev)
app.get('/api/messages', (req, res) => res.json(readJson('messages.json')));
app.get('/api/subs', (req, res) => res.json(readJson('subs.json')));

// Static fallback
app.use(express.static(path.join(__dirname, 'public')));

// Start
app.listen(PORT, ()=> console.log(`LLF server running on http://localhost:${PORT}`));
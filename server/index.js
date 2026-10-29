import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_CASES, CHEAT_SHEET_DATA } from '../src/data/casesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let casesStore = [...INITIAL_CASES];
let teamsStore = [
  { id: 'team-1', name: 'Equipo Data Ninjas', score: 0, streak: 0, casesSolved: [] },
  { id: 'team-2', name: 'Equipo Pythonistas', score: 0, streak: 0, casesSolved: [] },
  { id: 'team-3', name: 'Equipo Matplotlib', score: 0, streak: 0, casesSolved: [] }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', totalCases: casesStore.length });
});

app.get('/api/cases', (_req, res) => {
  res.json(casesStore);
});

app.post('/api/cases', (req, res) => {
  const newCase = req.body;
  if (!newCase || !newCase.title || !newCase.industry) {
    return res.status(400).json({ error: 'Faltan campos requeridos (title, industry).' });
  }
  const created = {
    ...newCase,
    id: newCase.id || `custom-${Date.now()}`
  };
  casesStore.unshift(created);
  res.status(201).json(created);
});

app.get('/api/cheatsheet', (_req, res) => {
  res.json(CHEAT_SHEET_DATA);
});

app.get('/api/teams', (_req, res) => {
  res.json(teamsStore);
});

app.post('/api/teams', (req, res) => {
  if (Array.isArray(req.body.teams)) {
    teamsStore = req.body.teams;
  }
  res.json(teamsStore);
});

// Serve static frontend in production if dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.listen(PORT, () => {
  console.log(`🚀 DataViz Arena API Server corriendo en http://localhost:${PORT}`);
});

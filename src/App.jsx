import React, { useState, useEffect } from 'react';
import {
  Trophy,
  BookOpen,
  Users,
  ArrowLeft,
  Plus,
  Flame,
  RotateCcw,
  Sun,
  Moon,
  Check,
  X
} from 'lucide-react';
import { INITIAL_CASES } from './data/casesData.js';
import ContextRoulette from './components/ContextRoulette.jsx';
import Stage1Database from './components/Stage1Database.jsx';
import Stage2ChartPicker from './components/Stage2ChartPicker.jsx';
import Stage3VisualDuel from './components/Stage3VisualDuel.jsx';
import Stage4Storytelling from './components/Stage4Storytelling.jsx';
import CheatSheetModal from './components/CheatSheetModal.jsx';
import CaseCreatorModal from './components/CaseCreatorModal.jsx';

const STORAGE_KEY = 'dataviz_arena_state_v2';

const DEFAULT_TEAMS = [
  { id: 't1', name: 'Equipo 1 (Axes)', score: 0, streak: 0 },
  { id: 't2', name: 'Equipo 2 (Pandas)', score: 0, streak: 0 },
  { id: 't3', name: 'Equipo 3 (Storytellers)', score: 0, streak: 0 }
];

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getEffectiveScheme() {
  if (typeof document === 'undefined') return 'dark';
  const meta = document.querySelector('meta[name="color-scheme"]');
  const content = meta?.content || 'dark';
  if (content === 'light' || content === 'dark') return content;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const saved = loadSavedState();

  const [customCases, setCustomCases] = useState(() => saved?.customCases || []);
  const [cases, setCases] = useState(() => [...(saved?.customCases || []), ...INITIAL_CASES]);
  const [currentCase, setCurrentCase] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [casePoints, setCasePoints] = useState(0);
  const [solvedCaseIds, setSolvedCaseIds] = useState(() => saved?.solvedCaseIds || []);

  const [tournamentMode, setTournamentMode] = useState(() =>
    typeof saved?.tournamentMode === 'boolean' ? saved.tournamentMode : true
  );
  const [teams, setTeams] = useState(() => saved?.teams || DEFAULT_TEAMS);
  const [activeTeamIndex, setActiveTeamIndex] = useState(() => saved?.activeTeamIndex || 0);

  // Inline team creation/renaming (avoids blocking browser prompt)
  const [editingTeamIdx, setEditingTeamIdx] = useState(null);
  const [addingTeam, setAddingTeam] = useState(false);
  const [teamDraftName, setTeamDraftName] = useState('');

  // Modals & Color Scheme
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [renderedScheme, setRenderedScheme] = useState(() => getEffectiveScheme());

  // Persist tournament & custom cases in localStorage for static GitHub Pages autonomy
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          teams,
          activeTeamIndex,
          tournamentMode,
          solvedCaseIds,
          customCases
        })
      );
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [teams, activeTeamIndex, tournamentMode, solvedCaseIds, customCases]);

  // Optional sync with local Express API when running locally
  useEffect(() => {
    fetch('/api/cases')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases((prev) => {
            const existingIds = new Set(data.map((c) => c.id));
            const localOnly = prev.filter((c) => !existingIds.has(c.id));
            return [...localOnly, ...data];
          });
        }
      })
      .catch(() => {});
  }, []);

  // Sync color-scheme across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'color-scheme') {
        const meta = document.querySelector('meta[name="color-scheme"]');
        if (meta) {
          meta.content = e.newValue ?? 'light dark';
          setRenderedScheme(getEffectiveScheme());
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Global keyboard shortcut: G opens Cheat Sheet when not typing in an input
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'g' && !creatorOpen) {
        e.preventDefault();
        setCheatSheetOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [creatorOpen]);

  const handleToggleColorScheme = () => {
    const current = getEffectiveScheme();
    const target = current === 'dark' ? 'light' : 'dark';
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const meta = document.querySelector('meta[name="color-scheme"]');

    try {
      if (target === systemPref) {
        localStorage.removeItem('color-scheme');
        if (meta) meta.content = 'light dark';
      } else {
        localStorage.setItem('color-scheme', target);
        if (meta) meta.content = target;
      }
    } catch {
      if (meta) meta.content = target;
    }
    setRenderedScheme(target);
  };

  const awardPointsToActiveTeam = (pts) => {
    setCasePoints((prev) => prev + pts);
    setTeams((prev) =>
      prev.map((t, idx) =>
        idx === activeTeamIndex
          ? {
              ...t,
              score: t.score + pts,
              streak: pts >= 100 ? t.streak + 1 : 0
            }
          : t
      )
    );
  };

  const handleSelectCase = (selected) => {
    setCurrentCase(selected);
    setCurrentStage(1);
    setCasePoints(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStage1 = (pts) => {
    awardPointsToActiveTeam(pts);
    setCurrentStage(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStage2 = (pts) => {
    awardPointsToActiveTeam(pts);
    setCurrentStage(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStage3 = (pts) => {
    awardPointsToActiveTeam(pts);
    setCurrentStage(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishCase = (pts) => {
    awardPointsToActiveTeam(pts);
    if (currentCase && !solvedCaseIds.includes(currentCase.id)) {
      setSolvedCaseIds((prev) => [...prev, currentCase.id]);
    }
    if (tournamentMode && teams.length > 0) {
      setActiveTeamIndex((prev) => (prev + 1) % teams.length);
    }
    setCurrentCase(null);
    setCurrentStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAddTeam = () => {
    setEditingTeamIdx(null);
    setTeamDraftName(`Equipo ${teams.length + 1}`);
    setAddingTeam(true);
  };

  const commitAddTeam = (e) => {
    e.preventDefault();
    if (teamDraftName.trim()) {
      setTeams((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, name: teamDraftName.trim(), score: 0, streak: 0 }
      ]);
    }
    setAddingTeam(false);
    setTeamDraftName('');
  };

  const startRenameTeam = (idx) => {
    setAddingTeam(false);
    setEditingTeamIdx(idx);
    setTeamDraftName(teams[idx]?.name || '');
  };

  const commitRenameTeam = (e) => {
    e.preventDefault();
    if (editingTeamIdx !== null && teamDraftName.trim()) {
      setTeams((prev) =>
        prev.map((t, i) => (i === editingTeamIdx ? { ...t, name: teamDraftName.trim() } : t))
      );
    }
    setEditingTeamIdx(null);
    setTeamDraftName('');
  };

  const handleResetScores = () => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0, streak: 0 })));
    setSolvedCaseIds([]);
    setActiveTeamIndex(0);
  };

  const handleCreateCustomCase = (newCase) => {
    setCustomCases((prev) => [newCase, ...prev]);
    setCases((prev) => [newCase, ...prev]);
    fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCase)
    }).catch(() => {});
    handleSelectCase(newCase);
  };

  return (
    <div className="app-shell">
      <header className="top-navbar">
        <button
          type="button"
          className="brand-button"
          onClick={() => setCurrentCase(null)}
          title="Volver al directorio de casos"
        >
          <span className="brand-mark" aria-hidden="true">
            DK
          </span>
          <span>
            <span className="brand-title">Data-Kahoo · DataViz Arena</span>
            <span className="brand-sub">Ayudantía Clase 10 HBDA · Matplotlib & Storytelling</span>
          </span>
        </button>

        <div className="scoreboard-strip">
          <button
            type="button"
            className={`mode-toggle-btn ${tournamentMode ? 'active' : ''}`}
            onClick={() => setTournamentMode(!tournamentMode)}
            title="Alternar entre Modo Torneo por Equipos y Práctica Individual"
          >
            <Users size={15} />
            {tournamentMode ? 'Torneo Equipos' : 'Individual'}
          </button>

          {tournamentMode && (
            <div className="teams-bar">
              {teams.map((team, idx) => {
                const isTurn = idx === activeTeamIndex;
                if (editingTeamIdx === idx) {
                  return (
                    <form key={team.id} className="team-inline-editor" onSubmit={commitRenameTeam}>
                      <input
                        type="text"
                        className="team-inline-input"
                        value={teamDraftName}
                        onChange={(e) => setTeamDraftName(e.target.value)}
                        aria-label="Nuevo nombre del equipo"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="icon-control-btn"
                        aria-label="Guardar nombre"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        className="icon-control-btn"
                        onClick={() => setEditingTeamIdx(null)}
                        aria-label="Cancelar edición"
                      >
                        <X size={14} />
                      </button>
                    </form>
                  );
                }

                return (
                  <button
                    key={team.id}
                    type="button"
                    className={`team-chip ${isTurn ? 'active-turn' : ''}`}
                    onClick={() => setActiveTeamIndex(idx)}
                    onDoubleClick={() => startRenameTeam(idx)}
                    title="Clic para asignar el turno · Doble clic para renombrar"
                  >
                    {isTurn && <span className="team-turn-dot" aria-hidden="true" />}
                    <span className="team-name">{team.name}</span>
                    <span className="team-pts">{team.score} pts</span>
                    {team.streak > 1 && (
                      <span className="streak-tag">
                        <Flame size={12} /> x{team.streak}
                      </span>
                    )}
                  </button>
                );
              })}

              {addingTeam ? (
                <form className="team-inline-editor" onSubmit={commitAddTeam}>
                  <input
                    type="text"
                    className="team-inline-input"
                    value={teamDraftName}
                    onChange={(e) => setTeamDraftName(e.target.value)}
                    aria-label="Nombre del nuevo equipo"
                    autoFocus
                  />
                  <button type="submit" className="icon-control-btn" aria-label="Confirmar equipo">
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    className="icon-control-btn"
                    onClick={() => setAddingTeam(false)}
                    aria-label="Cancelar"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="icon-control-btn"
                  onClick={startAddTeam}
                  aria-label="Agregar nuevo equipo"
                  title="Agregar nuevo equipo"
                >
                  <Plus size={15} />
                </button>
              )}

              <button
                type="button"
                className="icon-control-btn"
                onClick={handleResetScores}
                aria-label="Reiniciar marcador y progreso"
                title="Reiniciar marcador y casos completados"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="nav-right-actions">
          <button
            type="button"
            className="icon-control-btn"
            onClick={handleToggleColorScheme}
            aria-label={
              renderedScheme === 'dark'
                ? 'Cambiar a modo claro para sala iluminada'
                : 'Cambiar a modo oscuro de estudio'
            }
            title={
              renderedScheme === 'dark'
                ? 'Modo Proyector Claro (Sala Iluminada)'
                : 'Modo Estudio Oscuro'
            }
          >
            {renderedScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={() => setCheatSheetOpen(true)}
          >
            <BookOpen size={16} />
            <span>Guía Clase 10</span>
            <kbd className="kbd-hint">G</kbd>
          </button>
        </div>
      </header>

      <main className="main-container">
        {!currentCase ? (
          <ContextRoulette
            cases={cases}
            solvedCaseIds={solvedCaseIds}
            onSelectCase={handleSelectCase}
            onOpenCreator={() => setCreatorOpen(true)}
            modalOpen={cheatSheetOpen || creatorOpen}
          />
        ) : (
          <div className="mission-arena-wrapper">
            <div className="mission-top-bar">
              <button
                type="button"
                className="btn-back-lobby"
                onClick={() => setCurrentCase(null)}
              >
                <ArrowLeft size={15} /> Volver al Directorio
              </button>

              <nav className="stage-stepper" aria-label="Etapas de la misión">
                {[
                  { num: 1, label: '1. BBD & Variables' },
                  { num: 2, label: '2. Elegir Gráfico' },
                  { num: 3, label: '3. Duelo A vs. B' },
                  { num: 4, label: '4. Storytelling' }
                ].map((st) => (
                  <button
                    key={st.num}
                    type="button"
                    className={`stepper-item ${currentStage === st.num ? 'current' : ''} ${
                      currentStage > st.num ? 'done' : ''
                    }`}
                    aria-current={currentStage === st.num ? 'step' : undefined}
                    onClick={() => setCurrentStage(st.num)}
                  >
                    {st.label}
                  </button>
                ))}
              </nav>

              {tournamentMode && (
                <div className="active-turn-readout">
                  <Trophy size={15} />
                  <span>
                    Turno: <strong>{teams[activeTeamIndex]?.name}</strong> · +{casePoints} pts
                  </span>
                </div>
              )}
            </div>

            <section className="case-briefing-section" aria-labelledby="case-briefing-heading">
              <div className="briefing-header-row">
                <h1 id="case-briefing-heading" className="briefing-title">
                  {currentCase.title}
                </h1>
                <div className="briefing-meta-inline">
                  <span className="briefing-company-badge">{currentCase.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentCase.industry}</span>
                </div>
              </div>
              <p className="briefing-context">{currentCase.context}</p>
              <div className="briefing-question-bar">
                <strong>Pregunta de negocio:</strong> {currentCase.businessQuestion}
              </div>
            </section>

            {currentStage === 1 && (
              <Stage1Database
                key={`${currentCase.id}-s1`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage1}
              />
            )}
            {currentStage === 2 && (
              <Stage2ChartPicker
                key={`${currentCase.id}-s2`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage2}
              />
            )}
            {currentStage === 3 && (
              <Stage3VisualDuel
                key={`${currentCase.id}-s3`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage3}
              />
            )}
            {currentStage === 4 && (
              <Stage4Storytelling
                key={`${currentCase.id}-s4`}
                currentCase={currentCase}
                casePointsSoFar={casePoints}
                onFinishCase={handleFinishCase}
              />
            )}
          </div>
        )}
      </main>

      <CheatSheetModal isOpen={cheatSheetOpen} onClose={() => setCheatSheetOpen(false)} />
      <CaseCreatorModal
        isOpen={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        onCreateCase={handleCreateCustomCase}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  BookOpen,
  Presentation,
  Users,
  ArrowLeft,
  Plus,
  Flame,
  RotateCcw,
  Sun,
  Moon,
  Check,
  X,
  Terminal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { INITIAL_CASES } from './data/casesData.js';
import AsciiBootScreen from './components/AsciiBootScreen.jsx';
import ContextRoulette from './components/ContextRoulette.jsx';
import Stage1Database from './components/Stage1Database.jsx';
import Stage2ChartPicker from './components/Stage2ChartPicker.jsx';
import Stage3VisualDuel from './components/Stage3VisualDuel.jsx';
import Stage4Storytelling from './components/Stage4Storytelling.jsx';
import CheatSheetModal from './components/CheatSheetModal.jsx';
import CaseCreatorModal from './components/CaseCreatorModal.jsx';
import { runViewTransition, playHackerSfx } from './utils/hackerEffects.js';

const STORAGE_KEY = 'dataviz_arena_state_v2';
const BOOT_SESSION_KEY = 'dataviz_arena_booted_v1';

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

  const [showBoot, setShowBoot] = useState(() => {
    try {
      if (
        window.location.hash === '#arena' ||
        new URLSearchParams(window.location.search).get('noboot') === '1'
      ) {
        return false;
      }
      return sessionStorage.getItem(BOOT_SESSION_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const [sfxEnabled, setSfxEnabled] = useState(() =>
    typeof saved?.sfxEnabled === 'boolean' ? saved.sfxEnabled : false
  );

  const [customCases, setCustomCases] = useState(() => saved?.customCases || []);
  const [cases, setCases] = useState(() => [...(saved?.customCases || []), ...INITIAL_CASES]);
  const [currentCase, setCurrentCase] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [casePoints, setCasePoints] = useState(0);
  const [lastXpGain, setLastXpGain] = useState(null);
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

  // Persist tournament, SFX & custom cases in localStorage for static GitHub Pages autonomy
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          teams,
          activeTeamIndex,
          tournamentMode,
          solvedCaseIds,
          customCases,
          sfxEnabled
        })
      );
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [teams, activeTeamIndex, tournamentMode, solvedCaseIds, customCases, sfxEnabled]);

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
    if (showBoot) return;
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'g' && !creatorOpen) {
        e.preventDefault();
        playHackerSfx('tick', sfxEnabled);
        setCheatSheetOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [creatorOpen, showBoot, sfxEnabled]);

  const handleEnterFromBoot = () => {
    try {
      sessionStorage.setItem(BOOT_SESSION_KEY, '1');
    } catch {
      // Ignore sessionStorage restrictions
    }
    runViewTransition(
      () => {
        setShowBoot(false);
      },
      currentCase ? '#case-briefing-heading' : '#lobby-main-title'
    );
  };

  const handleReplayBoot = () => {
    playHackerSfx('scan', sfxEnabled);
    runViewTransition(() => {
      setShowBoot(true);
    }, '#boot-hero-heading');
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    if (next) {
      playHackerSfx('lock', true);
    }
  };

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
    playHackerSfx('tick', sfxEnabled);
    setRenderedScheme(target);
  };

  const awardPointsToActiveTeam = (pts) => {
    setCasePoints((prev) => prev + pts);
    setLastXpGain({ pts, key: Date.now() });
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
    playHackerSfx('lock', sfxEnabled);
    runViewTransition(() => {
      setCurrentCase(selected);
      setCurrentStage(1);
      setCasePoints(0);
    }, '#case-briefing-heading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToLobby = () => {
    playHackerSfx('tick', sfxEnabled);
    runViewTransition(() => {
      setCurrentCase(null);
    }, '#lobby-main-title');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpStage = (stageNum) => {
    if (stageNum === currentStage) return;
    playHackerSfx('tick', sfxEnabled);
    runViewTransition(() => {
      setCurrentStage(stageNum);
    }, `#stage${stageNum}-heading`);
  };

  const handleCompleteStage1 = (pts) => {
    playHackerSfx('success', sfxEnabled);
    runViewTransition(() => {
      awardPointsToActiveTeam(pts);
      setCurrentStage(2);
    }, '#stage2-heading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStage2 = (pts) => {
    playHackerSfx('success', sfxEnabled);
    runViewTransition(() => {
      awardPointsToActiveTeam(pts);
      setCurrentStage(3);
    }, '#stage3-heading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStage3 = (pts) => {
    playHackerSfx('success', sfxEnabled);
    runViewTransition(() => {
      awardPointsToActiveTeam(pts);
      setCurrentStage(4);
    }, '#stage4-heading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishCase = (pts) => {
    playHackerSfx('boot', sfxEnabled);
    runViewTransition(() => {
      awardPointsToActiveTeam(pts);
      if (currentCase && !solvedCaseIds.includes(currentCase.id)) {
        setSolvedCaseIds((prev) => [...prev, currentCase.id]);
      }
      if (tournamentMode && teams.length > 0) {
        setActiveTeamIndex((prev) => (prev + 1) % teams.length);
      }
      setCurrentCase(null);
      setCurrentStage(1);
    }, '#lobby-main-title');
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
    playHackerSfx('tick', sfxEnabled);
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0, streak: 0 })));
    setSolvedCaseIds([]);
    setActiveTeamIndex(0);
    setLastXpGain(null);
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
          onClick={() => {
            if (showBoot) {
              handleEnterFromBoot();
            } else if (currentCase) {
              handleReturnToLobby();
            }
          }}
          title="Volver a la terminal principal de misiones"
        >
          <span className="brand-mark" aria-hidden="true">
            &gt;_
          </span>
          <span>
            <span className="brand-title">DATA-KAHOO // ARENA_OS</span>
            <span className="brand-sub">SYS.10 HBDA · Matplotlib &amp; Storytelling</span>
          </span>
        </button>

        {!showBoot && (
          <div className="scoreboard-strip">
            <button
              type="button"
              className={`mode-toggle-btn ${tournamentMode ? 'active' : ''}`}
              onClick={() => {
                playHackerSfx('tick', sfxEnabled);
                setTournamentMode(!tournamentMode);
              }}
              title="Alternar entre Modo Torneo por Equipos y Práctica Individual"
            >
              <Users size={15} aria-hidden="true" />
              {tournamentMode ? 'Torneo Equipos' : 'Solo_Op'}
            </button>

            {tournamentMode && (
              <div className="teams-bar">
                {teams.map((team, idx) => {
                  const isTurn = idx === activeTeamIndex;
                  if (editingTeamIdx === idx) {
                    return (
                      <form
                        key={team.id}
                        className="team-inline-editor"
                        onSubmit={commitRenameTeam}
                      >
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
                          <Check size={14} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="icon-control-btn"
                          onClick={() => setEditingTeamIdx(null)}
                          aria-label="Cancelar edición"
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      </form>
                    );
                  }

                  return (
                    <button
                      key={team.id}
                      type="button"
                      className={`team-chip ${isTurn ? 'active-turn' : ''}`}
                      onClick={() => {
                        playHackerSfx('tick', sfxEnabled);
                        setActiveTeamIndex(idx);
                      }}
                      onDoubleClick={() => startRenameTeam(idx)}
                      title="Clic para asignar el turno · Doble clic para renombrar"
                    >
                      {isTurn && <span className="team-turn-dot" aria-hidden="true" />}
                      <span className="team-name">{team.name}</span>
                      <span className="team-pts">{team.score} XP</span>
                      {team.streak > 1 && (
                        <span className="streak-tag">
                          <Flame size={12} aria-hidden="true" /> x{team.streak}
                        </span>
                      )}
                      {isTurn && lastXpGain && (
                        <span key={lastXpGain.key} className="xp-pop-badge" aria-hidden="true">
                          +{lastXpGain.pts}
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
                    <button
                      type="submit"
                      className="icon-control-btn"
                      aria-label="Confirmar equipo"
                    >
                      <Check size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-control-btn"
                      onClick={() => setAddingTeam(false)}
                      aria-label="Cancelar"
                    >
                      <X size={14} aria-hidden="true" />
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
                    <Plus size={15} aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  className="icon-control-btn"
                  onClick={handleResetScores}
                  aria-label="Reiniciar marcador y progreso"
                  title="Reiniciar marcador y casos completados"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="nav-right-actions">
          {!showBoot && (
            <button
              type="button"
              className="icon-control-btn"
              onClick={handleReplayBoot}
              aria-label="Ver secuencia de arranque ASCII"
              title="Reproducir pantalla Hero ASCII de arranque"
            >
              <Terminal size={15} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            className={`icon-control-btn ${sfxEnabled ? 'sfx-active' : ''}`}
            onClick={handleToggleSfx}
            aria-pressed={sfxEnabled}
            aria-label={sfxEnabled ? 'Silenciar efectos de terminal' : 'Activar efectos de terminal'}
            title={sfxEnabled ? 'Audio táctico activado' : 'Activar audio táctico de terminal'}
          >
            {sfxEnabled ? (
              <Volume2 size={15} aria-hidden="true" />
            ) : (
              <VolumeX size={15} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="icon-control-btn"
            onClick={handleToggleColorScheme}
            aria-label={
              renderedScheme === 'dark'
                ? 'Cambiar a modo claro para sala iluminada'
                : 'Cambiar a modo terminal hacker oscuro'
            }
            title={
              renderedScheme === 'dark'
                ? 'Modo Proyector Claro (Sala Iluminada)'
                : 'Modo Terminal Hacker Oscuro'
            }
          >
            {renderedScheme === 'dark' ? (
              <Sun size={16} aria-hidden="true" />
            ) : (
              <Moon size={16} aria-hidden="true" />
            )}
          </button>

          <a
            href="./presentacion.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-header-secondary"
            title="Abrir presentación interactiva de cátedra"
          >
            <Presentation size={16} aria-hidden="true" />
            <span>Presentación</span>
          </a>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={() => {
              playHackerSfx('tick', sfxEnabled);
              setCheatSheetOpen(true);
            }}
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>Guía Clase 10</span>
            <kbd className="kbd-hint">G</kbd>
          </button>
        </div>
      </header>

      <main className="main-container">
        {showBoot ? (
          <AsciiBootScreen onEnterArena={handleEnterFromBoot} sfxEnabled={sfxEnabled} />
        ) : !currentCase ? (
          <ContextRoulette
            cases={cases}
            solvedCaseIds={solvedCaseIds}
            onSelectCase={handleSelectCase}
            onOpenCreator={() => {
              playHackerSfx('tick', sfxEnabled);
              setCreatorOpen(true);
            }}
            modalOpen={cheatSheetOpen || creatorOpen}
            sfxEnabled={sfxEnabled}
          />
        ) : (
          <div className="mission-arena-wrapper">
            <div className="mission-top-bar">
              <button
                type="button"
                className="btn-back-lobby"
                onClick={handleReturnToLobby}
              >
                <ArrowLeft size={15} aria-hidden="true" /> Volver al Directorio
              </button>

              <nav className="stage-stepper" aria-label="Etapas de la misión">
                {[
                  { num: 1, label: '01 // BBD & Variables' },
                  { num: 2, label: '02 // Elegir Gráfico' },
                  { num: 3, label: '03 // Duelo A vs. B' },
                  { num: 4, label: '04 // Storytelling' }
                ].map((st) => (
                  <button
                    key={st.num}
                    type="button"
                    className={`stepper-item ${currentStage === st.num ? 'current' : ''} ${
                      currentStage > st.num ? 'done' : ''
                    }`}
                    aria-current={currentStage === st.num ? 'step' : undefined}
                    onClick={() => handleJumpStage(st.num)}
                  >
                    {st.label}
                  </button>
                ))}
              </nav>

              {tournamentMode && (
                <div className="active-turn-readout">
                  <Trophy size={15} aria-hidden="true" />
                  <span>
                    OP: <strong>{teams[activeTeamIndex]?.name}</strong> · +{casePoints} XP
                  </span>
                </div>
              )}
            </div>

            <section className="case-briefing-section" aria-labelledby="case-briefing-heading">
              <div className="briefing-header-row">
                <h1 id="case-briefing-heading" className="briefing-title" tabIndex={-1}>
                  {currentCase.title}
                </h1>
                <div className="briefing-meta-inline">
                  <span className="briefing-company-badge">{currentCase.company}</span>
                  <span aria-hidden="true">//</span>
                  <span>{currentCase.industry}</span>
                </div>
              </div>
              <p className="briefing-context">{currentCase.context}</p>
              <div className="briefing-question-bar">
                <strong>TARGET_QUERY:</strong> {currentCase.businessQuestion}
              </div>
            </section>

            {currentStage === 1 && (
              <Stage1Database
                key={`${currentCase.id}-s1`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage1}
                sfxEnabled={sfxEnabled}
              />
            )}
            {currentStage === 2 && (
              <Stage2ChartPicker
                key={`${currentCase.id}-s2`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage2}
                sfxEnabled={sfxEnabled}
              />
            )}
            {currentStage === 3 && (
              <Stage3VisualDuel
                key={`${currentCase.id}-s3`}
                currentCase={currentCase}
                onCompleteStage={handleCompleteStage3}
                sfxEnabled={sfxEnabled}
              />
            )}
            {currentStage === 4 && (
              <Stage4Storytelling
                key={`${currentCase.id}-s4`}
                currentCase={currentCase}
                casePointsSoFar={casePoints}
                onFinishCase={handleFinishCase}
                sfxEnabled={sfxEnabled}
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

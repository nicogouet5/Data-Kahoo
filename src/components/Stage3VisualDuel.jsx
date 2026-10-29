import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Code2, Eye } from 'lucide-react';
import MatplotlibCanvas from './MatplotlibCanvas.jsx';
import { runViewTransition, playHackerSfx } from '../utils/hackerEffects.js';

export default function Stage3VisualDuel({ currentCase, onCompleteStage, sfxEnabled }) {
  const [duelIndex, setDuelIndex] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null); // 'A' | 'B'
  const [submitted, setSubmitted] = useState(false);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [sharedXRay, setSharedXRay] = useState(false);

  const duels = currentCase.duels || [];
  const currentDuel = duels[duelIndex];

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!submitted) {
        if (e.key.toLowerCase() === 'a') {
          playHackerSfx('tick', sfxEnabled);
          setSelectedVersion('A');
        }
        if (e.key.toLowerCase() === 'b') {
          playHackerSfx('tick', sfxEnabled);
          setSelectedVersion('B');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [submitted, sfxEnabled]);

  const handleConfirm = () => {
    if (!selectedVersion || submitted) return;
    const ok = selectedVersion === currentDuel.correctVersion;
    playHackerSfx(ok ? 'success' : 'error', sfxEnabled);
    setSubmitted(true);
    const pts = ok ? 100 : 25;
    setAccumulatedPoints((prev) => prev + pts);
  };

  const handleNextDuel = () => {
    if (duelIndex < duels.length - 1) {
      playHackerSfx('lock', sfxEnabled);
      runViewTransition(() => {
        setDuelIndex((prev) => prev + 1);
        setSelectedVersion(null);
        setSubmitted(false);
      }, '#stage3-heading');
    } else {
      onCompleteStage(accumulatedPoints);
    }
  };

  if (!currentDuel) return null;

  const isCorrect = selectedVersion === currentDuel.correctVersion;

  return (
    <section className="stage-workspace" aria-labelledby="stage3-heading">
      <div className="stage-header">
        <h2 id="stage3-heading" tabIndex={-1}>
          Fase 03 — {currentDuel.title} ({duelIndex + 1}/{duels.length})
        </h2>
        <div className="stage-header-controls">
          <button
            type="button"
            className={`xray-btn ${sharedXRay ? 'active' : ''}`}
            onClick={() => {
              playHackerSfx('scan', sfxEnabled);
              setSharedXRay((prev) => !prev);
            }}
            title="Comparar anatomía Figure vs. Axes simultáneamente en ambas versiones"
          >
            <Eye size={14} aria-hidden="true" />
            {sharedXRay ? 'Desactivar Rayos X (fig/ax)' : 'Scanner Rayos X: fig vs. ax'}
          </button>
          <span className="stage-points-tag">+100 XP / duelo</span>
        </div>
      </div>

      <p className="stage-prompt-question">{currentDuel.question}</p>

      <div className="duel-arena-grid">
        {['A', 'B'].map((ver, idx) => {
          const vData = ver === 'A' ? currentDuel.versionA : currentDuel.versionB;
          const isSelected = selectedVersion === ver;
          const isWinner = submitted && currentDuel.correctVersion === ver;
          const isLoser = submitted && isSelected && currentDuel.correctVersion !== ver;

          return (
            <div
              key={`${duelIndex}-${ver}`}
              style={{ '--stagger-i': idx }}
              className={`duel-panel ${isSelected ? 'selected' : ''} ${
                isWinner ? 'winner' : ''
              } ${isLoser ? 'loser' : ''}`}
              onClick={() => {
                if (!submitted) {
                  playHackerSfx('tick', sfxEnabled);
                  setSelectedVersion(ver);
                }
              }}
            >
              <div className="duel-card-header">
                <div className="duel-card-title-group">
                  <span className="version-tag">BUILD_{ver}</span>
                  <strong>{vData.label}</strong>
                </div>
                {isWinner && (
                  <span className="solved-badge">
                    <CheckCircle2 size={13} aria-hidden="true" /> ÓPTIMA
                  </span>
                )}
              </div>

              <MatplotlibCanvas
                rows={currentCase.rows}
                config={vData.chartConfig}
                allowXRay={true}
                xrayOverride={sharedXRay}
              />

              <div className="code-snippet-box">
                <div className="code-bar">
                  <span className="code-bar-label">
                    <Code2 size={14} aria-hidden="true" /> script_{ver.toLowerCase()}.py
                  </span>
                  <kbd className="kbd-hint">{ver}</kbd>
                </div>
                <pre>
                  <code>{vData.code}</code>
                </pre>
              </div>

              <button
                type="button"
                className={`btn-pick-version ${isSelected ? 'active' : ''}`}
                disabled={submitted}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!submitted) {
                    playHackerSfx('tick', sfxEnabled);
                    setSelectedVersion(ver);
                  }
                }}
              >
                {isSelected ? `✓ BUILD_${ver} SELECCIONADA` : `Seleccionar BUILD_${ver}`}
              </button>
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <div className="stage-footer-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!selectedVersion}
            onClick={handleConfirm}
          >
            Validar Decisión en Duelo {duelIndex + 1}
          </button>
        </div>
      ) : (
        <div className={`stage-result-banner ${isCorrect ? 'banner-ok' : ''}`}>
          <div>
            <h3>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={18} className="inline-icon" aria-hidden="true" /> [OK] La
                  BUILD_{currentDuel.correctVersion} cumple el estándar Clase 10 (+100 XP)
                </>
              ) : (
                <>
                  <XCircle size={18} className="inline-icon" aria-hidden="true" /> [WARN] La opción
                  correcta era BUILD_{currentDuel.correctVersion} (+25 XP)
                </>
              )}
            </h3>
            <p>{currentDuel.explanation}</p>
          </div>
          <button type="button" className="btn-primary" onClick={handleNextDuel}>
            {duelIndex < duels.length - 1 ? (
              <>
                Siguiente Duelo ({duelIndex + 2}/{duels.length}){' '}
                <ArrowRight size={18} aria-hidden="true" />
              </>
            ) : (
              <>
                Avanzar a Fase 04: Storytelling <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Code2, Eye } from 'lucide-react';
import MatplotlibCanvas from './MatplotlibCanvas.jsx';

export default function Stage3VisualDuel({ currentCase, onCompleteStage }) {
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
        if (e.key.toLowerCase() === 'a') setSelectedVersion('A');
        if (e.key.toLowerCase() === 'b') setSelectedVersion('B');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [submitted]);

  const handleConfirm = () => {
    if (!selectedVersion || submitted) return;
    setSubmitted(true);
    const isCorrect = selectedVersion === currentDuel.correctVersion;
    const pts = isCorrect ? 100 : 25;
    setAccumulatedPoints((prev) => prev + pts);
  };

  const handleNextDuel = () => {
    if (duelIndex < duels.length - 1) {
      setDuelIndex((prev) => prev + 1);
      setSelectedVersion(null);
      setSubmitted(false);
    } else {
      onCompleteStage(accumulatedPoints);
    }
  };

  if (!currentDuel) return null;

  const isCorrect = selectedVersion === currentDuel.correctVersion;

  return (
    <section className="stage-workspace" aria-labelledby="stage3-heading">
      <div className="stage-header">
        <h2 id="stage3-heading">
          Etapa 3 — {currentDuel.title} ({duelIndex + 1}/{duels.length})
        </h2>
        <div className="stage-header-controls">
          <button
            type="button"
            className={`xray-btn ${sharedXRay ? 'active' : ''}`}
            onClick={() => setSharedXRay((prev) => !prev)}
            title="Comparar anatomía Figure vs. Axes simultáneamente en ambas versiones"
          >
            <Eye size={14} />
            {sharedXRay ? 'Ocultar Rayos X (fig/ax)' : 'Rayos X: Figure vs. Axes'}
          </button>
          <span className="stage-points-tag">+100 pts por duelo</span>
        </div>
      </div>

      <p className="stage-prompt-question">{currentDuel.question}</p>

      <div className="duel-arena-grid">
        {['A', 'B'].map((ver) => {
          const vData = ver === 'A' ? currentDuel.versionA : currentDuel.versionB;
          const isSelected = selectedVersion === ver;
          const isWinner = submitted && currentDuel.correctVersion === ver;
          const isLoser = submitted && isSelected && currentDuel.correctVersion !== ver;

          return (
            <div
              key={ver}
              className={`duel-panel ${isSelected ? 'selected' : ''} ${
                isWinner ? 'winner' : ''
              } ${isLoser ? 'loser' : ''}`}
              onClick={() => !submitted && setSelectedVersion(ver)}
            >
              <div className="duel-card-header">
                <div className="duel-card-title-group">
                  <span className="version-tag">VERSIÓN {ver}</span>
                  <strong>{vData.label}</strong>
                </div>
                {isWinner && (
                  <span className="solved-badge">
                    <CheckCircle2 size={13} /> Óptima
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
                    <Code2 size={14} /> Código Python · Versión {ver}
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
                  if (!submitted) setSelectedVersion(ver);
                }}
              >
                {isSelected ? `✓ Versión ${ver} seleccionada` : `Elegir Versión ${ver}`}
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
            Confirmar Decisión en Duelo {duelIndex + 1}
          </button>
        </div>
      ) : (
        <div className={`stage-result-banner ${isCorrect ? 'banner-ok' : ''}`}>
          <div>
            <h3>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={18} className="inline-icon" /> Respuesta correcta: la Versión{' '}
                  {currentDuel.correctVersion} sigue las reglas de la Clase 10 (+100 pts)
                </>
              ) : (
                <>
                  <XCircle size={18} className="inline-icon" /> La opción recomendada era la Versión{' '}
                  {currentDuel.correctVersion} (+25 pts)
                </>
              )}
            </h3>
            <p>{currentDuel.explanation}</p>
          </div>
          <button type="button" className="btn-primary" onClick={handleNextDuel}>
            {duelIndex < duels.length - 1 ? (
              <>
                Siguiente Duelo ({duelIndex + 2}/{duels.length}) <ArrowRight size={18} />
              </>
            ) : (
              <>
                Continuar a Etapa 4: Storytelling <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

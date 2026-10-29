import React, { useState } from 'react';
import {
  Copy,
  Check,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MatplotlibCanvas from './MatplotlibCanvas.jsx';
import {
  prefersReducedMotion,
  playHackerSfx,
  useCountUp
} from '../utils/hackerEffects.js';

export default function Stage4Storytelling({
  currentCase,
  casePointsSoFar,
  onFinishCase,
  sfxEnabled
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const lastDuel = currentCase.duels[currentCase.duels.length - 1];
  const bestConfig =
    lastDuel.correctVersion === 'A'
      ? lastDuel.versionA.chartConfig
      : lastDuel.versionB.chartConfig;

  const selectedOption = currentCase.storytelling.options.find(
    (o) => o.id === selectedId
  );

  const handleConfirm = () => {
    if (!selectedId || submitted) return;
    const opt = currentCase.storytelling.options.find((o) => o.id === selectedId);
    playHackerSfx(opt?.isCorrect ? 'boot' : 'error', sfxEnabled);
    setSubmitted(true);

    if (opt?.isCorrect && !prefersReducedMotion()) {
      try {
        confetti({
          particleCount: 70,
          spread: 68,
          origin: { y: 0.62 },
          colors: ['#22e566', '#38bdf8', '#fbbf24', '#e8f5ee']
        });
      } catch {
        // Ignore canvas confetti errors in headless/restricted contexts
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCase.storytelling.finalCode);
    playHackerSfx('tick', sfxEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const earnedPoints = selectedOption?.isCorrect ? 150 : 40;
  const totalMissionPoints = casePointsSoFar + (submitted ? earnedPoints : 0);
  const animatedXp = useCountUp(totalMissionPoints, submitted, 680);

  return (
    <section className="stage-workspace" aria-labelledby="stage4-heading">
      <div className="stage-header">
        <h2 id="stage4-heading" tabIndex={-1}>
          Fase 04 — El Gráfico Final Se Lee Sin Explicación Adicional
        </h2>
        <span className="stage-points-tag">+150 XP</span>
      </div>

      <div className="storytelling-layout">
        <div>
          <h3 className="storytelling-col-heading">Salida Depurada para Directorio</h3>
          <MatplotlibCanvas
            rows={currentCase.rows}
            config={{
              ...bestConfig,
              title: selectedOption ? selectedOption.title : bestConfig.title
            }}
            allowXRay={true}
          />

          <div className="code-snippet-box final-code">
            <div className="code-bar">
              <span>notebook_export.py (Colab / Jupyter)</span>
              <button type="button" className="copy-btn" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <Check size={13} aria-hidden="true" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy size={13} aria-hidden="true" /> Copiar script
                  </>
                )}
              </button>
            </div>
            <pre>
              <code>{currentCase.storytelling.finalCode}</code>
            </pre>
          </div>
        </div>

        <div>
          <h3 className="storytelling-col-heading">
            Titular Ejecutivo (<code>ax.set_title</code>)
          </h3>
          <p className="stage-prompt-question" style={{ marginBottom: '1rem' }}>
            {currentCase.storytelling.prompt}
          </p>

          <div className="story-options-list">
            {currentCase.storytelling.options.map((opt, idx) => {
              const isSelected = selectedId === opt.id;
              const showCorrect = submitted && opt.isCorrect;
              const showWrong = submitted && isSelected && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  style={{ '--stagger-i': idx }}
                  className={`story-option-card ${isSelected ? 'selected' : ''} ${
                    showCorrect ? 'correct' : ''
                  } ${showWrong ? 'wrong' : ''}`}
                  onClick={() => {
                    if (!submitted) {
                      playHackerSfx('tick', sfxEnabled);
                      setSelectedId(opt.id);
                    }
                  }}
                  disabled={submitted}
                >
                  <div className="story-opt-header">
                    <code>ax.set_title(&quot;{opt.title}&quot;)</code>
                  </div>
                  <p className="story-opt-takeaway">{opt.takeaway}</p>

                  {submitted && (isSelected || opt.isCorrect) && (
                    <div className="story-feedback">
                      {opt.isCorrect ? (
                        <CheckCircle2 size={15} aria-hidden="true" />
                      ) : (
                        <XCircle size={15} aria-hidden="true" />
                      )}
                      <span>{opt.feedback}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <button
              type="button"
              className="btn-primary full-width"
              disabled={!selectedId}
              onClick={handleConfirm}
            >
              Transmitir Titular Ejecutivo
            </button>
          ) : (
            <div className="mission-complete-panel">
              <div className="mission-trophy-row">
                <Award size={34} aria-hidden="true" />
                <div>
                  <h3>Misión desbloqueada al 100%</h3>
                  <p>
                    Recompensa total en <strong>{currentCase.company}</strong>:{' '}
                    <span className="mission-score-readout">+{animatedXp} XP</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary full-width"
                onClick={() => onFinishCase(earnedPoints)}
              >
                <RotateCcw size={17} aria-hidden="true" /> Registrar XP y Volver al Directorio
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

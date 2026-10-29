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

export default function Stage4Storytelling({
  currentCase,
  casePointsSoFar,
  onFinishCase
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
    setSubmitted(true);
    const opt = currentCase.storytelling.options.find((o) => o.id === selectedId);
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (opt?.isCorrect && !reducedMotion) {
      try {
        confetti({
          particleCount: 65,
          spread: 68,
          origin: { y: 0.62 }
        });
      } catch {
        // Ignore canvas confetti errors in headless/restricted contexts
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCase.storytelling.finalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const earnedPoints = selectedOption?.isCorrect ? 150 : 40;
  const totalMissionPoints = casePointsSoFar + (submitted ? earnedPoints : 0);

  return (
    <section className="stage-workspace" aria-labelledby="stage4-heading">
      <div className="stage-header">
        <h2 id="stage4-heading">
          Etapa 4 — El Gráfico Final Se Lee Sin Explicación Adicional
        </h2>
        <span className="stage-points-tag">+150 pts</span>
      </div>

      <div className="storytelling-layout">
        <div>
          <h3 className="storytelling-col-heading">Gráfico Depurado para Directorio</h3>
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
              <span>Script completo reproducible (Colab / Jupyter)</span>
              <button type="button" className="copy-btn" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <Check size={13} /> Copiado
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copiar código
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
          <h3 className="storytelling-col-heading">Titular Ejecutivo (<code>ax.set_title</code>)</h3>
          <p className="stage-prompt-question" style={{ marginBottom: '1rem' }}>
            {currentCase.storytelling.prompt}
          </p>

          <div className="story-options-list">
            {currentCase.storytelling.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const showCorrect = submitted && opt.isCorrect;
              const showWrong = submitted && isSelected && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`story-option-card ${isSelected ? 'selected' : ''} ${
                    showCorrect ? 'correct' : ''
                  } ${showWrong ? 'wrong' : ''}`}
                  onClick={() => !submitted && setSelectedId(opt.id)}
                  disabled={submitted}
                >
                  <div className="story-opt-header">
                    <code>ax.set_title(&quot;{opt.title}&quot;)</code>
                  </div>
                  <p className="story-opt-takeaway">{opt.takeaway}</p>

                  {submitted && (isSelected || opt.isCorrect) && (
                    <div className="story-feedback">
                      {opt.isCorrect ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <XCircle size={15} />
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
              Confirmar Titular de Storytelling
            </button>
          ) : (
            <div className="mission-complete-panel">
              <div className="mission-trophy-row">
                <Award size={34} />
                <div>
                  <h3>Misión empresarial completada</h3>
                  <p>
                    Puntaje acumulado en <strong>{currentCase.company}</strong>:{' '}
                    <span className="mission-score-readout">+{totalMissionPoints} pts</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary full-width"
                onClick={() => onFinishCase(earnedPoints)}
              >
                <RotateCcw size={17} /> Guardar Puntaje y Volver al Directorio
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

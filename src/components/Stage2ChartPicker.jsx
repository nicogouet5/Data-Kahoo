import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  ScatterChart,
  PieChart,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { playHackerSfx } from '../utils/hackerEffects.js';

const CHART_ICONS = {
  bar: BarChart3,
  line: LineChart,
  multiline: LineChart,
  scatter: ScatterChart,
  pie: PieChart
};

export default function Stage2ChartPicker({ currentCase, onCompleteStage, sfxEnabled }) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const keptColumns = currentCase.columns.filter((c) => c.role === 'keep');
  const xCol = keptColumns.find((c) => c.axisRole === 'x');
  const yCols = keptColumns.filter((c) => c.axisRole === 'y' || c.axisRole === 'y2');

  const handleConfirm = () => {
    if (!selectedId || submitted) return;
    const ok = selectedId === currentCase.chartQuestion.correctChart;
    playHackerSfx(ok ? 'success' : 'error', sfxEnabled);
    setSubmitted(true);
  };

  const selectedOption = currentCase.chartQuestion.options.find(
    (o) => o.id === selectedId
  );
  const isCorrect = selectedId === currentCase.chartQuestion.correctChart;
  const earnedPoints = isCorrect ? 100 : 25;

  return (
    <section className="stage-workspace" aria-labelledby="stage2-heading">
      <div className="stage-header">
        <h2 id="stage2-heading" tabIndex={-1}>
          Fase 02 — Selección del Método en <code>Axes (ax)</code>
        </h2>
        <span className="stage-points-tag">+100 XP</span>
      </div>

      <div className="semantic-mapping-strip" aria-label="Mapeo de ejes desde el modelo semántico">
        <div className="mapping-slot">
          <span className="map-label">AXIS_X // Eje Horizontal</span>
          <code>{xCol?.name}</code>
          <span className="map-sem">{xCol?.semanticType}</span>
        </div>
        <div className="mapping-divider" aria-hidden="true">
          <span className="signal-pipe">═══►</span>
        </div>
        <div className="mapping-slot">
          <span className="map-label">AXIS_Y // Eje Vertical</span>
          <code>{yCols.map((c) => c.name).join(', ')}</code>
          <span className="map-sem">{yCols.map((c) => c.semanticType).join(' + ')}</span>
        </div>
      </div>

      <p className="stage-prompt-question">{currentCase.chartQuestion.prompt}</p>

      <div className="chart-options-grid">
        {currentCase.chartQuestion.options.map((opt, idx) => {
          const IconComp = CHART_ICONS[opt.id] || BarChart3;
          const isSelected = selectedId === opt.id;
          const showCorrect = submitted && opt.id === currentCase.chartQuestion.correctChart;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={opt.id}
              type="button"
              style={{ '--stagger-i': idx }}
              className={`chart-option-card ${isSelected ? 'selected' : ''} ${
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
              <div className="chart-opt-icon">
                <IconComp size={24} aria-hidden="true" />
              </div>
              <div className="chart-opt-body">
                <div className="chart-opt-title">{opt.label}</div>
                {submitted && (isSelected || showCorrect) && (
                  <div className="chart-opt-reason">
                    {opt.id === currentCase.chartQuestion.correctChart ? (
                      <CheckCircle2 size={16} aria-hidden="true" />
                    ) : (
                      <XCircle size={16} aria-hidden="true" />
                    )}
                    <span>{opt.reason}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="stage-footer-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            Compilar Selección Gráfica
          </button>
        </div>
      ) : (
        <div className={`stage-result-banner ${isCorrect ? 'banner-ok' : ''}`}>
          <div>
            <h3>
              {isCorrect
                ? '[OK] Método Matplotlib óptimo (+100 XP)'
                : '[WARN] Revisa el criterio de selección gráfica (+25 XP)'}
            </h3>
            <p>{selectedOption?.reason}</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onCompleteStage(earnedPoints)}
          >
            Avanzar a Fase 03: Duelo A vs. B <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

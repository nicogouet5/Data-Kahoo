import React, { useState } from 'react';
import {
  Database,
  Trash2,
  CheckCircle,
  Calculator,
  ArrowRight,
  Info
} from 'lucide-react';
import { playHackerSfx } from '../utils/hackerEffects.js';

const SEMANTIC_OPTIONS = [
  'Identificador / Ruido de Sistema',
  'Cualitativa Nominal',
  'Temporal / Cuantitativa Discreta',
  'Cuantitativa Continua / Discreta (Variable o Indicador)'
];

function normalizeSemanticCategory(rawType) {
  if (rawType.includes('Identificador')) return 'Identificador / Ruido de Sistema';
  if (rawType.includes('Cualitativa Nominal')) return 'Cualitativa Nominal';
  if (rawType.includes('Temporal')) return 'Temporal / Cuantitativa Discreta';
  return 'Cuantitativa Continua / Discreta (Variable o Indicador)';
}

export default function Stage1Database({ currentCase, onCompleteStage, sfxEnabled }) {
  const [decisions, setDecisions] = useState(() => {
    const init = {};
    currentCase.columns.forEach((col) => {
      init[col.name] = {
        role: '',
        semantic: ''
      };
    });
    return init;
  });

  const [indicatorBuilt, setIndicatorBuilt] = useState(!currentCase.needsIndicator);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleRoleChange = (colName, role) => {
    if (verified) return;
    playHackerSfx('tick', sfxEnabled);
    setDecisions((prev) => ({
      ...prev,
      [colName]: {
        ...prev[colName],
        role,
        semantic:
          role === 'drop' ? 'Identificador / Ruido de Sistema' : prev[colName].semantic
      }
    }));
  };

  const handleSemanticChange = (colName, semantic) => {
    if (verified) return;
    playHackerSfx('tick', sfxEnabled);
    setDecisions((prev) => ({
      ...prev,
      [colName]: {
        ...prev[colName],
        semantic
      }
    }));
  };

  const handleVerify = () => {
    let correctCount = 0;
    const totalCols = currentCase.columns.length;
    const details = [];

    currentCase.columns.forEach((col) => {
      const userDec = decisions[col.name];
      const expectedSem = normalizeSemanticCategory(col.semanticType);
      const roleOk = userDec.role === col.role;
      const semOk = userDec.semantic === expectedSem;

      if (roleOk && semOk) {
        correctCount++;
      }
      details.push({
        name: col.name,
        isCorrect: roleOk && semOk,
        expectedRole: col.role === 'keep' ? 'Conservar variable' : 'Descartar (df.drop)',
        expectedSem,
        explanation: col.explanation
      });
    });

    const earnedPoints = Math.round((correctCount / totalCols) * 150);
    playHackerSfx(correctCount === totalCols ? 'success' : 'error', sfxEnabled);
    setVerified(true);
    setFeedback({
      correctCount,
      totalCols,
      earnedPoints,
      details
    });
  };

  const completedColsCount = currentCase.columns.filter(
    (col) => decisions[col.name]?.role && decisions[col.name]?.semantic
  ).length;
  const totalColsCount = currentCase.columns.length;
  const auditProgressPct = Math.round((completedColsCount / totalColsCount) * 100);

  const allSelected = indicatorBuilt && completedColsCount === totalColsCount;

  return (
    <section className="stage-workspace" aria-labelledby="stage1-heading">
      <div className="stage-header">
        <h2 id="stage1-heading" tabIndex={-1}>
          Fase 01 — Tipo Técnico (<code>.dtypes</code>) vs. Modelo Semántico
        </h2>
        <span className="stage-points-tag">MAX +150 XP</span>
      </div>

      <div className="pedagogical-note">
        <Info size={18} className="pedagogical-note-icon" aria-hidden="true" />
        <div>
          <strong>Protocolo Semana 3 + Clase 10:</strong> Que una columna tenga{' '}
          <code>dtype: int64</code> u <code>object</code> describe cómo la almacena Pandas, no su
          rol analítico. Purga los identificadores o ruido con <code>df.drop</code> y clasifica el
          tipo semántico de las columnas activas.
        </div>
      </div>

      <div className="dataframe-frame">
        <div className="df-code-bar">
          <span className="df-code-title">
            <Database size={14} aria-hidden="true" />{' '}
            <code>{currentCase.dataframeName}.head(6)</code> — Muestra en memoria (
            {currentCase.rows.length} registros)
          </span>
          <code className="tabular">
            shape: ({currentCase.rows.length}, {currentCase.columns.length})
          </code>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="df-preview-caption"
          className="table-region"
        >
          <table className="data-table">
            <caption id="df-preview-caption" className="sr-only">
              Vista previa de {currentCase.dataframeName} con tipos técnicos de columnas
            </caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                {currentCase.columns.map((col) => {
                  const isDropped = decisions[col.name]?.role === 'drop';
                  return (
                    <th key={col.name} scope="col">
                      <div className="th-col-name">{col.name}</div>
                      <div className="th-col-meta">
                        <span className="dtype-chip">.{col.dtype}</span>
                        {isDropped && <span className="drop-status-tag">DROP</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentCase.rows.slice(0, 6).map((row, idx) => (
                <tr key={idx}>
                  <th scope="row">{idx}</th>
                  {currentCase.columns.map((col) => (
                    <td
                      key={col.name}
                      className={decisions[col.name]?.role === 'drop' ? 'cell-dropped' : ''}
                    >
                      {String(row[col.name])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {currentCase.needsIndicator && (
        <div className={`indicator-builder-box ${indicatorBuilt ? 'built' : ''}`}>
          <div className="ind-info">
            <Calculator size={20} aria-hidden="true" />
            <div>
              <strong>Compilar Indicador (Semana 3):</strong> Para comparar rentabilidad de forma
              justa entre tiendas de distinto tamaño, primero inyectamos el indicador{' '}
              <code>{currentCase.needsIndicator.name}</code> en el DataFrame:
              <div className="ind-formula">
                <code>
                  df[&quot;{currentCase.needsIndicator.name}&quot;] ={' '}
                  {currentCase.needsIndicator.formula}
                </code>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={indicatorBuilt ? 'btn-secondary' : 'btn-primary'}
            disabled={indicatorBuilt}
            onClick={() => {
              playHackerSfx('lock', sfxEnabled);
              setIndicatorBuilt(true);
            }}
          >
            {indicatorBuilt ? '✓ Indicador Compilado' : 'Ejecutar Cálculo en df'}
          </button>
        </div>
      )}

      <div>
        <div className="audit-header-bar">
          <h3>
            Matriz de Auditoría de Columnas (<code>{currentCase.dataframeName}</code>)
          </h3>
          <div className="audit-meter-wrap tabular" aria-label="Progreso de auditoría de columnas">
            <span>
              AUDITADAS: {completedColsCount}/{totalColsCount}
            </span>
            <div className="hud-progress-track" aria-hidden="true">
              <div
                className="hud-progress-fill"
                style={{ transform: `scaleX(${auditProgressPct / 100})` }}
              />
            </div>
          </div>
        </div>

        <div className="audit-ledger">
          {currentCase.columns.map((col, idx) => {
            const userDec = decisions[col.name];
            const detail = feedback?.details.find((d) => d.name === col.name);
            const selectId = `sem-select-${col.name}`;

            return (
              <div
                key={col.name}
                style={{ '--stagger-i': Math.min(idx, 8) }}
                className={`audit-row ${
                  detail ? (detail.isCorrect ? 'row-correct' : 'row-wrong') : ''
                }`}
              >
                <div className="audit-row-grid">
                  <div>
                    <div className="audit-col-head">
                      <code className="col-title-code">{col.name}</code>
                      <span className="dtype-pill">dtype: {col.dtype}</span>
                    </div>
                    <p className="col-samples">
                      Muestra: {col.sampleValues.slice(0, 4).join(', ')}
                    </p>
                  </div>

                  <div>
                    <span className="field-label">1. Acción en limpieza</span>
                    <div className="role-toggle-group">
                      <button
                        type="button"
                        className={`role-btn keep ${userDec.role === 'keep' ? 'selected' : ''}`}
                        onClick={() => handleRoleChange(col.name, 'keep')}
                        disabled={verified}
                      >
                        <CheckCircle size={14} aria-hidden="true" /> Usar
                      </button>
                      <button
                        type="button"
                        className={`role-btn drop ${userDec.role === 'drop' ? 'selected' : ''}`}
                        onClick={() => handleRoleChange(col.name, 'drop')}
                        disabled={verified}
                      >
                        <Trash2 size={14} aria-hidden="true" /> Drop
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={selectId} className="field-label">
                      2. Clasificación en el Modelo Semántico
                    </label>
                    <select
                      id={selectId}
                      className="semantic-select"
                      value={userDec.semantic}
                      onChange={(e) => handleSemanticChange(col.name, e.target.value)}
                      disabled={verified}
                    >
                      <option value="">Selecciona tipo semántico...</option>
                      {SEMANTIC_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {detail && (
                  <div className={`audit-feedback-line ${detail.isCorrect ? 'ok' : 'err'}`}>
                    <span className="feedback-status">
                      {detail.isCorrect
                        ? '[OK]'
                        : `[ERR · ${detail.expectedRole} · ${detail.expectedSem}]`}
                    </span>
                    <span>{detail.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!verified ? (
        <div className="stage-footer-actions">
          <button
            type="button"
            className="btn-primary"
            disabled={!allSelected}
            onClick={handleVerify}
          >
            Ejecutar Auditoría de Variables
          </button>
        </div>
      ) : (
        <div className="stage-result-banner banner-ok">
          <div>
            <h3>
              Fase 01 verificada: {feedback.correctCount} de {feedback.totalCols} columnas
              exactas (+{feedback.earnedPoints} XP)
            </h3>
            <p>
              DataFrame depurado y modelo semántico validado. Procediendo al módulo de selección
              gráfica en Matplotlib.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onCompleteStage(feedback.earnedPoints)}
          >
            Avanzar a Fase 02 <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

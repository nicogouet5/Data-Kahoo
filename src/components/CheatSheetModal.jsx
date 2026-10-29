import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Layers, GitBranch, Code, Database } from 'lucide-react';
import { CHEAT_SHEET_DATA } from '../data/casesData.js';

export default function CheatSheetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tree');
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };
    dialog.addEventListener('close', handleClose);

    // Fallback for browsers where <dialog closedby="any"> is not yet supported (e.g. Safari)
    let cleanupLightDismiss = () => {};
    if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      const onPointerDown = (e) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e) => {
        if (pressedOutside && isOutside(e) && dialog.open) {
          dialog.close();
        }
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupLightDismiss = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupLightDismiss();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="app-dialog"
      aria-labelledby="cheatsheet-dialog-title"
      {...{ closedby: 'any' }}
    >
      <div className="modal-header">
        <div className="modal-title-group">
          <BookOpen size={22} className="modal-accent-icon" />
          <div>
            <h2 id="cheatsheet-dialog-title">Guía Rápida — Clase 10 HBDA</h2>
            <p>Profundización en Matplotlib, Tipos de Variables y Reglas de Storytelling</p>
          </div>
        </div>
        <form method="dialog">
          <button
            type="submit"
            value="cancel"
            className="modal-close-btn"
            aria-label="Cerrar guía"
          >
            <X size={18} />
          </button>
        </form>
      </div>

      <div className="modal-tabs" role="tablist" aria-label="Secciones de la guía">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'tree'}
          className={`tab-btn ${activeTab === 'tree' ? 'active' : ''}`}
          onClick={() => setActiveTab('tree')}
          autoFocus
        >
          <GitBranch size={15} /> ¿Qué Gráfico Usar?
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'vars'}
          className={`tab-btn ${activeTab === 'vars' ? 'active' : ''}`}
          onClick={() => setActiveTab('vars')}
        >
          <Database size={15} /> Variables vs. .dtypes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'anatomy'}
          className={`tab-btn ${activeTab === 'anatomy' ? 'active' : ''}`}
          onClick={() => setActiveTab('anatomy')}
        >
          <Layers size={15} /> Figure (fig) vs. Axes (ax)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'syntax'}
          className={`tab-btn ${activeTab === 'syntax' ? 'active' : ''}`}
          onClick={() => setActiveTab('syntax')}
        >
          <Code size={15} /> De plt. a ax.set_
        </button>
      </div>

      <div className="modal-body">
        {activeTab === 'tree' && (
          <div className="cheat-list">
            {CHEAT_SHEET_DATA.chartDecisionTree.map((item, idx) => (
              <div key={idx} className="cheat-item">
                <div className="cheat-q">{item.question}</div>
                <div className="cheat-meta">
                  Modelo Semántico: <code>{item.variables}</code>
                </div>
                <div className="cheat-chart-rec">{item.chart}</div>
                <p className="cheat-rule">
                  <strong>Regla Clase 10:</strong> {item.goldenRule}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vars' && (
          <div className="cheat-list">
            {CHEAT_SHEET_DATA.variableTypes.map((v, idx) => (
              <div key={idx} className="cheat-item">
                <div className="cheat-q">{v.type}</div>
                <div className="cheat-meta">
                  Ejemplos en BBD: <code>{v.example}</code>
                </div>
                <p className="cheat-rule">{v.action}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'anatomy' && (
          <div className="anatomy-section">
            <div className="anatomy-diagram">
              <div className="diag-fig">
                <span className="diag-tag">
                  Figure (fig) — El lienzo completo incluidos márgenes
                </span>
                <div className="diag-ax">
                  <span className="diag-tag-ax">
                    Axes (ax) — El panel de coordenadas x-y donde se dibujan los datos
                  </span>
                  <div className="diag-axes-inner">
                    <div className="diag-y-axis">Axis Y (vertical)</div>
                    <div className="diag-plot-area">
                      <code>ax.plot(x, y) · ax.bar(x, y) · ax.scatter(x, y)</code>
                      <p style={{ marginTop: '0.35rem', color: 'var(--ink-2)' }}>
                        1 Figure contiene 1 o más Axes, cada uno con Axis X y Axis Y
                      </p>
                    </div>
                  </div>
                  <div className="diag-x-axis">Axis X (horizontal)</div>
                </div>
              </div>
            </div>

            <div className="cheat-list">
              {CHEAT_SHEET_DATA.anatomy.points.map((pt, i) => (
                <div key={i} className="cheat-item">
                  <div className="cheat-q">{pt.term}</div>
                  <div className="cheat-chart-rec">{pt.code}</div>
                  <p className="cheat-rule">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'syntax' && (
          <div>
            <p className="syntax-intro">
              Desde la Clase 10 trabajamos explícitamente sobre el objeto <code>ax</code> (
              <code>fig, ax = plt.subplots()</code>) para controlar cada <strong>Axes</strong> con
              precisión:
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-labelledby="syntax-table-caption"
              className="table-region"
            >
              <table className="data-table">
                <caption id="syntax-table-caption" className="sr-only">
                  Comparación de sintaxis entre plt (Clases 8 y 9) y ax (Clase 10)
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Acción en el Gráfico</th>
                    <th scope="col">Clases 8 y 9 (con plt)</th>
                    <th scope="col">Desde Clase 10 (con ax)</th>
                  </tr>
                </thead>
                <tbody>
                  {CHEAT_SHEET_DATA.pltVsAx.map((row, idx) => (
                    <tr key={idx}>
                      <th scope="row">{row.action}</th>
                      <td>
                        <code>{row.oldPlt}</code>
                      </td>
                      <td>
                        <code className="code-highlight">{row.newAx}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

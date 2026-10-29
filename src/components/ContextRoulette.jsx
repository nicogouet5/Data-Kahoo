import React, { useState, useEffect, useCallback } from 'react';
import {
  Dices,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Headphones,
  Sparkles,
  Gauge,
  PhoneCall,
  Film,
  CheckCircle2,
  ArrowUpRight,
  PlusCircle
} from 'lucide-react';

const ICON_MAP = {
  Gamepad2,
  Trophy,
  ShoppingBag,
  Headphones,
  Sparkles,
  Gauge,
  PhoneCall,
  Film
};

export default function ContextRoulette({
  cases,
  solvedCaseIds,
  onSelectCase,
  onOpenCreator,
  modalOpen
}) {
  const [spinning, setSpinning] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'solved'
  const [query, setQuery] = useState('');

  const handleSpinRoulette = useCallback(() => {
    if (spinning || cases.length === 0) return;

    const unsolved = cases.filter((c) => !solvedCaseIds.includes(c.id));
    const pool = unsolved.length > 0 ? unsolved : cases;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setHighlightedId(chosen.id);
      onSelectCase(chosen);
      return;
    }

    setSpinning(true);
    setStatusFilter('all');
    setQuery('');

    let ticks = 0;
    const totalTicks = 16;
    const interval = setInterval(() => {
      const candidate = cases[ticks % cases.length];
      setHighlightedId(candidate.id);
      ticks++;
      if (ticks >= totalTicks) {
        clearInterval(interval);
        setHighlightedId(chosen.id);
        setTimeout(() => {
          setSpinning(false);
          onSelectCase(chosen);
        }, 520);
      }
    }, 80);
  }, [spinning, cases, solvedCaseIds, onSelectCase]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (modalOpen) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleSpinRoulette();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSpinRoulette, modalOpen]);

  const filteredCases = cases.filter((c) => {
    const isSolved = solvedCaseIds.includes(c.id);
    if (statusFilter === 'pending' && isSolved) return false;
    if (statusFilter === 'solved' && !isSolved) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.dataframeName.toLowerCase().includes(q)
    );
  });

  const pendingCount = cases.filter((c) => !solvedCaseIds.includes(c.id)).length;
  const solvedCount = cases.length - pendingCount;

  return (
    <div className="roulette-lobby">
      <section className="lobby-desk" aria-labelledby="lobby-main-title">
        <div className="lobby-pitch">
          <h1 id="lobby-main-title" className="lobby-title">
            Del Dato Crudo al <span className="title-accent">Storytelling</span> con Matplotlib
          </h1>
          <p className="lobby-lead">
            Sorteamos un contexto empresarial real para auditar su DataFrame (
            <code>.dtypes</code> frente al modelo semántico), elegir el gráfico preciso, detectar
            distorsiones en duelos <code>fig, ax</code> y redactar un titular ejecutivo que se lea
            sin explicación adicional.
          </p>
          <div className="lobby-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleSpinRoulette}
              disabled={spinning}
            >
              <Dices size={19} />
              <span>{spinning ? 'Sorteando misión...' : 'Girar Ruleta de Contexto'}</span>
              <kbd className="kbd-hint">R</kbd>
            </button>
            <button type="button" className="btn-secondary" onClick={onOpenCreator}>
              <PlusCircle size={18} />
              <span>Crear Caso en Vivo</span>
            </button>
          </div>
          <p className="lobby-progress-note">
            Progreso de la sesión: <strong>{solvedCount}</strong> de <strong>{cases.length}</strong>{' '}
            misiones completadas
          </p>
        </div>

        <div className="lobby-protocol">
          <h2 className="protocol-heading">Protocolo de cada Misión</h2>
          <ol className="protocol-steps">
            <li>
              <span className="step-index">01</span>
              <div>
                <strong>Auditoría de BBD & Modelo Semántico</strong>
                <span className="step-desc">
                  Descarta IDs/ruido con <code>df.drop</code>, construye indicadores y clasifica
                  variables.
                </span>
              </div>
            </li>
            <li>
              <span className="step-index">02</span>
              <div>
                <strong>Selección del Gráfico en Matplotlib</strong>
                <span className="step-desc">
                  Conecta Axis X y Axis Y con <code>ax.bar</code>, <code>ax.plot</code> o{' '}
                  <code>ax.scatter</code>.
                </span>
              </div>
            </li>
            <li>
              <span className="step-index">03</span>
              <div>
                <strong>Duelo Visual A vs. B</strong>
                <span className="step-desc">
                  Evalúa <code>ylim(0, 100)</code>, <code>yscale(&quot;log&quot;)</code>, color de
                  acento, <code>alpha=0.3</code> y <code>legend</code>.
                </span>
              </div>
            </li>
            <li>
              <span className="step-index">04</span>
              <div>
                <strong>Titular Ejecutivo & Código Colab</strong>
                <span className="step-desc">
                  Elige el mejor <code>ax.set_title</code> y copia el script Python completo.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section aria-labelledby="directory-heading">
        <div className="directory-toolbar">
          <h2 id="directory-heading">Banco de Contextos ({filteredCases.length})</h2>

          <div className="filter-group" role="group" aria-label="Filtrar casos por estado">
            <button
              type="button"
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({cases.length})
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              type="button"
              className={`filter-btn ${statusFilter === 'solved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('solved')}
            >
              Completados ({solvedCount})
            </button>
          </div>

          <input
            type="search"
            className="search-input"
            placeholder="Buscar industria, empresa o df..."
            aria-label="Buscar caso empresarial"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="cases-grid">
          {filteredCases.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || Gamepad2;
            const isSolved = solvedCaseIds.includes(item.id);
            const isHighlighted = highlightedId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`case-card ${isHighlighted ? 'roulette-active' : ''}`}
                onClick={() => !spinning && onSelectCase(item)}
              >
                <div>
                  <div className="case-card-top">
                    <span className="industry-label">
                      <IconComponent size={15} className="industry-icon" />
                      {item.industry}
                    </span>
                    {isSolved && (
                      <span className="solved-badge">
                        <CheckCircle2 size={13} /> Completado
                      </span>
                    )}
                  </div>

                  <h3 className="case-card-title">{item.title}</h3>
                  <p className="case-card-company">{item.company}</p>
                  <p className="case-card-desc">{item.context}</p>
                </div>

                <div className="case-card-footer">
                  <code className="df-code-tag">df: {item.dataframeName}</code>
                  <span className="play-cta">
                    Abrir caso <ArrowUpRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

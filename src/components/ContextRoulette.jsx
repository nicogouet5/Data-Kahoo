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
  PlusCircle,
  Crosshair
} from 'lucide-react';
import {
  prefersReducedMotion,
  playHackerSfx,
  useCipherScramble
} from '../utils/hackerEffects.js';

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
  modalOpen,
  sfxEnabled
}) {
  const [spinning, setSpinning] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [scanLabel, setScanLabel] = useState('STANDBY // READY_FOR_DISPATCH');
  const [scrambleTick, setScrambledTick] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'solved'
  const [query, setQuery] = useState('');

  const scrambledStatus = useCipherScramble(scanLabel, scrambleTick);

  const handleSpinRoulette = useCallback(() => {
    if (spinning || cases.length === 0) return;

    const unsolved = cases.filter((c) => !solvedCaseIds.includes(c.id));
    const pool = unsolved.length > 0 ? unsolved : cases;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    if (prefersReducedMotion()) {
      setHighlightedId(chosen.id);
      setScanLabel(`LOCKED // ${chosen.dataframeName}`);
      onSelectCase(chosen);
      return;
    }

    setSpinning(true);
    setStatusFilter('all');
    setQuery('');

    let ticks = 0;
    const totalTicks = 15;
    const interval = setInterval(() => {
      const candidate = cases[ticks % cases.length];
      setHighlightedId(candidate.id);
      setScanLabel(`SCANNING // ${candidate.dataframeName}`);
      playHackerSfx('tick', sfxEnabled);
      ticks++;
      if (ticks >= totalTicks) {
        clearInterval(interval);
        setHighlightedId(chosen.id);
        setScanLabel(`TARGET_LOCKED // ${chosen.dataframeName}`);
        setScrambledTick((k) => k + 1);
        playHackerSfx('lock', sfxEnabled);
        setTimeout(() => {
          setSpinning(false);
          onSelectCase(chosen);
        }, 480);
      }
    }, 78);
  }, [spinning, cases, solvedCaseIds, onSelectCase, sfxEnabled]);

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
  const completionPct = cases.length > 0 ? Math.round((solvedCount / cases.length) * 100) : 0;

  return (
    <div className="roulette-lobby">
      <section className="lobby-desk" aria-labelledby="lobby-main-title">
        <div className="lobby-pitch">
          <h1 id="lobby-main-title" className="lobby-title" tabIndex={-1}>
            Del Dato Crudo al <span className="title-accent">Storytelling</span> con Matplotlib
          </h1>
          <p className="lobby-lead">
            Intercepta un contexto empresarial real para auditar su DataFrame (
            <code>.dtypes</code> frente al modelo semántico), elegir el gráfico preciso, detectar
            distorsiones en duelos <code>fig, ax</code> y redactar un titular ejecutivo autónomo.
          </p>

          <div className="lobby-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleSpinRoulette}
              disabled={spinning}
            >
              <Dices size={19} aria-hidden="true" />
              <span>{spinning ? 'Escaneando Sector...' : 'Sortear Misión Aleatoria'}</span>
              <kbd className="kbd-hint">R</kbd>
            </button>
            <button type="button" className="btn-secondary" onClick={onOpenCreator}>
              <PlusCircle size={18} aria-hidden="true" />
              <span>Inyectar Caso en Vivo</span>
            </button>
          </div>

          <div className="radar-telemetry-strip" role="status" aria-live="polite">
            <span className="radar-target-code">
              <Crosshair
                size={14}
                className={spinning ? 'radar-spin-icon' : ''}
                aria-hidden="true"
              />
              <code>{scrambledStatus}</code>
            </span>
            <span className="lobby-progress-inline tabular">
              MISIONES: <strong>{solvedCount}</strong>/{cases.length} ({completionPct}%)
            </span>
          </div>
        </div>

        <div className="lobby-protocol">
          <h2 className="protocol-heading">Protocolo de Ejecución (4 Fases)</h2>
          <ol className="protocol-steps">
            <li>
              <span className="step-index">01</span>
              <div>
                <strong>Auditoría de BBD &amp; Modelo Semántico</strong>
                <span className="step-desc">
                  Purga IDs/ruido con <code>df.drop</code>, construye indicadores y clasifica
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
                <strong>Duelo Visual A vs. B + Rayos X</strong>
                <span className="step-desc">
                  Inspecciona <code>ylim(0, 100)</code>, <code>yscale(&quot;log&quot;)</code>,{' '}
                  <code>alpha=0.3</code> y <code>legend</code>.
                </span>
              </div>
            </li>
            <li>
              <span className="step-index">04</span>
              <div>
                <strong>Titular Ejecutivo &amp; Script Colab</strong>
                <span className="step-desc">
                  Elige el mejor <code>ax.set_title</code> y extrae el código Python reproducible.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section aria-labelledby="directory-heading">
        <div className="directory-toolbar">
          <h2 id="directory-heading">Sectores de Datos ({filteredCases.length})</h2>

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
            placeholder="Filtrar sector, empresa o df_..."
            aria-label="Buscar caso empresarial"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="cases-grid">
          {filteredCases.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Gamepad2;
            const isSolved = solvedCaseIds.includes(item.id);
            const isHighlighted = highlightedId === item.id;
            const sectorCode = `SEC_${String(idx + 1).padStart(2, '0')}`;

            return (
              <button
                key={item.id}
                type="button"
                style={{ '--stagger-i': Math.min(idx, 10) }}
                className={`case-card ${isHighlighted ? 'roulette-active' : ''} ${
                  isSolved ? 'case-solved' : ''
                }`}
                onMouseEnter={() => {
                  if (!spinning) {
                    setScanLabel(`READY // ${item.dataframeName}`);
                    setScrambledTick((k) => k + 1);
                  }
                }}
                onClick={() => !spinning && onSelectCase(item)}
              >
                <div>
                  <div className="case-card-top">
                    <span className="industry-label">
                      <IconComponent size={15} className="industry-icon" aria-hidden="true" />
                      <span>{item.industry}</span>
                    </span>
                    {isSolved ? (
                      <span className="solved-badge">
                        <CheckCircle2 size={13} aria-hidden="true" /> CLEAR
                      </span>
                    ) : (
                      <span className="sector-id-tag tabular">{sectorCode}</span>
                    )}
                  </div>

                  <h3 className="case-card-title">{item.title}</h3>
                  <p className="case-card-company">{item.company}</p>
                  <p className="case-card-desc">{item.context}</p>
                </div>

                <div className="case-card-footer">
                  <code className="df-code-tag">df: {item.dataframeName}</code>
                  <span className="play-cta">
                    Ejecutar <ArrowUpRight size={15} aria-hidden="true" />
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

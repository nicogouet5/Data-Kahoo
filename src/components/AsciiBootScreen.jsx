import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, Play, FastForward } from 'lucide-react';
import { prefersReducedMotion, playHackerSfx } from '../utils/hackerEffects.js';

const INNER_WIDTH = 37;

function frameBox(lines, style = 'double') {
  const [tl, h, tr, v, bl, br] =
    style === 'double'
      ? ['╔', '═', '╗', '║', '╚', '╝']
      : ['┌', '─', '┐', '│', '└', '┘'];
  const top = `${tl}${h.repeat(INNER_WIDTH)}${tr}`;
  const bottom = `${bl}${h.repeat(INNER_WIDTH)}${br}`;
  const body = lines.map((line) => `${v}${line.slice(0, INNER_WIDTH).padEnd(INNER_WIDTH, ' ')}${v}`);
  return [top, ...body, bottom].join('\n');
}

const ASCII_HERO_BANNER = frameBox(
  [
    '  ____    _  _____  _       _  ___   ',
    ' |  _ \\  / \\|_   _|/ \\     | |/ / |  ',
    ' | | | |/ _ \\ | | / _ \\ ___| \' /| |  ',
    ' | |_| / ___ \\| |/ ___ \\___| . \\|_|  ',
    ' |____/_/   \\_\\_/_/   \\_\\  |_|\\_(_)  ',
    ' ─────────────────────────────────── ',
    ' >> ARENA_OS v10.4 // CLASE_10_HBDA  '
  ],
  'double'
);

function buildLiveTelemetryAscii(progress) {
  const thresholds = [
    [82, 58, 95, 72, 100],
    [62, 42, 76, 56, 82],
    [40, 25, 52, 38, 60],
    [18, 12, 24, 18, 30]
  ];

  const colScaled = [
    Math.min(100, progress * 1.15),
    Math.min(100, Math.max(0, (progress - 12) * 1.15)),
    Math.min(100, Math.max(0, (progress - 24) * 1.25)),
    Math.min(100, Math.max(0, (progress - 36) * 1.25)),
    Math.min(100, Math.max(0, (progress - 48) * 1.9))
  ];

  const barRows = thresholds.map((rowThresholds, rowIdx) => {
    const yTick = [100, 75, 50, 25][rowIdx];
    const cells = rowThresholds
      .map((req, colIdx) => (colScaled[colIdx] >= req ? '███' : '░░░'))
      .join('   ');
    return ` ${String(yTick).padStart(3, ' ')} ┤  ${cells}`;
  });

  return frameBox(
    [
      ' fig, ax = plt.subplots()  [LIVE_AX] ',
      ...barRows,
      '   0 └───┴─────┴─────┴─────┴─────┴── ',
      '       BBD   PLOT  DUEL  STORY COLAB '
    ],
    'single'
  );
}

const BOOT_STEPS = [
  { threshold: 12, time: '00.08s', tag: 'KERNEL', msg: 'pandas.DataFrame (.dtypes vs semántico)', status: 'OK' },
  { threshold: 36, time: '00.41s', tag: 'SUBPLT', msg: 'matplotlib Figure (fig) & Axes (ax)', status: 'OK' },
  { threshold: 62, time: '00.84s', tag: 'CORPUS', msg: '09 contextos empresariales indexados', status: 'OK' },
  { threshold: 86, time: '01.29s', tag: 'X_RAY ', msg: 'scanner A/B ylim(0) + yscale("log")', status: 'OK' },
  { threshold: 100, time: '01.68s', tag: 'STORY ', msg: 'protocolo ax.set_title ejecutivo', status: 'READY' }
];

export default function AsciiBootScreen({ onEnterArena, sfxEnabled }) {
  const reduced = prefersReducedMotion();
  const [progress, setProgress] = useState(() => (reduced ? 100 : 8));

  const finishBootAndEnter = useCallback(() => {
    playHackerSfx('boot', sfxEnabled);
    onEnterArena();
  }, [onEnterArena, sfxEnabled]);

  useEffect(() => {
    if (reduced) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const delta = prev < 50 ? 7 : prev < 85 ? 6 : 5;
        return Math.min(100, prev + delta);
      });
    }, 85);

    return () => clearInterval(interval);
  }, [reduced]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        finishBootAndEnter();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finishBootAndEnter]);

  const isReady = progress >= 100;
  const barSegments = 22;
  const filledSegments = Math.round((progress / 100) * barSegments);
  const asciiProgressBar = `[${'█'.repeat(filledSegments)}${'░'.repeat(barSegments - filledSegments)}]`;

  return (
    <section className="boot-screen-shell" aria-labelledby="boot-hero-heading">
      <div className="boot-terminal-frame">
        <div className="boot-top-strip">
          <span className="boot-sys-id">
            <Terminal size={15} aria-hidden="true" />
            <span>TTY://DATAVIZ_ARENA_OS · KERNEL_10.4</span>
          </span>
          <span className={`boot-status-pill ${isReady ? 'ready' : 'loading'}`}>
            {isReady ? 'ONLINE // LISTO' : `CARGANDO // ${progress}%`}
          </span>
        </div>

        <div className="boot-hero-body">
          <div className="boot-heading-group">
            <h1 id="boot-hero-heading" className="boot-main-title">
              Simulador Táctico de <span className="title-accent">Visualización & Storytelling</span>
            </h1>
            <p className="boot-subtitle">
              Audita bases de datos reales, separa <code>.dtypes</code> del modelo semántico,
              desbloquea duelos <code>fig, ax</code> en Matplotlib y domina la narrativa ejecutiva
              de la Clase 10 HBDA.
            </p>
          </div>

          <div className="ascii-hero-grid" aria-hidden="true">
            <pre className="ascii-art-block ascii-logo-art">{ASCII_HERO_BANNER}</pre>
            <pre className="ascii-art-block ascii-telemetry-art">
              {buildLiveTelemetryAscii(progress)}
            </pre>
          </div>

          <div className="boot-log-panel" role="status" aria-live="polite">
            <div className="boot-progress-row">
              <code className="boot-ascii-meter tabular">
                BOOT_SEQ {asciiProgressBar} {String(progress).padStart(3, ' ')}%
              </code>
              <span className="boot-mem-tag tabular">MEM: 64.0 MB · FPS: 60</span>
            </div>

            <ul className="boot-log-list">
              {BOOT_STEPS.map((step) => {
                const unlocked = progress >= step.threshold;
                return (
                  <li
                    key={step.tag}
                    className={`boot-log-item ${unlocked ? 'visible' : 'pending'}`}
                  >
                    <span className="log-time tabular">[{step.time}]</span>
                    <span className="log-tag">{step.tag}</span>
                    <span className="log-msg">{step.msg}</span>
                    <span className={`log-status ${step.status === 'READY' ? 'ready' : ''}`}>
                      [{unlocked ? step.status : 'WAIT'}]
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="boot-cta-bar">
            <button
              type="button"
              className={`btn-primary boot-launch-btn ${isReady ? 'pulse-ready' : ''}`}
              onClick={finishBootAndEnter}
            >
              <Play size={18} aria-hidden="true" />
              <span>{isReady ? 'Iniciar Terminal de Misiones' : 'Entrar Ahora a la Terminal'}</span>
              <kbd className="kbd-hint">Enter</kbd>
            </button>

            {!isReady && (
              <button
                type="button"
                className="btn-secondary"
                onClick={finishBootAndEnter}
              >
                <FastForward size={16} aria-hidden="true" />
                <span>Saltar Carga</span>
                <kbd className="kbd-hint">Esc</kbd>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

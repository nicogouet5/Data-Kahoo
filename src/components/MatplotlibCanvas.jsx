import React, { useState } from 'react';
import { Eye, Layers } from 'lucide-react';

/**
 * Motor SVG que emula con fidelidad los gráficos de Matplotlib de la Clase 10:
 * - Figure (fig) y Axes (ax) con modo "Rayos X" (Diapo 4)
 * - Barras (ax.bar) con ylim truncado vs ylim(0, max), colores arcoíris vs acento, figsize ancho vs etiquetas pisadas o rotadas
 * - Líneas simples y multiserie (ax.plot) con escala lineal vs logarítmica, set_xticks, marker, linestyle y leyenda con loc
 * - Dispersión (ax.scatter) con solapamiento opaco vs alpha=0.3 + grid(True)
 */
export default function MatplotlibCanvas({
  rows,
  config = {},
  allowXRay = true,
  xrayOverride = null
}) {
  const [localXray, setLocalXray] = useState(false);
  const xrayMode = typeof xrayOverride === 'boolean' ? xrayOverride : localXray;

  const {
    type = 'bar',
    xKey,
    yKey,
    y2Key,
    yLabel1 = 'Serie 1',
    yLabel2 = 'Serie 2',
    title = '',
    xlabel = '',
    ylabel = '',
    ylim = null,
    yScale = 'linear',
    showAllXChecks = true,
    wideFig = false,
    overlapLabels = false,
    rotateLabels = 0,
    colors = null,
    legendLoc = 'none',
    styledLines = false,
    alpha = 1.0,
    grid = false,
    marker = null
  } = config;

  const svgWidth = wideFig ? 760 : 520;
  const svgHeight = 330;
  const margin = { top: 44, right: 32, bottom: rotateLabels ? 74 : 58, left: 66 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  const xValues = rows.map((r) => r[xKey]);
  const yValues = rows.map((r) => Number(r[yKey]));
  const y2Values = y2Key ? rows.map((r) => Number(r[y2Key])) : [];
  const allY = [...yValues, ...y2Values].filter((v) => !Number.isNaN(v));

  let minY = 0;
  let maxY = Math.max(...allY, 10);

  if (yScale === 'log') {
    minY = 100;
    maxY = 100000;
  } else if (ylim && Array.isArray(ylim)) {
    minY = ylim[0];
    maxY = ylim[1];
  } else if (type === 'bar') {
    minY = 0;
    maxY = Math.ceil(maxY * 1.12);
  } else {
    const rawMin = Math.min(...allY);
    const rawMax = Math.max(...allY);
    const pad = (rawMax - rawMin) * 0.1 || 5;
    minY = Math.max(0, Math.floor(rawMin - pad));
    maxY = Math.ceil(rawMax + pad);
  }

  const mapY = (val) => {
    if (yScale === 'log') {
      const safeVal = Math.max(val, minY);
      const logMin = Math.log10(minY);
      const logMax = Math.log10(maxY);
      const ratio = (Math.log10(safeVal) - logMin) / (logMax - logMin);
      return margin.top + plotHeight - ratio * plotHeight;
    }
    const clamped = Math.max(minY, Math.min(maxY, val));
    const ratio = (clamped - minY) / (maxY - minY || 1);
    return margin.top + plotHeight - ratio * plotHeight;
  };

  const mapXIndex = (idx) => {
    if (type === 'bar') {
      const step = plotWidth / rows.length;
      return margin.left + step * idx + step / 2;
    }
    if (type === 'scatter') {
      const numX = xValues.map(Number);
      const minX = Math.min(...numX);
      const maxX = Math.max(...numX);
      const padX = 0.4;
      const ratio = (Number(xValues[idx]) - (minX - padX)) / (maxX + padX - (minX - padX));
      return margin.left + ratio * plotWidth;
    }
    if (rows.length <= 1) return margin.left + plotWidth / 2;
    return margin.left + (idx / (rows.length - 1)) * plotWidth;
  };

  let yTicks = [];
  if (yScale === 'log') {
    yTicks = [
      { value: 100, label: '100' },
      { value: 1000, label: '1.000' },
      { value: 10000, label: '10.000' },
      { value: 100000, label: '100.000' }
    ];
  } else {
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const v = minY + ((maxY - minY) / steps) * i;
      const formatted = Number.isInteger(v) ? String(v) : v.toFixed(1);
      yTicks.push({ value: v, label: formatted });
    }
  }

  const uniqueScatterX =
    type === 'scatter' ? [...new Set(xValues.map(Number))].sort((a, b) => a - b) : [];

  const getLegendCoords = () => {
    const boxW = 92;
    const boxH = 44;
    if (legendLoc === 'upper left') {
      return { x: margin.left + 10, y: margin.top + 10, boxW, boxH };
    }
    if (legendLoc === 'upper right') {
      return { x: margin.left + plotWidth - boxW - 10, y: margin.top + 10, boxW, boxH };
    }
    if (legendLoc === 'lower right') {
      return {
        x: margin.left + plotWidth - boxW - 10,
        y: margin.top + plotHeight - boxH - 10,
        boxW,
        boxH
      };
    }
    if (legendLoc === 'empty') {
      return {
        x: margin.left + plotWidth - 40,
        y: margin.top + plotHeight - 30,
        boxW: 26,
        boxH: 20
      };
    }
    return null;
  };

  const legendBox = getLegendCoords();

  return (
    <div className="mpl-wrapper">
      {allowXRay && xrayOverride === null && (
        <div className="mpl-toolbar">
          <span className="mpl-badge">
            <Layers size={13} /> Salida Matplotlib (pyplot)
          </span>
          <button
            type="button"
            className={`xray-btn ${xrayMode ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setLocalXray(!localXray);
            }}
            title="Inspeccionar anatomía Figure (fig) vs Axes (ax)"
          >
            <Eye size={13} />
            {xrayMode ? 'Ocultar Anatomía fig/ax' : 'Rayos X: Figure vs. Axes'}
          </button>
        </div>
      )}

      <div className={`mpl-figure-container ${xrayMode ? 'xray-active' : ''}`}>
        {xrayMode && (
          <div className="xray-fig-tag">
            Figure (fig) — Lienzo completo {wideFig ? 'figsize=(12, 4.5)' : 'figsize=(6.4, 4.8)'}
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mpl-svg"
          role="img"
          aria-label={title || 'Gráfico renderizado de Matplotlib'}
        >
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill={xrayMode ? '#dbeafe' : '#ffffff'}
            stroke={xrayMode ? '#1d4ed8' : '#cbd5e1'}
            strokeWidth={xrayMode ? '3' : '1'}
          />

          <rect
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
            fill="#ffffff"
            stroke={xrayMode ? '#b45309' : '#1e293b'}
            strokeWidth={xrayMode ? '2.5' : '1.2'}
            strokeDasharray={xrayMode ? '6 3' : 'none'}
          />

          {xrayMode && (
            <text
              x={margin.left + plotWidth / 2}
              y={margin.top + 18}
              textAnchor="middle"
              fill="#b45309"
              fontSize="11"
              fontWeight="700"
            >
              Axes (ax) — Área de coordenadas x-y donde se dibujan los datos
            </text>
          )}

          {grid && (
            <g className="mpl-grid">
              {yTicks.map((t, i) => {
                const yPos = mapY(t.value);
                return (
                  <line
                    key={`gy-${i}`}
                    x1={margin.left}
                    x2={margin.left + plotWidth}
                    y1={yPos}
                    y2={yPos}
                    stroke="#cbd5e1"
                    strokeWidth="0.9"
                  />
                );
              })}
              {type === 'scatter'
                ? uniqueScatterX.map((vx, i) => {
                    const numX = xValues.map(Number);
                    const minX = Math.min(...numX);
                    const maxX = Math.max(...numX);
                    const padX = 0.4;
                    const ratio = (vx - (minX - padX)) / (maxX + padX - (minX - padX));
                    const xPos = margin.left + ratio * plotWidth;
                    return (
                      <line
                        key={`gx-${i}`}
                        x1={xPos}
                        x2={xPos}
                        y1={margin.top}
                        y2={margin.top + plotHeight}
                        stroke="#cbd5e1"
                        strokeWidth="0.9"
                      />
                    );
                  })
                : rows.map((_, idx) => {
                    const xPos = mapXIndex(idx);
                    return (
                      <line
                        key={`gx-${idx}`}
                        x1={xPos}
                        x2={xPos}
                        y1={margin.top}
                        y2={margin.top + plotHeight}
                        stroke="#e2e8f0"
                        strokeWidth="0.8"
                      />
                    );
                  })}
            </g>
          )}

          {title && (
            <text
              x={margin.left + plotWidth / 2}
              y={margin.top - 12}
              textAnchor="middle"
              fill="#0f172a"
              fontSize={wideFig ? '14.5' : '13'}
              fontWeight="600"
              fontFamily="sans-serif"
            >
              {title}
            </text>
          )}

          {yTicks.map((t, idx) => {
            const yPos = mapY(t.value);
            return (
              <g key={`ytick-${idx}`}>
                <line
                  x1={margin.left - 5}
                  x2={margin.left}
                  y1={yPos}
                  y2={yPos}
                  stroke="#1e293b"
                  strokeWidth="1.1"
                />
                <text
                  x={margin.left - 8}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="#1e293b"
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {t.label}
                </text>
              </g>
            );
          })}

          {ylabel && (
            <text
              transform={`translate(18, ${margin.top + plotHeight / 2}) rotate(-90)`}
              textAnchor="middle"
              fill={xrayMode ? '#1d4ed8' : '#0f172a'}
              fontSize="12"
              fontWeight={xrayMode ? '700' : '500'}
              fontFamily="sans-serif"
            >
              {xrayMode ? `Axis Y: ${ylabel}` : ylabel}
            </text>
          )}

          {type === 'bar' &&
            rows.map((r, idx) => {
              const step = plotWidth / rows.length;
              const barW = Math.min(step * 0.66, 78);
              const centerX = mapXIndex(idx);
              const val = Number(r[yKey]);
              const topY = mapY(val);
              const barH = Math.max(0, margin.top + plotHeight - topY);
              const barColor = colors && colors[idx] ? colors[idx] : '#1f77b4';

              return (
                <g key={`bar-${idx}`}>
                  <rect
                    x={centerX - barW / 2}
                    y={topY}
                    width={barW}
                    height={barH}
                    fill={barColor}
                  />
                </g>
              );
            })}

          {type === 'line' && (
            <g>
              <polyline
                fill="none"
                stroke="#1f77b4"
                strokeWidth="2.2"
                points={rows
                  .map((r, idx) => `${mapXIndex(idx)},${mapY(Number(r[yKey]))}`)
                  .join(' ')}
              />
              {marker &&
                rows.map((r, idx) => (
                  <circle
                    key={`pt-${idx}`}
                    cx={mapXIndex(idx)}
                    cy={mapY(Number(r[yKey]))}
                    r="3.8"
                    fill="#1f77b4"
                  />
                ))}
            </g>
          )}

          {type === 'multiline' && (
            <g>
              <polyline
                fill="none"
                stroke={styledLines ? '#000080' : '#1f77b4'}
                strokeWidth={styledLines ? '2.5' : '1.8'}
                points={rows
                  .map((r, idx) => `${mapXIndex(idx)},${mapY(Number(r[yKey]))}`)
                  .join(' ')}
              />
              {styledLines &&
                rows.map((r, idx) => (
                  <circle
                    key={`s1-${idx}`}
                    cx={mapXIndex(idx)}
                    cy={mapY(Number(r[yKey]))}
                    r="3.8"
                    fill="#000080"
                  />
                ))}

              <polyline
                fill="none"
                stroke="#ff8c00"
                strokeWidth={styledLines ? '2.5' : '1.8'}
                strokeDasharray={styledLines ? '6 4' : 'none'}
                points={rows
                  .map((r, idx) => `${mapXIndex(idx)},${mapY(Number(r[y2Key]))}`)
                  .join(' ')}
              />
              {styledLines &&
                rows.map((r, idx) => (
                  <rect
                    key={`s2-${idx}`}
                    x={mapXIndex(idx) - 3.5}
                    y={mapY(Number(r[y2Key])) - 3.5}
                    width="7"
                    height="7"
                    fill="#ff8c00"
                  />
                ))}
            </g>
          )}

          {type === 'scatter' && (
            <g>
              {rows.map((r, idx) => (
                <circle
                  key={`sc-${idx}`}
                  cx={mapXIndex(idx)}
                  cy={mapY(Number(r[yKey]))}
                  r="5.2"
                  fill="#1f77b4"
                  fillOpacity={alpha}
                  stroke="#1f77b4"
                  strokeOpacity={Math.min(1, alpha + 0.15)}
                />
              ))}
            </g>
          )}

          {type === 'scatter'
            ? uniqueScatterX.map((vx, i) => {
                const numX = xValues.map(Number);
                const minX = Math.min(...numX);
                const maxX = Math.max(...numX);
                const padX = 0.4;
                const ratio = (vx - (minX - padX)) / (maxX + padX - (minX - padX));
                const xPos = margin.left + ratio * plotWidth;
                return (
                  <g key={`xt-sc-${i}`}>
                    <line
                      x1={xPos}
                      x2={xPos}
                      y1={margin.top + plotHeight}
                      y2={margin.top + plotHeight + 5}
                      stroke="#1e293b"
                    />
                    <text
                      x={xPos}
                      y={margin.top + plotHeight + 18}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize="11"
                    >
                      {vx}
                    </text>
                  </g>
                );
              })
            : rows.map((r, idx) => {
                if (!showAllXChecks && idx % 2 === 0 && type !== 'bar') {
                  return null;
                }
                const xPos = mapXIndex(idx);
                const rawLabel = String(r[xKey]);
                const yTickText = margin.top + plotHeight + 17;

                return (
                  <g key={`xt-${idx}`}>
                    <line
                      x1={xPos}
                      x2={xPos}
                      y1={margin.top + plotHeight}
                      y2={margin.top + plotHeight + 5}
                      stroke="#1e293b"
                    />
                    <text
                      x={xPos}
                      y={yTickText}
                      textAnchor={rotateLabels ? 'end' : 'middle'}
                      transform={
                        rotateLabels ? `rotate(-${rotateLabels}, ${xPos}, ${yTickText})` : undefined
                      }
                      fill={overlapLabels ? '#b91c1c' : '#1e293b'}
                      fontSize={overlapLabels ? '12.5' : '11'}
                      fontFamily="sans-serif"
                    >
                      {rawLabel}
                    </text>
                  </g>
                );
              })}

          {xlabel && (
            <text
              x={margin.left + plotWidth / 2}
              y={svgHeight - 10}
              textAnchor="middle"
              fill={xrayMode ? '#1d4ed8' : '#0f172a'}
              fontSize="12"
              fontWeight={xrayMode ? '700' : '500'}
              fontFamily="sans-serif"
            >
              {xrayMode ? `Axis X: ${xlabel}` : xlabel}
            </text>
          )}

          {legendBox && (
            <g className="mpl-legend">
              <rect
                x={legendBox.x}
                y={legendBox.y}
                width={legendBox.boxW}
                height={legendBox.boxH}
                rx="3"
                fill="#ffffff"
                fillOpacity="0.92"
                stroke="#cbd5e1"
              />
              {legendLoc !== 'empty' && (
                <>
                  <line
                    x1={legendBox.x + 8}
                    x2={legendBox.x + 28}
                    y1={legendBox.y + 14}
                    y2={legendBox.y + 14}
                    stroke={styledLines ? '#000080' : '#1f77b4'}
                    strokeWidth="2.2"
                  />
                  {styledLines && (
                    <circle cx={legendBox.x + 18} cy={legendBox.y + 14} r="3.2" fill="#000080" />
                  )}
                  <text
                    x={legendBox.x + 34}
                    y={legendBox.y + 18}
                    fontSize="11"
                    fill="#0f172a"
                    fontFamily="sans-serif"
                  >
                    {yLabel1}
                  </text>

                  <line
                    x1={legendBox.x + 8}
                    x2={legendBox.x + 28}
                    y1={legendBox.y + 31}
                    y2={legendBox.y + 31}
                    stroke="#ff8c00"
                    strokeWidth="2.2"
                    strokeDasharray={styledLines ? '4 2' : 'none'}
                  />
                  {styledLines && (
                    <rect
                      x={legendBox.x + 15}
                      y={legendBox.y + 28}
                      width="6"
                      height="6"
                      fill="#ff8c00"
                    />
                  )}
                  <text
                    x={legendBox.x + 34}
                    y={legendBox.y + 35}
                    fontSize="11"
                    fill="#0f172a"
                    fontFamily="sans-serif"
                  >
                    {yLabel2}
                  </text>
                </>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

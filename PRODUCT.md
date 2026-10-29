# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ayudante universitario y estudiantes del curso *Herramientas Básicas de Data Analysis (HBDA)* durante una ayudantía presencial proyectada en sala (modo presentador / torneo por equipos) y en práctica autónoma desde computador o navegador móvil a través de GitHub Pages.

## Product Purpose

Data-Kahoo (DataViz Arena) transforma el repaso teórico de la Clase 10 (*Profundización en Matplotlib*) y la Semana 3 (*Variables vs. Indicadores y Modelo Semántico*) en un juego competitivo por rondas sobre contextos empresariales reales. El éxito se mide en que los equipos logren:
1. Distinguir el tipo técnico (`.dtypes`) del rol y tipo semántico de cada columna (descartando IDs/ruido y construyendo indicadores cuando faltan).
2. Seleccionar el gráfico adecuado según las variables y la pregunta de negocio (`ax.bar`, `ax.plot` simple o multiserie, `ax.scatter`).
3. Detectar distorsiones y malas prácticas visuales en duelos A vs. B (`ylim(0, 100)` en barras, `yscale("log")`, color de acento frente a arcoíris, `alpha=0.3` + `grid(True)` para puntos superpuestos, `legend(loc=...)`, `figsize` vs. `labelrotation`).
4. Sintetizar el hallazgo con un titular ejecutivo de Storytelling (`ax.set_title`) acompañado del código Python orientado a objetos (`fig, ax = plt.subplots()`).

## Positioning

A diferencia de un quiz genérico de opción múltiple, cada misión conecta una tabla de datos real (`DataFrame`) con un motor interactivo de Matplotlib que renderiza las decisiones de código en vivo e incluye inspección anatómica (`Figure` vs. `Axes` vs. `Axis`), culminando en código reproducible para Google Colab / Jupyter.

## Operating Context

Se proyecta en el telón o pantalla de la sala de clases con luz ambiente media, donde los estudiantes leen tablas, gráficos y bloques de código a distancia mientras compiten en equipos por turnos, o se abre directamente desde el enlace estático de GitHub Pages (`nicogouet5.github.io/Data-Kahoo`) sin depender de un servidor backend obligatorio.

## Capabilities and Constraints

- Funciona 100% en cliente para despliegue estático en GitHub Pages, manteniendo compatibilidad opcional con servidor local Node.js/Express.
- Incluye 9 casos empresariales curados (Videojuegos, Fútbol, Moda/Retail, Streaming Musical, Marketing de Influencers, Fórmula 1, Delivery/Soporte de Diapo 30, Cine y Streetwear/Sneakers) más un creador rápido de casos en vivo con persistencia en `localStorage`.
- Incluye marcador de equipos editable, selector aleatorio (ruleta de casos) y guía de consulta rápida (Cheat Sheet de Clase 10).
- Todos los conceptos, ejemplos numéricos y fragmentos de código respetan estrictamente la pedagogía del curso HBDA.

## Brand Commitments

Voz directa, ágil y rigurosa en español académico-práctico. Estética oscura de tablero competitivo de datos (inspirada en programas de concurso televisivo / consolas tácticas de telemetría y deportes), evitando clichés de plantillas IA (sin gradientes púrpura-cian, sin texto con gradiente, sin bordes laterales gruesos en tarjetas redondeadas, sin etiquetas eyebrow sobre cada titular).

## Evidence on Hand

- Material oficial de cátedra: `Clase_10_HBDA_Es.pdf` (casos de Electrohogar, Web vs. App, Couriers `ylim`, App `yscale("log")`, Defectos con color de acento, 30 campañas `scatter` con `alpha=0.3`, y Llamadas por hora) y `Guia_Clase03_Variables.md`.
- No existen testimonios externos ni métricas comerciales; no deben inventarse.

## Product Principles

1. **Legibilidad de proyección en sala.** Todo texto, tabla, gráfico y bloque de código debe leerse con nitidez desde el fondo de una sala universitaria.
2. **Rigor estadístico y visual.** La interfaz misma debe predicar con el ejemplo de la Clase 10: cero ruido cromático, jerarquía clara y uso intencional del color de acento.
3. **Flujo sin fricción para el ayudante.** Girar un caso, cambiar el turno de un equipo o abrir la guía teórica toma un clic y nunca bloquea el ritmo de la clase.
4. **Autonomía estática.** Toda funcionalidad del juego opera sin conexión a backend para garantizar disponibilidad permanente en GitHub Pages.

## Accessibility & Inclusion

Estándar WCAG 2.1 AA: contraste mínimo 4.5:1 en texto de lectura y 3:1 en titulares y controles, navegación completa por teclado con anillos de foco visibles, respeto por `prefers-reduced-motion` y distinción de estados mediante forma, texto y posición además del color.

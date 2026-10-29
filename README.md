# Data-Kahoo // ARENA_OS (Ayudantía Clase 10 HBDA)

Videojuego competitivo estilo **Terminal Hacker (`ARENA_OS v10.4`)** para repasar **Tipos de Variables vs. `.dtypes`**, **Modelo Semántico**, **Profundización en Matplotlib (`fig, ax = plt.subplots()`)** y **Storytelling con Datos** durante la ayudantía de *Herramientas Básicas de Data Analysis (HBDA)*.

- **Demo en vivo (GitHub Pages):** [https://nicogouet5.github.io/Data-Kahoo/](https://nicogouet5.github.io/Data-Kahoo/)

## Novedades de Interfaz Hacker & Animaciones

- **Pantalla de Arranque Hero ASCII Art (`AsciiBootScreen`):** Secuencia de carga tipo terminal con logo ASCII en bloques, monitor en vivo de `fig, ax = plt.subplots()`, log secuencial de módulos (`pandas`, `matplotlib`, `storytelling`) y acceso directo con `Enter` o `Esc` (reproducible en cualquier momento desde el botón `>_` de la barra superior).
- **Animaciones Limpias en el Compositor (`View Transitions` + `@starting-style`):** Transiciones espaciales entre fases con enrutamiento accesible de foco, cascada escalonada (*stagger*) en sectores de datos, decodificación tipo *cipher scramble* al escanear misiones, barrido láser en modo **Scanner Rayos X (`fig` vs. `ax`)**, contador dinámico de XP y efectos opcionales de audio sintético (`Web Audio API`).
- **Modo Dual Proyector / Terminal:** Alterna entre **Terminal Hacker Oscuro** (obsidiana fósforo + verde Matrix) y **Modo Proyector Claro** para salas muy iluminadas.

## Estructura Pedagógica (4 Fases por Misión)

1. **Fase 01 — Auditoría de Base de Datos (`.dtypes` vs. Modelo Semántico):** Inspecciona `df.head()`, purga identificadores o ruido (`df.drop`), compila indicadores porcentuales cuando las variables brutas no bastan y clasifica cada columna.
2. **Fase 02 — Selección del Método en `Axes (ax)`:** Conecta `Axis X` y `Axis Y` con el gráfico apropiado (`ax.bar`, `ax.plot` simple o multiserie, `ax.scatter`).
3. **Fase 03 — Duelo Visual A vs. B (`Figure` vs. `Axes`):** Compara dos salidas de código reales lado a lado (con **Scanner Rayos X** para inspeccionar `Figure`, `Axes` y `Axis`) evaluando `ylim(0, 100)`, `yscale("log")`, color de acento único, `alpha=0.3` + `grid(True)`, `legend(loc=...)`, `marker`/`linestyle` y `figsize`.
4. **Fase 04 — Titular Ejecutivo de Storytelling & Script Colab:** Selecciona el mejor `ax.set_title(...)` para que el gráfico se lea sin explicación adicional y copia el script Python completo listo para Google Colab o Jupyter.

## Atajos de Teclado en Sala

- `Enter` / `Esc`: Entrar o saltar la secuencia Hero ASCII de arranque.
- `R`: Sortear misión aleatoria en el directorio de sectores.
- `G`: Abrir o cerrar el **Manual de Campo — Clase 10 HBDA**.
- `A` / `B`: Seleccionar rápidamente `BUILD_A` o `BUILD_B` en los duelos visuales.

## Ejecución Local

```bash
npm install
npm run dev
```

Para levantar opcionalmente también la API local en Express (`http://localhost:3001`):

```bash
npm run server
```

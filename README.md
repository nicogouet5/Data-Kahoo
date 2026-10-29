# Data-Kahoo · DataViz Arena (Ayudantía Clase 10 HBDA)

Juego competitivo e interactivo para repasar **Tipos de Variables vs. `.dtypes`**, **Modelo Semántico**, **Profundización en Matplotlib (`fig, ax = plt.subplots()`)** y **Storytelling con Datos** durante la ayudantía de *Herramientas Básicas de Data Analysis (HBDA)*.

- **Demo en vivo (GitHub Pages):** [https://nicogouet5.github.io/Data-Kahoo/](https://nicogouet5.github.io/Data-Kahoo/)

## Estructura Pedagógica (4 Etapas por Ronda)

1. **Auditoría de Base de Datos (`.dtypes` vs. Modelo Semántico):** Inspecciona `df.head()`, descarta identificadores o ruido de sistema (`df.drop`), construye indicadores porcentuales cuando las variables brutas no bastan y clasifica cada columna (*Cualitativa Nominal*, *Temporal / Discreta*, *Cuantitativa Continua / Discreta*).
2. **Selección del Gráfico en Matplotlib:** Conecta `Axis X` y `Axis Y` con el gráfico apropiado (`ax.bar`, `ax.plot` simple o multiserie, `ax.scatter`).
3. **Duelo Visual A vs. B (`Figure` vs. `Axes`):** Compara dos salidas de código reales lado a lado (con modo **Rayos X** para inspeccionar `Figure`, `Axes` y `Axis`) evaluando las reglas de la Clase 10:
   - `ax.set_ylim(0, 100)` en gráficos de barras para no exagerar diferencias pequeñas.
   - `ax.set_yscale("log")` cuando los valores abarcan varios órdenes de magnitud.
   - Color de acento único frente a barras arcoíris decorativas.
   - `alpha=0.3` + `ax.grid(True)` en `ax.scatter()` cuando existen puntos superpuestos.
   - `ax.legend(loc=...)`, `marker`, `linestyle` y `figsize` ancho frente a etiquetas rotadas o pisadas.
4. **Titular Ejecutivo de Storytelling & Código Colab:** Selecciona el mejor `ax.set_title(...)` para que el gráfico se lea sin explicación adicional y copia el script Python completo listo para Google Colab o Jupyter Notebook.

## Atajos para Proyección en Sala

- `R`: Girar la ruleta de contextos empresariales en el directorio.
- `G`: Abrir o cerrar la **Guía Rápida — Clase 10 HBDA**.
- `A` / `B`: Seleccionar rápidamente la Versión A o Versión B durante los duelos visuales.
- **Modo Estudio Oscuro / Proyector Claro:** Alterna el esquema de color desde la esquina superior derecha según la iluminación de la sala.

## Ejecución Local

```bash
npm install
npm run dev
```

Para levantar opcionalmente también la API local en Express (`http://localhost:3001`):

```bash
npm run server
```

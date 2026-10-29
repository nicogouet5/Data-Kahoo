export const INITIAL_CASES = [
  {
    id: 'videojuegos-indie-rpg',
    industry: 'Videojuegos & Esports',
    icon: 'Gamepad2',
    badgeColor: '#f0b429',
    title: 'Lanzamiento Viral de "ChronoValparaíso RPG" en Steam',
    company: 'Andes Pixel Studios',
    context: 'El estudio lanzó su RPG indie hace 12 meses. Los inversionistas dicen que el juego "estuvo muerto los primeros 6 meses y recién despegó en el mes 8", pero el Director de Producto sospecha que el ritmo porcentual de crecimiento fue altísimo al inicio y que ahora se está desacelerando.',
    businessQuestion: '¿Cómo evolucionaron los jugadores activos mensuales del mes 1 al 12, y cómo visualizar tanto el volumen total como el ritmo real de crecimiento?',
    dataframeName: 'jugadores_steam',
    columns: [
      {
        name: 'build_hash',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['v1.0.2a', 'v1.0.5b', 'v1.1.0c', 'v1.1.4f', 'v1.2.0a'],
        explanation: 'Es un código técnico de versión del motor de juego; no aporta a medir la evolución de jugadores por mes (usar df.drop).'
      },
      {
        name: 'mes_lanzamiento',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Temporal / Cuantitativa Discreta',
        sampleValues: [1, 2, 3, 4, 5],
        explanation: 'Representa el tiempo transcurrido (meses 1 al 12 desde el estreno). Va en el eje horizontal (Axis X).'
      },
      {
        name: 'usuarios_activos',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Discreta',
        sampleValues: [150, 320, 700, 1500, 3100],
        explanation: 'Cantidad de jugadores activos mensuales (pasa de 150 en el mes 1 a 86.000 en el mes 12). Va en el eje vertical (Axis Y).'
      },
      {
        name: 'servidor_id',
        dtype: 'int64',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: [9001, 9001, 9001, 9002, 9002],
        explanation: 'Aunque su dtype es int64 (numérico), semánticamente es solo un ID interno del servidor AWS.'
      }
    ],
    rows: [
      { build_hash: 'v1.0.1', mes_lanzamiento: 1, usuarios_activos: 150, servidor_id: 9001 },
      { build_hash: 'v1.0.4', mes_lanzamiento: 2, usuarios_activos: 320, servidor_id: 9001 },
      { build_hash: 'v1.1.0', mes_lanzamiento: 3, usuarios_activos: 700, servidor_id: 9001 },
      { build_hash: 'v1.1.2', mes_lanzamiento: 4, usuarios_activos: 1500, servidor_id: 9001 },
      { build_hash: 'v1.2.0', mes_lanzamiento: 5, usuarios_activos: 3100, servidor_id: 9002 },
      { build_hash: 'v1.2.5', mes_lanzamiento: 6, usuarios_activos: 6600, servidor_id: 9002 },
      { build_hash: 'v1.3.0', mes_lanzamiento: 7, usuarios_activos: 14000, servidor_id: 9002 },
      { build_hash: 'v1.4.0', mes_lanzamiento: 8, usuarios_activos: 29000, servidor_id: 9003 },
      { build_hash: 'v1.4.8', mes_lanzamiento: 9, usuarios_activos: 41000, servidor_id: 9003 },
      { build_hash: 'v1.5.0', mes_lanzamiento: 10, usuarios_activos: 55000, servidor_id: 9003 },
      { build_hash: 'v1.5.5', mes_lanzamiento: 11, usuarios_activos: 70000, servidor_id: 9003 },
      { build_hash: 'v1.6.0', mes_lanzamiento: 12, usuarios_activos: 86000, servidor_id: 9003 }
    ],
    chartQuestion: {
      prompt: 'Queremos analizar la evolución mensual continua y el ritmo de crecimiento entre el mes 1 (150 usuarios) y el mes 12 (86.000 usuarios). ¿Qué gráfico de Matplotlib es el correcto?',
      correctChart: 'line',
      options: [
        {
          id: 'line',
          label: 'Gráfico de Líneas con marcadores — ax.plot(meses, usuarios, marker="o")',
          reason: '¡Exacto! Conecta la evolución temporal mes a mes permitiendo leer la pendiente (ritmo de cambio) entre los 12 períodos.'
        },
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(meses, usuarios)',
          reason: 'Incorrecto para este foco: aunque muestra magnitudes, en barras el eje Y debe partir en 0 y no permite usar escala logarítmica de forma limpia para ver tasas de crecimiento.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión sin conectar — ax.scatter(meses, usuarios)',
          reason: 'Incorrecto: al ser una serie de tiempo ordenada de 1 a 12 meses de un mismo fenómeno, conectar los puntos con ax.plot ayuda a ver la trayectoria temporal.'
        },
        {
          id: 'pie',
          label: 'Gráfico de Torta — ax.pie(usuarios)',
          reason: 'Incorrecto: sumar usuarios activos de distintos meses no tiene sentido (un mismo jugador está activo en varios meses).'
        }
      ]
    },
    duels: [
      {
        id: 'duel-1-scale',
        title: 'Duelo 1: Escala Lineal vs. Escala Logarítmica (ax.set_yscale)',
        question: 'En los primeros 6 meses los usuarios pasan de 150 a 6.600 (duplicándose cada mes, +107%), pero en escala lineal quedan "pegados al cero". Si queremos evaluar el RITMO DE CRECIMIENTO porcentual en los 12 meses, ¿qué versión elegimos?',
        versionA: {
          label: 'Versión A: Escala Lineal por defecto',
          code: `fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(meses, usuarios, marker="o")
ax.set_title("Usuarios activos de ChronoValparaíso")
ax.set_xlabel("Mes desde el lanzamiento")
ax.set_ylabel("Usuarios activos")
ax.set_xticks(meses)
plt.show()`,
          chartConfig: {
            type: 'line',
            xKey: 'mes_lanzamiento',
            yKey: 'usuarios_activos',
            title: 'Usuarios activos de ChronoValparaíso',
            xlabel: 'Mes desde el lanzamiento',
            ylabel: 'Usuarios activos',
            yScale: 'linear',
            showAllXChecks: true,
            marker: 'o'
          }
        },
        versionB: {
          label: 'Versión B: Escala Logarítmica con ax.set_yscale("log")',
          code: `fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(meses, usuarios, marker="o")
ax.set_title("Usuarios activos de ChronoValparaíso")
ax.set_xlabel("Mes desde el lanzamiento")
ax.set_ylabel("Usuarios activos (escala log)")
ax.set_xticks(meses)
ax.set_yscale("log")
ax.set_yticks([100, 1000, 10000, 100000],
              labels=["100", "1.000", "10.000", "100.000"])
plt.show()`,
          chartConfig: {
            type: 'line',
            xKey: 'mes_lanzamiento',
            yKey: 'usuarios_activos',
            title: 'Usuarios activos de ChronoValparaíso',
            xlabel: 'Mes desde el lanzamiento',
            ylabel: 'Usuarios activos (escala log)',
            yScale: 'log',
            showAllXChecks: true,
            marker: 'o'
          }
        },
        correctVersion: 'B',
        explanation: 'Como vimos en la Clase 10 (Diapos 22-25): En escala lineal, distancias iguales = misma diferencia en cantidad (+20.000), dejando los meses 1 a 6 aplastados contra el cero. En escala logarítmica (ax.set_yscale("log")), distancias iguales = mismo factor multiplicativo (x10), revelando que hasta el mes 8 el juego creció a tasa constante (línea recta) y luego se desaceleró.'
      },
      {
        id: 'duel-2-xticks',
        title: 'Duelo 2: Marcas del Eje X (ax.set_xticks)',
        question: 'Al presentar a los directores mes por mes, ¿por qué es importante agregar ax.set_xticks(meses) en lugar de dejar las marcas automáticas de Matplotlib?',
        versionA: {
          label: 'Versión A: Con ax.set_xticks(meses) explícito',
          code: `ax.set_xticks(meses) # Muestra 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12`,
          chartConfig: {
            type: 'line',
            xKey: 'mes_lanzamiento',
            yKey: 'usuarios_activos',
            title: 'Usuarios activos de ChronoValparaíso',
            xlabel: 'Mes desde el lanzamiento',
            ylabel: 'Usuarios activos (escala log)',
            yScale: 'log',
            showAllXChecks: true,
            marker: 'o'
          }
        },
        versionB: {
          label: 'Versión B: Sin set_xticks (marcas automáticas saltadas)',
          code: `# Sin ax.set_xticks(meses): solo rotula meses pares (2, 4, 6, 8, 10, 12)`,
          chartConfig: {
            type: 'line',
            xKey: 'mes_lanzamiento',
            yKey: 'usuarios_activos',
            title: 'Usuarios activos de ChronoValparaíso',
            xlabel: 'Mes desde el lanzamiento',
            ylabel: 'Usuarios activos (escala log)',
            yScale: 'log',
            showAllXChecks: false,
            marker: 'o'
          }
        },
        correctVersion: 'A',
        explanation: 'Con ax.set_xticks(meses) obligamos a Matplotlib a rotular cada uno de los 12 meses del año, facilitando identificar exactamente en qué mes (mes 8) cambió la pendiente de crecimiento sin tener que adivinar valores intermedios.'
      }
    ],
    storytelling: {
      prompt: 'Para el informe final al directorio, elige el titular (ax.set_title) y conclusión de Storytelling más rigurosa:',
      options: [
        {
          id: 's1',
          title: 'Crecimiento exponencial sostenido hasta el mes 8; desaceleración relativa en el cierre de año',
          takeaway: 'Entre el mes 1 y 8 los usuarios se duplicaron cada mes (~107% mensual); del mes 8 al 12 sigue sumando ~15.000 usuarios por mes en volumen, pero su ritmo porcentual bajó a +23%.',
          isCorrect: true,
          feedback: '¡Brillante! Distingues claramente entre aumento en cantidad absoluta (escala lineal) y ritmo porcentual de crecimiento (escala logarítmica).'
        },
        {
          id: 's2',
          title: 'Gráfico de usuarios por mes en escala logarítmica',
          takeaway: 'Se muestran los datos de los 12 meses usando Python y Matplotlib.',
          isCorrect: false,
          feedback: 'Demasiado descriptivo y genérico: describe qué tiene el gráfico pero no entrega el hallazgo de negocio.'
        },
        {
          id: 's3',
          title: 'El juego fracasó en los primeros 6 meses y recién funcionó en diciembre',
          takeaway: 'En los primeros 6 meses casi no hubo crecimiento porque la barra estaba cerca de cero.',
          isCorrect: false,
          feedback: '¡Cuidado! Esa es la trampa visual de leer solo la escala lineal sin considerar que pasar de 150 a 6.600 usuarios es multiplicar por 44 veces la base inicial.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
usuarios = [150, 320, 700, 1500, 3100, 6600, 14000, 29000, 41000, 55000, 70000, 86000]

fig, ax = plt.subplots(figsize=(6.5, 4))
ax.plot(meses, usuarios, color="#1f77b4", marker="o", linewidth=2.5)
ax.set_title("Crecimiento exponencial hasta el mes 8; luego se desacelera", fontsize=14)
ax.set_xlabel("Mes desde el lanzamiento", fontsize=12)
ax.set_ylabel("Usuarios activos (escala log)", fontsize=12)
ax.set_xticks(meses)
ax.set_yscale("log")
ax.set_yticks([100, 1000, 10000, 100000], labels=["100", "1.000", "10.000", "100.000"])
ax.grid(True, alpha=0.25)
plt.show()`
    }
  },
  {
    id: 'futbol-scouting-pases',
    industry: 'Fútbol & Deportes',
    icon: 'Trophy',
    badgeColor: '#10B981',
    title: 'Scouting de Mediocampistas: ¿Vale la pena pagar el triple por Silva?',
    company: 'Club Deportivo Analítica FC',
    context: 'El representante del volante "Silva D." exige un sueldo tres veces mayor que el de "Rojas A.", mostrando un gráfico de barras donde la barra de efectividad de pases de Silva parece el triple de alta que la de Rojas. El Director Deportivo te pide auditar la tabla real de la temporada.',
    businessQuestion: '¿Qué tan grande es realmente la diferencia en el porcentaje de pases entregados a tiempo/correctos entre los 4 mediocampistas candidatos?',
    dataframeName: 'scouting_volantes',
    columns: [
      {
        name: 'ficha_fifa_id',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['FIF-8821', 'FIF-3910', 'FIF-4402', 'FIF-7719'],
        explanation: 'Código federativo interno. No aporta al análisis comparativo (eliminar con drop).'
      },
      {
        name: 'jugador',
        dtype: 'object',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cualitativa Nominal',
        sampleValues: ['Rojas A.', 'Vidal B.', 'Aránguiz C.', 'Silva D.'],
        explanation: 'Categorías nominales (nombres de los 4 mediocampistas a comparar en el eje X).'
      },
      {
        name: 'pases_correctos_pct',
        dtype: 'float64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Continua (Indicador %)',
        sampleValues: [92.4, 94.1, 93.0, 95.2],
        explanation: 'Porcentaje de efectividad de pases (de 0% a 100%). Magnitud que irá en la altura de las barras (eje Y).'
      },
      {
        name: 'dorsalcamiseta',
        dtype: 'int64',
        role: 'drop',
        semanticType: 'Cualitativa Nominal / Identificador',
        sampleValues: [8, 23, 20, 10],
        explanation: '¡Trampa clásica! Aunque su dtype técnico es int64, el número de camiseta no es una magnitud cuantitativa.'
      }
    ],
    rows: [
      { ficha_fifa_id: 'FIF-8821', jugador: 'Rojas A.', pases_correctos_pct: 92.4, dorsalcamiseta: 8 },
      { ficha_fifa_id: 'FIF-3910', jugador: 'Vidal B.', pases_correctos_pct: 94.1, dorsalcamiseta: 23 },
      { ficha_fifa_id: 'FIF-4402', jugador: 'Aránguiz C.', pases_correctos_pct: 93.0, dorsalcamiseta: 20 },
      { ficha_fifa_id: 'FIF-7719', jugador: 'Silva D.', pases_correctos_pct: 95.2, dorsalcamiseta: 10 }
    ],
    chartQuestion: {
      prompt: 'Tenemos una variable Cualitativa Nominal (4 jugadores) y una variable Cuantitativa que representa una magnitud porcentual (pases correctos %). ¿Qué gráfico corresponde usar?',
      correctChart: 'bar',
      options: [
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(jugadores, pases_correctos_pct)',
          reason: '¡Correcto! Permite comparar magnitudes directamente entre categorías discretas independientes.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(jugadores, pases_correctos_pct)',
          reason: 'Incorrecto: los 4 jugadores son categorías nominales sin orden temporal ni continuidad entre sí; unirlos con una línea sugiere una tendencia inexistente.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(dorsal, pases_correctos_pct)',
          reason: 'Incorrecto: el dorsal de camiseta no es una variable numérica cuantitativa real.'
        },
        {
          id: 'pie',
          label: 'Gráfico de Torta — ax.pie(pases_correctos_pct)',
          reason: 'Incorrecto: los porcentajes de efectividad de cada jugador NO son partes de un mismo total (no suman 100%).'
        }
      ]
    },
    duels: [
      {
        id: 'duel-futbol-ylim',
        title: 'Duelo 1: El truco del representante con ax.set_ylim (Diapos 20-21)',
        question: 'Los datos son: Rojas A (92,4%), Vidal B (94,1%), Aránguiz C (93,0%) y Silva D (95,2%). ¿Cuál de los dos gráficos representa honestamente la diferencia de rendimiento?',
        versionA: {
          label: 'Versión A: ax.set_ylim(91, 96) — Eje truncado',
          code: `fig, ax = plt.subplots(figsize=(5, 3.5))
ax.bar(jugadores, a_tiempo)
ax.set_title("Precisión de pases en el torneo")
ax.set_ylabel("Pases correctos (%)")
ax.set_ylim(91, 96)
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'jugador',
            yKey: 'pases_correctos_pct',
            title: 'Precisión de pases en el torneo',
            xlabel: 'Mediocampista',
            ylabel: 'Pases correctos (%)',
            ylim: [91, 96]
          }
        },
        versionB: {
          label: 'Versión B: ax.set_ylim(0, 100) — Eje parte en cero',
          code: `fig, ax = plt.subplots(figsize=(5, 3.5))
ax.bar(jugadores, a_tiempo)
ax.set_title("Precisión de pases en el torneo")
ax.set_ylabel("Pases correctos (%)")
ax.set_ylim(0, 100)
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'jugador',
            yKey: 'pases_correctos_pct',
            title: 'Precisión de pases en el torneo',
            xlabel: 'Mediocampista',
            ylabel: 'Pases correctos (%)',
            ylim: [0, 100]
          }
        },
        correctVersion: 'B',
        explanation: 'Regla de Oro de la Clase 10 (Diapo 21): "En un gráfico de barras, el eje Y debe partir en cero". Como en las barras leemos el LARGO/ALTURA como proporción de magnitud, partir en 91 hace que la barra de Silva (95,2%) se vea tres veces más alta que la de Rojas (92,4%), cuando solo lo supera por 2,8 puntos porcentuales.'
      },
      {
        id: 'duel-futbol-color',
        title: 'Duelo 2: ¿Cinco colores distintos o Color de Acento?',
        question: 'Si queremos destacar a Silva D. como el líder técnico sin exagerar el eje Y, ¿qué configuración de color aporta claridad sin ruido?',
        versionA: {
          label: 'Versión A: Gris neutro + Color de acento en el líder',
          code: `colores = ["gray", "gray", "gray", "darkorange"]
ax.bar(jugadores, a_tiempo, color=colores)
ax.set_ylim(0, 100)`,
          chartConfig: {
            type: 'bar',
            xKey: 'jugador',
            yKey: 'pases_correctos_pct',
            title: 'Silva D. lidera por estrecho margen (+2,8 pp)',
            xlabel: 'Mediocampista',
            ylabel: 'Pases correctos (%)',
            ylim: [0, 100],
            colors: ['#64748b', '#64748b', '#64748b', '#f59e0b']
          }
        },
        versionB: {
          label: 'Versión B: Un color chillón distinto para cada barra',
          code: `colores = ["red", "blue", "green", "purple"]
ax.bar(jugadores, a_tiempo, color=colores)
ax.set_ylim(0, 100)`,
          chartConfig: {
            type: 'bar',
            xKey: 'jugador',
            yKey: 'pases_correctos_pct',
            title: 'Precisión de pases en el torneo',
            xlabel: 'Mediocampista',
            ylabel: 'Pases correctos (%)',
            ylim: [0, 100],
            colors: ['#ef4444', '#3b82f6', '#22c55e', '#a855f7']
          }
        },
        correctVersion: 'A',
        explanation: 'Como vimos en las Diapos 26-27: poner un color distinto por barra no agrega ninguna información que las etiquetas del eje X no entreguen ya. En cambio, usar gris y un único color de acento ("darkorange") dirige la mirada inmediatamente al punto focal.'
      }
    ],
    storytelling: {
      prompt: '¿Qué titular y conclusión presentarías a la dirigencia del club?',
      options: [
        {
          id: 's1',
          title: 'Los 4 volantes superan el 92% de precisión; Silva D. supera a Rojas A. por solo 2,8 puntos porcentuales',
          takeaway: 'Aunque Silva lidera con 95,2%, el rendimiento entre los cuatro candidatos es altamente parejo (rango de 92,4% a 95,2%), por lo que no se justifica pagar el triple de sueldo.',
          isCorrect: true,
          feedback: '¡Excelente! Resumes la evidencia numérica sin caer en la distorsión visual del eje truncado.'
        },
        {
          id: 's2',
          title: 'Silva D. triplica el rendimiento de Rojas A. en pases completados',
          takeaway: 'La barra de Silva es tres veces más grande en el gráfico entre 91% y 96%.',
          isCorrect: false,
          feedback: 'Falso: confundiste la altura visual de un eje truncado con la proporción real de los datos.'
        },
        {
          id: 's3',
          title: 'Gráfico de barras de jugadores de fútbol',
          takeaway: 'Comparación del porcentaje de pases.',
          isCorrect: false,
          feedback: 'Titular mudo: obliga al lector a hacer todo el trabajo mental para entender por qué importa el gráfico.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

jugadores = ["Rojas A.", "Vidal B.", "Aránguiz C.", "Silva D."]
a_tiempo = [92.4, 94.1, 93.0, 95.2]
colores = ["gray", "gray", "gray", "darkorange"]

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(jugadores, a_tiempo, color=colores)
ax.set_title("Silva D. lidera en precisión por solo 2,8 pp sobre Rojas A.", fontsize=13)
ax.set_ylabel("Pases correctos (%)")
ax.set_ylim(0, 100)
plt.show()`
    }
  },
  {
    id: 'moda-retail-septiembre',
    industry: 'Moda & E-Commerce Retail',
    icon: 'ShoppingBag',
    badgeColor: '#EC4899',
    title: 'Cierre de Ventas de Septiembre por Categoría de Tienda',
    company: 'ModaAndina & Retail S.A.',
    context: 'El equipo comercial armó un primer gráfico de barras en su notebook para mostrar las ventas de septiembre en millones de CLP de sus 6 departamentos, pero en el proyector los nombres de las categorías se pisan unos con otros ("ElectrohogarVestuario y calzadoHogar y decoración...") y el gráfico no tiene ni título ni unidades.',
    businessQuestion: '¿Cuáles son las categorías que concentran más de la mitad de la facturación de septiembre y cómo hacer que el gráfico se lea sin explicación adicional?',
    dataframeName: 'ventas_septiembre',
    columns: [
      {
        name: 'cod_depto_erp',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['ERP-01', 'ERP-02', 'ERP-03', 'ERP-04', 'ERP-05', 'ERP-06'],
        explanation: 'Código interno de SAP/ERP que no aporta al directorio comercial.'
      },
      {
        name: 'categoria',
        dtype: 'object',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cualitativa Nominal',
        sampleValues: ['Electrohogar', 'Vestuario y calzado', 'Hogar y decoración', 'Deportes', 'Belleza y cuidado', 'Juguetería'],
        explanation: 'Las 6 líneas de negocio de la tienda departamental que compararemos en el eje X.'
      },
      {
        name: 'ventas_mm',
        dtype: 'float64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Continua',
        sampleValues: [48.6, 41.2, 27.5, 18.9, 15.3, 9.8],
        explanation: 'Ventas expresadas en millones de pesos chilenos (CLP). Va en el eje Y.'
      }
    ],
    rows: [
      { cod_depto_erp: 'ERP-01', categoria: 'Electrohogar', ventas_mm: 48.6 },
      { cod_depto_erp: 'ERP-02', categoria: 'Vestuario y calzado', ventas_mm: 41.2 },
      { cod_depto_erp: 'ERP-03', categoria: 'Hogar y decoración', ventas_mm: 27.5 },
      { cod_depto_erp: 'ERP-04', categoria: 'Deportes', ventas_mm: 18.9 },
      { cod_depto_erp: 'ERP-05', categoria: 'Belleza y cuidado', ventas_mm: 15.3 },
      { cod_depto_erp: 'ERP-06', categoria: 'Juguetería', ventas_mm: 9.8 }
    ],
    chartQuestion: {
      prompt: 'Queremos comparar las ventas en millones de CLP entre las 6 categorías de productos en el mes de septiembre. ¿Qué instrucción de Axes usamos?',
      correctChart: 'bar',
      options: [
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(ventas["categoria"], ventas["ventas_mm"])',
          reason: '¡Correcto! Como vimos en el Caso 1 de la Clase 10 (Diapo 8), cada barra es una categoría y su altura representa las ventas en millones de CLP.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(ventas["categoria"], ventas["ventas_mm"])',
          reason: 'Incorrecto: las categorías de productos no son momentos en el tiempo.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(ventas["categoria"], ventas["ventas_mm"])',
          reason: 'Incorrecto: para comparar totales por categoría nominal, las barras ancladas en cero son mucho más claras.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-moda-labels',
        title: 'Duelo 1: Etiquetas superpuestas en el Eje X (Diapos 8 a 12)',
        question: 'Por defecto la figura mide 6,4 x 4,8 pulgadas y los nombres largos ("Vestuario y calzado", "Hogar y decoración") chocan entre sí. Si tenemos espacio horizontal en la diapositiva, ¿cuál es la solución más rápida de leer?',
        versionA: {
          label: 'Versión A: Ensanchar la figura con figsize=(12, 4.5) y agrandar fuentes',
          code: `fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(ventas["categoria"], ventas["ventas_mm"])
ax.set_title("Electrohogar lidera las ventas de septiembre", fontsize=16)
ax.set_xlabel("Categoría de producto", fontsize=13)
ax.set_ylabel("Ventas (millones de CLP)", fontsize=13)
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'categoria',
            yKey: 'ventas_mm',
            title: 'Electrohogar lidera las ventas de septiembre',
            xlabel: 'Categoría de producto',
            ylabel: 'Ventas (millones de CLP)',
            wideFig: true,
            overlapLabels: false
          }
        },
        versionB: {
          label: 'Versión B: Dejar el tamaño por defecto sin rotar ni ensanchar',
          code: `fig, ax = plt.subplots() # 6.4 x 4.8 por defecto
ax.bar(ventas["categoria"], ventas["ventas_mm"])
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'categoria',
            yKey: 'ventas_mm',
            title: '',
            xlabel: '',
            ylabel: '',
            wideFig: false,
            overlapLabels: true
          }
        },
        correctVersion: 'A',
        explanation: 'Como enseña la Clase 10 (Diapos 10-12): ensanchar con figsize=(12, 4.5) deja el texto horizontal, que se lee más rápido. (Y cuando el ancho está limitado en un informe angosto, la alternativa válida es ax.tick_params(axis="x", labelrotation=30)).'
      },
      {
        id: 'duel-moda-syntax',
        title: 'Duelo 2: Sintaxis Orientada a Objetos (ax) vs. plt (Diapo 7)',
        question: 'En esta clase pasamos de usar funciones sueltas de plt a trabajar explícitamente sobre el objeto Axes (ax). ¿Cuál de estos dos códigos usa correctamente los métodos de ax?',
        versionA: {
          label: 'Versión A: Métodos mal escritos (ax.title / ax.xlabel)',
          code: `fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(ventas["categoria"], ventas["ventas_mm"])
ax.title("Electrohogar lidera las ventas") # AttributeError!
ax.xlabel("Categoría de producto")`,
          chartConfig: {
            type: 'bar',
            xKey: 'categoria',
            yKey: 'ventas_mm',
            title: 'Error: AxesSubplot object has no attribute title',
            xlabel: '',
            ylabel: '',
            wideFig: true
          }
        },
        versionB: {
          label: 'Versión B: Métodos con prefijo set_ (ax.set_title, ax.set_xlabel, ax.set_ylabel)',
          code: `fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(ventas["categoria"], ventas["ventas_mm"])
ax.set_title("Electrohogar lidera las ventas de septiembre", fontsize=16)
ax.set_xlabel("Categoría de producto", fontsize=13)
ax.set_ylabel("Ventas (millones de CLP)", fontsize=13)`,
          chartConfig: {
            type: 'bar',
            xKey: 'categoria',
            yKey: 'ventas_mm',
            title: 'Electrohogar lidera las ventas de septiembre',
            xlabel: 'Categoría de producto',
            ylabel: 'Ventas (millones de CLP)',
            wideFig: true
          }
        },
        correctVersion: 'B',
        explanation: 'En el objeto Axes (ax), los métodos para configurar título, etiquetas y límites llevan el prefijo set_: ax.set_title(), ax.set_xlabel(), ax.set_ylabel(), ax.set_ylim(), ax.set_xticks().'
      }
    ],
    storytelling: {
      prompt: 'Observando que el total vendido entre las 6 categorías es 161,3 millones de CLP, ¿qué conclusión de Storytelling acompaña mejor al gráfico final?',
      options: [
        {
          id: 's1',
          title: 'Electrohogar (48,6M) y Vestuario y calzado (41,2M) concentran más de la mitad de las ventas (55,7%)',
          takeaway: 'Ambas categorías suman 89,8 de los 161,3 millones de CLP totales de septiembre, siendo los pilares comerciales de la tienda.',
          isCorrect: true,
          feedback: '¡Exacto! Tal como en la Diapo 13 de la Clase 10: combinas el ranking visual con el peso relativo dentro del negocio.'
        },
        {
          id: 's2',
          title: 'Ventas por categoría en septiembre',
          takeaway: 'Hay 6 barras ordenadas de mayor a menor en el gráfico.',
          isCorrect: false,
          feedback: 'No agrega valor analítico: solo repite lo obvio sin destacar la concentración en las dos primeras categorías.'
        },
        {
          id: 's3',
          title: 'Juguetería dio pérdidas en septiembre',
          takeaway: 'Como es la barra más baja (9,8 millones), el departamento perdió dinero.',
          isCorrect: false,
          feedback: '¡Cuidado con inventar datos! El gráfico muestra ingresos por ventas (9,8M CLP), no costos ni margen de utilidad.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(ventas["categoria"], ventas["ventas_mm"], color="#0284c7")
ax.set_title("Electrohogar lidera las ventas de septiembre", fontsize=16)
ax.set_xlabel("Categoría de producto", fontsize=13)
ax.set_ylabel("Ventas (millones de CLP)", fontsize=13)
plt.show()`
    }
  },
  {
    id: 'streaming-musica-canales',
    industry: 'Streaming & Apps Móviles',
    icon: 'Headphones',
    badgeColor: '#F59E0B',
    title: 'Batalla de Plataformas: Pedidos y Reproducciones Web vs. App Móvil',
    company: 'BeatFlow Latam',
    context: 'Durante las 12 semanas del trimestre se lanzaron mejoras en la App móvil. Queremos comparar en un mismo panel (Axes) la evolución semanal del canal Web tradicional frente al rápido ascenso de la App, asegurándonos de que el gráfico sea legible incluso si alguien lo imprime en blanco y negro.',
    businessQuestion: '¿Cómo evolucionaron ambos canales en las 12 semanas y cómo distinguirlos claramente sin que la leyenda tape los datos?',
    dataframeName: 'trafico_canales',
    columns: [
      {
        name: 'semana',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Temporal / Cuantitativa Discreta',
        sampleValues: [1, 2, 3, 4, 5],
        explanation: 'Semana del trimestre (1 a 12). Va en el eje X.'
      },
      {
        name: 'pedidos_web',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Discreta (Serie 1)',
        sampleValues: [820, 845, 810, 870, 860],
        explanation: 'Cantidad de pedidos semanales por canal Web (primera serie en el Axes).'
      },
      {
        name: 'pedidos_app',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y2',
        semanticType: 'Cuantitativa Discreta (Serie 2)',
        sampleValues: [310, 350, 395, 430, 480],
        explanation: 'Cantidad de pedidos semanales por canal App (segunda serie en el mismo Axes).'
      },
      {
        name: 'hash_log',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['LOG-01A', 'LOG-02B', 'LOG-03C', 'LOG-04D', 'LOG-05E'],
        explanation: 'Identificador de auditoría del servidor que no se grafica.'
      }
    ],
    rows: [
      { semana: 1, pedidos_web: 820, pedidos_app: 310, hash_log: 'LOG-01A' },
      { semana: 2, pedidos_web: 845, pedidos_app: 350, hash_log: 'LOG-02B' },
      { semana: 3, pedidos_web: 810, pedidos_app: 395, hash_log: 'LOG-03C' },
      { semana: 4, pedidos_web: 870, pedidos_app: 430, hash_log: 'LOG-04D' },
      { semana: 5, pedidos_web: 860, pedidos_app: 480, hash_log: 'LOG-05E' },
      { semana: 6, pedidos_web: 900, pedidos_app: 520, hash_log: 'LOG-06F' },
      { semana: 7, pedidos_web: 880, pedidos_app: 575, hash_log: 'LOG-07G' },
      { semana: 8, pedidos_web: 910, pedidos_app: 610, hash_log: 'LOG-08H' },
      { semana: 9, pedidos_web: 895, pedidos_app: 660, hash_log: 'LOG-09I' },
      { semana: 10, pedidos_web: 930, pedidos_app: 700, hash_log: 'LOG-10J' },
      { semana: 11, pedidos_web: 920, pedidos_app: 750, hash_log: 'LOG-11K' },
      { semana: 12, pedidos_web: 940, pedidos_app: 790, hash_log: 'LOG-12L' }
    ],
    chartQuestion: {
      prompt: 'Queremos comparar la trayectoria de las dos series (Web y App) a lo largo de las 12 semanas dentro del mismo área de datos (Axes). ¿Cómo lo construimos?',
      correctChart: 'multiline',
      options: [
        {
          id: 'multiline',
          label: 'Dos llamadas a ax.plot() en el mismo Axes con label="Web" y label="App" + ax.legend()',
          reason: '¡Exacto! Como en el Caso 2 de la Clase 10 (Diapos 14-19), llamar dos veces a ax.plot sobre el mismo ax superpone ambas curvas para compararlas.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de dispersión ax.scatter(pedidos_web, pedidos_app)',
          reason: 'Incorrecto: eso perdería la secuencia de las semanas 1 a 12 en el eje X.'
        },
        {
          id: 'bar',
          label: 'Un solo ax.bar() sumando Web + App',
          reason: 'Incorrecto: al sumarlas en una sola barra simple perderíamos la comparación del crecimiento de la App frente a la Web.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-streaming-legend',
        title: 'Duelo 1: Leyenda, label= y posición con loc (Diapos 15-16)',
        question: 'La serie Web parte en 820 (arriba a la izquierda) y la serie App parte en 310 (abajo a la izquierda). ¿Cuál configuración de leyenda evita tapar los datos?',
        versionA: {
          label: 'Versión A: ax.legend(loc="upper left")',
          code: `ax.plot(semanas, web, label="Web")
ax.plot(semanas, app, label="App")
ax.legend(loc="upper left") # ¡Cuidado donde cae!`,
          chartConfig: {
            type: 'multiline',
            xKey: 'semana',
            yKey: 'pedidos_web',
            y2Key: 'pedidos_app',
            yLabel1: 'Web',
            yLabel2: 'App',
            title: 'Pedidos semanales por canal',
            xlabel: 'Semana del trimestre',
            ylabel: 'Pedidos (cantidad)',
            legendLoc: 'upper left',
            showAllXChecks: false
          }
        },
        versionB: {
          label: 'Versión B: ax.legend(loc="lower right")',
          code: `ax.plot(semanas, web, label="Web")
ax.plot(semanas, app, label="App")
ax.legend(loc="lower right")`,
          chartConfig: {
            type: 'multiline',
            xKey: 'semana',
            yKey: 'pedidos_web',
            y2Key: 'pedidos_app',
            yLabel1: 'Web',
            yLabel2: 'App',
            title: 'Pedidos semanales por canal',
            xlabel: 'Semana del trimestre',
            ylabel: 'Pedidos (cantidad)',
            legendLoc: 'lower right',
            showAllXChecks: true
          }
        },
        correctVersion: 'B',
        explanation: 'Como muestra la Diapo 16 de la Clase 10: loc="upper left" pone la caja de leyenda justo encima de la línea Web (semanas 1 a 4). En cambio, loc="lower right" aprovecha el espacio vacío debajo de ambas curvas dejando todos los datos a la vista.'
      },
      {
        id: 'duel-streaming-style',
        title: 'Duelo 2: Accesibilidad con marker, linestyle y linewidth (Diapos 18-19)',
        question: 'Para que las dos series se distingan incluso al imprimir en blanco y negro o para personas con daltonismo, ¿qué código es superior?',
        versionA: {
          label: 'Versión A: Combinar color, marker ("o" vs "s"), linestyle="--" y linewidth=2.5',
          code: `ax.plot(semanas, web, label="Web", color="navy", marker="o", linewidth=2.5)
ax.plot(semanas, app, label="App", color="darkorange", marker="s",
        linestyle="--", linewidth=2.5)
ax.set_xticks(semanas)
ax.legend(loc="lower right")`,
          chartConfig: {
            type: 'multiline',
            xKey: 'semana',
            yKey: 'pedidos_web',
            y2Key: 'pedidos_app',
            yLabel1: 'Web',
            yLabel2: 'App',
            title: 'Pedidos semanales por canal',
            xlabel: 'Semana del trimestre',
            ylabel: 'Pedidos (cantidad)',
            legendLoc: 'lower right',
            showAllXChecks: true,
            styledLines: true
          }
        },
        versionB: {
          label: 'Versión B: Llamar a ax.legend() olvidando poner label= en ax.plot()',
          code: `ax.plot(semanas, web)
ax.plot(semanas, app)
ax.legend() # Error frecuente: sin label= no hay nombres que mostrar`,
          chartConfig: {
            type: 'multiline',
            xKey: 'semana',
            yKey: 'pedidos_web',
            y2Key: 'pedidos_app',
            yLabel1: '',
            yLabel2: '',
            title: 'Pedidos semanales por canal',
            xlabel: 'Semana del trimestre',
            ylabel: 'Pedidos (cantidad)',
            legendLoc: 'empty',
            showAllXChecks: false,
            styledLines: false
          }
        },
        correctVersion: 'A',
        explanation: 'En la Versión A (Diapo 19), marker="o" vs marker="s" y linestyle="--" permiten distinguir ambas series incluso sin color, además de incluir label= para que ax.legend() funcione.'
      }
    ],
    storytelling: {
      prompt: '¿Qué titular de Storytelling resume mejor la historia estratégica entre Web y App?',
      options: [
        {
          id: 's1',
          title: 'App móvil más que duplica sus pedidos (+155%) y reduce a un tercio la brecha frente a Web',
          takeaway: 'Mientras Web crece de forma estable (+14,6%, de 820 a 940), la App sube de 310 a 790 pedidos semanales, acercándose rápidamente al canal principal.',
          isCorrect: true,
          feedback: '¡Excelente! Comparas la dinámica de ambas series (estabilidad de Web vs. aceleración de App) cuantificando el cierre de la brecha.'
        },
        {
          id: 's2',
          title: 'La App superó a la Web en la semana 12',
          takeaway: 'En la semana 12 la línea naranja está por encima de la azul.',
          isCorrect: false,
          feedback: 'Incorrecto: en la semana 12 la App llega a 790 y la Web está en 940; se acerca mucho, pero aún no la supera.'
        },
        {
          id: 's3',
          title: 'Pedidos semanales por canal del 1 al 12',
          takeaway: 'Se ven dos líneas que suben.',
          isCorrect: false,
          feedback: 'Titular pasivo que no destaca el hallazgo estratégico del trimestre.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(semanas, web, label="Web", color="navy", marker="o", linewidth=2.5)
ax.plot(semanas, app, label="App", color="darkorange", marker="s",
        linestyle="--", linewidth=2.5)
ax.set_title("App duplica sus pedidos y acorta la brecha frente a Web")
ax.set_xlabel("Semana del trimestre")
ax.set_ylabel("Pedidos (cantidad)")
ax.set_xticks(semanas)
ax.legend(loc="lower right")
plt.show()`
    }
  },
  {
    id: 'marketing-streamers-scatter',
    industry: 'Marketing & Influencers',
    icon: 'Sparkles',
    badgeColor: '#3b82f6',
    title: 'El Misterio de las 30 Campañas: ¿Por qué solo se ven 15 puntos?',
    company: 'GG Agency & Brands',
    context: 'El equipo de Marketing contrató 30 campañas con creadores de contenido (con presupuestos de 1, 2, 3, 4 o 5 millones de CLP) y midió las ventas generadas (entre 4 y 15 millones de CLP). Al hacer ax.scatter(inversion, ventas), el gerente reclama: "¡Pagamos 30 campañas pero en tu gráfico solo cuento 15 puntos! ¿Me están ocultando datos?"',
    businessQuestion: '¿Por qué desaparecen puntos en el gráfico de dispersión, cómo mostrar dónde se concentran las campañas repetidas y qué podemos concluir sobre inversión y ventas?',
    dataframeName: 'campanas_influencers',
    columns: [
      {
        name: 'id_contrato',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['INF-01', 'INF-02', 'INF-03', 'INF-04', 'INF-05'],
        explanation: 'Código de contrato legal; no es una variable analítica para el scatter plot.'
      },
      {
        name: 'inversion_mm',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cuantitativa Discreta / Continua',
        sampleValues: [1, 1, 2, 3, 5],
        explanation: 'Monto invertido en la campaña (millones de CLP). Variable explicativa en el eje X.'
      },
      {
        name: 'ventas_mm',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Discreta / Continua',
        sampleValues: [4, 5, 7, 9, 13],
        explanation: 'Ventas atribuidas a la campaña (millones de CLP). Variable de respuesta en el eje Y.'
      }
    ],
    rows: [
      { id_contrato: 'INF-01', inversion_mm: 1, ventas_mm: 4 },
      { id_contrato: 'INF-02', inversion_mm: 1, ventas_mm: 4 },
      { id_contrato: 'INF-03', inversion_mm: 1, ventas_mm: 4 },
      { id_contrato: 'INF-04', inversion_mm: 1, ventas_mm: 5 },
      { id_contrato: 'INF-05', inversion_mm: 1, ventas_mm: 5 },
      { id_contrato: 'INF-06', inversion_mm: 1, ventas_mm: 6 },
      { id_contrato: 'INF-07', inversion_mm: 2, ventas_mm: 6 },
      { id_contrato: 'INF-08', inversion_mm: 2, ventas_mm: 7 },
      { id_contrato: 'INF-09', inversion_mm: 2, ventas_mm: 7 },
      { id_contrato: 'INF-10', inversion_mm: 2, ventas_mm: 7 },
      { id_contrato: 'INF-11', inversion_mm: 2, ventas_mm: 7 },
      { id_contrato: 'INF-12', inversion_mm: 2, ventas_mm: 8 },
      { id_contrato: 'INF-13', inversion_mm: 3, ventas_mm: 8 },
      { id_contrato: 'INF-14', inversion_mm: 3, ventas_mm: 9 },
      { id_contrato: 'INF-15', inversion_mm: 3, ventas_mm: 9 },
      { id_contrato: 'INF-16', inversion_mm: 3, ventas_mm: 9 },
      { id_contrato: 'INF-17', inversion_mm: 3, ventas_mm: 10 },
      { id_contrato: 'INF-18', inversion_mm: 3, ventas_mm: 10 },
      { id_contrato: 'INF-19', inversion_mm: 4, ventas_mm: 10 },
      { id_contrato: 'INF-20', inversion_mm: 4, ventas_mm: 11 },
      { id_contrato: 'INF-21', inversion_mm: 4, ventas_mm: 11 },
      { id_contrato: 'INF-22', inversion_mm: 4, ventas_mm: 12 },
      { id_contrato: 'INF-23', inversion_mm: 4, ventas_mm: 12 },
      { id_contrato: 'INF-24', inversion_mm: 4, ventas_mm: 12 },
      { id_contrato: 'INF-25', inversion_mm: 5, ventas_mm: 12 },
      { id_contrato: 'INF-26', inversion_mm: 5, ventas_mm: 13 },
      { id_contrato: 'INF-27', inversion_mm: 5, ventas_mm: 13 },
      { id_contrato: 'INF-28', inversion_mm: 5, ventas_mm: 13 },
      { id_contrato: 'INF-29', inversion_mm: 5, ventas_mm: 13 },
      { id_contrato: 'INF-30', inversion_mm: 5, ventas_mm: 15 }
    ],
    chartQuestion: {
      prompt: 'Queremos evaluar la relación o asociación entre dos variables cuantitativas (Inversión en millones vs. Ventas en millones) para las 30 campañas. ¿Qué gráfico usamos?',
      correctChart: 'scatter',
      options: [
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(inversion, ventas)',
          reason: '¡Exacto! El scatter plot ubica cada campaña como un punto (x, y) para observar la asociación entre dos variables numéricas.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(inversion, ventas)',
          reason: 'Incorrecto: hay 6 campañas distintas por cada nivel de inversión; unirlas con una línea crearía un zigzag sin sentido temporal.'
        },
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(inversion, ventas)',
          reason: 'Incorrecto: al pasar valores repetidos de X a ax.bar(), las barras de distintas campañas se pisan unas a otras mostrando solo la más alta.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-scatter-alpha',
        title: 'Duelo 1: Puntos superpuestos (Overplotting) y alpha=0.3 (Diapos 28-29)',
        question: 'En las 30 campañas hay varias con exactamente el mismo par (inversión, ventas), como 4 campañas que invirtieron 2M y vendieron 7M. ¿Cómo revelamos cuántas campañas se acumulan en cada coordenada?',
        versionA: {
          label: 'Versión A: ax.scatter(inversion, ventas) opaco por defecto',
          code: `fig, ax = plt.subplots(figsize=(4.5, 3.1))
ax.scatter(inversion, ventas)
ax.set_title("Ventas según inversión")
ax.set_xlabel("Inversión (millones de CLP)")
ax.set_ylabel("Ventas (millones de CLP)")
plt.show()`,
          chartConfig: {
            type: 'scatter',
            xKey: 'inversion_mm',
            yKey: 'ventas_mm',
            title: 'Ventas según inversión',
            xlabel: 'Inversión (millones de CLP)',
            ylabel: 'Ventas (millones de CLP)',
            alpha: 1.0,
            grid: false
          }
        },
        versionB: {
          label: 'Versión B: ax.scatter(inversion, ventas, alpha=0.3) + ax.grid(True)',
          code: `fig, ax = plt.subplots(figsize=(4.5, 3.1))
ax.scatter(inversion, ventas, alpha=0.3)
ax.set_title("Ventas según inversión")
ax.set_xlabel("Inversión (millones de CLP)")
ax.set_ylabel("Ventas (millones de CLP)")
ax.grid(True)
plt.show()`,
          chartConfig: {
            type: 'scatter',
            xKey: 'inversion_mm',
            yKey: 'ventas_mm',
            title: 'Ventas según inversión',
            xlabel: 'Inversión (millones de CLP)',
            ylabel: 'Ventas (millones de CLP)',
            alpha: 0.3,
            grid: true
          }
        },
        correctVersion: 'B',
        explanation: 'Como explica la Diapo 29 de la Clase 10: alpha=0.3 vuelve cada punto un 70% transparente. Así, donde se repiten varias campañas el círculo se ve más oscuro, y ax.grid(True) ayuda a leer las coordenadas exactas.'
      },
      {
        id: 'duel-scatter-causality',
        title: 'Duelo 2: Interpretación Estadística — ¿Asociación o Causalidad?',
        question: 'Al mirar el gráfico con alpha=0.3 y grilla, vemos que a mayor inversión los puntos se ubican más arriba en ventas. ¿Cuál afirmación es metodológicamente correcta según la Diapo 29?',
        versionA: {
          label: 'Versión A: "Más inversión se asocia a más ventas; el gráfico por sí solo no prueba causalidad"',
          code: `# Lectura rigurosa (Clase 10, pág. 29):
# Asociación positiva clara + concentración en valores medios de cada tramo.`,
          chartConfig: {
            type: 'scatter',
            xKey: 'inversion_mm',
            yKey: 'ventas_mm',
            title: 'Mayor inversión se asocia a mayores ventas (30 campañas)',
            xlabel: 'Inversión (millones de CLP)',
            ylabel: 'Ventas (millones de CLP)',
            alpha: 0.3,
            grid: true
          }
        },
        versionB: {
          label: 'Versión B: "El gráfico demuestra con certeza absoluta que invertir más es la única causa de las ventas"',
          code: `# Afirmación riesgosa:
# Ignora variables confundentes (ej. temporada navideña o fama previa del juego).`,
          chartConfig: {
            type: 'scatter',
            xKey: 'inversion_mm',
            yKey: 'ventas_mm',
            title: 'La inversión causa el 100% de las ventas',
            xlabel: 'Inversión (millones de CLP)',
            ylabel: 'Ventas (millones de CLP)',
            alpha: 0.3,
            grid: true
          }
        },
        correctVersion: 'A',
        explanation: 'Cita directa de la Diapo 29: "Más inversión se asocia a más ventas; el gráfico no prueba que una cause la otra". Siempre debemos distinguir correlación/asociación visual de causalidad.'
      }
    ],
    storytelling: {
      prompt: 'Elige el mejor mensaje final para presentar este gráfico al Gerente de Marketing:',
      options: [
        {
          id: 's1',
          title: 'Mayor inversión se asocia consistentemente a mayores ventas (de 4-5M hasta 13M CLP)',
          takeaway: 'Los puntos más oscuros (alpha=0.3) muestran dónde se concentran la mayoría de las 30 campañas en cada tramo: 4M en ventas al invertir 1M, subiendo a 13M al invertir 5M.',
          isCorrect: true,
          feedback: '¡Impecable! Explicas tanto la tendencia general como el significado de la densidad de puntos gracias a alpha=0.3.'
        },
        {
          id: 's2',
          title: 'Gráfico de dispersión con alpha=0.3',
          takeaway: 'Se usó transparencia para ver los 30 puntos.',
          isCorrect: false,
          feedback: 'Explicas el parámetro técnico de Python pero olvidas el hallazgo de negocio para Marketing.'
        },
        {
          id: 's3',
          title: 'Las campañas de 5 millones dan menos retorno que las de 1 millón',
          takeaway: 'Los puntos de la derecha están más bajos.',
          isCorrect: false,
          feedback: 'Incorrecto: al invertir 5M las ventas llegan a 12-15M CLP, el nivel más alto del dataset.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5.5, 3.8))
ax.scatter(inversion, ventas, alpha=0.3, color="#0284c7", s=70)
ax.set_title("Mayor inversión se asocia a mayores ventas (30 campañas)")
ax.set_xlabel("Inversión (millones de CLP)")
ax.set_ylabel("Ventas (millones de CLP)")
ax.grid(True)
plt.show()`
    }
  },
  {
    id: 'f1-telemetria-defectos',
    industry: 'Fórmula 1 & Ingeniería',
    icon: 'Gauge',
    badgeColor: '#EF4444',
    title: 'Alerta en Pit Stop: Defectos en 5 Líneas de Compuestos de Neumáticos',
    company: 'Apex Motorsport Engineering',
    context: 'En la fábrica de compuestos para neumáticos de carrera hay 5 líneas de producción ("Línea 1" a "Línea 5"). En octubre, una de las líneas triplicó la tasa de unidades defectuosas (3,4%), poniendo en riesgo la clasificación del domingo. El ingeniero junior hizo un gráfico con 5 colores arcoíris ("red", "blue", "green", "purple", "orange").',
    businessQuestion: '¿Qué línea presenta la anomalía crítica de defectos y cómo usar el color de forma intencional para dirigir la atención del Jefe de Escudería en 2 segundos?',
    dataframeName: 'control_calidad_f1',
    columns: [
      {
        name: 'lote_uuid',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['F1-OCT-01', 'F1-OCT-02', 'F1-OCT-03', 'F1-OCT-04', 'F1-OCT-05'],
        explanation: 'ID de lote de sistema; no aporta al gráfico.'
      },
      {
        name: 'linea_produccion',
        dtype: 'object',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cualitativa Nominal',
        sampleValues: ['Línea 1', 'Línea 2', 'Línea 3', 'Línea 4', 'Línea 5'],
        explanation: 'Identifica cada línea de producción en el eje X.'
      },
      {
        name: 'tasa_defectos_pct',
        dtype: 'float64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Continua (Indicador %)',
        sampleValues: [1.2, 0.9, 3.4, 1.1, 1.0],
        explanation: 'Porcentaje de unidades defectuosas (%) en octubre. Va en el eje Y.'
      }
    ],
    rows: [
      { lote_uuid: 'F1-OCT-01', linea_produccion: 'Línea 1', tasa_defectos_pct: 1.2 },
      { lote_uuid: 'F1-OCT-02', linea_produccion: 'Línea 2', tasa_defectos_pct: 0.9 },
      { lote_uuid: 'F1-OCT-03', linea_produccion: 'Línea 3', tasa_defectos_pct: 3.4 },
      { lote_uuid: 'F1-OCT-04', linea_produccion: 'Línea 4', tasa_defectos_pct: 1.1 },
      { lote_uuid: 'F1-OCT-05', linea_produccion: 'Línea 5', tasa_defectos_pct: 1.0 }
    ],
    chartQuestion: {
      prompt: 'Queremos comparar la magnitud de la tasa de unidades defectuosas (%) entre las 5 líneas de producción. ¿Qué gráfico corresponde?',
      correctChart: 'bar',
      options: [
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(lineas, tasa, color=colores)',
          reason: '¡Correcto! Como en el Caso 5 de la Clase 10 (Diapos 26-27), compara la magnitud de defectos entre las 5 líneas.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(lineas, tasa)',
          reason: 'Incorrecto: las 5 líneas de ensamblaje operan en paralelo, no son una secuencia temporal.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(lineas, tasa)',
          reason: 'Incorrecto: para comparar magnitudes de una variable cuantitativa por categoría nominal, las barras son mucho más directas.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-f1-accent',
        title: 'Duelo 1: ¿Qué aportan cinco colores vs. un Color de Acento? (Diapos 26-27)',
        question: 'En la Diapo 26 nos preguntamos: "¿Qué información agregan 5 colores distintos que el eje X no entregue ya?". Compara ambas versiones:',
        versionA: {
          label: 'Versión A: Cinco colores distintos (arcoíris)',
          code: `colores = ["red", "blue", "green", "purple", "orange"]
fig, ax = plt.subplots(figsize=(4.5, 3.1))
ax.bar(lineas, tasa, color=colores)
ax.set_title("Defectos por línea, octubre")
ax.set_ylabel("Unidades defectuosas (%)")
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'linea_produccion',
            yKey: 'tasa_defectos_pct',
            title: 'Defectos por línea, octubre',
            xlabel: 'Línea de producción',
            ylabel: 'Unidades defectuosas (%)',
            ylim: [0, 3.8],
            colors: ['#ef4444', '#3b82f6', '#16a34a', '#9333ea', '#f97316']
          }
        },
        versionB: {
          label: 'Versión B: Gris neutro + Color de acento en la Línea 3',
          code: `colores = ["gray", "gray", "darkorange", "gray", "gray"]
fig, ax = plt.subplots(figsize=(4.5, 3.1))
ax.bar(lineas, tasa, color=colores)
ax.set_title("Defectos por línea, octubre")
ax.set_ylabel("Unidades defectuosas (%)")
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'linea_produccion',
            yKey: 'tasa_defectos_pct',
            title: 'Defectos por línea, octubre',
            xlabel: 'Línea de producción',
            ylabel: 'Unidades defectuosas (%)',
            ylim: [0, 3.8],
            colors: ['#808080', '#808080', '#ff8c00', '#808080', '#808080']
          }
        },
        correctVersion: 'B',
        explanation: 'Como enseña la Diapo 27: cuando cada barra tiene un color distinto ("red", "blue", "green"...), el cerebro busca una categoría extra que no existe. Al dejar las líneas normales en "gray" y usar "darkorange" únicamente en la Línea 3, el color cumple una función comunicativa: señalar de inmediato la anomalía.'
      },
      {
        id: 'duel-f1-ylim',
        title: 'Duelo 2: Punto de partida del Eje Y en tasas de defecto',
        question: 'La tasa más baja es 0,9% (Línea 2) y la más alta es 3,4% (Línea 3). ¿Dónde debe comenzar el eje Y?',
        versionA: {
          label: 'Versión A: En 0.0% (comportamiento natural de ax.bar)',
          code: `# Eje Y parte en 0.0%: se aprecia fielmente que 3.4% es ~3 veces el ~1.0% del resto.`,
          chartConfig: {
            type: 'bar',
            xKey: 'linea_produccion',
            yKey: 'tasa_defectos_pct',
            title: 'Línea 3 triplica la tasa normal de defectos (3,4%)',
            xlabel: 'Línea de producción',
            ylabel: 'Unidades defectuosas (%)',
            ylim: [0, 3.8],
            colors: ['#808080', '#808080', '#ff8c00', '#808080', '#808080']
          }
        },
        versionB: {
          label: 'Versión B: En 0.85% con ax.set_ylim(0.85, 3.5)',
          code: `ax.set_ylim(0.85, 3.5) # Hace que la Línea 2 parezca tener casi cero defectos`,
          chartConfig: {
            type: 'bar',
            xKey: 'linea_produccion',
            yKey: 'tasa_defectos_pct',
            title: 'Defectos por línea, octubre',
            xlabel: 'Línea de producción',
            ylabel: 'Unidades defectuosas (%)',
            ylim: [0.85, 3.6],
            colors: ['#808080', '#808080', '#ff8c00', '#808080', '#808080']
          }
        },
        correctVersion: 'A',
        explanation: 'Partir en 0.0% permite ver la proporción real: la Línea 3 (3,4%) tiene aproximadamente el triple de defectos que las demás líneas (~1,0%), sin hacer parecer que la Línea 2 (0,9%) tiene cero fallas.'
      }
    ],
    storytelling: {
      prompt: 'Elige el mejor titular de Storytelling para el reporte de ingeniería:',
      options: [
        {
          id: 's1',
          title: 'Línea 3 concentra la anomalía de calidad con 3,4% de defectos (el triple que el resto)',
          takeaway: 'Mientras las Líneas 1, 2, 4 y 5 se mantienen estables en torno al 1,0% de unidades defectuosas, la Línea 3 requiere intervención técnica inmediata.',
          isCorrect: true,
          feedback: '¡Perfecto! El titular y el color de acento trabajan juntos para impulsar una decisión concreta.'
        },
        {
          id: 's2',
          title: 'Porcentaje de unidades defectuosas en cinco líneas',
          takeaway: 'Gráfico de barras con una barra naranja y cuatro grises.',
          isCorrect: false,
          feedback: 'Describe los elementos geométricos del gráfico en lugar del hallazgo de negocio.'
        },
        {
          id: 's3',
          title: 'Todas las líneas de producción fallaron en octubre',
          takeaway: 'Hay defectos en todas las líneas.',
          isCorrect: false,
          feedback: 'Pierde por completo el foco: un ~1% es el estándar normal de operación; el problema real está concentrado en la Línea 3.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

lineas = ["Línea 1", "Línea 2", "Línea 3", "Línea 4", "Línea 5"]
tasa = [1.2, 0.9, 3.4, 1.1, 1.0]
colores = ["gray", "gray", "darkorange", "gray", "gray"]

fig, ax = plt.subplots(figsize=(5.5, 3.6))
ax.bar(lineas, tasa, color=colores)
ax.set_title("Línea 3 triplica la tasa normal de defectos (3,4%)")
ax.set_ylabel("Unidades defectuosas (%)")
plt.show()`
    }
  },
  {
    id: 'delivery-llamadas-soporte',
    industry: 'Delivery & Operaciones',
    icon: 'PhoneCall',
    badgeColor: '#38BDF8',
    title: 'Colapso al Mediodía: Llamadas Recibidas vs. Atendidas en Soporte (Diapo 30)',
    company: 'RápidoExpress Delivery',
    context: '¡El desafío final de la Clase 10 (Diapositiva 30)! La central de soporte de pedidos registra por cada bloque de una hora (desde las 8:00 hasta las 19:00) cuántas llamadas de clientes entraron (recibidas) y cuántas lograron responder los agentes (atendidas). En el gráfico crudo sin etiquetas ni marcas completas, la gerencia no logra ver con precisión en qué horarios colapsó el equipo.',
    businessQuestion: '¿En qué bloques horarios exactos no se atendieron todas las llamadas y cómo aplicar al menos 3 herramientas de la Clase 10 para dejarlo clarísimo?',
    dataframeName: 'soporte_bloques',
    columns: [
      {
        name: 'central_id',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['SCL-01', 'SCL-01', 'SCL-01', 'SCL-01'],
        explanation: 'Código fijo de la sucursal; no varía ni aporta a la pregunta.'
      },
      {
        name: 'hora',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Temporal / Cuantitativa Discreta',
        sampleValues: [8, 9, 10, 11, 12],
        explanation: 'Inicio de cada bloque de una hora (8 = 8:00–9:00; 19 = 19:00–20:00). Va en el eje X.'
      },
      {
        name: 'recibidas',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Discreta (Serie 1)',
        sampleValues: [40, 70, 95, 120, 140],
        explanation: 'Llamadas totales que entraron en ese bloque horario.'
      },
      {
        name: 'atendidas',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y2',
        semanticType: 'Cuantitativa Discreta (Serie 2)',
        sampleValues: [40, 70, 95, 108, 110],
        explanation: 'Llamadas efectivamente contestadas por el equipo (tope de capacidad ~110 llamadas/hora).'
      }
    ],
    rows: [
      { central_id: 'SCL-01', hora: 8, recibidas: 40, atendidas: 40 },
      { central_id: 'SCL-01', hora: 9, recibidas: 70, atendidas: 70 },
      { central_id: 'SCL-01', hora: 10, recibidas: 95, atendidas: 95 },
      { central_id: 'SCL-01', hora: 11, recibidas: 120, atendidas: 108 },
      { central_id: 'SCL-01', hora: 12, recibidas: 140, atendidas: 110 },
      { central_id: 'SCL-01', hora: 13, recibidas: 150, atendidas: 108 },
      { central_id: 'SCL-01', hora: 14, recibidas: 125, atendidas: 110 },
      { central_id: 'SCL-01', hora: 15, recibidas: 105, atendidas: 105 },
      { central_id: 'SCL-01', hora: 16, recibidas: 100, atendidas: 100 },
      { central_id: 'SCL-01', hora: 17, recibidas: 90, atendidas: 90 },
      { central_id: 'SCL-01', hora: 18, recibidas: 75, atendidas: 75 },
      { central_id: 'SCL-01', hora: 19, recibidas: 55, atendidas: 55 }
    ],
    chartQuestion: {
      prompt: 'Queremos comparar las llamadas recibidas vs. atendidas hora a hora entre las 8:00 y las 19:00 para detectar exactamente en qué horas se separan las curvas. ¿Qué visualización usamos?',
      correctChart: 'multiline',
      options: [
        {
          id: 'multiline',
          label: 'Gráfico de Líneas Multiserie — dos llamadas a ax.plot(hora, ...) en el mismo Axes',
          reason: '¡Exacto! Permite ver cómo ambas curvas coinciden temprano y en la tarde, pero se separan al mediodía cuando la demanda supera la capacidad.'
        },
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(recibidas, atendidas)',
          reason: 'Incorrecto: al quitar la hora del eje X no podríamos responder fácilmente qué bloques horarios (11, 12, 13, 14) quedaron sin atender.'
        },
        {
          id: 'pie',
          label: 'Gráfico de Torta — ax.pie(recibidas)',
          reason: 'Incorrecto: no permite comparar recibidas contra atendidas por hora.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-delivery-xticks',
        title: 'Duelo 1: Identificar los bloques exactos con ax.set_xticks(hora) y leyenda',
        question: 'En el gráfico original de la Diapo 30, el eje X solo muestra los números pares (8, 10, 12, 14, 16, 18) y no tiene leyenda. ¿Cuál versión permite identificar sin dudar que el problema ocurre en los bloques 11, 12, 13 y 14?',
        versionA: {
          label: 'Versión A: Con ax.set_xticks(hora), label=, ax.legend() y ax.grid(True)',
          code: `fig, ax = plt.subplots(figsize=(6.5, 3.8))
ax.plot(hora, recibidas, label="Recibidas", color="navy", marker="o", linewidth=2.5)
ax.plot(hora, atendidas, label="Atendidas", color="darkorange", marker="s",
        linestyle="--", linewidth=2.5)
ax.set_title("Entre las 11:00 y 15:00 soporte no logra atender todas las llamadas")
ax.set_xlabel("Bloque horario (hora de inicio)")
ax.set_ylabel("Cantidad de llamadas")
ax.set_xticks(hora)
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)
plt.show()`,
          chartConfig: {
            type: 'multiline',
            xKey: 'hora',
            yKey: 'recibidas',
            y2Key: 'atendidas',
            yLabel1: 'Recibidas',
            yLabel2: 'Atendidas',
            title: 'Entre las 11:00 y 15:00 soporte no logra atender todas las llamadas',
            xlabel: 'Bloque horario (hora de inicio)',
            ylabel: 'Cantidad de llamadas',
            legendLoc: 'upper right',
            showAllXChecks: true,
            styledLines: true,
            grid: true
          }
        },
        versionB: {
          label: 'Versión B: Gráfico crudo original de la actividad (sin labels ni set_xticks)',
          code: `fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(hora, recibidas)
ax.plot(hora, atendidas)
plt.show()`,
          chartConfig: {
            type: 'multiline',
            xKey: 'hora',
            yKey: 'recibidas',
            y2Key: 'atendidas',
            yLabel1: '',
            yLabel2: '',
            title: '',
            xlabel: '',
            ylabel: '',
            legendLoc: 'none',
            showAllXChecks: false,
            styledLines: false,
            grid: false
          }
        },
        correctVersion: 'A',
        explanation: '¡Resolviste la Actividad de la Diapo 30! Con ax.set_xticks(hora) aparecen las horas impares (11 y 13), con marker="o"/"s" vemos cada punto horario y con ax.legend() sabemos cuál línea es Recibidas y cuál es Atendidas.'
      },
      {
        id: 'duel-delivery-analysis',
        title: 'Duelo 2: Diagnóstico Operacional de los Bloques',
        question: 'Mirando los puntos de las horas 11, 12, 13 y 14 en la Versión A: ¿qué ocurre exactamente en esos 4 bloques horarios?',
        versionA: {
          label: 'Versión A: En los bloques 11, 12, 13 y 14 (11:00 a 15:00) las recibidas superan el tope de ~110 atendidas, perdiéndose 99 llamadas',
          code: `# Bloques con brecha:
# Hora 11: 120 vs 108 (-12) | Hora 12: 140 vs 110 (-30)
# Hora 13: 150 vs 108 (-42) | Hora 14: 125 vs 110 (-15) -> Total: 99 llamadas sin atender`,
          chartConfig: {
            type: 'multiline',
            xKey: 'hora',
            yKey: 'recibidas',
            y2Key: 'atendidas',
            yLabel1: 'Recibidas',
            yLabel2: 'Atendidas',
            title: 'Capacidad tope de 110 llamadas/h genera 99 llamadas perdidas (11:00–15:00)',
            xlabel: 'Bloque horario (hora de inicio)',
            ylabel: 'Cantidad de llamadas',
            legendLoc: 'upper right',
            showAllXChecks: true,
            styledLines: true,
            grid: true
          }
        },
        versionB: {
          label: 'Versión B: Solo falla el bloque de las 13:00 porque es el punto más alto',
          code: `# Lectura incompleta: ignora que a las 11, 12 y 14 la línea azul también supera a la naranja.`,
          chartConfig: {
            type: 'multiline',
            xKey: 'hora',
            yKey: 'recibidas',
            y2Key: 'atendidas',
            yLabel1: 'Recibidas',
            yLabel2: 'Atendidas',
            title: 'Solo falla a las 13 horas',
            xlabel: 'Bloque horario (hora de inicio)',
            ylabel: 'Cantidad de llamadas',
            legendLoc: 'upper right',
            showAllXChecks: true,
            styledLines: true,
            grid: true
          }
        },
        correctVersion: 'A',
        explanation: 'En los bloques 8, 9, 10 y luego 15 a 19 ambas líneas están superpuestas (se atiende el 100%). Entre el bloque 11 (11:00-12:00) y el bloque 14 (14:00-15:00), la línea de atendidas choca contra un techo de ~110 llamadas por hora, dejando 99 llamadas sin contestar.'
      }
    ],
    storytelling: {
      prompt: '¿Qué recomendación ejecutiva de Storytelling se desprende directamente de este gráfico mejorado?',
      options: [
        {
          id: 's1',
          title: 'Tope de capacidad (110 llamadas/h) deja 99 llamadas sin atender entre las 11:00 y las 15:00',
          takeaway: 'En el horario punta de almuerzo (bloques 11, 12, 13 y 14) la demanda llega a 150 llamadas/h pero el equipo satura en ~110; reforzar turnos en esas 4 horas elimina el 100% del déficit.',
          isCorrect: true,
          feedback: '¡Sobresaliente! Conectas el hallazgo visual exacto con la decisión operativa de negocio.'
        },
        {
          id: 's2',
          title: 'Hay que contratar el doble de operadores de 8:00 a 20:00',
          takeaway: 'Falta personal durante todo el día.',
          isCorrect: false,
          feedback: 'Ineficiente: de 8:00 a 11:00 y de 15:00 a 20:00 se atiende el 100% de las llamadas sin problema.'
        },
        {
          id: 's3',
          title: 'Gráfico de llamadas recibidas y atendidas por hora',
          takeaway: 'Muestra dos series en el mismo Axes.',
          isCorrect: false,
          feedback: 'Es un título descriptivo neutro; no responde la pregunta de negocio.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

hora = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
recibidas = [40, 70, 95, 120, 140, 150, 125, 105, 100, 90, 75, 55]
atendidas = [40, 70, 95, 108, 110, 108, 110, 105, 100, 90, 75, 55]

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(hora, recibidas, label="Recibidas", color="navy", marker="o", linewidth=2.5)
ax.plot(hora, atendidas, label="Atendidas", color="darkorange", marker="s",
        linestyle="--", linewidth=2.5)
ax.set_title("Entre las 11:00 y 15:00 soporte satura en ~110 llamadas/h", fontsize=13)
ax.set_xlabel("Inicio de bloque horario (h)")
ax.set_ylabel("Llamadas (cantidad)")
ax.set_xticks(hora)
ax.legend(loc="upper right")
ax.grid(True, alpha=0.3)
plt.show()`
    }
  },
  {
    id: 'cine-streaming-rentabilidad',
    industry: 'Cine & Entretenimiento',
    icon: 'Film',
    badgeColor: '#F43F5E',
    title: 'Estrenos de Cine: De Variable Cruda a Indicador de Margen por Género',
    company: 'Andes Pictures & Distribution',
    context: '¡Conexión directa entre la Semana 3 (Variables vs. Indicadores) y la Clase 10! El estudio tiene una tabla con 6 géneros cinematográficos que incluye ingresos de taquilla (`ventas_mm`) y costo de producción (`costo_mm`), pero viene con abreviaciones (`nom_gen`) y aún NO tiene calculado el indicador de margen porcentual (`margen_pct`).',
    businessQuestion: '¿Qué género cinematográfico tiene realmente el mayor margen de rentabilidad (%) y cómo construir y visualizar este indicador sin distorsionar las barras?',
    dataframeName: 'estrenos_cine',
    needsIndicator: {
      name: 'margen_pct',
      formula: '((df["ventas_mm"] - df["costo_mm"]) / df["ventas_mm"] * 100).round(1)',
      description: 'Indicador calculado de rentabilidad porcentual sobre ingresos.'
    },
    columns: [
      {
        name: 'id_catalogo',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['CAT-101', 'CAT-102', 'CAT-103', 'CAT-104', 'CAT-105', 'CAT-106'],
        explanation: 'Identificador interno de archivo; se elimina con df.drop(columns=["id_catalogo"]).'
      },
      {
        name: 'genero',
        dtype: 'object',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cualitativa Nominal',
        sampleValues: ['Terror Indie', 'Animación Familiar', 'Ciencia Ficción', 'Comedia Local', 'Acción Blockbuster', 'Drama Histórico'],
        explanation: 'Categoría de género cinematográfico (tras renombrar nom_gen -> genero con df.rename).'
      },
      {
        name: 'ventas_mm',
        dtype: 'float64',
        role: 'keep',
        axisRole: 'aux',
        semanticType: 'Cuantitativa Continua (Variable base)',
        sampleValues: [32.0, 54.0, 60.0, 28.0, 75.0, 18.0],
        explanation: 'Variable registrada de recaudación en millones de USD. Sirve para construir el indicador de margen.'
      },
      {
        name: 'margen_pct',
        dtype: 'float64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Continua (Indicador Calculado %)',
        sampleValues: [56.3, 40.7, 35.0, 32.1, 24.0, 16.7],
        explanation: '¡Indicador construido! Representa qué porcentaje de las ventas queda como margen. Una vez guardado en el DataFrame, también es una variable más para graficar en el eje Y.'
      }
    ],
    rows: [
      { id_catalogo: 'CAT-101', genero: 'Terror Indie', ventas_mm: 32.0, margen_pct: 56.3 },
      { id_catalogo: 'CAT-102', genero: 'Animación Familiar', ventas_mm: 54.0, margen_pct: 40.7 },
      { id_catalogo: 'CAT-103', genero: 'Ciencia Ficción', ventas_mm: 60.0, margen_pct: 35.0 },
      { id_catalogo: 'CAT-104', genero: 'Comedia Local', ventas_mm: 28.0, margen_pct: 32.1 },
      { id_catalogo: 'CAT-105', genero: 'Acción Blockbuster', ventas_mm: 75.0, margen_pct: 24.0 },
      { id_catalogo: 'CAT-106', genero: 'Drama Histórico', ventas_mm: 18.0, margen_pct: 16.7 }
    ],
    chartQuestion: {
      prompt: 'Una vez construido el indicador margen_pct en el DataFrame, queremos comparar la rentabilidad porcentual de los 6 géneros cinematográficos y destacar al líder. ¿Qué gráfico usamos?',
      correctChart: 'bar',
      options: [
        {
          id: 'bar',
          label: 'Gráfico de Barras anchas con color de acento — ax.bar(df["genero"], df["margen_pct"])',
          reason: '¡Exacto! Permite comparar el indicador de rentabilidad entre los 6 géneros nominales sin que las etiquetas largas se pisen.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(df["genero"], df["margen_pct"])',
          reason: 'Incorrecto: los géneros de cine son categorías nominales, no una serie de tiempo.'
        },
        {
          id: 'pie',
          label: 'Gráfico de Torta — ax.pie(df["margen_pct"])',
          reason: 'Incorrecto: promedios o porcentajes de margen de distintos géneros no suman un todo del 100%.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-cine-labels',
        title: 'Duelo 1: Etiquetas largas de géneros y color de acento',
        question: 'Los nombres como "Animación Familiar" y "Acción Blockbuster" son largos, y queremos resaltar que "Terror Indie" tiene el mayor margen (56,3%) pese a no ser el de mayor taquilla bruta. ¿Qué versión elegimos?',
        versionA: {
          label: 'Versión A: figsize=(12, 4.5) + color de acento en Terror Indie + ylim(0, 70)',
          code: `colores = ["darkorange", "gray", "gray", "gray", "gray", "gray"]
fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(df["genero"], df["margen_pct"], color=colores)
ax.set_title("Terror Indie lidera en rentabilidad con 56,3% de margen", fontsize=15)
ax.set_xlabel("Género cinematográfico", fontsize=12)
ax.set_ylabel("Margen sobre ventas (%)", fontsize=12)
ax.set_ylim(0, 70)
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'genero',
            yKey: 'margen_pct',
            title: 'Terror Indie lidera en rentabilidad con 56,3% de margen',
            xlabel: 'Género cinematográfico',
            ylabel: 'Margen sobre ventas (%)',
            ylim: [0, 70],
            wideFig: true,
            colors: ['#f59e0b', '#64748b', '#64748b', '#64748b', '#64748b', '#64748b']
          }
        },
        versionB: {
          label: 'Versión B: Figura angosta por defecto + colores arcoíris + sin etiquetas de eje',
          code: `colores = ["red", "blue", "green", "purple", "orange", "cyan"]
fig, ax = plt.subplots()
ax.bar(df["genero"], df["margen_pct"], color=colores)
plt.show()`,
          chartConfig: {
            type: 'bar',
            xKey: 'genero',
            yKey: 'margen_pct',
            title: '',
            xlabel: '',
            ylabel: '',
            ylim: [0, 70],
            wideFig: false,
            overlapLabels: true,
            colors: ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#06b6d4']
          }
        },
        correctVersion: 'A',
        explanation: 'Combina tres herramientas clave de la Clase 10: figsize=(12, 4.5) para que los nombres de los géneros se lean horizontales sin pisarse, color de acento para destacar al líder y rótulos completos de título y unidades (%).'
      },
      {
        id: 'duel-cine-rotate',
        title: 'Duelo 2: ¿Y si el ancho del informe está limitado? (Diapo 11)',
        question: 'Si el comité ejecutivo nos pide insertar este gráfico en una columna angosta de un informe PDF donde NO podemos usar figsize=(12, 4.5), ¿qué instrucción de la Diapo 11 soluciona el choque de etiquetas?',
        versionA: {
          label: 'Versión A: ax.tick_params(axis="x", labelrotation=30)',
          code: `fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(df["genero"], df["margen_pct"], color=colores)
ax.tick_params(axis="x", labelrotation=30) # Gira las etiquetas 30 grados`,
          chartConfig: {
            type: 'bar',
            xKey: 'genero',
            yKey: 'margen_pct',
            title: 'Terror Indie lidera en rentabilidad con 56,3% de margen',
            xlabel: 'Género cinematográfico',
            ylabel: 'Margen sobre ventas (%)',
            ylim: [0, 70],
            rotateLabels: 30,
            colors: ['#f59e0b', '#64748b', '#64748b', '#64748b', '#64748b', '#64748b']
          }
        },
        versionB: {
          label: 'Versión B: Eliminar los nombres de los géneros del eje X',
          code: `ax.set_xticks([]) # Nadie sabrá qué barra corresponde a qué género`,
          chartConfig: {
            type: 'bar',
            xKey: 'genero',
            yKey: 'margen_pct',
            title: 'Terror Indie lidera en rentabilidad con 56,3% de margen',
            xlabel: 'Género cinematográfico',
            ylabel: 'Margen sobre ventas (%)',
            ylim: [0, 70],
            overlapLabels: true,
            colors: ['#f59e0b', '#64748b', '#64748b', '#64748b', '#64748b', '#64748b']
          }
        },
        correctVersion: 'A',
        explanation: 'Como indica la Diapo 11: "Ensanchar deja el texto horizontal, que se lee más rápido. Girar con ax.tick_params(axis="x", labelrotation=30) sirve cuando el ancho está limitado".'
      }
    ],
    storytelling: {
      prompt: '¿Qué conclusión estratégica conecta mejor la construcción del indicador con el gráfico?',
      options: [
        {
          id: 's1',
          title: 'Terror Indie duplica el margen porcentual de Acción Blockbuster (56,3% vs. 24,0%)',
          takeaway: 'Mirar solo la variable de recaudación bruta engañaba al directorio: al construir el indicador margen_pct descubrimos que las producciones de Terror Indie son las más rentables por dólar vendido.',
          isCorrect: true,
          feedback: '¡Magistral! Conectaste la diferencia entre variable e indicador (Semana 3) con la visualización de impacto (Clase 10).'
        },
        {
          id: 's2',
          title: 'Acción Blockbuster es el género más rentable porque recaudó 75 millones',
          takeaway: 'Es el que tiene más ventas brutas.',
          isCorrect: false,
          feedback: 'Confundiste ingresos brutos (ventas_mm) con rentabilidad (margen_pct): Acción tiene costos altísimos y su margen es solo 24%.'
        },
        {
          id: 's3',
          title: 'Gráfico de barras de géneros de películas',
          takeaway: 'Muestra seis barras con rotación de etiquetas.',
          isCorrect: false,
          feedback: 'No transmite ninguna conclusión de negocio.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

colores = ["darkorange", "gray", "gray", "gray", "gray", "gray"]
fig, ax = plt.subplots(figsize=(12, 4.5))
ax.bar(df["genero"], df["margen_pct"], color=colores)
ax.set_title("Terror Indie lidera en rentabilidad con 56,3% de margen", fontsize=16)
ax.set_xlabel("Género cinematográfico", fontsize=13)
ax.set_ylabel("Margen sobre ventas (%)", fontsize=13)
ax.set_ylim(0, 70)
plt.show()`
    }
  },
  {
    id: 'sneakers-hype-resale',
    industry: 'Streetwear & Sneakers',
    icon: 'ShoppingBag',
    badgeColor: '#d97706',
    title: 'Fiebre de Sneakers: ¿La Escasez de Pares Se Asocia al Precio de Reventa?',
    company: 'DropKicks Latam Marketplace',
    context: 'La plataforma de reventa de zapatillas de edición limitada analizó 25 lanzamientos ("drops") midiendo el nivel de stock liberado (1 = Ultra Limitado a 5 = Masivo) frente al multiplicador de precio de reventa (de 2x a 12x sobre el precio original). Al graficar los 25 drops con ax.scatter(), solo se ven 12 puntos en pantalla porque varios drops tuvieron exactamente el mismo resultado.',
    businessQuestion: '¿Cómo visualizar la densidad real de los 25 lanzamientos superpuestos y qué relación muestra el gráfico entre nivel de stock y precio de reventa?',
    dataframeName: 'drops_sneakers',
    columns: [
      {
        name: 'sku_barras',
        dtype: 'object',
        role: 'drop',
        semanticType: 'Identificador / Ruido de Sistema',
        sampleValues: ['SNK-901', 'SNK-902', 'SNK-903', 'SNK-904', 'SNK-905'],
        explanation: 'Código SKU de inventario; no aporta al análisis de correlación.'
      },
      {
        name: 'nivel_stock',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'x',
        semanticType: 'Cuantitativa Discreta',
        sampleValues: [1, 1, 2, 3, 5],
        explanation: 'Tramo de unidades lanzadas al mercado (en miles de pares). Va en el eje X.'
      },
      {
        name: 'reventa_mult',
        dtype: 'int64',
        role: 'keep',
        axisRole: 'y',
        semanticType: 'Cuantitativa Discreta',
        sampleValues: [11, 10, 8, 5, 2],
        explanation: 'Múltiplo alcanzado en reventa respecto al precio retail. Va en el eje Y.'
      }
    ],
    rows: [
      { sku_barras: 'SNK-01', nivel_stock: 1, reventa_mult: 12 },
      { sku_barras: 'SNK-02', nivel_stock: 1, reventa_mult: 11 },
      { sku_barras: 'SNK-03', nivel_stock: 1, reventa_mult: 11 },
      { sku_barras: 'SNK-04', nivel_stock: 1, reventa_mult: 11 },
      { sku_barras: 'SNK-05', nivel_stock: 1, reventa_mult: 10 },
      { sku_barras: 'SNK-06', nivel_stock: 2, reventa_mult: 9 },
      { sku_barras: 'SNK-07', nivel_stock: 2, reventa_mult: 8 },
      { sku_barras: 'SNK-08', nivel_stock: 2, reventa_mult: 8 },
      { sku_barras: 'SNK-09', nivel_stock: 2, reventa_mult: 8 },
      { sku_barras: 'SNK-10', nivel_stock: 2, reventa_mult: 7 },
      { sku_barras: 'SNK-11', nivel_stock: 3, reventa_mult: 6 },
      { sku_barras: 'SNK-12', nivel_stock: 3, reventa_mult: 6 },
      { sku_barras: 'SNK-13', nivel_stock: 3, reventa_mult: 5 },
      { sku_barras: 'SNK-14', nivel_stock: 3, reventa_mult: 5 },
      { sku_barras: 'SNK-15', nivel_stock: 3, reventa_mult: 5 },
      { sku_barras: 'SNK-16', nivel_stock: 4, reventa_mult: 4 },
      { sku_barras: 'SNK-17', nivel_stock: 4, reventa_mult: 4 },
      { sku_barras: 'SNK-18', nivel_stock: 4, reventa_mult: 4 },
      { sku_barras: 'SNK-19', nivel_stock: 4, reventa_mult: 3 },
      { sku_barras: 'SNK-20', nivel_stock: 4, reventa_mult: 3 },
      { sku_barras: 'SNK-21', nivel_stock: 5, reventa_mult: 3 },
      { sku_barras: 'SNK-22', nivel_stock: 5, reventa_mult: 2 },
      { sku_barras: 'SNK-23', nivel_stock: 5, reventa_mult: 2 },
      { sku_barras: 'SNK-24', nivel_stock: 5, reventa_mult: 2 },
      { sku_barras: 'SNK-25', nivel_stock: 5, reventa_mult: 2 }
    ],
    chartQuestion: {
      prompt: 'Queremos visualizar cómo se relacionan dos variables numéricas (stock liberado en miles vs. múltiplo de reventa) en los 25 lanzamientos. ¿Qué gráfico corresponde?',
      correctChart: 'scatter',
      options: [
        {
          id: 'scatter',
          label: 'Gráfico de Dispersión — ax.scatter(nivel_stock, reventa_mult, alpha=0.3)',
          reason: '¡Exacto! Permite observar la asociación negativa (a menor stock, mayor múltiplo de reventa) y dónde se concentran los drops.'
        },
        {
          id: 'line',
          label: 'Gráfico de Líneas — ax.plot(nivel_stock, reventa_mult)',
          reason: 'Incorrecto: son 25 lanzamientos independientes, no una serie de tiempo.'
        },
        {
          id: 'bar',
          label: 'Gráfico de Barras — ax.bar(nivel_stock, reventa_mult)',
          reason: 'Incorrecto: al haber varios lanzamientos con el mismo stock, las barras se pisan ocultando la dispersión.'
        }
      ]
    },
    duels: [
      {
        id: 'duel-sneakers-alpha',
        title: 'Duelo 1: Revelar puntos repetidos con alpha=0.3 y ax.grid(True)',
        question: '¿Cuál versión permite distinguir en qué coordenada exacta se acumulan hasta 4 drops con el mismo stock y precio de reventa?',
        versionA: {
          label: 'Versión A: ax.scatter(..., alpha=0.3) + ax.grid(True)',
          code: `fig, ax = plt.subplots(figsize=(5, 3.4))
ax.scatter(stock, reventa, alpha=0.3)
ax.set_title("Precio de reventa según stock liberado")
ax.set_xlabel("Stock liberado (miles de pares)")
ax.set_ylabel("Múltiplo de precio en reventa (x)")
ax.grid(True)
plt.show()`,
          chartConfig: {
            type: 'scatter',
            xKey: 'nivel_stock',
            yKey: 'reventa_mult',
            title: 'Precio de reventa según stock liberado',
            xlabel: 'Stock liberado (miles de pares)',
            ylabel: 'Múltiplo de precio en reventa (x)',
            alpha: 0.3,
            grid: true
          }
        },
        versionB: {
          label: 'Versión B: Puntos 100% opacos sin grilla de referencia',
          code: `fig, ax = plt.subplots(figsize=(5, 3.4))
ax.scatter(stock, reventa)
plt.show()`,
          chartConfig: {
            type: 'scatter',
            xKey: 'nivel_stock',
            yKey: 'reventa_mult',
            title: '',
            xlabel: '',
            ylabel: '',
            alpha: 1.0,
            grid: false
          }
        },
        correctVersion: 'A',
        explanation: 'Con alpha=0.3 los puntos con mayor concentración de drops (como 1.000 pares a 11x o 5.000 pares a 2x) se ven más oscuros, y la grilla facilita leer cada par (x, y).'
      }
    ],
    storytelling: {
      prompt: 'Elige el mejor titular de Storytelling para el equipo de lanzamientos:',
      options: [
        {
          id: 's1',
          title: 'Mayor escasez se asocia a múltiplos de reventa hasta 5 veces superiores (11x vs. 2x)',
          takeaway: 'Los drops de 1.000 pares concentran su reventa en 11x el valor retail, mientras los lanzamientos masivos de 5.000 pares convergen a solo 2x.',
          isCorrect: true,
          feedback: '¡Excelente! Resumes la asociación inversa con cifras concretas leídas directamente de las zonas de mayor densidad.'
        },
        {
          id: 's2',
          title: 'Gráfico de dispersión de zapatillas',
          takeaway: 'Hay puntos azules transparentes en una grilla.',
          isCorrect: false,
          feedback: 'No comunica el aprendizaje de negocio.'
        }
      ],
      finalCode: `import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5.5, 3.8))
ax.scatter(stock, reventa, alpha=0.3, s=65)
ax.set_title("Mayor escasez se asocia a múltiplos de reventa de hasta 11x")
ax.set_xlabel("Stock liberado (miles de pares)")
ax.set_ylabel("Múltiplo de precio en reventa (x)")
ax.grid(True)
plt.show()`
    }
  }
];

export const CHEAT_SHEET_DATA = {
  anatomy: {
    title: 'Anatomía de Matplotlib: Figure (fig) vs. Axes (ax) vs. Axis',
    points: [
      {
        term: 'Figure (fig)',
        code: 'fig, ax = plt.subplots(figsize=(12, 4.5))',
        desc: 'El espacio o lienzo completo que se muestra, incluidos los márgenes. Su tamaño en pulgadas (ancho, alto) se controla con figsize (por defecto mide 6,4 × 4,8 pulgadas).'
      },
      {
        term: 'Axes (ax)',
        code: 'ax.bar(...) / ax.plot(...) / ax.scatter(...)',
        desc: 'El panel o área de coordenadas x-y donde se ubican los datos y se configuran los ejes, el título y la leyenda. ¡Ojo! "Axes" NO es "ejes [axis]": un Axes es un área de datos que adentro contiene dos Axis.'
      },
      {
        term: 'Axis (x / y)',
        code: 'ax.set_xlabel(...) / ax.set_xticks(...) / ax.set_ylim(...)',
        desc: 'Cada uno de los dos ejes individuales (el eje horizontal X y el eje vertical Y) que viven dentro de un Axes.'
      }
    ]
  },
  pltVsAx: [
    { action: 'Título del gráfico', oldPlt: 'plt.title("Pedidos por mes")', newAx: 'ax.set_title("Pedidos por mes", fontsize=16)' },
    { action: 'Etiqueta del eje X', oldPlt: 'plt.xlabel("Mes")', newAx: 'ax.set_xlabel("Mes", fontsize=13)' },
    { action: 'Etiqueta del eje Y', oldPlt: 'plt.ylabel("Pedidos")', newAx: 'ax.set_ylabel("Pedidos", fontsize=13)' },
    { action: 'Límites del eje Y', oldPlt: 'plt.ylim(0, 160)', newAx: 'ax.set_ylim(0, 160)' },
    { action: 'Marcas del eje X', oldPlt: 'plt.xticks(semanas)', newAx: 'ax.set_xticks(semanas)' },
    { action: 'Escala logarítmica', oldPlt: 'plt.yscale("log")', newAx: 'ax.set_yscale("log")' },
    { action: 'Girar etiquetas eje X', oldPlt: 'plt.xticks(rotation=30)', newAx: 'ax.tick_params(axis="x", labelrotation=30)' }
  ],
  chartDecisionTree: [
    {
      question: '¿Comparar magnitudes entre categorías nominales (ej. ventas por categoría, defectos por línea)?',
      variables: '1 Cualitativa Nominal (X) + 1 Cuantitativa (Y)',
      chart: 'Gráfico de Barras — ax.bar(x, y)',
      goldenRule: 'El eje Y SIEMPRE debe partir en cero: ax.set_ylim(0, max). Si las etiquetas se pisan, ensanchar con figsize=(12, 4.5) o girar con labelrotation=30.'
    },
    {
      question: '¿Ver evolución, tendencia o ritmo de cambio a lo largo del tiempo (meses, semanas, horas)?',
      variables: '1 Temporal/Secuencial (X) + 1 o más Cuantitativas (Y)',
      chart: 'Gráfico de Líneas — ax.plot(x, y, marker="o")',
      goldenRule: 'Usar ax.set_xticks(x) para mostrar todos los períodos. Si comparas cantidades usa escala lineal; si comparas ritmo porcentual de crecimiento entre valores muy distintos, usa ax.set_yscale("log").'
    },
    {
      question: '¿Comparar dos o más series temporales en el mismo panel (ej. Web vs. App, Recibidas vs. Atendidas)?',
      variables: '1 Temporal (X) + 2 Cuantitativas (Y1, Y2)',
      chart: 'Líneas Multiserie — dos ax.plot(..., label="...") + ax.legend()',
      goldenRule: 'Distinguir series incluso sin color usando marker="o"/"s", linestyle="--" y linewidth=2.5. Ubicar la leyenda donde NO tape los datos (ej. loc="lower right").'
    },
    {
      question: '¿Explorar la relación o asociación entre dos variables numéricas (ej. inversión vs. ventas)?',
      variables: '1 Cuantitativa (X) + 1 Cuantitativa (Y)',
      chart: 'Gráfico de Dispersión — ax.scatter(x, y, alpha=0.3)',
      goldenRule: 'Si hay puntos con los mismos valores que se tapan (overplotting), usar alpha=0.3 y ax.grid(True). Recordar: asociación visual NO prueba causalidad.'
    }
  ],
  variableTypes: [
    {
      type: 'Identificador / Ruido de Sistema',
      example: 'codigo_interno, id_tienda, hash_log',
      action: 'Descartar con df.drop(columns=[...]). Aunque su dtype técnico sea int64 u object, no es una variable analítica ni agrupable.'
    },
    {
      type: 'Cualitativa Nominal',
      example: 'categoria ("Electrohogar"), linea ("Línea 3"), jugador',
      action: 'Agrupa o clasifica sin un orden numérico intrínseco. Ideal para el eje X en gráficos de barras.'
    },
    {
      type: 'Temporal / Secuencial',
      example: 'mes (1..12), semana (1..12), bloque horario (8..19)',
      action: 'Posee un orden cronológico estricto. Ideal para el eje X en gráficos de líneas con ax.set_xticks().'
    },
    {
      type: 'Cuantitativa (Discreta / Continua) e Indicadores',
      example: 'ventas_mm, pedidos, margen_pct, tasa_defectos',
      action: 'Mide una magnitud numérica o un indicador calculado (ej. margen_pct = margen / ventas * 100). Va en el eje Y (o ambos ejes en scatter).'
    }
  ]
};

import React, { useState, useEffect, useRef } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function CaseCreatorModal({ isOpen, onClose, onCreateCase }) {
  const [industry, setIndustry] = useState('Música & Festivales');
  const [company, setCompany] = useState('LollaChile Live');
  const [title, setTitle] = useState('Venta de Entradas por Escenario Temático');
  const [context, setContext] = useState(
    'La productora quiere mostrar las ventas en millones de CLP de sus 5 escenarios para decidir dónde ampliar graderías, destacando el escenario principal con color de acento.'
  );
  const [categoriesRaw, setCategoriesRaw] = useState(
    'Main Stage: 55.0, Electrónica: 38.5, Urbano: 34.0, Indie: 19.5, Kids: 11.0'
  );

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const pairs = categoriesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRows = pairs.map((p, idx) => {
      const [cat, valStr] = p.split(':').map((x) => x?.trim());
      return {
        id_interno: `SYS-0${idx + 1}`,
        item: cat || `Categoría ${idx + 1}`,
        valor: parseFloat(valStr) || (idx + 1) * 10
      };
    });

    const maxVal = Math.max(...parsedRows.map((r) => r.valor), 50);
    const topItem = [...parsedRows].sort((a, b) => b.valor - a.valor)[0]?.item || 'Principal';

    const newCase = {
      id: `custom-${Date.now()}`,
      industry,
      icon: 'Sparkles',
      badgeColor: '#f0b429',
      title,
      company,
      context,
      businessQuestion: `¿Cuál categoría lidera en ${company} y cómo representarlo sin distorsión visual?`,
      dataframeName: 'df_personalizado',
      columns: [
        {
          name: 'id_interno',
          dtype: 'object',
          role: 'drop',
          semanticType: 'Identificador / Ruido de Sistema',
          sampleValues: parsedRows.map((r) => r.id_interno),
          explanation: 'Identificador interno de sistema que se descarta con df.drop.'
        },
        {
          name: 'item',
          dtype: 'object',
          role: 'keep',
          axisRole: 'x',
          semanticType: 'Cualitativa Nominal',
          sampleValues: parsedRows.map((r) => r.item),
          explanation: 'Categorías nominales que van en el eje X.'
        },
        {
          name: 'valor',
          dtype: 'float64',
          role: 'keep',
          axisRole: 'y',
          semanticType: 'Cuantitativa Continua',
          sampleValues: parsedRows.map((r) => r.valor),
          explanation: 'Magnitud numérica que determina la altura de cada barra en el eje Y.'
        }
      ],
      rows: parsedRows,
      chartQuestion: {
        prompt:
          'Tenemos una variable Cualitativa Nominal y una Cuantitativa Continua para comparar magnitudes. ¿Qué gráfico elegimos?',
        correctChart: 'bar',
        options: [
          {
            id: 'bar',
            label: 'Gráfico de Barras — ax.bar(df["item"], df["valor"])',
            reason:
              'Ideal para comparar magnitudes entre categorías nominales partiendo desde cero.'
          },
          {
            id: 'line',
            label: 'Gráfico de Líneas — ax.plot(df["item"], df["valor"])',
            reason: 'Incorrecto: son categorías nominales independientes, no una serie de tiempo.'
          },
          {
            id: 'scatter',
            label: 'Gráfico de Dispersión — ax.scatter(df["item"], df["valor"])',
            reason: 'Incorrecto: las barras comunican mejor la proporción desde cero.'
          }
        ]
      },
      duels: [
        {
          id: 'custom-duel-1',
          title: 'Color de Acento + Eje Y en Cero',
          question: `¿Cuál versión destaca mejor a "${topItem}" siguiendo las reglas de la Clase 10?`,
          versionA: {
            label: 'Color de acento + figsize ancho + Eje Y en 0',
            code: `colores = ["darkorange" if x == "${topItem}" else "gray" for x in df["item"]]
fig, ax = plt.subplots(figsize=(10, 4.2))
ax.bar(df["item"], df["valor"], color=colores)
ax.set_title("${topItem} lidera en ${company}")
ax.set_ylim(0, ${Math.ceil(maxVal * 1.15)})
plt.show()`,
            chartConfig: {
              type: 'bar',
              xKey: 'item',
              yKey: 'valor',
              title: `${topItem} lidera en ${company}`,
              xlabel: 'Categoría',
              ylabel: 'Valor medido',
              ylim: [0, Math.ceil(maxVal * 1.15)],
              wideFig: true,
              colors: parsedRows.map((r) => (r.item === topItem ? '#d97706' : '#64748b'))
            }
          },
          versionB: {
            label: 'Colores arcoíris sin título ni etiquetas',
            code: `colores = ["red", "blue", "green", "purple", "orange"]
fig, ax = plt.subplots()
ax.bar(df["item"], df["valor"], color=colores)
plt.show()`,
            chartConfig: {
              type: 'bar',
              xKey: 'item',
              yKey: 'valor',
              title: '',
              xlabel: '',
              ylabel: '',
              ylim: [0, Math.ceil(maxVal * 1.15)],
              wideFig: false,
              colors: ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316']
            }
          },
          correctVersion: 'A',
          explanation:
            'El color de acento guía la vista inmediatamente hacia la categoría líder sin distraer con colores innecesarios.'
        }
      ],
      storytelling: {
        prompt: 'Elige el mejor titular de Storytelling para este caso creado en vivo:',
        options: [
          {
            id: 's1',
            title: `${topItem} lidera los resultados de ${company}, marcando la prioridad de inversión`,
            takeaway:
              'El gráfico con color de acento y eje en cero permite tomar la decisión sin explicaciones adicionales.',
            isCorrect: true,
            feedback: 'Titular directo, accionable y respaldado por los datos.'
          },
          {
            id: 's2',
            title: 'Gráfico de barras de datos',
            takeaway: 'Se muestran las barras de la tabla.',
            isCorrect: false,
            feedback: 'Titular genérico que no cuenta la historia de los datos.'
          }
        ],
        finalCode: `import matplotlib.pyplot as plt

colores = ["darkorange" if x == "${topItem}" else "gray" for x in df["item"]]
fig, ax = plt.subplots(figsize=(10, 4.2))
ax.bar(df["item"], df["valor"], color=colores)
ax.set_title("${topItem} lidera los resultados de ${company}", fontsize=15)
ax.set_xlabel("Categoría")
ax.set_ylabel("Valor")
plt.show()`
      }
    };

    onCreateCase(newCase);
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    } else {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="app-dialog small-dialog"
      aria-labelledby="creator-dialog-title"
      {...{ closedby: 'any' }}
    >
      <div className="modal-header">
        <div className="modal-title-group">
          <PlusCircle size={22} className="modal-accent-icon" />
          <div>
            <h2 id="creator-dialog-title">Crear Caso Empresarial en Vivo</h2>
            <p>Agrega un contexto propuesto por los estudiantes durante la ayudantía</p>
          </div>
        </div>
        <form method="dialog">
          <button
            type="submit"
            value="cancel"
            className="modal-close-btn"
            aria-label="Cerrar creador de casos"
          >
            <X size={18} />
          </button>
        </form>
      </div>

      <form className="creator-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Industria / Temática
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              autoFocus
              required
            />
          </label>
          <label>
            Empresa / Organización
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Título del Caso
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Contexto de Negocio
          <textarea
            rows={2}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            required
          />
        </label>

        <label>
          <span>
            Datos (formato <code>Categoría: Valor</code> separados por coma)
          </span>
          <input
            type="text"
            value={categoriesRaw}
            onChange={(e) => setCategoriesRaw(e.target.value)}
            required
          />
        </label>

        <div className="modal-footer-btns">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Crear y Jugar Caso
          </button>
        </div>
      </form>
    </dialog>
  );
}

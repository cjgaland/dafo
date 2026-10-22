# DAFO · CAME

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona sin conexión) para hacer, paso a paso y aprendiendo mientras se hace, el **análisis DAFO** (debilidades, amenazas, fortalezas y oportunidades) de un servicio, una unidad o un proyecto sanitario y, a partir de él, el **análisis CAME** (corregir, afrontar, mantener, explotar) y un plan de acción con indicadores.

Ocho pasos: qué se analiza y para qué; fuentes de información; mirar hacia dentro (fortalezas y debilidades); mirar hacia fuera (oportunidades y amenazas); priorizar; cruzar los factores; estrategias CAME; plan de acción. Están disponibles los ocho pasos.

- Preguntas guía por área (análisis interno) y por ámbito del entorno (PESTEL adaptado a sanidad).
- Cada factor con el dato que lo respalda, su importancia y, en lo externo, su probabilidad y su peso.
- Avisos didácticos de las trampas más habituales: algo externo escrito como interno (o al revés), una solución escrita como factor, factores vagos, repetidos o sin datos.
- Pegar los factores desde Excel, Calc o Word.
- Trabajo en equipo: equipo y sesiones, lluvia de ideas con grupo nominal, votación de la importancia, modo reunión y hoja de trabajo para las sesiones en papel.
- Ediciones anuales con comparación y vista por bloques ACSA del análisis interno.
- Prioridad por cuadrante, matriz cruzada con orientación estratégica, estrategias CAME elegidas por impacto y viabilidad, y plan de acción con indicadores y seguimiento.
- Informe DAFO · CAME y resumen para la Dirección en Word y PDF, lámina DAFO y Excel.
- Paquete de intercambio para las otras apps del ecosistema (factores, estrategias y candidatos a AMFE, Mapa de Riesgos o auditoría).
- **Traer de AMFE**: los AMFE de la app hermana como evidencia de una debilidad o una fortaleza.
- **Aprende** (siete temas), **Ponte a prueba** (20 preguntas y tres ejercicios), **glosario**, un **ejemplo completo** (una UGC de Atención Primaria inventada que prepara su acuerdo de gestión, con su edición anterior) y **seis minicasos**.

Los datos se guardan solo en el dispositivo; para trabajar en equipo se comparte la copia de seguridad.

Hermana de [AMFE](https://cjgaland.github.io/amfe/), [Auditorías](https://cjgaland.github.io/auditorias/), [Indicadores](https://cjgaland.github.io/indicadores-calidad/) y [Tamaño Muestral](https://cjgaland.github.io/tamano-muestral/).

## Uso
Servir la carpeta y abrir `index.html`:

    python3 -m http.server 8770

Tests de la lógica:

    node tests/logic.test.mjs

Documentación técnica y decisiones: ver `CLAUDE.md`.

Aplicación desarrollada por:

- **Carlos J. Galán Doval** · Médico de Familia · Técnico en Calidad y Seguridad del Paciente
- **Rafael J. Romero de Castilla Gil** · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente

Área de Gestión Sanitaria Sur de Córdoba · Andalucía. De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.

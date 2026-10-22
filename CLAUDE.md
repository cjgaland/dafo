# CLAUDE.md — DAFO · CAME

> Documento común a todas las apps (lista, carpetas, identidad visual e intercambio de datos): `/Users/Trabajo/Desktop/Ecosistema Calidad/ECOSISTEMA.md`.

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios. Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño completo, las decisiones del autor y el plan por entregas están en `/Users/Trabajo/Desktop/DAFO/Diseño/DISEÑO_DAFO.md` (léelo también al empezar una sesión).

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) para hacer, **paso a paso y de forma didáctica**, el **análisis DAFO** (debilidades, amenazas, fortalezas y oportunidades) de un servicio, unidad o proyecto sanitario y, a partir de él, el **análisis CAME** (corregir, afrontar, mantener, explotar) y un **plan de acción con indicadores**. Metodología estándar (sin curso propio), adaptada a la gestión sanitaria: acuerdo de gestión de una UGC, acreditación ACSA, plan estratégico, proyecto nuevo. Herramienta docente y de apoyo; no sustituye el criterio profesional.

Es una **herramienta** del ecosistema (funciona sola). Publicará `localStorage["dafo-intercambio"]` (formato `dafo-came` v1, diseño sección 6; llega en la entrega 2) para que AMFE, Mapa de Riesgos y Auditorías traigan sus candidatos y acciones. Leerá `amfe-intercambio` (como evidencia) e `indicadores-datos` (indicadores de las acciones).

Autoría (idéntica en el pie de index.html, «Acerca de», `informePie()` en app.js y el README; orden alfabético, sin centro de trabajo): Carlos J. Galán Doval (Médico de Familia · Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente), Área de Gestión Sanitaria Sur de Córdoba · Andalucía.

## 2. Arquitectura
Base copiada de `AMFE/Aplicación` (entrega 1) y de su `styles.css` actual (mismos patrones que Auditorías). Archivos:
- `index.html` — esqueleto, cabecera (logo: matriz 2 × 2), nav, franja de ejemplo, modales (bienvenida, Acerca de, novedades, confirmar), `<input type=file>` para importar. Script inline que fija `data-tema` antes de pintar.
- `styles.css` — el de AMFE con el **acento cambiado a violeta** (la variable sigue llamándose `--cyan`: claro `#6d28d9`, oscuro `#a78bfa`, texto sobre acento en oscuro `#1e0b3d`, impreso `#5b21b6`). Conserva los bloques heredados de Indicadores, Auditorías y AMFE (algunos se usan: `sub-card`, `wiz-steps--8`, `punt-esc`, `seg`…). Bloque final «Componentes propios de DAFO · CAME»: colores de cuadrante `.q-F` verde, `.q-D` ámbar, `.q-O` azul, `.q-A` rojo (variables `--qc` y `--qc-dim`, también en oscuro y en la vista de informe), columnas `.cuad-2`/`.cuad`, tarjetas de factor `.fx` (código `.fx-cod`, peso `.peso-b`, botones 1–5 `.seg--5`, desplegable `.fx-mas`), preguntas guía `.guia-*` y matriz 2 × 2 `.dafo-m`/`.dm-*`.
- `logic.js` — funciones PURAS (`window.Logica` / `module.exports`): `CUADRANTES` (F, D, O, A con su estrategia CAME), `PASOS` (con la entrega en que se activa cada uno), `TIPOS_OBJETO`, `FINALIDADES` (horizonte propuesto, consejo y fuentes que suelen servir), `aniosHorizonte`, `FUENTES_TIPO`, `APORTA`, `AREAS` (análisis interno, con preguntas guía), `AMBITOS` (PESTEL adaptado + entorno sanitario, comunidad, formación), `BLOQUES_ACSA` y `AREA_A_BLOQUE` (para la vista por bloques de la entrega 4), escalas `ESC_IMP`/`ESC_PROB`, **`peso(f)`** (interno = importancia 1–5; externo = importancia × probabilidad 1–25; sin datos = null), `codigo` (F1, D3…), `ordenar`/`delTipo`/`matrizDafo`/`puestos`, fábricas (`nuevoDafo`, `nuevaFuente`, `nuevoFactor`), `siguienteNum` (por cuadrante), textos propuestos (`sugerirTitulo`, `sugerirHorizonte`, `sugerirMision`, `sugerirVision`), **`revisarRedaccion(texto, tipo)`** → `[{ k: solucion|externo|interno|vago|persona, texto }]` (patrones estrechos a propósito), `parecido` (palabras compartidas, para repetidos y «el mismo asunto a favor y en contra»), avisos por paso (`avisosObjeto`, `avisosFuentes`, `avisosInterno`, `avisosExterno`, `avisosDe(d, n)`; cada aviso lleva `paso` y, si es de un factor, `factor` = id), `resumen`, `progreso`, `pasoPendiente`, `siguientePaso`, **pegar** (`parsearFactores(texto, tipoPorDefecto)`: con cabecera, sin cabecera con o sin columna de tipo, o lista de una columna; `incorporarFactores`), saneado (`ESQ` + `sanear`, `sanearDafo`: referencias rotas fuera, área que no es de su cuadrante fuera, probabilidad vacía en los internos, números únicos por cuadrante), `sanearDatos`, `fusionar`.
- `contenido.js` — solo datos (`window.Contenido`): `TEMAS` (Aprende, 7 temas), `GLOSARIO` (39 términos), `EJEMPLOS` (`dafos`: la UGC de Atención Primaria inventada, 8 fuentes y 6 factores por cuadrante; `fichas`). HTML de confianza escrito a mano.
- `xlsx.js`, `docx.js` — copiados de AMFE (Excel y Word sin dependencias, color violeta). **Aún no se cargan** (no están en index.html ni en sw.js): se usarán en las entregas 2 (Excel) y 3 (Word).
- `app.js` — interfaz: datos, enrutado, inicio, lista, pasos 1–4, matriz DAFO, vista imprimible (`renderInforme`), Aprende, ejemplos, glosario, PDF en iOS, copia/importar, tema, modales, SW. Enlaces en la UI: campos del DAFO con `data-k`; fuentes con `data-u` + `data-f`; factores con `data-fx` + `data-f`; importancia y probabilidad con botones `data-act="fx-punt"` (pulsar el mismo valor lo borra). Al escribir se refrescan zonas (`refrescar`) sin perder el foco; los cambios de estructura repintan conservando el scroll (`repintar`). «Copiar a mis datos» da ids nuevos también a fuentes y factores y conserva qué fuente cita cada factor.
- `sw.js` — network-first; sin `skipWaiting` al instalar.
- `tests/logic.test.mjs` — `node tests/logic.test.mjs` (88 pruebas: peso, orden, redacción, avisos, pegar, saneado, ejemplo sin avisos falsos, contenido).

Rutas: `#/` inicio · `#/dafo` mis DAFO · `#/dafo/nuevo` · `#/dafo/<id>/<1-8>` · `?informe=1` vista imprimible (matriz y factores) · `#/aprende[/<n>]` · `#/glosario` · `#/ejemplos`. Más adelante: `#/prueba` y `?doc=informe|resumen|lamina|hoja`.

Datos: `localStorage["dafo-datos"]` = `{ app: "dafo", v, ultimaCopia, dafos: [] }`, guardado con 250 ms de retardo y al salir. Al cargar e importar se pasa SIEMPRE por `sanearDatos`. **Al añadir un campo nuevo**: añadirlo a la fábrica (`nuevoX`) y a `ESQ` en logic.js (si no, el saneado lo borra al recargar). Importancia y probabilidad se guardan como texto; el peso, el orden y los puestos se calculan siempre. Los ejemplos viven en memoria (ids `ej-…`) y nunca se guardan.

## 3. Pruebas en el navegador
El puerto 8769 lo usa Flujograma. DAFO usa el **8770**: `cd "/Users/Trabajo/Desktop/DAFO/Aplicación" && python3 -m http.server 8770` y la vista previa `app-dafo` de `/Users/Trabajo/Desktop/DAFO/.claude/launch.json` (solo URL). El navegador integrado no admite service workers (el error de consola al registrarlo es normal). Revisar siempre en escritorio y en móvil (360 px, sin scroll horizontal) y en modo oscuro. Icono: `icon-512.svg` → PNG con `qlmanage -t -s 512` y tamaños con `sips -z`.

## 4. Versiones
`APP_VERSION` y `NOVEDADES` al principio de `app.js` (formato AAAA.NN, la más reciente arriba). Claves de localStorage: `dafo-datos`, `dafo-tema`, `dafo-bienvenida-vista`, `dafo-version-vista`, `dafo-facil-abierto` (y `dafo-intercambio` desde la entrega 2).

## 5. Copias de seguridad locales
```
Desktop/DAFO/
├── Aplicación/   ← la app (este repositorio git, lo que se publica)
├── Backup/       ← 5 copias más recientes, fuera del repositorio
└── Diseño/       ← DISEÑO_DAFO.md
```
`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/DAFO" --name DAFO --exclude "Curso*" --exclude "Documentos*" --exclude "*.docx" --exclude .claude` (copia `Aplicación/` y `Diseño/`). Hacer una antes de cada publicación.

## 6. Publicación
Sin publicar. Repositorio previsto `cjgaland/dafo` (GitHub Pages desde `main`). Publicar **solo cuando el autor lo pida**. Pasos por versión: copia de seguridad; entrada en `NOVEDADES` + `APP_VERSION`; mismos `?v=` en index.html; subir `CACHE_NAME` en sw.js; tests; commit en español terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## 7. Estado y pendiente (plan por entregas en el documento de diseño)
- **Diseño aprobado** (2026-10-22) con las mejoras A a M y los cinco bloques ACSA confirmados.
- **Entrega 1 (hecha, 2026-10-22, v2026.01)**: esqueleto e identidad (violeta, icono de la matriz 2 × 2); datos y copias `.json`; paso 1 (objeto, tipo, finalidad con su consejo, horizonte, alcance, misión y visión con textos propuestos); paso 2 (fuentes, con propuestas según la finalidad; el equipo y las sesiones llegan en la entrega 4); pasos 3 y 4 (factores con código fijo, área o ámbito, dato, fuente, quién lo aporta, importancia y probabilidad con botones 1–5, peso; preguntas guía; avisos de redacción; pegar desde Excel); matriz DAFO 2 × 2 en el paso 4 y en la vista imprimible/PDF; ejemplo de la UGC; Aprende (7 temas) y glosario; 88 tests.
- Siguiente: **entrega 2** (pasos 5 y 6: los N por cuadrante, decisión manual con motivo, matriz cruzada 0–3, orientación estratégica, factores llave; Excel; paquete `dafo-came` v1).

# CLAUDE.md — DAFO · CAME

> Documento común a todas las apps (lista, carpetas, identidad visual e intercambio de datos): `/Users/Trabajo/Desktop/Ecosistema Calidad/ECOSISTEMA.md`.

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios. Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño completo, las decisiones del autor y el plan por entregas están en `/Users/Trabajo/Desktop/DAFO/Diseño/DISEÑO_DAFO.md` (léelo también al empezar una sesión).

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) para hacer, **paso a paso y de forma didáctica**, el **análisis DAFO** (debilidades, amenazas, fortalezas y oportunidades) de un servicio, unidad o proyecto sanitario y, a partir de él, el **análisis CAME** (corregir, afrontar, mantener, explotar) y un **plan de acción con indicadores**. Metodología estándar (sin curso propio), adaptada a la gestión sanitaria: acuerdo de gestión de una UGC, acreditación ACSA, plan estratégico, proyecto nuevo. Herramienta docente y de apoyo; no sustituye el criterio profesional.

Es una **herramienta** del ecosistema (funciona sola). Publicará `localStorage["dafo-intercambio"]` (formato `dafo-came` v1, diseño sección 6) para que AMFE, Mapa de Riesgos y Auditorías traigan sus candidatos y acciones. Leerá `amfe-intercambio` (como evidencia) e `indicadores-datos` (indicadores de las acciones).

Autoría (idéntica en el pie de index.html, «Acerca de», `informePie()` en app.js y el README; orden alfabético, sin centro de trabajo): Carlos J. Galán Doval (Médico de Familia · Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente), Área de Gestión Sanitaria Sur de Córdoba · Andalucía.

## 2. Arquitectura
Base que se copiará de `Auditorías/Aplicación` y `AMFE/Aplicación` (mismos patrones): `index.html`, `styles.css` (acento **violeta**: claro `#6d28d9`, oscuro `#a78bfa`, texto sobre acento en oscuro `#1e0b3d`, impreso `#5b21b6`; variable `--cyan` heredada; cuadrantes F verde, D ámbar, O azul, A rojo), `logic.js` (funciones puras), `contenido.js` (Aprende, glosario, test, ejemplos), `xlsx.js`, `docx.js`, `app.js`, `sw.js`, `tests/logic.test.mjs` (`node tests/logic.test.mjs`).

Rutas previstas: `#/` · `#/dafo` · `#/dafo/nuevo` · `#/dafo/<id>/<1-8>` · `?informe=1&doc=informe|resumen|lamina|hoja` · `#/aprende[/<n>]` · `#/glosario` · `#/prueba` · `#/ejemplos`.

Claves de localStorage: `dafo-datos`, `dafo-intercambio`, `dafo-tema`, `dafo-bienvenida-vista`, `dafo-version-vista`, `dafo-facil-abierto`.

## 3. Copias de seguridad locales
```
Desktop/DAFO/
├── Aplicación/   ← la app (este repositorio git, lo que se publica)
├── Backup/       ← 5 copias más recientes, fuera del repositorio
└── Diseño/       ← DISEÑO_DAFO.md
```
`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/DAFO" --name DAFO --exclude "Curso*" --exclude "Documentos*" --exclude "*.docx" --exclude .claude` (copia `Aplicación/` y `Diseño/`). Hacer una antes de cada publicación.

## 4. Publicación
Sin publicar. Repositorio previsto `cjgaland/dafo` (GitHub Pages desde `main`). Publicar **solo cuando el autor lo pida**. Commits en español terminados en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## 5. Estado
- **Diseño aprobado** (2026-10-22) con las mejoras A a M y los cinco bloques ACSA confirmados.
- Siguiente: **entrega 1** (base y análisis: pasos 1, 3 y 4, fuentes, matriz DAFO 2 × 2, ejemplo de la UGC, Aprende, glosario, tests).

// ============================================================
//  app.js — UI y estado · DAFO · CAME
//  Las reglas viven en logic.js (funciones puras) y los textos didácticos y
//  ejemplos en contenido.js. Aquí: datos en localStorage, enrutado por hash,
//  inicio, lista de DAFO, asistente por pasos, ejemplos, Aprende, glosario,
//  vista imprimible y PDF en iOS, copias de seguridad.
//  Base copiada de AMFE y Auditorías (mismos patrones: data-k, refrescar sin
//  perder el foco, repintar conservando el scroll, borradores, ejemplos en memoria).
// ============================================================
(function () {
  "use strict";
  const L = window.Logica, C = window.Contenido;

  // ---------- Versión y novedades ----------
  // Al publicar cambios: añadir una entrada AL PRINCIPIO de NOVEDADES, poner su versión en los ?v= de index.html, en
  // APP_VERSION y subir CACHE_NAME en sw.js. Formato de versión: AAAA.NN.
  const APP_VERSION = "2026.09";
  const NOVEDADES = [
    { version: "2026.09", fecha: "Octubre 2026", titulo: "Herramientas de apoyo y portal de las apps", cambios: [
      "En «Acerca de», nuevo grupo «Herramientas de apoyo»: el Anonimizador RGPD (seudonimiza o anonimiza una hoja de cálculo sin que los datos salgan de tu navegador) y el Normalizador Bibliográfico (pon tus referencias en Vancouver, APA y otros estilos).",
      "Y un enlace al portal cjgaland.github.io, la página que reúne todas las apps y explica cómo encajan."] },
    { version: "2026.08", fecha: "Octubre 2026", titulo: "Nueva app hermana: Rondas de Seguridad", cambios: [
      "Enlace a la nueva app hermana Rondas de Seguridad en la portada y en «Acerca de»: programa y haz las rondas de seguridad de una unidad y descubre lo que falla una y otra vez."] },
    { version: "2026.07", fecha: "Octubre 2026", titulo: "Nueva app hermana: Mapa de Riesgos", cambios: [
      "Enlace a la nueva app hermana Mapa de Riesgos en la portada y en «Acerca de». «Llevar a… Mapa de Riesgos» abre ahora esa app (antes abría Auditorías), y su botón «Traer de DAFO» recoge los factores que marques para un mapa de riesgos."] },
    { version: "2026.06", fecha: "Octubre 2026", titulo: "Nueva app hermana: Flujograma", cambios: [
      "Enlace a la nueva app hermana Flujograma (escribe los pasos de un proceso y la app dibuja el diagrama, con sus puntos críticos) en la portada y en «Acerca de». La portada enlaza también a Tamaño Muestral."] },
    { version: "2026.05", fecha: "Octubre 2026", titulo: "Ponte a prueba, minicasos y «Traer de AMFE»", cambios: [
      "«Ponte a prueba»: 20 preguntas en cuatro bloques, con su explicación y un enlace al tema de «Aprende» que conviene repasar.",
      "Tres ejercicios prácticos: ¿fortaleza, debilidad, oportunidad o amenaza?, ¿sirve como factor? y ¿qué estrategia CAME sale de este cruce?",
      "Seis minicasos para practicar un paso concreto: Urgencias, Farmacia, un proyecto nuevo, la Unidad de Calidad, el bloque quirúrgico y un hospital de día.",
      "«Traer de AMFE» en el paso 3: los AMFE de la app AMFE (de este navegador o de su copia) se proponen como debilidad o fortaleza, con su dato y su fuente.",
      "Todas las entregas del diseño, terminadas."] },
    { version: "2026.04", fecha: "Octubre 2026", titulo: "Trabajo en equipo", cambios: [
      "Paso 2: el equipo (perfil, cargo y papel) y las sesiones de trabajo, con asistentes y resultados, y avisos si el equipo es de un solo estamento o solo de dirección.",
      "Lluvia de ideas cuadrante a cuadrante, con preguntas guía, agrupación en bloques, aviso de ideas parecidas y técnica de grupo nominal (3, 2 y 1 puntos). Ideas y bloques pasan a factores con un toque.",
      "Votación de la importancia y la probabilidad por cada miembro del equipo, con la media propuesta y aviso cuando los votos están muy separados.",
      "Modo reunión: letra grande y pantalla limpia para proyectar en las sesiones.",
      "Hoja de trabajo en Word y PDF para las reuniones en papel: lluvia de ideas, votación y matriz cruzada.",
      "Ediciones anuales: crea la edición del año siguiente y compárala con la anterior (factores que se mantienen, aparecen o desaparecen, y cómo acabaron las estrategias).",
      "Vista por bloques ACSA del análisis interno, para preparar la acreditación.",
      "El ejemplo de la UGC trae su equipo, sus sesiones, su lluvia de ideas, la votación y la edición anterior de 2026."] },
    { version: "2026.03", fecha: "Octubre 2026", titulo: "Estrategias CAME, plan de acción y documentos", cambios: [
      "Paso 7 · Estrategias CAME: la app las propone a partir de los cruces fuertes (o de los factores prioritarios), y cada una se puntúa en impacto y viabilidad. Se eligen las de «Hazla ya» y «Planifícala», con la posibilidad de cambiarlo a mano con motivo.",
      "Avisos de coherencia: la debilidad o la amenaza que más pesa sin respuesta, todas las estrategias del mismo tipo, estrategias que no se apoyan en ningún factor, demasiadas elegidas…",
      "Factores que merecen un análisis propio: márcalos como candidatos a AMFE, Mapa de Riesgos o auditoría, y llévalos a esa app.",
      "Paso 8 · Plan de acción: objetivo con cifra y fecha, acciones con responsable, plazo, recursos e indicador (con «Traer de Indicadores»), fuerza de la medida, estado y seguimiento del indicador con aviso de si cumple el estándar.",
      "Conclusiones propuestas con las cifras del análisis, control del documento, próxima revisión y nota de calidad del análisis.",
      "Informe DAFO · CAME y resumen para la Dirección en Word y PDF, y lámina DAFO para imprimir en apaisado.",
      "El ejemplo de la UGC trae sus 9 estrategias (6 elegidas), su plan de acción y dos candidatos: un AMFE y una auditoría."] },
    { version: "2026.02", fecha: "Octubre 2026", titulo: "Priorizar y cruzar los factores", cambios: [
      "Paso 5 · Quedarse con lo importante: los factores de más peso de cada cuadrante (5 por defecto, de 3 a 10), con aviso de empates en el corte. Se puede añadir o quitar cualquiera a mano, escribiendo el motivo.",
      "La matriz DAFO destaca los factores prioritarios.",
      "Paso 6 · Cruzar los factores: matriz cruzada de 0 a 3 entre fortalezas y debilidades y oportunidades y amenazas, en tabla o pregunta a pregunta (mejor en el móvil).",
      "Orientación estratégica (ofensiva, defensiva, de reorientación o de supervivencia), factores llave y cruces fuertes con una idea de estrategia de partida.",
      "Excel con los factores, la matriz DAFO, la matriz cruzada, las fuentes y la ficha del análisis.",
      "El ejemplo de la UGC trae ya su priorización y su matriz cruzada completa.",
      "Preparado el intercambio con las otras apps del ecosistema (AMFE, Mapa de Riesgos, Auditorías)."] },
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión: mirar hacia dentro y hacia fuera", cambios: [
      "Asistente en 8 pasos con «Tu siguiente paso» en la portada. En esta versión están disponibles los pasos 1 a 4.",
      "Qué se analiza y para qué: objeto, finalidad (acuerdo de gestión, acreditación, plan estratégico, proyecto…), horizonte, alcance, misión y visión, con textos propuestos.",
      "Las fuentes de información del análisis, con propuestas según la finalidad.",
      "Fortalezas y debilidades, oportunidades y amenazas, con preguntas guía por área y por ámbito del entorno (PESTEL adaptado a sanidad), el dato que respalda cada factor, su importancia y, en lo externo, su probabilidad y su peso.",
      "Avisos de las trampas más habituales: algo externo escrito como interno (o al revés), una solución escrita como factor, factores vagos, repetidos o sin datos.",
      "Pegar los factores desde Excel, Calc o Word.",
      "Matriz DAFO imprimible y en PDF, ejemplo completo de una UGC de Atención Primaria, Aprende (7 temas), glosario y copia de seguridad."] }
  ];
  const ENTREGA = 5;   // pasos ya construidos (ver L.PASOS[].entrega)

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const escMl = s => esc(s).replace(/\n/g, "<br>");
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = $("#view");
  const hoy = () => new Date().toISOString();
  const fechaCorta = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("es-ES"); };
  const fmtFecha = s => /^\d{4}-\d{2}-\d{2}$/.test(s || "") ? s.split("-").reverse().join("/") : (s || "");
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const lleno = L.lleno, plural = L.plural, nombreDafo = L.nombreDafo, Q = L.CUADRANTES;
  const clon = o => JSON.parse(JSON.stringify(o));
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

  // ---------- Datos (solo en este dispositivo) ----------
  const KEY_DATOS = "dafo-datos", KEY_INTERCAMBIO = "dafo-intercambio";
  let datos = { dafos: [], ultimaCopia: null };
  (function cargar() {
    const crudo = leer(KEY_DATOS); if (!crudo) return;
    try {
      const o = JSON.parse(crudo), s = L.sanearDatos(o, genId, hoy());
      if (s) datos = { dafos: s.dafos, ultimaCopia: typeof o.ultimaCopia === "string" ? o.ultimaCopia : null };
    } catch (e) { /* datos dañados: se empieza de cero sin borrar lo guardado */ }
  })();
  // Los datos del usuario son los únicos que se guardan. Los ejemplos viven aparte, en memoria
  // (ids «ej-…»): se pueden tocar, pero ni se guardan ni se mezclan con los suyos.
  const datosUsuario = datos;
  let datosEjemplo = null, modoEjemplo = false;
  const esIdEjemplo = id => /^ej-/.test(id || "");
  function ejemplos() {
    if (!datosEjemplo) datosEjemplo = { dafos: C.EJEMPLOS.dafos.map(d => L.sanearDafo(clon(d), genId, hoy())), ultimaCopia: null };
    return datosEjemplo;
  }
  let tGuardar = null, avisoSinEspacio = false;
  function guardar(inmediato) {
    clearTimeout(tGuardar);
    const fn = () => {
      const ok = escribir(KEY_DATOS, JSON.stringify({ app: "dafo", v: L.VERSION_DATOS, ultimaCopia: datosUsuario.ultimaCopia, dafos: datosUsuario.dafos }));
      // Paquete con forma fija para las otras apps (nunca lleva los ejemplos)
      if (ok) { try { escribir(KEY_INTERCAMBIO, JSON.stringify(L.paqueteIntercambio(datosUsuario.dafos, APP_VERSION, hoy()))); } catch (e) { /* */ } }
      if (!ok && !avisoSinEspacio) { avisoSinEspacio = true; toast("No se ha podido guardar en este navegador (¿modo privado o sin espacio?). Haz una copia de seguridad.", 6000); }
    };
    if (inmediato) fn(); else tGuardar = setTimeout(fn, 250);
  }
  window.addEventListener("pagehide", () => guardar(true));
  const buscaDafo = id => datos.dafos.find(x => x.id === id);
  // Un DAFO recién creado no se guarda hasta que se escribe algo
  const borradores = new Map();
  const esVacio = d => !d.factores.length && !d.fuentes.length && !d.estrategias.length && !d.equipo.length && !d.sesiones.length && !d.ideas.length && !["titulo", "objeto", "tipoObjeto", "finalidad", "horizonte", "mision", "vision", "incluye", "excluye", "responsable", "fecha", "conclusiones"].some(k => lleno(d[k]));

  // ---------- Textos de ayuda reutilizables ----------
  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span>${html}</div>`;
  const idea = html => box("idea", "Idea clave", `<p>${html}</p>`);
  const trampa = html => box("trampa", "Ojo, trampa", `<p>${html}</p>`);
  const practica = html => box("practica", "En la práctica", `<p>${html}</p>`);
  const KEY_FACIL = "dafo-facil-abierto";
  const facil = (html, titulo = "Explicado fácil") => `<details class="facil" data-recordar="1"${leer(KEY_FACIL) === "1" ? " open" : ""}><summary>${titulo}</summary><div class="facil-body">${html}</div></details>`;
  const avisoHtml = a => a.nivel === "nota" ? `<div class="note">ℹ ${esc(a.texto)}</div>` : a.nivel === "error" ? `<div class="aviso-error">✕ ${esc(a.texto)}</div>` : `<div class="warn">⚠ ${esc(a.texto)}</div>`;

  // ---------- Campos ----------
  // Por defecto se enlazan con data-k (ruta dentro del DAFO en edición). Con o.bind se enlazan de otra forma
  // (fuentes: data-u; factores: data-fx; siempre con data-f = campo).
  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function setPath(o, path, v) {
    const ks = path.split("."), ult = ks.pop();
    let a = o; ks.forEach(k => { if (a[k] == null || typeof a[k] !== "object") a[k] = {}; a = a[k]; });
    a[ult] = v;
  }
  let nAyuda = 0;
  function ayudaBtn(help) {
    if (!help) return { btn: "", box: "" };
    const id = "h" + (++nAyuda);
    return { btn: `<button type="button" class="info-btn" data-info="${id}" aria-expanded="false" aria-label="Ayuda">i</button>`, box: `<p class="help" id="help-${id}" hidden>${help}</p>` };
  }
  function campo(obj, path, label, o = {}) {
    const v = getPath(obj, path) || "", a = ayudaBtn(o.help);
    const bind = o.bind || `data-k="${path}"`;
    const ctrl = o.area
      ? `<textarea class="txt-in" ${bind} rows="${o.rows || 2}" placeholder="${esc(o.ph || "")}"${o.aria ? ` aria-label="${esc(o.aria)}"` : ""}>${esc(v)}</textarea>`
      : `<div class="input-wrap"><input class="txt-in" ${bind} value="${esc(v)}" placeholder="${esc(o.ph || "")}"${o.tipo ? ` type="${o.tipo}"` : ""} autocomplete="off" /></div>`;
    return `<div class="field${o.destacado ? " field--destacado" : ""}">${label ? `<div class="field-head"><label class="field-label">${label}</label>${o.opt ? '<span class="field-opt">(opcional)</span>' : ""}${a.btn}</div>` : ""}${a.box}${o.sub ? `<p class="field-sub">${o.sub}</p>` : ""}${ctrl}${o.extra || ""}</div>`;
  }
  function selector(label, bind, valor, opciones, o = {}) {
    const a = ayudaBtn(o.help);
    return `<div class="field"><div class="field-head"><label class="field-label">${label}</label>${o.opt ? '<span class="field-opt">(opcional)</span>' : ""}${a.btn}</div>${a.box}<div class="input-wrap"><select class="txt-in" ${bind}>${opciones.map(([v, t]) => `<option value="${esc(v)}"${v === valor ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></div>${o.extra || ""}</div>`;
  }
  const proponer = (act, txt = "✎ Proponer") => `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="${act}">${txt}</button></div>`;

  // ---------- Pasos (en toda la ficha de un DAFO) ----------
  const disponible = p => p.entrega <= ENTREGA;
  const pasosDisp = () => L.PASOS.filter(disponible);
  function pasosHtml(d, actual) {
    return `<ol class="wiz-steps wiz-steps--8 no-print" aria-label="Pasos del DAFO" data-zona="pasos">${pasosInner(d, actual)}</ol>`;
  }
  function pasosInner(d, actual, g = L.progreso(d)) {
    return L.PASOS.map(p => `<li><a href="#/dafo/${d.id}/${p.n}" class="wiz-step${p.n === actual ? " actual" : g[p.n] ? " hecho" : ""}${disponible(p) ? "" : " prox"}"${p.n === actual ? ' aria-current="step"' : ""} title="${esc(p.titulo + (disponible(p) ? "" : " (próximamente)"))}"><span class="wiz-num">${g[p.n] && p.n !== actual ? "✓" : p.n}</span><span class="wiz-lbl">${p.corto}</span></a></li>`).join("");
  }

  // ---------- Informe (cabecera y pie, solo al imprimir / Ver matriz) ----------
  function informeBar() {
    return `<div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></div>`;
  }
  function informeCab(titulo, sub) {
    return `<header class="print-head print-only"><h1>${esc(titulo)}</h1><p>${esc(sub ? sub + " · " : "")}DAFO · CAME · Calidad y seguridad del paciente · ${new Date().toLocaleDateString("es-ES")}</p></header>`;
  }
  function informePie() {
    return `<footer class="print-foot print-only">
      <span class="autor-titulo">Aplicación desarrollada por</span>
      <span class="autor"><b>Carlos J. Galán Doval</b> · Médico de Familia · Técnico en Calidad y Seguridad del Paciente</span>
      <span class="autor"><b>Rafael J. Romero de Castilla Gil</b> · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente</span>
      <span class="autor-area">Área de Gestión Sanitaria Sur de Córdoba · Andalucía</span>
      <span class="autor-uso">De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</span>
      <span class="footer-version">DAFO · CAME · versión ${APP_VERSION}</span>
    </footer>`;
  }

  // ---------- Pequeñas piezas comunes ----------
  const volver = (href, txt) => `<a class="volver-cuadro" href="${href}">← ${txt}</a>`;
  const codBadge = f => `<span class="fx-cod q-${f.tipo}">${L.codigo(f)}</span>`;
  function pesoBadge(f) {
    const p = L.peso(f);
    if (!p) return `<span class="peso-b peso-b--sin">${L.esInterno(f.tipo) ? "Sin importancia" : "Sin peso"}</span>`;
    const nivel = p / L.PESO_MAX(f.tipo) >= 0.6 ? "alto" : p / L.PESO_MAX(f.tipo) >= 0.3 ? "medio" : "bajo";
    return `<span class="peso-b peso-b--${nivel}" title="${L.esInterno(f.tipo) ? "Importancia" : "Importancia × probabilidad"}">${L.esInterno(f.tipo) ? "Imp." : "Peso"} ${p}</span>`;
  }

  // ---------- Inicio ----------
  function renderHome() {
    const d = datosUsuario, sig = L.siguientePaso(d, ENTREGA), n = d.dafos.length;
    const nf = d.dafos.reduce((s, x) => s + x.factores.filter(f => lleno(f.texto)).length, 0);
    const ne = d.dafos.reduce((s, x) => s + x.factores.filter(f => lleno(f.texto) && (lleno(f.evidencia) || lleno(f.fuenteId))).length, 0);
    const diasCopia = d.ultimaCopia ? Math.floor((Date.now() - new Date(d.ultimaCopia)) / 864e5) : null;
    const avisoCopia = n && (diasCopia === null || diasCopia > 30)
      ? `<div class="warn">⚠ ${diasCopia === null ? "Aún no has hecho ninguna copia de seguridad." : `Tu última copia de seguridad es de hace ${diasCopia} días.`} Tus datos solo están en este dispositivo: guarda una copia.</div>` : "";
    const ult = d.dafos.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)))[0];
    const revisar = d.dafos.filter(x => L.revisionProxima(x, hoyIso()) && !d.dafos.some(y => y.anteriorId === x.id));
    view.innerHTML = `
      <section class="hero">
        <h1 class="hero-t"><span>DAFO · CAME</span></h1>
        <p class="hero-p">Haz el <b>análisis DAFO</b> de tu servicio, tu unidad o tu proyecto y conviértelo en <b>estrategias CAME</b> y en un <b>plan de acción</b>, paso a paso y aprendiendo mientras lo haces.</p>
        <div class="hero-btns">
          <a class="btn btn--primary btn--grande" href="#/dafo/nuevo">+ Nuevo DAFO</a>
          <a class="btn btn--grande" href="#/dafo">Mis DAFO${n ? ` <span class="contador">${n}</span>` : ""}</a>
        </div>
      </section>
      ${revisar.map(x => { const r = L.revisionProxima(x, hoyIso()); return `<div class="warn">⚠ ${r.vencida ? "Ya toca" : `En ${plural(r.dias, "día", "días")} toca`} revisar «${esc(L.corto(nombreDafo(x) || "DAFO sin nombre", 60))}». <a href="#/dafo/${x.id}/8">Crear la edición nueva</a></div>`; }).join("")}
      <div class="siguiente">
        <span class="siguiente-tag">Tu siguiente paso</span>
        <p>${esc(sig.texto)}</p>
        <a class="btn btn--primary" href="${sig.href}">${esc(sig.btn)} →</a>
      </div>
      <h2 class="sec-t">El camino, en 8 pasos</h2>
      <p class="page-lead">De la foto de la unidad al plan de acción. Cada paso tiene su explicación y sus avisos.</p>
      <ol class="fases">
        ${L.PASOS.map(p => `<li><a class="fase fase--acc${disponible(p) ? "" : " prox"}" href="${ult ? `#/dafo/${ult.id}/${p.n}` : "#/dafo/nuevo"}">
          <span class="fase-cab"><span class="pdca-num">${p.n}</span><b>${p.titulo}</b></span>
          <span class="fase-que">${p.que}</span>
          ${disponible(p) ? "" : `<span class="fase-prox">Próximamente · mientras, repásalo en «Aprende»</span>`}
        </a></li>`).join("")}
      </ol>
      <h2 class="sec-t">Tus datos</h2>
      <div class="card datos-card">
        <div class="datos-cifras">
          <a href="#/dafo"><b>${n}</b><span>DAFO</span></a>
          <a href="#/dafo"><b>${nf}</b><span>${nf === 1 ? "factor" : "factores"}</span></a>
          <a href="#/dafo"><b>${ne}</b><span>con su dato</span></a>
        </div>
        ${avisoCopia}
        <p class="field-sub">Se guardan <b>solo en este dispositivo</b>. Para trabajar en equipo, pasa tu copia a los demás: al importarla se junta con lo suyo sin duplicar.${d.ultimaCopia ? ` Última copia: ${fechaCorta(d.ultimaCopia)}.` : ""}</p>
        <div class="toolbar"><button class="btn" data-act="copia">⬇ Copia de seguridad</button><button class="btn" data-act="importar">⬆ Importar copia</button></div>
      </div>
      <div class="guide">
        <a class="guide-card" href="#/ejemplos"><span class="guide-num">Ej</span><div><div class="guide-q">Ejemplo</div><div class="guide-a">El DAFO de una <b>UGC de Atención Primaria</b> que prepara su acuerdo de gestión: 24 factores, cada uno con su dato.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/aprende"><span class="guide-num">?</span><div><div class="guide-q">Aprende</div><div class="guide-a">${C.TEMAS.length} temas <b>explicados fácil</b>: del qué es un DAFO al plan de acción.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/prueba"><span class="guide-num">✎</span><div><div class="guide-q">Ponte a prueba</div><div class="guide-a">${C.TEST.length} preguntas y <b>tres ejercicios</b>: ¿interno o externo?, ¿sirve como factor?, ¿qué estrategia sale?</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/glosario"><span class="guide-num">A–Z</span><div><div class="guide-q">Glosario</div><div class="guide-a">${C.GLOSARIO.length} términos <b>en lenguaje llano</b>, con buscador.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AMFE}" target="_blank" rel="noopener"><span class="guide-num">!</span><div><div class="guide-q">AMFE ↗</div><div class="guide-a">App hermana: si una debilidad es un <b>proceso con riesgo</b> para el paciente, analiza qué puede fallar en él.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AUD}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Auditorías ↗</div><div class="guide-a">App hermana: <b>mide con una auditoría</b> si una práctica se cumple (higiene de manos, registros…).</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_IND}" target="_blank" rel="noopener"><span class="guide-num">%</span><div><div class="guide-q">Indicadores ↗</div><div class="guide-a">App hermana: <b>diseña los indicadores</b> con los que medirás tu plan de acción.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_FLUJO}" target="_blank" rel="noopener"><span class="guide-num">→</span><div><div class="guide-q">Flujograma ↗</div><div class="guide-a">App hermana: <b>dibuja el flujograma</b> del proceso que quieres mejorar, con sus puntos críticos.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_TM}" target="_blank" rel="noopener"><span class="guide-num">n</span><div><div class="guide-q">Tamaño Muestral ↗</div><div class="guide-a">App hermana: <b>cuántos casos revisar</b> para medir tus indicadores.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_MAPA}" target="_blank" rel="noopener"><span class="guide-num">◆</span><div><div class="guide-q">Mapa de Riesgos ↗</div><div class="guide-a">App hermana: <b>elabora el mapa de riesgos</b> de un proceso; con su «Traer de DAFO» recoge los factores que marques para un mapa de riesgos.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_RONDAS}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Rondas de Seguridad ↗</div><div class="guide-a">App hermana: <b>rondas de seguridad</b> en una unidad: lo que se ve a pie de cama y lo que falla una y otra vez.</div></div><span class="guide-go">›</span></a>
      </div>
      ${practica("<b>Protección de datos:</b> un DAFO analiza una unidad, no a personas. No escribas nombres de pacientes ni de profesionales, ni números de historia clínica.")}`;
  }

  // ---------- Lista de DAFO ----------
  function renderLista() {
    const lista = datos.dafos.slice().sort((a, b) => String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <h1 class="page-title">Mis DAFO</h1>
      <p class="page-lead">Cada DAFO analiza un servicio, una unidad o un proyecto, para una finalidad concreta.</p>
      ${facil(`<p>El <b>DAFO</b> ordena lo que pesa en una unidad en cuatro casillas: <b>fortalezas</b> y <b>debilidades</b> (de dentro: dependen de vosotros) y <b>oportunidades</b> y <b>amenazas</b> (de fuera: vienen del entorno).</p>
        <p>De ahí sale el <b>CAME</b>: corregir las debilidades, afrontar las amenazas, mantener las fortalezas y explotar las oportunidades. Y de las estrategias, un plan de acción con indicadores.</p>`)}
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/dafo/nuevo">+ Nuevo DAFO</a><a class="btn" href="#/dafo/ej-dafo-ugc/1">Ver el ejemplo de la UGC</a></div>
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjeta).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ningún DAFO.</b></p><p>Crea uno nuevo, o abre antes el ejemplo de la UGC para ver cómo queda.</p></div>`}`;
  }
  function tarjeta(d) {
    const r = L.resumen(d), g = L.progreso(d), disp = pasosDisp(), hechos = disp.filter(p => g[p.n]).length;
    const fin = L.FINALIDADES[d.finalidad];
    return `<div class="item-card">
      <a class="item-main" href="#/dafo/${d.id}">
        <b class="item-t">${lleno(nombreDafo(d)) ? esc(nombreDafo(d)) : '<span class="vacio">DAFO sin nombre</span>'}</b>
        <span class="item-s">${esc([d.titulo && d.objeto !== d.titulo ? d.objeto : "", fin ? fin.nom : ""].filter(lleno).join(" · ")) || "&nbsp;"}</span>
        <span class="badges">${L.TIPOS.map(t => `<span class="badge q-b q-${t}">${t} ${r[t]}</span>`).join("")}<span class="badge badge--prog">Pasos ${hechos}/${disp.length}</span></span>
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(d.modificado)}</span><span><button class="link-btn" data-act="dafo-dup" data-id="${d.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="dafo-del" data-id="${d.id}">Borrar</button></span></div>
    </div>`;
  }

  // ---------- Ficha de un DAFO: armazón común de los pasos ----------
  let actual = null, pasoActual = 1;
  const abiertos = new Set();          // factores con «más datos» desplegado
  let pegarAbierto = false;
  const avisosGenerales = (d, n) => L.avisosDe(d, n).filter(x => !x.factor && !x.estrategia).map(avisoHtml).join("");
  const avisosFactor = (d, n, id) => L.avisosDe(d, n).filter(x => x.factor === id).map(avisoHtml).join("");

  function renderDafo(d, n) {
    actual = d; pasoActual = n; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) { if (DOCS[docActual]) renderDoc(d, docActual); else renderInforme(d); return; }
    if (HERRAMIENTAS[n]) { renderHerramienta(d, n); return; }
    const p = L.PASOS[n - 1], disp = pasosDisp();
    const prev = disp.filter(x => x.n < n).pop(), next = disp.find(x => x.n > n);
    const cuerpo = !disponible(p) ? pasoProximo(d, p) : RENDER[n](d);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/dafo", modoEjemplo ? "Ejemplos" : "Mis DAFO")}${pasosHtml(d, n)}</div>
      <div class="wiz-titulo"><span class="wiz-paso">Paso ${n} de 8${lleno(nombreDafo(d)) ? " · " + esc(L.corto(nombreDafo(d), 60)) : ""}</span><h1 class="page-title">${p.titulo}</h1></div>
      ${cuerpo}
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/dafo/${d.id}/${prev.n}">← ${prev.corto}</a>` : `<span></span>`}${next ? `<a class="btn btn--primary" href="#/dafo/${d.id}/${next.n}">${next.corto} →</a>` : `<span></span>`}</div>`;
  }
  function pasoProximo(d, p) {
    const tema = { 5: 5, 6: 6, 7: 6, 8: 7 }[p.n];
    return `<p class="page-lead">${p.que}</p>
      <div class="placeholder-box"><p><b>Este paso llegará en una próxima versión.</b></p>
      <p>Mientras, en el paso 6 tienes la orientación estratégica y los cruces fuertes, con una idea de estrategia de partida para cada uno.</p>
      <div class="toolbar" style="justify-content:center"><a class="btn" href="#/aprende/${tema}">Repasarlo en «Aprende»</a><a class="btn btn--primary" href="#/dafo/${d.id}/6">Ir al paso 6 →</a></div></div>`;
  }

  // ---------- Paso 1 · Qué analizamos y para qué ----------
  function consejoHtml(d) {
    const f = L.FINALIDADES[d.finalidad];
    return f ? practica(`<b>${esc(f.nom)}:</b> ${esc(f.consejo)}`) : "";
  }
  function paso1(d) {
    return `
      ${idea("Antes de escribir fortalezas y debilidades, decidid <b>qué</b> analizáis y <b>para qué</b>. La finalidad cambia los datos que hacen falta y las preguntas que conviene haceros.")}
      ${facil(`<p>El <b>objeto</b> es lo que se analiza: una UGC, un servicio, un centro, un proceso o un proyecto. Mejor acotado: un DAFO de «todo el Área» sale tan general que no ayuda a decidir.</p>
        <p>La <b>finalidad</b> dice para qué: el acuerdo de gestión, la acreditación, un plan estratégico, un proyecto nuevo… Y el <b>horizonte</b>, el tiempo que cubre: las oportunidades y amenazas se valoran para ese plazo.</p>
        <p>La <b>visión</b> («a dónde queremos llegar») es opcional, pero ayuda: algo es una fortaleza o una debilidad respecto a esa meta.</p>
        ${trampa("Un DAFO «porque toca» se queda en una lista. Si no sabéis para qué es, no sabréis qué decidir con él.")}`)}
      <div class="card">
        <h2 class="sub-h">Qué analizamos</h2>
        ${campo(d, "objeto", "Servicio, unidad o proyecto", { ph: "p. ej. UGC de Atención Primaria", help: "El nombre con el que lo conoce todo el mundo. Puede ser una UGC, un servicio, un centro, un proceso o un proyecto nuevo." })}
        <div class="dos-col">
          ${selector("Tipo", 'data-k="tipoObjeto"', d.tipoObjeto, [["", "— Elige —"], ...Object.entries(L.TIPOS_OBJETO)], { opt: true })}
          ${campo(d, "titulo", "Nombre corto de este DAFO", { opt: true, ph: "p. ej. DAFO UGC 2027", help: "Para reconocerlo en tu lista. Si lo dejas vacío, se usa el nombre del objeto.", extra: proponer("sug-titulo") })}
        </div>
        <div class="dos-col">
          ${campo(d, "incluye", "Qué queda dentro", { area: true, opt: true, ph: "p. ej. El centro de salud y sus dos consultorios" })}
          ${campo(d, "excluye", "Qué queda fuera", { area: true, opt: true, ph: "p. ej. El dispositivo de urgencias" })}
        </div>
      </div>
      <div class="card">
        <h2 class="sub-h">Para qué</h2>
        ${selector("Finalidad del análisis", 'data-k="finalidad"', d.finalidad, [["", "— Elige la finalidad —"], ...Object.entries(L.FINALIDADES).map(([k, v]) => [k, v.nom])], { help: "Cambia los consejos de la app, las fuentes que te propone y el horizonte temporal.", extra: `<div data-zona="consejo">${consejoHtml(d)}</div>` })}
        ${campo(d, "horizonte", "Horizonte temporal", { ph: "p. ej. 1 año (el del acuerdo de gestión)", help: "Cuánto tiempo cubre el análisis. Las oportunidades y amenazas se valoran para ese plazo.", extra: proponer("sug-horizonte") })}
        ${campo(d, "mision", "Misión: para qué existe la unidad", { area: true, opt: true, ph: "p. ej. Prestar a la población de la zona una atención primaria segura, accesible y de calidad", extra: proponer("sug-mision") })}
        ${campo(d, "vision", "Visión: a dónde queréis llegar", { area: true, opt: true, ph: "p. ej. Ser una UGC acreditada, con cita en 48 horas", help: "Una meta para el horizonte del análisis. Una fortaleza o una debilidad lo son respecto a ella.", extra: proponer("sug-vision") })}
        <div class="dos-col">
          ${campo(d, "responsable", "Responsable del análisis", { opt: true, ph: "p. ej. Dirección de la UGC" })}
          ${campo(d, "fecha", "Fecha o periodo", { opt: true, ph: "p. ej. Noviembre de 2026" })}
        </div>
      </div>
      <div data-zona="avisos">${avisosGenerales(d, 1)}</div>`;
  }

  // ---------- Paso 2 · Fuentes de información ----------
  const bu = (x, f) => `data-u="${x.id}" data-f="${f}"`;
  const usosFuente = (d, x) => d.factores.filter(f => f.fuenteId === x.id).length;
  function fuenteCard(d, x, i) {
    const n = usosFuente(d, x);
    return `<div class="sub-card sub-card--eq">
      <div class="sub-cab"><span class="eq-n">${i + 1}</span><b>${lleno(L.nombreFuente(x)) ? esc(L.nombreFuente(x)) : '<span class="vacio">Fuente sin nombre</span>'}</b>${n ? `<span class="badge">${plural(n, "factor la cita", "factores la citan")}</span>` : ""}
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="fu-del" data-id="${x.id}">Quitar</button></span></div>
      <div class="dos-col">
        ${selector("Tipo de fuente", bu(x, "tipo"), x.tipo, [["", "— Elige —"], ...Object.entries(L.FUENTES_TIPO).map(([k, v]) => [k, v.nom])])}
        ${campo(x, "fecha", "Fecha o periodo", { bind: bu(x, "fecha"), opt: true, ph: "p. ej. 2026" })}
      </div>
      ${campo(x, "nombre", "Nombre", { bind: bu(x, "nombre"), ph: L.FUENTES_TIPO[x.tipo] && L.FUENTES_TIPO[x.tipo].ej ? "p. ej. " + L.FUENTES_TIPO[x.tipo].ej : "p. ej. Encuesta de satisfacción de usuarios 2026" })}
      ${campo(x, "nota", "Qué dice, en resumen", { bind: bu(x, "nota"), area: true, opt: true, ph: "p. ej. 91 % satisfechos; quejas por la demora" })}
    </div>`;
  }
  function paso2(d) {
    const fin = L.FINALIDADES[d.finalidad], sug = fin ? fin.fuentes : [];
    const tipos = [...sug, ...Object.keys(L.FUENTES_TIPO).filter(k => !sug.includes(k))].filter(k => k !== "otros");
    return `
      ${idea("<b>Datos antes que opiniones.</b> Cada factor del DAFO debería poder responder a «¿cómo lo sabéis?». Apuntad aquí las fuentes y, en los pasos 3 y 4, cada factor podrá citar la suya.")}
      ${facil(`<p>Sirven los resultados del <b>acuerdo de gestión</b> anterior, el <b>informe de acreditación</b>, los <b>indicadores</b>, la <b>encuesta de satisfacción</b> y las <b>reclamaciones</b> (la voz de los pacientes), la <b>encuesta de cultura de seguridad</b> y las <b>notificaciones de incidentes</b>, las <b>auditorías</b> y los <b>AMFE</b> hechos, la <b>memoria</b> de actividad y los <b>planes</b> del sistema sanitario.</p>
        ${practica("Si no hay datos de algo importante, apuntadlo igual como factor y anotad «sin datos»: ya es un hallazgo (y puede ser una debilidad de vuestro sistema de información).")}`)}
      <h2 class="sec-t">Fuentes de información <span class="contador" data-zona="nfu">${d.fuentes.length}</span></h2>
      <div class="card no-print"><p class="field-sub">Añade con un toque las fuentes habituales${fin ? ` (primero, las que suelen servir para «${esc(fin.nom)}»)` : ""} y después ajústalas:</p>
        <div class="quick">${tipos.map(k => `<button type="button" class="chip${d.fuentes.some(x => x.tipo === k) ? " active" : sug.includes(k) ? " chip--accent" : ""}" data-act="fu-sug" data-t="${k}">+ ${esc(L.FUENTES_TIPO[k].nom)}</button>`).join("")}</div></div>
      <div class="sub-lista">${d.fuentes.map((x, i) => fuenteCard(d, x, i)).join("")}</div>
      <div class="toolbar no-print"><button class="btn${d.fuentes.length ? "" : " btn--primary"}" data-act="fu-add">+ Añadir otra fuente</button></div>
      <div data-zona="avisos">${avisosGenerales(d, 2)}</div>
      ${equipoHtml(d)}`;
  }

  // ---------- Pasos 3 y 4 · Los cuatro cuadrantes ----------
  const bx = (f, k) => `data-fx="${f.id}" data-f="${k}"`;
  function segPunt(f, k) {
    const v = L.entero1a5(f[k]), esc5 = k === "importancia" ? L.ESC_IMP : L.ESC_PROB;
    return `<div class="seg seg--5" role="group" aria-label="${k === "importancia" ? "Importancia" : "Probabilidad"} de ${L.codigo(f)}">${[1, 2, 3, 4, 5].map(i => `<button type="button" class="${v === i ? "active" : ""}" data-act="fx-punt" data-id="${f.id}" data-f="${k}" data-v="${i}" title="${esc(esc5[i - 1])}" aria-pressed="${v === i}">${i}</button>`).join("")}</div>`;
  }
  function escFila(f) {
    const p = [];
    const i = L.entero1a5(f.importancia), pr = L.entero1a5(f.probabilidad);
    if (i) p.push(`<b>Importancia ${i}</b> ${esc(L.ESC_IMP[i - 1].replace(/\.$/, ""))}`);
    if (!L.esInterno(f.tipo) && pr) p.push(`<b>Probabilidad ${pr}</b> ${esc(L.ESC_PROB[pr - 1].replace(/\.$/, ""))}`);
    return p.join(" · ");
  }
  function puntHtml(f) {
    return `<div class="fx-p"><span class="fx-pl">Importancia</span><span data-zseg="${f.id}-importancia">${segPunt(f, "importancia")}</span></div>
      ${L.esInterno(f.tipo) ? "" : `<div class="fx-p"><span class="fx-pl">Probabilidad</span><span data-zseg="${f.id}-probabilidad">${segPunt(f, "probabilidad")}</span></div>`}`;
  }
  function factorCard(d, f) {
    const areas = L.areasDe(f.tipo), ab = abiertos.has(f.id), fu = L.fuenteDe(d, f);
    const resumenMas = [L.nombreArea(f), lleno(f.evidencia) ? "dato: " + L.corto(f.evidencia, 50) : "", fu ? "fuente: " + L.corto(L.nombreFuente(fu), 40) : ""].filter(Boolean).join(" · ");
    return `<div class="fx q-${f.tipo}" data-fid="${f.id}">
      <div class="fx-cab">${codBadge(f)}<span data-zpeso="${f.id}">${pesoBadge(f)}</span>
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="fx-del" data-id="${f.id}">Quitar</button></span></div>
      ${campo(f, "texto", "", { bind: bx(f, "texto"), area: true, aria: `Texto de ${L.codigo(f)}`, ph: { F: "p. ej. Enfermería gestora de casos con 140 crónicos complejos en seguimiento", D: "p. ej. Demora de 6 días para cita con medicina de familia", O: "p. ej. Nueva herramienta corporativa de teleconsulta en 2027", A: "p. ej. Tres jubilaciones de médicos en 2 años, plazas difíciles de cubrir" }[f.tipo] })}
      <div data-zav="${f.id}">${avisosFactor(d, pasoActual, f.id)}</div>
      <div class="fx-punt">${puntHtml(f)}</div>
      <p class="punt-esc" data-zesc="${f.id}">${escFila(f)}</p>
      <details class="fx-mas"${ab ? " open" : ""} data-fmas="${f.id}"><summary>${L.esInterno(f.tipo) ? "Área" : "Ámbito"}, dato y fuente <span class="fx-res" data-zres="${f.id}">${esc(resumenMas)}</span></summary>
        <div class="dos-col">
          ${selector(L.esInterno(f.tipo) ? "Área" : "Ámbito del entorno", bx(f, "area"), f.area, [["", "— Elige —"], ...Object.entries(areas).map(([k, v]) => [k, v.nom])])}
          ${selector("Quién lo aporta", bx(f, "aporta"), f.aporta, [["", "— Elige —"], ...Object.entries(L.APORTA)], { opt: true })}
        </div>
        ${L.esInterno(f.tipo) ? selector("Bloque del manual ACSA", bx(f, "bloqueAcsa"), f.bloqueAcsa, [["", `— Según el área${L.AREA_A_BLOQUE[f.area] ? ": " + L.BLOQUES_ACSA[L.AREA_A_BLOQUE[f.area]] : ""} —`], ...Object.entries(L.BLOQUES_ACSA)], { opt: true }) : ""}
        ${campo(f, "evidencia", "El dato que lo respalda", { bind: bx(f, "evidencia"), area: true, ph: "p. ej. 62 % con HbA1c < 8 % (Distrito: 54 %)", help: "Una cifra, un resultado, lo que dice una encuesta… Si no hay datos, escribe «sin datos»: también es un hallazgo." })}
        ${selector("Fuente", bx(f, "fuenteId"), f.fuenteId, [["", d.fuentes.length ? "— Sin fuente —" : "— Añade fuentes en el paso 2 —"], ...d.fuentes.map(x => [x.id, L.corto(L.nombreFuente(x) || "Fuente sin nombre", 70)])])}
      </details>
    </div>`;
  }
  function columna(d, t) {
    const l = L.delTipo(d, t, "num"), q = Q[t];
    return `<section class="cuad q-${t}">
      <h2 class="cuad-t"><span class="cuad-letra">${t}</span>${q.nom} <span class="contador" data-zona="n${t}">${d.factores.filter(f => f.tipo === t && lleno(f.texto)).length}</span></h2>
      <p class="field-sub cuad-que">${q.que}</p>
      <div class="fx-lista">${l.map(f => factorCard(d, f)).join("") || `<p class="placeholder-box">Aún no hay ${q.nom.toLowerCase()}.</p>`}</div>
      <button class="btn btn--sm no-print" data-act="fx-add" data-tipo="${t}">+ Añadir ${q.uno}</button>
    </section>`;
  }
  function guiaHtml(n) {
    const interno = n === 3, A = interno ? L.AREAS : L.AMBITOS, [t1, t2] = interno ? ["F", "D"] : ["O", "A"];
    return `<details class="facil guia-areas no-print"><summary>Preguntas guía por ${interno ? "área" : "ámbito del entorno"}</summary><div class="facil-body">
      <p class="field-sub">Recorred ${interno ? "cada área" : "cada ámbito"} con estas preguntas. Con los botones añades ${interno ? "una fortaleza o una debilidad" : "una oportunidad o una amenaza"} ya clasificada.</p>
      <div class="guia-lista">${Object.entries(A).map(([k, a]) => `<div class="guia-item"><b>${esc(a.nom)}</b><ul>${a.preg.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        <div class="quick"><button type="button" class="chip q-chip q-${t1}" data-act="fx-add" data-tipo="${t1}" data-area="${k}">+ ${Q[t1].uno}</button><button type="button" class="chip q-chip q-${t2}" data-act="fx-add" data-tipo="${t2}" data-area="${k}">+ ${Q[t2].uno}</button></div></div>`).join("")}</div>
    </div></details>`;
  }
  function pegarHtml(n) {
    const [t1, t2] = n === 3 ? ["F", "D"] : ["O", "A"];
    return `<div class="card pegar no-print">
      <h3 class="sub-h">Pegar factores desde Excel, Calc o Word</h3>
      <p class="field-sub">Copia las filas de tu tabla (mejor con la fila de títulos) y pégalas aquí. Sin títulos, las columnas van en este orden: <b>Tipo (F, D, O o A) · Factor · Dato · Importancia${n === 4 ? " · Probabilidad" : ""}</b>. Si pegas una lista de una sola columna, elige abajo en qué cuadrante van.</p>
      <textarea class="txt-in" id="pegar-txt" rows="6" placeholder="Pega aquí la tabla o la lista…"></textarea>
      ${selector("Si una fila no dice su cuadrante, va a", 'id="pegar-tipo"', t1, [[t1, Q[t1].nom], [t2, Q[t2].nom]])}
      <div data-zona="pegar"></div>
      <div class="toolbar"><button class="btn btn--primary" data-act="pegar-ok" disabled>Añadir los factores</button><button class="btn" data-act="pegar-cerrar">Cancelar</button></div>
    </div>`;
  }
  const vistaInt = () => leer(KEY_VISTA_INT) || "areas";
  function pasoCuadrantes(d, n) {
    const interno = n === 3, [t1, t2] = interno ? ["F", "D"] : ["O", "A"];
    const ayuda = interno
      ? `${idea("Mirad hacia dentro: ¿qué hacéis bien y qué hacéis peor? <b>Si lo podéis cambiar vosotros, es interno.</b>")}
        ${facil(`<p>Las <b>fortalezas</b> son lo que hacéis bien y os acerca a la visión; las <b>debilidades</b>, lo que hacéis peor o os falta. Las dos dependen de vosotros.</p>
          <div class="table-wrap"><table class="mini"><tr><th>Así no</th><th>Así sí</th></tr>
            <tr><td>Comunicación</td><td>No hay reunión de equipo desde hace un año</td></tr>
            <tr><td>Buen equipo</td><td>El 85 % de la plantilla lleva más de 5 años en la unidad</td></tr>
            <tr><td>Hay que formar en seguridad</td><td>Solo el 30 % del personal ha hecho formación en seguridad en 3 años</td></tr></table></div>
          <p>Cada factor lleva su <b>importancia</b> de 1 (poco) a 5 (clave): cuánto pesa en lo que queréis conseguir.</p>
          ${trampa("«Hay que…», «Mejorar…», «Implantar…» son soluciones, no factores. Y «la Consejería no cubre las bajas» no depende de vosotros: es una amenaza. La app te avisa cuando lo detecta.")}`)}`
      : `${idea("Mirad hacia fuera: ¿qué pasa en el entorno que os puede ayudar o perjudicar? <b>No depende de vosotros, pero sí cómo os preparáis.</b>")}
        ${facil(`<p>Las <b>oportunidades</b> son cambios del entorno que os pueden ayudar si los aprovecháis; las <b>amenazas</b>, los que os pueden perjudicar si no os preparáis.</p>
          <p>El método <b>PESTEL</b> ayuda a no olvidar nada: político, económico, social, tecnológico, ecológico (territorio) y legal. Y además, el entorno sanitario cercano (hospital, Distrito, Agencia de Calidad) y la comunidad (asociaciones, ayuntamiento).</p>
          <div class="formula">Peso = importancia (1–5) × probabilidad (1–5) → de 1 a 25</div>
          <p>La <b>probabilidad</b> se juzga para el horizonte del análisis${lleno(d.horizonte) ? ` (<b>${esc(d.horizonte)}</b>)` : ""}.</p>
          ${trampa("Una oportunidad que nadie va a aprovechar es solo un deseo; y «nuestro equipo está poco formado» no es una amenaza aunque preocupe: depende de vosotros.")}`)}`;
    return `${ayuda}
      ${guiaHtml(n)}
      <div class="toolbar no-print"><a class="btn" href="#/dafo/${d.id}/ideas">💡 Lluvia de ideas</a><button class="btn" data-act="pegar-abrir">Pegar desde Excel</button>${n === 3 ? `<button class="btn" data-act="amfe-traer">Traer de AMFE</button>` : ""}${d.factores.length ? `<button class="btn" data-act="informe">Ver matriz DAFO / PDF</button><button class="btn" data-act="excel">⬇ Excel</button>` : ""}</div>
      ${pegarAbierto ? pegarHtml(n) : ""}
      ${n === 3 && amfeLista ? amfeHtml(d) : ""}
      <div data-zona="avisos">${avisosGenerales(d, n)}</div>
      ${interno ? `<div class="seg seg--mini vista-int no-print" role="group" aria-label="Forma de ver el análisis interno"><button type="button" class="${vistaInt() === "areas" ? "active" : ""}" data-act="vista-int" data-v="areas">Por cuadrantes</button><button type="button" class="${vistaInt() === "acsa" ? "active" : ""}" data-act="vista-int" data-v="acsa">Por bloques ACSA</button></div>` : ""}
      ${interno && vistaInt() === "acsa" ? acsaHtml(d) : `<div class="cuad-2">${columna(d, t1)}${columna(d, t2)}</div>`}
      ${n === 4 ? `<h2 class="sec-t">Matriz DAFO</h2><p class="page-lead">Los cuatro cuadrantes, cada uno ordenado por su peso. En el paso 5 os quedaréis con los más importantes y en el 6 los cruzaréis.</p>
        <div data-zona="matriz">${matrizHtml(d)}</div>` : ""}`;
  }
  const paso3 = d => pasoCuadrantes(d, 3);
  const paso4 = d => pasoCuadrantes(d, 4);
  // ---------- Paso 5 · Quedarse con lo importante ----------
  function estadoPrio(e) {
    if (!e) return "";
    if (e.por === "manual") return e.prio ? `<span class="badge badge--prio">Añadido a mano</span>` : `<span class="badge">Quitado a mano</span>`;
    return e.prio ? `<span class="badge badge--prio">Prioritario</span>` : `<span class="badge badge--fuera">Fuera</span>`;
  }
  function factorPrio(d, f, m) {
    const e = m[f.id], btn = (v, t) => `<button type="button" class="pf-btn${(f.manual || "") === v ? " on" : ""}" data-act="fx-manual" data-id="${f.id}" data-v="${v}" aria-pressed="${(f.manual || "") === v}">${t}</button>`;
    return `<div class="pf q-${f.tipo}${e.prio ? " pf--on" : ""}" data-fid="${f.id}">
      <div class="pf-cab">${codBadge(f)}<span class="pf-txt"><b>${esc(f.texto)}</b>${lleno(f.evidencia) ? `<span>${esc(L.corto(f.evidencia, 110))}</span>` : `<span class="falta">Sin dato que lo respalde</span>`}</span>
        <span class="pf-badges">${pesoBadge(f)}${e.puesto ? `<span class="badge">${e.puesto}.º</span>` : ""}${f.votos.length ? `<span class="badge${L.discrepancia(f).length ? " sem--no" : ""}" title="Votación del equipo">${plural(f.votos.length, "voto", "votos")}</span>` : ""}${estadoPrio(e)}</span></div>
      <div class="pf-acc no-print">${btn("", "Según el peso")}${btn("si", "Sí, entra")}${btn("no", "No entra")}</div>
      ${f.manual ? campo(f, "motivo", "Motivo de la decisión", { bind: bx(f, "motivo"), area: true, ph: f.manual === "si" ? "p. ej. Aunque pesa poco, es requisito de la acreditación" : "p. ej. Ya se está corrigiendo con un proyecto en marcha", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-motivo" data-id="${f.id}">✎ Proponer el dato del motivo</button></div>` }) : ""}
      <div data-zav="${f.id}">${avisosFactor(d, 5, f.id)}</div>
    </div>`;
  }
  function paso5(d) {
    const m = L.prioridad(d), N = L.nPrioridad(d);
    return `
      ${idea("Una lluvia de ideas da muchos factores, pero <b>no se puede trabajar con todos</b>. Quedaos con los que más pesan de cada cuadrante: lo habitual, <b>unos 5</b>.")}
      ${facil(`<p>La app ordena cada cuadrante por su <b>peso</b> (importancia en los internos; importancia × probabilidad en los externos) y propone como prioritarios los primeros. El equipo puede <b>añadir o quitar a mano</b> cualquier factor, siempre escribiendo el motivo.</p>
        <p>Los prioritarios son los que se cruzan en el paso 6 y de los que saldrán las estrategias.</p>
        ${trampa("Si os quedáis con todo, la matriz cruzada se hace eterna y nada destaca. Y si quitáis a mano lo que más pesa, explicad por qué: quien lea el análisis lo preguntará.")}`)}
      <div class="card no-print"><h2 class="sub-h">Cuántos por cuadrante</h2>
        <div class="seg seg--mini" role="group" aria-label="Factores prioritarios por cuadrante">${[3, 4, 5, 6, 7, 8, 10].map(v => `<button type="button" class="${v === N ? "active" : ""}" data-act="prio-n" data-v="${v}">${v}</button>`).join("")}</div>
        <div class="toolbar"><a class="btn" href="#/dafo/${d.id}/votar">🗳 Votar la importancia en equipo</a>${btnReunion()}</div>
        <p class="field-sub">Entran los ${N} de más peso de cada cuadrante. Con ${N} por cuadrante, la matriz cruzada tendrá hasta ${N * 2 * N * 2} casillas.</p></div>
      <div data-zona="avisos">${avisosGenerales(d, 5)}</div>
      <h2 class="sec-t">Matriz DAFO de los prioritarios</h2>
      <div data-zona="matriz">${matrizHtml(d, true)}</div>
      ${L.TIPOS.map(t => { const l = L.delTipo(d, t).filter(f => lleno(f.texto)); return `<section class="grupo-sub"><h3 class="grupo-t q-${t}"><span class="cuad-letra">${t}</span>${Q[t].nom} <span class="contador">${l.filter(f => L.esPrio(m, f)).length} de ${l.length}</span></h3>
        <div class="pf-lista">${l.map(f => factorPrio(d, f, m)).join("") || `<p class="placeholder-box">No hay ${Q[t].nom.toLowerCase()}. <a href="#/dafo/${d.id}/${L.esInterno(t) ? 3 : 4}">Escríbelas en el paso ${L.esInterno(t) ? 3 : 4}</a>.</p>`}</div></section>`; }).join("")}
      <div class="toolbar no-print sep-arriba"><button class="btn" data-act="excel">⬇ Excel</button><button class="btn" data-act="informe">Ver análisis / PDF</button></div>`;
  }

  // ---------- Paso 6 · Cruzar los factores ----------
  const KEY_VISTA_CRUCE = "dafo-vista-cruce";
  const vistaCruce = () => leer(KEY_VISTA_CRUCE) || (window.innerWidth >= 720 ? "tabla" : "lista");
  const celdaCruce = (d, f, g, ver) => { const v = L.valorCruce(d, f, g); if (ver) return `<span class="cz${v === null ? " cz--vacio" : " cz--" + v}">${v === null ? "·" : v}</span>`; return `<button type="button" class="cz${v === null ? " cz--vacio" : " cz--" + v}" data-act="cruce" data-f="${f.id}" data-g="${g.id}" title="${esc(L.BLOQUES[L.bloqueDe(f, g)].preg + " " + L.codigo(f) + " × " + L.codigo(g))}" aria-label="${L.codigo(f)} por ${L.codigo(g)}: ${v === null ? "sin valorar" : v}">${v === null ? "·" : v}</button>`; };
  const mediaDe = (r, f) => { const x = r.porFactor.find(y => y.f === f); return x ? String(x.media).replace(".", ",") : ""; };
  function tablaCruce(d, r, ver) {
    const E = r.ejes, cols = [...E.O, ...E.A];
    const cab = g => `<th class="cz-h q-${g.tipo}${g === E.A[0] ? " cz-sep" : ""}" title="${esc(g.texto)}"><span>${L.codigo(g)}</span></th>`;
    const fila = f => `<tr class="${f === E.D[0] ? "cz-fsep" : ""}"><th class="cz-h q-${f.tipo}" title="${esc(f.texto)}"><span>${L.codigo(f)}</span></th>${cols.map(g => `<td class="${g === E.A[0] ? "cz-sep" : ""}">${celdaCruce(d, f, g, ver)}</td>`).join("")}<td class="cz-m" data-zmf="${f.id}">${mediaDe(r, f)}</td></tr>`;
    return `<div class="table-wrap cz-wrap"><table class="cz-t" aria-label="Matriz cruzada">
      <thead><tr><th class="cz-esq"></th>${cols.map(cab).join("")}<th class="cz-m">Media</th></tr></thead>
      <tbody>${[...E.F, ...E.D].map(fila).join("")}<tr class="cz-fsep"><th class="cz-m">Media</th>${cols.map(g => `<td class="cz-m${g === E.A[0] ? " cz-sep" : ""}" data-zmf="${g.id}">${mediaDe(r, g)}</td>`).join("")}<td></td></tr></tbody></table></div>
      <p class="field-sub no-print">Toca una casilla para cambiar su valor: · (sin valorar) → 0 → 1 → 2 → 3. Pasa el ratón por un código para ver el factor.</p>
      <div class="cz-ley">${[...E.F, ...E.D, ...E.O, ...E.A].map(f => `<span>${codBadge(f)} ${esc(f.texto)}</span>`).join("")}</div>`;
  }
  function listaCruce(d, r) {
    const E = r.ejes;
    return L.ORDEN_BLOQUES.map(k => { const B = L.BLOQUES[k];
      return `<section class="cz-bloque"><h3 class="sub-h">${k} · ${B.verbo} <span class="cz-preg">${esc(B.preg)}</span></h3>
        ${E[B.fila].map(f => `<div class="cz-grupo q-${f.tipo}"><p class="cz-fila">${codBadge(f)} <b>${esc(f.texto)}</b></p>
          ${E[B.col].map(g => { const v = L.valorCruce(d, f, g); return `<div class="cz-par"><span class="cz-col">${codBadge(g)} ${esc(g.texto)}</span>
            <div class="seg seg--mini seg--cz" role="group" aria-label="${L.codigo(f)} por ${L.codigo(g)}">${[0, 1, 2, 3].map(i => `<button type="button" class="${v === i ? "active" : ""}" data-act="cruce-v" data-f="${f.id}" data-g="${g.id}" data-v="${i}" title="${L.ESC_CRUCE[i]}">${i}</button>`).join("")}</div></div>`; }).join("")}
        </div>`).join("")}</section>`; }).join("");
  }
  function resultadoHtml(d) {
    const r = L.resultadoCruces(d);
    if (!r.total) return "";
    const max = Math.max(1, ...L.ORDEN_BLOQUES.map(k => r.bloques[k].media));
    const barras = L.ORDEN_BLOQUES.map(k => { const b = r.bloques[k], B = L.BLOQUES[k];
      return `<div class="or-fila${k === r.orientacion ? " or-fila--sel" : ""}"><span class="or-k">${k}</span><span class="or-n">${B.verbo}<small>${B.nom}</small></span><span class="or-barra"><i style="width:${Math.round(b.media / 3 * 100)}%"></i></span><b class="or-v">${String(b.media).replace(".", ",")}</b></div>`; }).join("");
    const fuertes = r.fuertes;
    return `<div class="card or-card"><h3 class="sub-h">Orientación estratégica</h3>
        <div class="or-barras">${barras}</div>
        <p class="field-sub">Media de cada bloque, de 0 a 3 (las casillas sin valorar cuentan como 0). ${r.listo ? "" : `Llevas ${r.rellenas} de ${r.total} casillas.`}</p>
        ${r.orientacion ? practica(`<b>Orientación ${esc(L.BLOQUES[r.orientacion].nom.toLowerCase())} (${r.orientacion}).</b> ${esc(L.BLOQUES[r.orientacion].texto)} Es una ayuda, no una orden: también conviene mantener las fortalezas y vigilar las amenazas.`) : `<div class="note">ℹ La orientación aparecerá cuando estén valoradas todas las casillas.</div>`}
      </div>
      ${r.llaves.length ? `<div class="card"><h3 class="sub-h">Factores llave</h3><p class="field-sub">Los que más se relacionan con el resto: actuar sobre ellos mueve varias estrategias a la vez.</p>
        <ul class="llaves">${r.llaves.map(x => `<li>${codBadge(x.f)} <span>${esc(x.f.texto)}</span> <span class="badge">media ${String(x.media).replace(".", ",")}</span></li>`).join("")}</ul></div>` : ""}
      ${fuertes.length ? `<div class="card"><h3 class="sub-h">Cruces fuertes (3) <span class="contador">${fuertes.length}</span></h3><p class="field-sub">De aquí saldrán las estrategias CAME propuestas en el paso 7 (próxima versión). Por ahora, una idea de partida:</p>
        ${L.ORDEN_BLOQUES.filter(k => fuertes.some(x => x.bloque === k)).map(k => `<p class="fz-t"><b>${k} · ${L.BLOQUES[k].verbo}</b></p><ul class="fuertes">${fuertes.filter(x => x.bloque === k).map(x => `<li><b>${esc(L.estrategiaPropuesta(x.fila, x.col))}</b><span>${L.codigo(x.fila)}: ${esc(L.corto(x.fila.texto, 70))} · ${L.codigo(x.col)}: ${esc(L.corto(x.col.texto, 70))}</span></li>`).join("")}</ul>`).join("")}</div>` : ""}`;
  }
  function paso6(d) {
    const r = L.resultadoCruces(d), faltan = L.TIPOS.filter(t => !r.ejes[t].length), vista = vistaCruce();
    const cabecera = `
      ${idea("Cruzad lo de dentro con lo de fuera: <b>cada cruce sugiere un tipo de estrategia</b>. Los cruces más fuertes serán vuestras estrategias CAME.")}
      ${facil(`<div class="table-wrap"><table class="mini"><tr><th></th><th>Oportunidades</th><th>Amenazas</th></tr>
          <tr><th>Fortalezas</th><td><b>FO · Explotar</b><br>${esc(L.BLOQUES.FO.preg)}</td><td><b>FA · Mantener</b><br>${esc(L.BLOQUES.FA.preg)}</td></tr>
          <tr><th>Debilidades</th><td><b>DO · Corregir</b><br>${esc(L.BLOQUES.DO.preg)}</td><td><b>DA · Afrontar</b><br>${esc(L.BLOQUES.DA.preg)}</td></tr></table></div>
        <p>Cada casilla se valora de <b>0</b> (sin relación) a <b>3</b> (fuerte). La media de cada bloque dice la <b>orientación</b> de la unidad: ofensiva (FO), defensiva (FA), de reorientación (DO) o de supervivencia (DA).</p>
        ${trampa("Si todo lleva un 3, nada destaca. Reservad el 3 para los cruces de verdad fuertes, y no olvidéis el 0: también es una respuesta.")}`)}`;
    if (faltan.length) return `${cabecera}<div data-zona="avisos">${avisosGenerales(d, 6)}</div>
      <div class="placeholder-box"><p>Para cruzar hacen falta factores prioritarios en los cuatro cuadrantes. <a href="#/dafo/${d.id}/5">Vuelve al paso 5</a>.</p></div>`;
    return `${cabecera}
      <div class="toolbar no-print"><div class="seg seg--mini" role="group" aria-label="Forma de ver la matriz"><button type="button" class="${vista === "tabla" ? "active" : ""}" data-act="cruce-vista" data-v="tabla">Tabla</button><button type="button" class="${vista === "lista" ? "active" : ""}" data-act="cruce-vista" data-v="lista">Pregunta a pregunta</button></div>
        ${r.rellenas < r.total ? `<button class="btn" data-act="cruce-ceros">Poner 0 en las vacías</button>` : ""}<button class="btn" data-act="excel">⬇ Excel</button><button class="btn" data-act="informe">Ver análisis / PDF</button></div>
      <p class="res-linea" data-zona="progcruce">${progCruce(r)}</p>
      <div data-zona="avisos">${avisosGenerales(d, 6)}</div>
      ${vista === "tabla" ? tablaCruce(d, r) : listaCruce(d, r)}
      <h2 class="sec-t">Resultado</h2>
      <div data-zona="resultado">${resultadoHtml(d)}</div>`;
  }
  const progCruce = r => `<span class="badge">${r.rellenas} de ${r.total} casillas valoradas</span>${r.orientacion ? `<span class="badge badge--prio">Orientación ${r.orientacion}</span>` : ""}`;
  // ---------- Paso 2 · Equipo y sesiones ----------
  const bm = (m, f) => `data-m="${m.id}" data-f="${f}"`;
  const bse = (x, f) => `data-x="${x.id}" data-f="${f}"`;
  function miembroCard(m, i) {
    return `<div class="sub-card sub-card--eq">
      <div class="sub-cab"><span class="eq-n">${i + 1}</span><b>${lleno(m.perfil) ? esc(m.perfil) : '<span class="vacio">Perfil sin escribir</span>'}</b><span class="badge">${esc(L.ROLES[m.rol].nom)}</span>
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="eq-del" data-id="${m.id}">Quitar</button></span></div>
      <div class="dos-col">
        ${campo(m, "perfil", "Perfil profesional", { bind: bm(m, "perfil"), ph: "p. ej. Enfermero/a de la unidad" })}
        ${campo(m, "cargo", "Cargo o puesto", { bind: bm(m, "cargo"), opt: true, ph: "p. ej. Coordinador/a de cuidados" })}
      </div>
      <div class="dos-col">
        ${selector("Papel en el DAFO", bm(m, "rol"), m.rol, Object.keys(L.ROLES).map(k => [k, L.ROLES[k].nom]), { help: Object.keys(L.ROLES).map(k => `<b>${L.ROLES[k].nom}</b>: ${L.ROLES[k].que}`).join("<br>") })}
        ${campo(m, "nombre", "Nombre", { bind: bm(m, "nombre"), opt: true, ph: "Puedes dejarlo vacío", help: "Opcional. Para votar basta con el perfil." })}
      </div>
    </div>`;
  }
  function sesionCard(d, x, i) {
    return `<div class="sub-card sub-card--ses">
      <div class="sub-cab"><span class="eq-n">${i + 1}</span><b>Sesión ${i + 1}</b>${lleno(x.fecha) ? `<span class="badge">${esc(fmtFecha(x.fecha))}</span>` : ""}
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="ses-del" data-id="${x.id}">Quitar</button></span></div>
      <div class="dos-col">
        ${campo(x, "fecha", "Fecha", { bind: bse(x, "fecha"), tipo: "date" })}
        ${campo(x, "duracion", "Duración", { bind: bse(x, "duracion"), opt: true, ph: "p. ej. 2 h" })}
      </div>
      ${campo(x, "actividad", "Actividad principal", { bind: bse(x, "actividad"), ph: "p. ej. Lluvia de ideas y matriz DAFO" })}
      ${d.equipo.length ? `<div class="field"><div class="field-head"><label class="field-label">Asistentes</label></div><div class="quick">${d.equipo.map(m => `<button type="button" class="chip${x.asistentes.includes(m.id) ? " active" : ""}" data-asis="${x.id}" data-v="${m.id}">${esc(L.corto(L.etiquetaMiembro(m), 40))}</button>`).join("")}</div></div>` : ""}
      ${campo(x, "resultados", "Resultados", { bind: bse(x, "resultados"), area: true, opt: true, ph: "p. ej. 24 factores con su dato" })}
    </div>`;
  }
  function equipoHtml(d) {
    const ya = new Set([...d.equipo.map(m => L.normal(m.perfil))]);
    return `<h2 class="sec-t">Equipo <span class="contador" data-zona="neq">${d.equipo.length}</span> <span class="field-opt">(opcional)</span></h2>
      <p class="page-lead">Quién participa en el análisis. Hace falta para votar en la lluvia de ideas y en la importancia de los factores.</p>
      <div class="card no-print"><p class="field-sub">Añade con un toque los perfiles habituales y después ajústalos:</p>
        <div class="quick">${L.PERFILES_SUG.map((p, i) => `<button type="button" class="chip${ya.has(L.normal(p.perfil)) ? " active" : ""}" data-act="eq-sug" data-i="${i}">+ ${esc(p.perfil)}</button>`).join("")}</div></div>
      <div class="sub-lista">${d.equipo.map(miembroCard).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="eq-add">+ Añadir otro perfil</button></div>
      <h2 class="sec-t">Sesiones de trabajo <span class="contador" data-zona="nses">${d.sesiones.length}</span> <span class="field-opt">(opcional)</span></h2>
      <div class="sub-lista">${d.sesiones.map((x, i) => sesionCard(d, x, i)).join("") || `<p class="placeholder-box">Aún no hay sesiones. Puedes proponer las habituales y ajustarlas.</p>`}</div>
      <div class="toolbar no-print"><button class="btn" data-act="ses-add">+ Añadir sesión</button>${d.sesiones.length ? "" : `<button class="btn" data-act="ses-tipo">Proponer las 3 sesiones habituales</button>`}</div>
      <div class="card herr-card no-print"><h3 class="sub-h">Para las sesiones</h3><p class="field-sub">Si empezáis en blanco, haced primero una <b>lluvia de ideas</b> cuadrante a cuadrante y votad en silencio los bloques más importantes. La <b>hoja de trabajo</b> sirve para las reuniones en papel.</p>
        <div class="toolbar"><a class="btn btn--primary" href="#/dafo/${d.id}/ideas">💡 Lluvia de ideas</a><a class="btn" href="#/dafo/${d.id}/votar">🗳 Votar la importancia</a><button class="btn" data-act="doc-ver" data-doc="hoja">Hoja de trabajo</button>${btnReunion()}</div></div>`;
  }

  // ---------- Modo reunión: letra grande y pantalla limpia para proyectar ----------
  const btnReunion = () => `<button class="btn" data-act="reunion">${document.body.classList.contains("modo-reunion") ? "Salir del modo reunión" : "🖥 Modo reunión"}</button>`;
  function ponerReunion(si) {
    document.body.classList.toggle("modo-reunion", si);
    let x = $("#salir-reunion");
    if (si && !x) { x = document.createElement("button"); x.id = "salir-reunion"; x.className = "btn salir-reunion no-print"; x.textContent = "✕ Salir del modo reunión"; x.addEventListener("click", () => ponerReunion(false)); document.body.appendChild(x); }
    if (!si && x) x.remove();
    if (actual) repintar();
  }

  // ---------- Herramientas de equipo: lluvia de ideas y votación (fuera de la línea de pasos) ----------
  const HERRAMIENTAS = { ideas: { titulo: "Lluvia de ideas", sub: "Ideas por cuadrante, bloques y técnica de grupo nominal" }, votar: { titulo: "Votar la importancia", sub: "Cada miembro puntúa; la app propone la media" } };
  let cuadIdeas = "F", cuadVotar = "D";
  const cuadTabs = (act, actual) => `<div class="quick cuad-tabs no-print" role="group" aria-label="Cuadrante">${L.TIPOS.map(t => `<button type="button" class="chip q-chip q-${t}${t === actual ? " chip--on" : ""}" data-act="${act}" data-v="${t}">${t} · ${Q[t].nom}</button>`).join("")}</div>`;
  function ideaFila(d, i) {
    const f = i.factorId ? d.factores.find(x => x.id === i.factorId) : null, B = d.bloques.filter(b => b.cuadrante === i.cuadrante);
    return `<div class="idea-fila">
      <input class="txt-in idea-in" data-idea="${i.id}" data-f="texto" value="${esc(i.texto)}" aria-label="Idea" autocomplete="off" />
      <div class="input-wrap idea-bq"><select class="txt-in" data-idea="${i.id}" data-f="bloqueId" aria-label="Bloque"><option value="">— Sin bloque —</option>${B.map(b => `<option value="${b.id}"${b.id === i.bloqueId ? " selected" : ""}>${esc(L.corto(b.nombre || "Bloque sin nombre", 40))}</option>`).join("")}</select></div>
      ${f ? `<a class="badge q-b q-${f.tipo} idea-ok" href="#/dafo/${d.id}/${L.esInterno(f.tipo) ? 3 : 4}" title="Ya es el factor ${L.codigo(f)}">✓ ${L.codigo(f)}</a>` : `<button type="button" class="btn btn--sm" data-act="idea-factor" data-id="${i.id}" title="Pasar esta idea a factor">→ Factor</button>`}
      <button type="button" class="icon-btn" data-act="idea-del" data-id="${i.id}" aria-label="Quitar la idea">✕</button>
    </div>`;
  }
  function rankingHtml(d, t) {
    const R = L.ranking(d, t);
    if (!R.length) return `<p class="field-sub">Crea bloques para poder votarlos.</p>`;
    return `<div class="table-wrap"><table class="mini tabla-riesgos tgn-res"><thead><tr><th>Puesto</th><th>Bloque</th><th>Puntos</th><th>Comentario del grupo</th><th></th></tr></thead><tbody>
      ${R.map((r, k) => { const pend = d.ideas.filter(i => i.bloqueId === r.b.id && lleno(i.texto) && !(i.factorId && d.factores.some(f => f.id === i.factorId))).length; return `<tr${r.total ? "" : ' class="tgn-cero"'}><td>${r.total ? k + 1 : "–"}</td><td><b>${esc(r.b.nombre || "Sin nombre")}</b><br><span class="field-sub">${plural(r.ideas, "idea", "ideas")}</span></td><td><b>${r.total}</b></td>
        <td><textarea class="txt-in txt-in--sm" data-bq="${r.b.id}" data-f="comentario" rows="2" placeholder="${r.total ? "Por qué es importante (o el dato que lo respalda)" : "Nadie lo ha votado: ¿por qué?"}">${esc(r.b.comentario)}</textarea></td>
        <td>${pend ? `<button type="button" class="btn btn--sm no-print" data-act="bloque-factor" data-id="${r.b.id}">Pasar a factor</button>` : `<span class="badge">✓ Pasado</span>`}</td></tr>`; }).join("")}
    </tbody></table></div>`;
  }
  function votacionTgn(d, t) {
    const M = d.equipo.filter(m => lleno(m.perfil)), B = d.bloques.filter(b => b.cuadrante === t);
    if (!M.length) return `<p class="placeholder-box">Para votar hace falta el equipo. <a href="#/dafo/${d.id}/2">Añádelo en el paso 2</a>.</p>`;
    if (B.length < 2) return `<p class="field-sub">Para votar hacen falta al menos dos bloques en ${Q[t].nom.toLowerCase()}.</p>`;
    return `<div class="table-wrap"><table class="mini tgn-t"><thead><tr><th>Miembro</th><th>3 puntos</th><th>2 puntos</th><th>1 punto</th></tr></thead><tbody>
      ${M.map(m => `<tr><td>${esc(L.corto(L.etiquetaMiembro(m), 34))}</td>${[3, 2, 1].map(pt => `<td><select class="txt-in tgn-sel" data-v321="${m.id}" data-t="${t}" data-p="${pt}" aria-label="${pt} puntos de ${esc(m.perfil)}"><option value="">—</option>${B.map(b => `<option value="${b.id}"${L.voto321(d, m.id, t, pt) === b.id ? " selected" : ""}>${esc(L.corto(b.nombre || "Sin nombre", 30))}</option>`).join("")}</select></td>`).join("")}</tr>`).join("")}
    </tbody></table></div>`;
  }
  function herrIdeas(d) {
    const t = cuadIdeas, I = d.ideas.filter(i => i.cuadrante === t), B = d.bloques.filter(b => b.cuadrante === t);
    return `
      ${idea("Primero, <b>muchas ideas sin juzgarlas</b>, cuadrante a cuadrante; después se agrupan en bloques y cada persona vota en silencio. Los bloques más votados pasan a factores.")}
      ${facil(`<p><b>Lluvia de ideas</b>: cada persona dice, para cada cuadrante, lo que se le ocurre. Todo se apunta, sin debatir. Se puede pedir tres ideas por cuadrante a cada uno.</p>
        <p><b>Agrupar</b>: se juntan las ideas parecidas en bloques (la app avisa de las que se parecen) y se quitan las repetidas.</p>
        <p><b>Técnica de grupo nominal</b>: en cada cuadrante, cada persona reparte en silencio 3, 2 y 1 puntos entre los bloques. Se suman y se comentan, también los que nadie votó.</p>
        <p>Los bloques importantes pasan a <b>factores</b> con un toque; después, en los pasos 3 y 4, se completan con su dato y su importancia.</p>
        ${trampa("Si se debate cada idea al apuntarla, se apagan las de quien habla menos. Primero se apunta todo; luego se ordena y se vota en silencio.")}`)}
      <div class="toolbar no-print">${btnReunion()}<button class="btn" data-act="doc-ver" data-doc="hoja">Hoja de trabajo</button></div>
      ${cuadTabs("ideas-cuad", t)}
      <section class="cuad q-${t}">
        <h2 class="cuad-t"><span class="cuad-letra">${t}</span>${Q[t].nom} <span class="contador">${I.length}</span></h2>
        <p class="guia">${L.PREGUNTAS_IDEAS[t].map(q => `<span>${esc(q)}</span>`).join("")}</p>
        <div class="idea-nueva no-print"><input class="txt-in" id="idea-txt" placeholder="Escribe una idea y pulsa Intro" autocomplete="off" /><button class="btn btn--primary" data-act="idea-add">Añadir</button></div>
        <div class="ideas-lista">${I.map(i => ideaFila(d, i)).join("") || `<p class="field-sub">Aún no hay ideas en este cuadrante.</p>`}</div>
        <h3 class="sub-h">Bloques <span class="contador">${B.length}</span></h3>
        <div class="idea-nueva no-print"><input class="txt-in" id="bloque-txt" placeholder="Nombre del bloque (p. ej. Demora para la cita)" autocomplete="off" /><button class="btn" data-act="bloque-add">Crear bloque</button></div>
        <div class="bloques-lista">${B.map(b => `<div class="bloque-fila"><input class="txt-in" data-bq="${b.id}" data-f="nombre" value="${esc(b.nombre)}" aria-label="Nombre del bloque" autocomplete="off" /><span class="badge">${plural(d.ideas.filter(i => i.bloqueId === b.id).length, "idea", "ideas")}</span><button type="button" class="icon-btn no-print" data-act="bloque-del" data-id="${b.id}" aria-label="Quitar el bloque">✕</button></div>`).join("")}</div>
        <h3 class="sub-h">Grupo nominal: 3, 2 y 1 puntos</h3>
        ${votacionTgn(d, t)}
        <h3 class="sub-h">Recuento</h3>
        <div data-zona="ranking">${rankingHtml(d, t)}</div>
      </section>
      <div data-zona="avisos">${avisosGenerales(d, "ideas")}</div>
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/dafo/${d.id}/${L.esInterno(t) ? 3 : 4}">Completar los factores en el paso ${L.esInterno(t) ? 3 : 4} →</a></div>`;
  }
  const fmtMedia = v => String(Math.round(v * 10) / 10).replace(".", ",");
  function celdaMedia(f) {
    const m = L.mediaVotos(f), dif = L.discrepancia(f);
    const parte = k => m[k] ? `<span class="${dif.includes(k) ? "vt-disc" : ""}" title="${m[k].n} votos; del ${m[k].media - 0} con rango ${m[k].rango}">${fmtMedia(m[k].exacta)} → <b>${m[k].media}</b></span>` : "—";
    return L.esInterno(f.tipo) ? parte("importancia") : `${parte("importancia")}<br>${parte("probabilidad")}`;
  }
  function herrVotar(d) {
    const t = cuadVotar, M = d.equipo.filter(m => lleno(m.perfil)), F = L.delTipo(d, t, "num").filter(f => lleno(f.texto)), ext = !L.esInterno(t);
    const tabla = !M.length ? `<p class="placeholder-box">Para votar hace falta el equipo. <a href="#/dafo/${d.id}/2">Añádelo en el paso 2</a>.</p>`
      : !F.length ? `<p class="placeholder-box">No hay ${Q[t].nom.toLowerCase()} que votar.</p>`
      : `<div class="table-wrap"><table class="mini vt-t"><thead><tr><th>Factor</th>${M.map(m => `<th title="${esc(m.perfil)}">${esc(L.corto(L.etiquetaMiembro(m), 14))}</th>`).join("")}<th>Media</th><th>Valor final</th><th></th></tr></thead><tbody>
        ${F.map(f => `<tr data-vf="${f.id}"><td>${codBadge(f)} ${esc(L.corto(f.texto, 70))}</td>${M.map(m => { const v = f.votos.find(x => x.miembroId === m.id) || {}; return `<td><input class="txt-in vot-in" data-voto="${f.id}" data-mi="${m.id}" data-f="importancia" value="${esc(v.importancia || "")}" inputmode="numeric" maxlength="1" placeholder="I" aria-label="Importancia según ${esc(m.perfil)}" />${ext ? `<input class="txt-in vot-in" data-voto="${f.id}" data-mi="${m.id}" data-f="probabilidad" value="${esc(v.probabilidad || "")}" inputmode="numeric" maxlength="1" placeholder="P" aria-label="Probabilidad según ${esc(m.perfil)}" />` : ""}</td>`; }).join("")}
          <td class="vt-m" data-zvm="${f.id}">${celdaMedia(f)}</td><td class="vt-m" data-zvf="${f.id}">${esc(f.importancia || "—")}${ext ? ` × ${esc(f.probabilidad || "—")}` : ""}</td><td><button type="button" class="btn btn--sm no-print" data-act="voto-usar" data-id="${f.id}">Usar la media</button></td></tr>`).join("")}
      </tbody></table></div>`;
    return `
      ${idea("Que cada persona puntúe <b>en silencio</b> y después se comparen los votos. Así no pesa más la voz más alta.")}
      ${facil(`<p>Cada miembro puntúa la <b>importancia</b> de 1 a 5 (I) y, en oportunidades y amenazas, la <b>probabilidad</b> de 1 a 5 (P). La app calcula la <b>media</b> y la redondea.</p>
        <p>Si entre el voto más alto y el más bajo hay <b>3 puntos o más</b>, sale en rojo: <b>habladlo</b> antes de cerrar el valor. Quizá cada uno entiende el factor de una forma; a veces hay que reescribirlo.</p>
        <p>El valor final lo decide el equipo: «Usar la media» lo copia al factor, pero se puede cambiar en los pasos 3 y 4.</p>`)}
      <div class="toolbar no-print">${btnReunion()}<button class="btn" data-act="votos-usar-todos">Usar todas las medias de ${Q[t].nom.toLowerCase()}</button><button class="btn" data-act="doc-ver" data-doc="hoja">Hoja de votación</button></div>
      ${cuadTabs("votar-cuad", t)}
      ${tabla}
      <div data-zona="avisos">${avisosGenerales(d, "votar")}${avisosVotarCuad(d)}</div>
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/dafo/${d.id}/5">Ir a priorizar →</a></div>`;
  }
  // Avisos de los factores del cuadrante que se está votando
  const avisosVotarCuad = d => L.avisosDe(d, "votar").filter(x => x.factor && (d.factores.find(f => f.id === x.factor) || {}).tipo === cuadVotar).map(avisoHtml).join("");
  function renderHerramienta(d, k) {
    const H = HERRAMIENTAS[k];
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/dafo", modoEjemplo ? "Ejemplos" : "Mis DAFO")}${pasosHtml(d, 0)}</div>
      <div class="wiz-titulo"><span class="wiz-paso">Trabajo en equipo${lleno(nombreDafo(d)) ? " · " + esc(L.corto(nombreDafo(d), 60)) : ""}</span><h1 class="page-title">${H.titulo}</h1><p class="page-lead">${H.sub}</p></div>
      ${k === "ideas" ? herrIdeas(d) : herrVotar(d)}
      <div class="wiz-nav no-print"><a class="btn" href="#/dafo/${d.id}/2">← Equipo y fuentes</a><a class="btn" href="#/dafo/${d.id}/${k === "ideas" ? "votar" : "ideas"}">${k === "ideas" ? "Votar la importancia" : "Lluvia de ideas"} →</a></div>`;
  }

  // ---------- Vista por bloques ACSA (paso 3) ----------
  const KEY_VISTA_INT = "dafo-vista-interno";
  function acsaHtml(d) {
    return `<div class="acsa">${L.porBloquesAcsa(d).map(b => `<section class="acsa-b${!b.F.length && !b.D.length ? " acsa-b--vacio" : ""}"><h3 class="sub-h">${esc(b.nom)} <span class="badge q-b q-F">F ${b.F.length}</span><span class="badge q-b q-D">D ${b.D.length}</span></h3>
      ${b.F.length || b.D.length ? `<ul class="acsa-l">${[...b.F, ...b.D].map(f => `<li>${codBadge(f)} ${esc(f.texto)} ${pesoBadge(f)}</li>`).join("")}</ul>` : `<p class="field-sub">Ningún factor. Si vais a la acreditación, revisad este bloque del manual.</p>`}</section>`).join("")}</div>
      <p class="field-sub">Cada factor va al bloque que le corresponde por su área; se puede cambiar en «Área, dato y fuente» de cada fortaleza o debilidad.</p>`;
  }

  // ---------- Ediciones y revisión anual (paso 8) ----------
  const anteriorDe = d => d.anteriorId ? (datos.dafos.find(x => x.id === d.anteriorId) || null) : null;
  function edicionesHtml(d) {
    const ant = anteriorDe(d), sig = datos.dafos.find(x => x.anteriorId === d.id), rev = L.revisionProxima(d, hoyIso());
    const cambio = { sube: "↑", baja: "↓", igual: "=", sin: "–" };
    let h = `<p>Edición <b>${esc(d.edicion || "00")}</b>${lleno(d.proxRevision) ? ` · Próxima revisión: <b>${esc(fmtFecha(d.proxRevision))}</b>${rev ? (rev.vencida ? ` <span class="badge sem--no">Pasada</span>` : ` <span class="badge">En ${plural(rev.dias, "día", "días")}</span>`) : ""}` : ""}</p>
      <p class="field-sub">Cada año (con el nuevo acuerdo de gestión, o antes si algo cambia), crea una <b>edición nueva</b>: es una copia que actualizaréis y que la app compara con esta, factor a factor y estrategia a estrategia.</p>`;
    if (sig) h += `<div class="note">ℹ Ya existe la edición ${esc(sig.edicion)}. <a href="#/dafo/${sig.id}/8">Ir a ella</a></div>`;
    else h += `<div class="toolbar no-print"><button class="btn" data-act="ed-nueva">Crear la edición ${String((parseInt(d.edicion, 10) || 0) + 1).padStart(2, "0")}</button></div>`;
    if (d.anteriorId && !ant) h += `<p class="field-sub">La edición anterior no está en este dispositivo.</p>`;
    if (ant) {
      const C2 = L.compararEdiciones(ant, d), cu = C2.cuenta;
      const cambian = C2.mantienen.filter(x => x.cambio === "sube" || x.cambio === "baja");
      h += `<h3 class="sub-h">Comparación con la edición ${esc(ant.edicion || "00")} <a class="field-sub" href="#/dafo/${ant.id}/8">(abrirla)</a></h3>
        <div class="res-linea"><span class="badge">${cu.mantienen} se mantienen</span><span class="badge">${cu.suben} pesan más</span><span class="badge">${cu.bajan} pesan menos</span><span class="badge sem--ok">${cu.nuevos} nuevos</span><span class="badge">${cu.desaparecen} desaparecen</span>${C2.orientacion.antes || C2.orientacion.ahora ? `<span class="badge">Orientación: ${C2.orientacion.antes || "—"} → ${C2.orientacion.ahora || "—"}</span>` : ""}</div>
        ${C2.nuevos.length || C2.desaparecen.length || cambian.length ? `<div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Cód.</th><th>Factor</th><th>Cambio</th></tr></thead><tbody>
          ${C2.nuevos.map(f => `<tr><td>${codBadge(f)}</td><td>${esc(f.texto)}</td><td><b>Nuevo</b></td></tr>`).join("")}
          ${C2.desaparecen.map(f => `<tr><td>${codBadge(f)}</td><td>${esc(f.texto)}</td><td>Desaparece</td></tr>`).join("")}
          ${cambian.map(x => `<tr><td>${codBadge(x.f)}</td><td>${esc(x.f.texto)}</td><td>${cambio[x.cambio]} peso ${x.antes} → ${x.ahora}</td></tr>`).join("")}</tbody></table></div>` : ""}
        ${C2.estrategias.length ? `<h3 class="sub-h">Cómo acabaron las estrategias de la edición ${esc(ant.edicion || "00")}</h3><ul class="nota-l">${C2.estrategias.map(x => `<li class="${x.estado === "cumplida" ? "ok" : x.estado === "sinlograr" || x.estado === "pendiente" ? "no" : ""}"><span>${x.estado === "cumplida" ? "✓" : x.estado === "sinlograr" || x.estado === "pendiente" ? "✕" : "·"}</span><span><b>${L.codigoEst(x.e)}</b> ${esc(x.e.texto)} · <i>${esc(L.ESTADOS_EST[x.estado])}</i></span></li>`).join("")}</ul>` : ""}`;
    }
    return h;
  }

  // ---------- Paso 7 · Estrategias CAME ----------
  const qDeCame = t => L.CAME[t].sobre;                  // color de la estrategia = el del cuadrante sobre el que actúa
  const cameBadge = e => `<span class="badge q-b q-${qDeCame(e.tipo)}">${L.CAME[e.tipo].nom}</span>`;
  const estCod = e => `<span class="fx-cod fx-cod--est">${L.codigoEst(e)}</span>`;
  function estadoEst(e) {
    const z = L.zonaEstrategia(e), el = L.esElegida(e);
    return `${z ? `<span class="badge zona-est zona-est--${z}" title="${esc(L.ZONAS_EST[z].que)}">${L.ZONAS_EST[z].nom}</span>` : ""}${e.elegida ? `<span class="badge${el ? " badge--prio" : ""}">${el ? "Elegida a mano" : "Descartada a mano"}</span>` : el ? `<span class="badge badge--prio">Elegida</span>` : `<span class="badge badge--fuera">No elegida</span>`}`;
  }
  const avisosEst = (d, n, id) => L.avisosDe(d, n).filter(x => x.estrategia === id && !x.accion).map(avisoHtml).join("");
  const avisosAcc = (d, id) => L.avisosDe(d, 8).filter(x => x.accion === id).map(avisoHtml).join("");
  const be = (e, f) => `data-es="${e.id}" data-f="${f}"`;
  function seg3(e, k) {
    const v = L.entero1a5(e[k]), T = k === "impacto" ? L.IMPACTO : L.VIABILIDAD;
    return `<div class="seg seg--5" role="group" aria-label="${k === "impacto" ? "Impacto" : "Viabilidad"} de ${L.codigoEst(e)}">${[1, 2, 3].map(i => `<button type="button" class="${v === i ? "active" : ""}" data-act="es-punt" data-id="${e.id}" data-f="${k}" data-v="${i}" title="${esc(T[i - 1])}" aria-pressed="${v === i}">${i}</button>`).join("")}</div>`;
  }
  function estrategiaCard(d, e) {
    const F = L.factoresDe(d, e), m = L.prioridad(d), btn = (v, t) => `<button type="button" class="pf-btn${(e.elegida || "") === v ? " on" : ""}" data-act="es-elegir" data-id="${e.id}" data-v="${v}">${t}</button>`;
    const candidatos = d.factores.filter(f => lleno(f.texto) && (L.esPrio(m, f) || e.factores.includes(f.id)));
    return `<div class="pf est q-${qDeCame(e.tipo)}${L.esElegida(e) ? " pf--on" : ""}" data-eid="${e.id}">
      <div class="pf-cab">${estCod(e)}${cameBadge(e)}<span class="pf-badges" data-zestado="${e.id}">${estadoEst(e)}</span>
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="es-del" data-id="${e.id}">Quitar</button></span></div>
      <div class="seg seg--mini est-tipo no-print" role="group" aria-label="Tipo de estrategia">${L.TIPOS_CAME.map(k => `<button type="button" class="${e.tipo === k ? "active" : ""}" data-act="es-tipo" data-id="${e.id}" data-v="${k}" title="${esc(L.CAME[k].que)}">${L.CAME[k].nom}</button>`).join("")}</div>
      ${campo(e, "texto", "", { bind: be(e, "texto"), area: true, aria: "Texto de " + L.codigoEst(e), ph: "p. ej. Circuito de conciliación de la medicación al alta con la enfermera de enlace del hospital" })}
      <details class="fx-mas"><summary>Factores en los que se apoya <span class="fx-res">${F.length ? F.map(L.codigo).join(", ") : "ninguno"}</span></summary>
        <div class="quick">${candidatos.map(f => `<button type="button" class="chip q-chip q-${f.tipo}${e.factores.includes(f.id) ? " chip--on" : ""}" data-act="es-fac" data-id="${e.id}" data-fx="${f.id}" title="${esc(f.texto)}" aria-pressed="${e.factores.includes(f.id)}">${L.codigo(f)}</button>`).join("")}</div>
        <ul class="est-facs">${F.map(f => `<li>${codBadge(f)} ${esc(f.texto)}</li>`).join("")}</ul></details>
      <div class="fx-punt"><div class="fx-p"><span class="fx-pl">Impacto</span><span data-zseg="${e.id}-impacto">${seg3(e, "impacto")}</span></div><div class="fx-p"><span class="fx-pl">Viabilidad</span><span data-zseg="${e.id}-viabilidad">${seg3(e, "viabilidad")}</span></div></div>
      <div class="pf-acc no-print">${btn("", "Según impacto y viabilidad")}${btn("si", "Sí, la elegimos")}${btn("no", "No")}</div>
      ${e.elegida || (L.esElegida(e) && L.entero1a5(e.viabilidad) === 1) ? campo(e, "motivo", "Motivo", { bind: be(e, "motivo"), area: true, ph: e.elegida === "no" ? "p. ej. Se incluye en otra estrategia" : "p. ej. La dirección del Distrito la apoya y aporta los recursos" }) : ""}
      <div data-zest="${e.id}">${avisosEst(d, 7, e.id)}</div>
    </div>`;
  }
  // Matriz impacto × viabilidad con los códigos de las estrategias
  function matrizEstHtml(d) {
    const L_ = d.estrategias.filter(e => lleno(e.texto) && L.zonaEstrategia(e));
    if (!L_.length) return `<p class="field-sub">Puntúa el impacto y la viabilidad de las estrategias para verlas aquí.</p>`;
    const celda = (i, v) => { const z = L.zonaEstrategia({ impacto: i, viabilidad: v }), l = L_.filter(e => Number(e.impacto) === i && Number(e.viabilidad) === v);
      return `<div class="iv-c zona-est--${z}" title="${esc(L.ZONAS_EST[z].nom)}">${l.map(e => `<span class="iv-e${L.esElegida(e) ? " iv-e--on" : ""}" title="${esc(e.texto)}">${L.codigoEst(e)}</span>`).join("")}</div>`; };
    return `<div class="iv"><span class="iv-eje iv-eje--i">Impacto</span><div class="iv-m">${[3, 2, 1].map(i => `<span class="iv-n">${i}</span>${[1, 2, 3].map(v => celda(i, v)).join("")}`).join("")}<span></span>${[1, 2, 3].map(v => `<span class="iv-n">${v}</span>`).join("")}</div><span class="iv-eje iv-eje--v">Viabilidad</span></div>
      <div class="leyenda">${Object.keys(L.ZONAS_EST).map(z => `<span><i class="zona-est--${z}"></i>${L.ZONAS_EST[z].nom}</span>`).join("")}<span><b class="iv-e iv-e--on">E1</b> elegida</span></div>`;
  }
  // Candidatos para otras apps
  function candidatoFila(d, f) {
    const c = f.candidato, sug = L.sugerirDestino(f);
    return `<div class="pf q-${f.tipo}" data-fid="${f.id}">
      <div class="pf-cab">${codBadge(f)}<span class="pf-txt"><b>${esc(f.texto)}</b>${sug && !c.destino ? `<span>La app sugiere: <b>${L.DESTINOS[sug].nom}</b></span>` : ""}</span></div>
      <div class="pf-acc no-print">${[["", "No"], ["amfe", "AMFE"], ["mapa", "Mapa de Riesgos"], ["auditoria", "Auditoría"]].map(([v, t]) => `<button type="button" class="pf-btn${(c.destino || "") === v ? " on" : ""}" data-act="cand" data-id="${f.id}" data-v="${v}" title="${v ? esc(L.DESTINOS[v].que) : "No necesita un análisis aparte"}">${t}</button>`).join("")}</div>
      ${c.destino ? `<div class="dos-col">${campo(f, "candidato.proceso", "Proceso o práctica que se analizaría", { bind: bx(f, "candidato.proceso"), ph: "p. ej. Conciliación de la medicación al alta hospitalaria" })}${campo(f, "candidato.motivo", "Por qué", { bind: bx(f, "candidato.motivo"), ph: "p. ej. Riesgo directo para el paciente" })}</div>
        <div class="toolbar no-print"><button class="btn btn--sm" data-act="llevar" data-id="${f.id}">Llevar a ${L.DESTINOS[c.destino].nom} ↗</button></div>` : ""}
    </div>`;
  }
  function paso7(d) {
    const r = L.resultadoCruces(d), prop = L.estrategiasPropuestas(d), ES = L.ordenarEstrategias(d.estrategias);
    const cand = d.factores.filter(f => lleno(f.texto) && ["D", "A"].includes(f.tipo) && (L.esPrio(L.prioridad(d), f) || f.candidato.destino));
    return `
      ${idea("De los cruces salen las estrategias: <b>corregir</b> debilidades, <b>afrontar</b> amenazas, <b>mantener</b> fortalezas y <b>explotar</b> oportunidades. Después se eligen <b>pocas y viables</b>.")}
      ${facil(`<div class="table-wrap"><table class="mini"><tr><th>Estrategia</th><th>Sale de</th><th>Para qué</th></tr>${L.TIPOS_CAME.map(k => `<tr><td><b>${L.CAME[k].nom}</b></td><td>${L.CAME[k].bloque}</td><td>${esc(L.CAME[k].que)}</td></tr>`).join("")}</table></div>
        <p>Puntúa cada estrategia de 1 a 3 en <b>impacto</b> (¿cuánto ayuda a la finalidad del análisis?) y <b>viabilidad</b> (¿se puede hacer con lo que hay?). La app propone elegir las de «Hazla ya» y «Planifícala»; el equipo decide, y si cambia la propuesta, escribe el motivo.</p>
        ${trampa("Un plan con 20 estrategias no se cumple. Quedaos con 6 u 8 como mucho, y comprobad que la debilidad y la amenaza que más pesan tienen respuesta.")}`)}
      ${r.orientacion ? practica(`<b>Orientación ${esc(L.BLOQUES[r.orientacion].nom.toLowerCase())} (${r.orientacion}).</b> ${esc(L.BLOQUES[r.orientacion].texto)}`) : ""}
      <div class="toolbar no-print">${prop.length ? `<button class="btn btn--primary" data-act="es-proponer">✎ Proponer ${plural(prop.length, "estrategia", "estrategias")} ${r.fuertes.length ? "de los cruces fuertes" : "de los factores prioritarios"}</button>` : ""}<button class="btn${prop.length ? "" : " btn--primary"}" data-act="es-add">+ Añadir estrategia</button><button class="btn" data-act="excel">⬇ Excel</button></div>
      <div data-zona="avisos">${avisosGenerales(d, 7)}</div>
      <div class="pf-lista">${ES.map(e => estrategiaCard(d, e)).join("") || `<p class="placeholder-box">Aún no hay estrategias.${prop.length ? " Pulsa «Proponer» y revisa lo que sale." : ""}</p>`}</div>
      <h2 class="sec-t">Impacto × viabilidad</h2>
      <div class="card" data-zona="matrizest">${matrizEstHtml(d)}</div>
      <h2 class="sec-t">¿Algún factor merece un análisis propio?</h2>
      <p class="page-lead">Una debilidad o amenaza de un <b>proceso concreto con riesgo</b> para el paciente pide un <b>AMFE</b>; un proceso completo, un <b>Mapa de Riesgos</b>; una <b>práctica que hay que medir</b>, una <b>auditoría</b>. Marcadlo aquí y llevadlo a la app que toca.</p>
      <div class="pf-lista">${cand.map(f => candidatoFila(d, f)).join("") || `<p class="placeholder-box">Prioriza primero las debilidades y amenazas (paso 5).</p>`}</div>`;
  }

  // ---------- Paso 8 · Plan de acción y seguimiento ----------
  let indImportados = null, indPara = null;   // indicadores traídos de la app Indicadores y la acción que los espera
  const ba = (x, f) => `data-ac="${x.id}" data-f="${f}"`;
  const fzBadge = texto => { const z = L.fuerzaMedida(texto); return z ? `<span class="badge fz fz--${z}" title="${esc(L.FUERZAS[z].que)}">${L.FUERZAS[z].nom}</span>` : ""; };
  function semHtml(x) {
    const u = L.ultimaMedida(x); if (!u) return "";
    const s = L.semaforo(x.indicador.estandar, u.valor);
    return `<span class="badge sem sem--${s || "sin"}">Último valor: ${esc(u.valor)}${u.fecha ? " (" + esc(fmtFecha(u.fecha)) + ")" : ""}${s === "ok" ? " · cumple" : s === "no" ? " · no cumple" : ""}</span>`;
  }
  function smartHtml(o) {
    const s = L.smartAuto(o);
    return [["especifico", "Concreto"], ["medible", "Con cifra"], ["plazo", "Con fecha"]].map(([k, t]) => `<span class="badge${s[k] ? " sem--ok" : ""}">${s[k] ? "✓" : "·"} ${t}</span>`).join("");
  }
  function zonaInd(x) {
    if (indPara !== x.id || !indImportados) return "";
    return `<div class="field no-print"><div class="field-head"><label class="field-label">Elige un indicador de la app Indicadores</label></div><div class="input-wrap"><select class="txt-in" data-act-sel="usar-ind" data-ac-ind="${x.id}"><option value="">— ${plural(indImportados.length, "indicador", "indicadores")} —</option>${indImportados.map((y, i) => `<option value="${i}">${esc(L.corto(y.nombre, 90))}</option>`).join("")}</select></div></div>`;
  }
  function accionCard(d, e, x, i) {
    return `<div class="acc-card" data-acid="${x.id}">
      <div class="sub-cab"><span class="eq-n">${i + 1}</span><b>${L.codigoEst(e)}.${i + 1}</b><span data-zfz="${x.id}">${fzBadge(x.que)}</span><span data-zsem="${x.id}">${semHtml(x)}</span>
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="ac-del" data-id="${x.id}">Quitar</button></span></div>
      ${campo(x, "que", "Qué se va a hacer", { bind: ba(x, "que"), area: true, ph: "p. ej. Circuito de aviso de altas con la enfermera de enlace del hospital", help: "Concreta y verificable. Las acciones que cambian el sistema (un circuito, una alerta, una agenda distinta) son más fuertes que formar o recordar." })}
      <div class="dos-col">
        ${campo(x, "quien", "Responsable", { bind: ba(x, "quien"), ph: "p. ej. Coordinación de cuidados", help: "Un cargo o una persona concreta, no «todos» ni «el equipo»." })}
        ${campo(x, "recursos", "Recursos", { bind: ba(x, "recursos"), opt: true, ph: "p. ej. Sin coste: tiempo de enfermería" })}
      </div>
      <div class="dos-col">
        ${campo(x, "inicio", "Inicio", { bind: ba(x, "inicio"), tipo: "date", opt: true })}
        ${campo(x, "fin", "Fecha de fin", { bind: ba(x, "fin"), tipo: "date" })}
      </div>
      ${campo(x, "como", "Cómo", { bind: ba(x, "como"), area: true, opt: true, ph: "p. ej. Listado diario de altas y cita en los 7 días siguientes" })}
      <div class="acc-ind">
        <div class="sub-cab"><b>Indicador</b><span class="sub-acc no-print"><button type="button" class="link-btn" data-act="ind-traer" data-id="${x.id}">Traer de Indicadores</button></span></div>
        <div data-zind="${x.id}">${zonaInd(x)}</div>
        ${campo(x, "indicador.nombre", "Nombre", { bind: ba(x, "indicador.nombre"), ph: "p. ej. % de altas con la medicación conciliada en 7 días" })}
        <div class="dos-col">
          ${campo(x, "indicador.formula", "Fórmula", { bind: ba(x, "indicador.formula"), opt: true, ph: "Numerador / denominador × 100" })}
          ${campo(x, "indicador.estandar", "Estándar", { bind: ba(x, "indicador.estandar"), ph: "p. ej. ≥ 80 %", help: "El valor que consideraréis bueno. Escríbelo con ≥ o ≤ (o «3 de 3») y la app dirá si cada medida lo cumple." })}
        </div>
        ${campo(x, "indicador.fuente", "Fuente de datos", { bind: ba(x, "indicador.fuente"), opt: true, ph: "p. ej. Historia de salud digital" })}
      </div>
      <div class="field"><div class="field-head"><label class="field-label">Estado</label></div><div class="seg seg--mini" role="group" aria-label="Estado">${Object.entries(L.ESTADOS).map(([k, t]) => `<button type="button" class="${x.estado === k ? "active" : ""}" data-act="ac-estado" data-id="${x.id}" data-v="${k}">${t}</button>`).join("")}</div></div>
      <details class="fx-mas"${x.seguimiento.length ? " open" : ""}><summary>Seguimiento del indicador <span class="fx-res">${plural(x.seguimiento.length, "medida", "medidas")}</span></summary>
        ${x.seguimiento.map(mm => `<div class="persona persona--hist med">
          <input class="txt-in" type="date" data-me="${mm.id}" data-f="fecha" value="${esc(mm.fecha)}" aria-label="Fecha" />
          <input class="txt-in" data-me="${mm.id}" data-f="valor" value="${esc(mm.valor)}" placeholder="Valor" inputmode="decimal" autocomplete="off" aria-label="Valor" />
          <input class="txt-in" data-me="${mm.id}" data-f="nota" value="${esc(mm.nota)}" placeholder="Nota" autocomplete="off" aria-label="Nota" />
          <button type="button" class="icon-btn no-print" data-act="me-del" data-id="${mm.id}" aria-label="Quitar">✕</button></div>`).join("")}
        <button type="button" class="link-btn no-print" data-act="me-add" data-id="${x.id}">+ Añadir una medida</button></details>
      <div data-zac="${x.id}">${avisosAcc(d, x.id)}</div>
    </div>`;
  }
  function planCard(d, e) {
    return `<section class="plan q-${qDeCame(e.tipo)}">
      <h3 class="plan-t">${estCod(e)}${cameBadge(e)} <span>${esc(e.texto)}</span></h3>
      <div class="card">
        ${campo(e, "objetivo.texto", "Objetivo", { bind: be(e, "objetivo.texto"), area: true, ph: "p. ej. Que el 80 % de las altas tengan la medicación conciliada en 7 días", help: "Qué queréis conseguir, con una cifra y una fecha: específico, medible, alcanzable, relevante y con plazo (SMART)." })}
        <div class="dos-col">
          ${campo(e, "objetivo.meta", "Meta", { bind: be(e, "objetivo.meta"), opt: true, ph: "p. ej. ≥ 80 %" })}
          ${campo(e, "objetivo.fecha", "Fecha", { bind: be(e, "objetivo.fecha"), tipo: "date" })}
        </div>
        <div class="res-linea" data-zsmart="${e.id}">${smartHtml(e.objetivo)}</div>
        <div data-zest="${e.id}">${avisosEst(d, 8, e.id)}</div>
      </div>
      <div class="acc-lista">${e.acciones.map((x, i) => accionCard(d, e, x, i)).join("")}</div>
      <button class="btn btn--sm no-print" data-act="ac-add" data-id="${e.id}">+ Añadir acción a ${L.codigoEst(e)}</button>
    </section>`;
  }
  function personasHtml(d, k, titulo) {
    return `<div class="personas"><p class="personas-t">${titulo}</p>${d.control[k].map((x, i) => `<div class="persona">
      <input class="txt-in" data-cp="${k}" data-i="${i}" data-f="nombre" value="${esc(x.nombre)}" placeholder="Nombre (opcional)" autocomplete="off" />
      <input class="txt-in" data-cp="${k}" data-i="${i}" data-f="cargo" value="${esc(x.cargo)}" placeholder="Cargo" autocomplete="off" />
      <button type="button" class="icon-btn no-print" data-act="cp-del" data-k="${k}" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}
      <button type="button" class="link-btn no-print" data-act="cp-add" data-k="${k}">+ Añadir persona</button></div>`;
  }
  function controlHtml(d) {
    return `${personasHtml(d, "elaborado", "Elaborado por")}${personasHtml(d, "revisado", "Revisado por")}${personasHtml(d, "aprobado", "Aprobado por")}
      <div class="personas"><p class="personas-t">Histórico de revisiones</p>${d.control.historial.map((h, i) => `<div class="persona persona--hist">
        <input class="txt-in" data-ch="${i}" data-f="edicion" value="${esc(h.edicion)}" placeholder="Ed." autocomplete="off" />
        <input class="txt-in" type="date" data-ch="${i}" data-f="fecha" value="${esc(h.fecha)}" />
        <input class="txt-in" data-ch="${i}" data-f="cambio" value="${esc(h.cambio)}" placeholder="Qué cambia" autocomplete="off" />
        <button type="button" class="icon-btn no-print" data-act="ch-del" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}
        <button type="button" class="link-btn no-print" data-act="ch-add">+ Nueva edición</button></div>`;
  }
  function notaHtml(d) {
    const n = L.notaCalidad(d);
    return `<div class="nota nota--${n.nivel}"><b class="nota-n">${n.nota}<small>/${n.de}</small></b><div><b>Calidad del análisis</b><p>${esc(n.texto)}</p></div></div>
      <ul class="nota-l">${n.comprobaciones.map(c => `<li class="${c.ok ? "ok" : "no"}"><span>${c.ok ? "✓" : "✕"}</span><span>${esc(c.texto)}${c.ok ? "" : ` · <a href="#/dafo/${d.id}/${c.paso}">${esc(c.consejo)}</a>`}</span></li>`).join("")}</ul>`;
  }
  function paso8(d) {
    const EL = L.elegidas(d);
    return `
      ${idea("Cada estrategia elegida se convierte en un <b>objetivo</b> con cifra y fecha, y en <b>acciones</b> con responsable, plazo e <b>indicador</b>. Sin eso, el DAFO se queda en el cajón.")}
      ${facil(`<p>Un objetivo es <b>SMART</b> si es específico, medible, alcanzable, relevante y con plazo: «que el 80 % de las altas tengan la medicación conciliada en 7 días antes de diciembre de 2027», y no «mejorar la conciliación».</p>
        <p>Las acciones que <b>cambian el sistema</b> (un circuito, una alerta en la historia clínica, una agenda distinta) son más fuertes que las que dependen de la memoria (formar, recordar, sensibilizar).</p>
        <p>En <b>seguimiento</b>, apuntad el valor del indicador cada vez que lo midáis: la app dice si cumple el estándar.</p>`)}
      <div data-zona="avisos">${avisosGenerales(d, 8)}</div>
      ${EL.length ? EL.map(e => planCard(d, e)).join("") : `<div class="placeholder-box"><p>Aún no hay estrategias elegidas. <a href="#/dafo/${d.id}/7">Elígelas en el paso 7</a>.</p></div>`}
      <h2 class="sec-t">Cierre</h2>
      <div class="card">
        ${campo(d, "conclusiones", "Conclusiones", { area: true, rows: 4, ph: "Si las dejas vacías, el informe usa un texto propuesto con las cifras del análisis", extra: proponer("sug-concl", "✎ Proponer conclusiones con las cifras") })}
        ${campo(d, "proxRevision", "Próxima revisión del DAFO", { tipo: "date", help: "Lo habitual es cada año, con el nuevo acuerdo de gestión, o antes si cambia algo importante." })}
      </div>
      <h2 class="sec-t">Control del documento</h2>
      <div class="card">${controlHtml(d)}</div>
      <h2 class="sec-t">Ediciones y revisión anual</h2>
      <div class="card">${edicionesHtml(d)}</div>
      <h2 class="sec-t">Nota de calidad</h2>
      <div class="card" data-zona="nota">${notaHtml(d)}</div>
      <h2 class="sec-t">Documentos</h2>
      <div class="doc-botones">
        <div class="card"><h3 class="sub-h">Informe DAFO · CAME</h3><p class="field-sub">El documento completo: control, introducción, metodología y fuentes, análisis interno y externo, matrices, estrategias, plan de acción, seguimiento, conclusiones y anexos.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="doc-word" data-doc="informe">⬇ Word</button><button class="btn" data-act="doc-ver" data-doc="informe">Ver / PDF</button></div></div>
        <div class="card"><h3 class="sub-h">Resumen para la Dirección</h3><p class="field-sub">Una página: la matriz DAFO, la orientación y lo que se va a hacer, con su objetivo e indicador.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="doc-word" data-doc="resumen">⬇ Word</button><button class="btn" data-act="doc-ver" data-doc="resumen">Ver / PDF</button></div></div>
        <div class="card"><h3 class="sub-h">Lámina DAFO</h3><p class="field-sub">La matriz y las estrategias elegidas en una hoja apaisada, para la sesión o el tablón.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="doc-ver" data-doc="lamina">Ver / imprimir</button><button class="btn" data-act="doc-word" data-doc="lamina">⬇ Word</button></div></div>
        <div class="card"><h3 class="sub-h">Hoja de trabajo</h3><p class="field-sub">Para las sesiones en papel: lluvia de ideas por cuadrante, hoja de votación de la importancia y plantilla de la matriz cruzada.</p>
          <div class="toolbar"><button class="btn" data-act="doc-word" data-doc="hoja">⬇ Word</button><button class="btn" data-act="doc-ver" data-doc="hoja">Ver / PDF</button></div></div>
        <div class="card"><h3 class="sub-h">Análisis y Excel</h3><p class="field-sub">Todos los factores, las matrices y el plan para imprimir, y el libro de Excel con todas las hojas.</p>
          <div class="toolbar"><button class="btn" data-act="informe">Ver análisis / PDF</button><button class="btn" data-act="excel">⬇ Excel</button></div></div>
      </div>`;
  }
  const RENDER = { 1: paso1, 2: paso2, 3: paso3, 4: paso4, 5: paso5, 6: paso6, 7: paso7, 8: paso8 };

  // ---------- Documentos: bloques → HTML (vista previa, imprimir y PDF) y → Word ----------
  function bloquesHtml(bloques) {
    const celda = (c, cab) => { const o = c !== null && typeof c === "object" ? c : { texto: c }; const st = o.fondo ? ` style="background:#${o.fondo}"` : ""; const cl = [o.centro ? "c" : "", o.negrita ? "b" : ""].filter(Boolean).join(" "); return `<${cab ? "th" : "td"}${cl ? ` class="${cl}"` : ""}${st}>${escMl(o.texto)}</${cab ? "th" : "td"}>`; };
    return bloques.map(b => {
      if (b.t === "portada") return `<div class="doc-portada"><h1>${esc(b.titulo)}</h1>${b.sub ? `<p class="doc-sub">${esc(b.sub)}</p>` : ""}${(b.extra || []).map(x => `<p>${esc(x)}</p>`).join("")}</div>`;
      if (b.t === "h1") return `<h2 class="doc-h1">${esc(b.texto)}</h2>`;
      if (b.t === "h2") return `<h3 class="doc-h2">${esc(b.texto)}</h3>`;
      if (b.t === "p") return `<p class="doc-p${b.estilo === "nota" ? " doc-nota" : ""}">${b.runs ? b.runs.map(r => r.negrita ? `<b>${escMl(r.texto)}</b>` : escMl(r.texto)).join("") : escMl(b.texto)}</p>`;
      if (b.t === "lista") return `<ul class="doc-ul">${b.items.map(i => `<li>${esc(typeof i === "string" ? i : i.texto)}</li>`).join("")}</ul>`;
      if (b.t === "salto") return `<div class="doc-salto"></div>`;
      if (b.t === "tabla") {
        const suma = (b.anchos || []).reduce((a, x) => a + x, 0);
        const cols = b.anchos ? `<colgroup>${b.anchos.map(w => `<col style="width:${(w / suma * 100).toFixed(1)}%">`).join("")}</colgroup>` : "";
        return `<div class="table-wrap"><table class="doc-t${b.fuente && b.fuente < 9 ? " doc-t--peq" : ""}">${cols}${b.cab && !b.sinCab ? `<thead><tr>${b.cab.map(c => celda(c, true)).join("")}</tr></thead>` : ""}<tbody>${b.filas.map(f => `<tr>${f.map(c => celda(c, false)).join("")}</tr>`).join("")}</tbody></table></div>`;
      }
      return "";
    }).join("");
  }
  const DOCS = { informe: (d, f) => L.documentoInforme(d, f, anteriorDe(d)), resumen: L.documentoResumen, lamina: L.documentoLamina, hoja: L.documentoHoja };
  function renderDoc(d, cual) {
    const doc = DOCS[cual](d, new Date().toLocaleDateString("es-ES"));
    view.innerHTML = `<div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><span class="informe-acc"><button class="btn" data-act="doc-word" data-doc="${cual}">⬇ Word</button><button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></span></div>
      ${cual === "lamina" ? `<style>@page { size: A4 landscape; margin: 12mm; }</style>` : ""}
      <div class="doc-prev doc-prev--informe${cual === "lamina" ? " doc-prev--lamina" : ""}">${bloquesHtml(doc.bloques)}</div>${cual === "lamina" ? "" : informePie()}`;
  }
  function descargarWord(d, cual) {
    try {
      const doc = DOCS[cual](d, new Date().toLocaleDateString("es-ES"));
      const bytes = window.Docx.construirDocx(Object.assign({ pie: doc.titulo + " · Generado con la app DAFO · CAME" }, doc));
      const base = ({ resumen: "DAFO Resumen ", lamina: "DAFO Lamina ", hoja: "DAFO Hoja de trabajo " }[cual] || "DAFO Informe ") + (nombreDafo(d) || "").slice(0, 60);
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), `${base.replace(/[\\/:*?"<>|%]/g, "").trim()} ${fechaArchivo()}.docx`, "Word descargado. Ábrelo con Word, Pages o LibreOffice y ajústalo a tu gusto.");
    } catch (e) { toast("No se ha podido crear el Word.", 4000); }
  }

  // ---------- Traer de AMFE ----------
  let amfeLista = null;   // AMFE leídos de la app AMFE (de este navegador o de su copia)
  function amfeHtml(d) {
    return `<div class="card pegar no-print">
      <h3 class="sub-h">Traer de AMFE</h3>
      <p class="field-sub">Cada AMFE hecho en la app AMFE dice mucho de un proceso: si tiene fallos prioritarios sin acción, es una <b>debilidad</b>; si sus riesgos ya están controlados, una <b>fortaleza</b>. La app propone el factor con su dato; revísalo después.</p>
      ${amfeLista.length ? `<div class="pf-lista">${amfeLista.map((x, i) => { const ya = d.factores.find(f => f.origen === "amfe:" + x.id); return `<div class="pf q-${x.factor.tipo}">
        <div class="pf-cab"><span class="fx-cod q-${x.factor.tipo}">${x.factor.tipo}</span><span class="pf-txt"><b>${esc(x.factor.texto)}</b><span>${esc(x.factor.evidencia)}</span></span></div>
        <div class="pf-acc">${ya ? `<span class="badge">✓ Ya es ${L.codigo(ya)}</span>` : `<button type="button" class="btn btn--sm btn--primary" data-act="amfe-add" data-i="${i}">Añadir como ${Q[x.factor.tipo].uno}</button>`}</div></div>`; }).join("")}</div>` : `<p class="placeholder-box">Esa copia no tiene ningún AMFE.</p>`}
      <div class="toolbar"><button class="btn" data-act="amfe-copia">Cargar la copia de AMFE (.json)</button><button class="btn" data-act="amfe-cerrar">Cerrar</button></div>
    </div>`;
  }

  // ---------- Matriz DAFO (2 × 2) ----------
  // soloPrio: con la entrega 2, los prioritarios destacan y el resto se ve atenuado
  function celdaMatriz(d, m, t, pm) {
    const l = m[t];
    return `<div class="dm-c q-${t}"><h3 class="dm-t"><span class="cuad-letra">${t}</span>${Q[t].nom}</h3>
      ${l.length ? `<ol class="dm-l">${l.map(f => `<li class="${pm && !L.esPrio(pm, f) ? "dm-fuera" : ""}"><span class="dm-cod">${L.codigo(f)}</span><span>${esc(f.texto)}</span>${L.peso(f) ? `<span class="dm-peso">${L.peso(f)}</span>` : ""}</li>`).join("")}</ol>` : `<p class="dm-vacio">Sin ${Q[t].nom.toLowerCase()}</p>`}</div>`;
  }
  function matrizHtml(d, conPrio = ENTREGA >= 2) {
    const m = L.matrizDafo(d), pm = conPrio ? L.prioridad(d) : null;
    return `<div class="dafo-m" role="table" aria-label="Matriz DAFO">
      <span></span><span class="dm-h">A favor</span><span class="dm-h">En contra</span>
      <span class="dm-lado">Interno</span>${celdaMatriz(d, m, "F", pm)}${celdaMatriz(d, m, "D", pm)}
      <span class="dm-lado">Externo</span>${celdaMatriz(d, m, "O", pm)}${celdaMatriz(d, m, "A", pm)}
    </div>
    <p class="field-sub">El número de cada factor es su peso: la importancia en los internos (1–5) y la importancia × probabilidad en los externos (1–25).${pm ? " En gris, los que no son prioritarios." : ""}</p>`;
  }

  // ---------- Vista imprimible: la matriz y los factores ----------
  function renderInforme(d) {
    const fila = (k, v) => lleno(v) ? `<tr><th>${k}</th><td>${escMl(v)}</td></tr>` : "";
    const r = L.resumen(d), fin = L.FINALIDADES[d.finalidad], pm = L.prioridad(d), rc = L.resultadoCruces(d);
    const tablaQ = t => {
      const l = L.delTipo(d, t).filter(f => lleno(f.texto)), ext = !L.esInterno(t);
      if (!l.length) return "";
      return `<h3 class="sub-h">${Q[t].nom}</h3><div class="table-wrap"><table class="mini tabla-riesgos tabla-fx"><thead><tr><th>Cód.</th><th>Factor</th><th>${ext ? "Ámbito" : "Área"}</th><th>Dato y fuente</th><th>Imp.</th>${ext ? "<th>Prob.</th><th>Peso</th>" : ""}<th>Prior.</th></tr></thead><tbody>
        ${l.map(f => { const fu = L.fuenteDe(d, f), e = pm[f.id]; return `<tr><td><b>${L.codigo(f)}</b></td><td><b>${esc(f.texto)}</b>${e.por === "manual" ? `<br><small>${e.prio ? "Añadido" : "Quitado"} a mano: ${esc(f.motivo)}</small>` : ""}</td><td>${esc(L.nombreArea(f))}</td><td>${esc(f.evidencia)}${fu ? `<br><small>${esc(L.nombreFuente(fu))}</small>` : ""}</td><td>${esc(f.importancia)}</td>${ext ? `<td>${esc(f.probabilidad)}</td><td><b>${L.peso(f) || ""}</b></td>` : ""}<td>${e.prio ? "<b>Sí</b>" : "No"}</td></tr>`; }).join("")}
      </tbody></table></div>`;
    };
    view.innerHTML = `${informeBar()}${informeCab("DAFO" + (lleno(nombreDafo(d)) ? " · " + nombreDafo(d) : ""), fin ? fin.nom : "")}
      <div class="ficha">
        <div class="ficha-cab"><span class="wiz-paso">Análisis DAFO</span><h2 class="ficha-nombre">${esc(d.objeto || nombreDafo(d) || "Sin nombre")}</h2></div>
        <table class="ficha-t">${fila("Tipo", L.TIPOS_OBJETO[d.tipoObjeto])}${fila("Finalidad", fin ? fin.nom : "")}${fila("Horizonte", d.horizonte)}${fila("Misión", d.mision)}${fila("Visión", d.vision)}${fila("Qué queda dentro", d.incluye)}${fila("Qué queda fuera", d.excluye)}${fila("Responsable", d.responsable)}${fila("Fecha", d.fecha)}
          <tr><th>Resumen</th><td>${L.TIPOS.map(t => `${r[t]} ${Q[t].nom.toLowerCase()}`).join(" · ")} · ${r.conEvidencia} de ${r.n} con su dato · ${plural(r.fuentes, "fuente", "fuentes")} · los ${L.nPrioridad(d)} de más peso de cada cuadrante, prioritarios${rc.orientacion ? ` · orientación ${L.BLOQUES[rc.orientacion].nom.toLowerCase()} (${rc.orientacion})` : ""}</td></tr></table>
      </div>
      <h2 class="sec-t">Matriz DAFO</h2>
      ${matrizHtml(d, true)}
      ${rc.total ? `<h2 class="sec-t">Matriz cruzada</h2>${tablaCruce(d, rc, true)}${resultadoHtml(d)}` : ""}
      ${d.fuentes.length ? `<h2 class="sec-t">Fuentes de información</h2><div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Nº</th><th>Fuente</th><th>Tipo</th><th>Fecha</th><th>Qué dice</th></tr></thead><tbody>${d.fuentes.map((x, i) => `<tr><td>${i + 1}</td><td><b>${esc(L.nombreFuente(x))}</b></td><td>${esc(L.FUENTES_TIPO[x.tipo] ? L.FUENTES_TIPO[x.tipo].nom : "")}</td><td>${esc(x.fecha)}</td><td>${esc(x.nota)}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <h2 class="sec-t">Análisis interno</h2>${tablaQ("F")}${tablaQ("D")}
      <h2 class="sec-t">Análisis externo</h2>${tablaQ("O")}${tablaQ("A")}
      <h2 class="sec-t">Escalas</h2>
      <div class="table-wrap"><table class="mini facil-tabla tabla-escalas"><tr><th></th><th>Importancia</th><th>Probabilidad (solo externos)</th></tr>${[0, 1, 2, 3, 4].map(i => `<tr><td><b>${i + 1}</b></td><td>${esc(L.ESC_IMP[i])}</td><td>${esc(L.ESC_PROB[i])}</td></tr>`).join("")}</table></div>
      <p class="field-sub">Matriz cruzada: 0 sin relación · 1 débil · 2 media · 3 fuerte.</p>
      ${lleno(d.notas) ? `<p class="field-sub">${escMl(d.notas)}</p>` : ""}
      ${informePie()}`;
  }

  // Refresca lo que depende de lo escrito sin repintar los campos (no se pierde el foco)
  function refrescar(idFactor) {
    const d = actual; if (!d) return;
    const n = pasoActual;
    const Z = {
      pasos: () => pasosInner(d, n), avisos: () => avisosGenerales(d, n) + (n === "votar" ? avisosVotarCuad(d) : ""), consejo: () => consejoHtml(d),
      nfu: () => String(d.fuentes.length), matriz: () => matrizHtml(d, n >= 5 || ENTREGA >= 2),
      progcruce: () => progCruce(L.resultadoCruces(d)), resultado: () => resultadoHtml(d),
      matrizest: () => matrizEstHtml(d), nota: () => notaHtml(d),
      neq: () => String(d.equipo.length), nses: () => String(d.sesiones.length), ranking: () => rankingHtml(d, cuadIdeas)
    };
    if (n === "votar") $$("[data-zvm]").forEach(el => { const f = d.factores.find(x => x.id === el.dataset.zvm); if (f) el.innerHTML = celdaMedia(f); });
    $$("[data-zest]").forEach(el => { el.innerHTML = avisosEst(d, n, el.dataset.zest); });
    $$("[data-zac]").forEach(el => { el.innerHTML = avisosAcc(d, el.dataset.zac); });
    $$("[data-zestado]").forEach(el => { const e = d.estrategias.find(x => x.id === el.dataset.zestado); if (e) el.innerHTML = estadoEst(e); });
    $$("[data-zsmart]").forEach(el => { const e = d.estrategias.find(x => x.id === el.dataset.zsmart); if (e) el.innerHTML = smartHtml(e.objetivo); });
    $$("[data-zfz]").forEach(el => { const r = buscaAccion(d, el.dataset.zfz); if (r) el.innerHTML = fzBadge(r.x.que); });
    $$("[data-zsem]").forEach(el => { const r = buscaAccion(d, el.dataset.zsem); if (r) el.innerHTML = semHtml(r.x); });
    if (n === 6) { const r = L.resultadoCruces(d); $$("[data-zmf]").forEach(el => { const f = d.factores.find(x => x.id === el.dataset.zmf); if (f) el.textContent = mediaDe(r, f); }); }
    L.TIPOS.forEach(t => { Z["n" + t] = () => String(d.factores.filter(f => f.tipo === t && lleno(f.texto)).length); });
    $$("[data-zona]").forEach(el => { const f = Z[el.dataset.zona]; if (f) el.innerHTML = f(); });
    $$("[data-zav]").forEach(el => { el.innerHTML = avisosFactor(d, n, el.dataset.zav); });
    if (idFactor) {
      const f = d.factores.find(x => x.id === idFactor); if (!f) return;
      const zp = $(`[data-zpeso="${f.id}"]`); if (zp) zp.innerHTML = pesoBadge(f);
      const ze = $(`[data-zesc="${f.id}"]`); if (ze) ze.innerHTML = escFila(f);
      ["importancia", "probabilidad"].forEach(k => { const z = $(`[data-zseg="${f.id}-${k}"]`); if (z) z.innerHTML = segPunt(f, k); });
      const zr = $(`[data-zres="${f.id}"]`), fu = L.fuenteDe(d, f);
      if (zr) zr.textContent = [L.nombreArea(f), lleno(f.evidencia) ? "dato: " + L.corto(f.evidencia, 50) : "", fu ? "fuente: " + L.corto(L.nombreFuente(fu), 40) : ""].filter(Boolean).join(" · ");
    }
  }
  function repintar() { const y = window.scrollY; renderDafo(actual, pasoActual); window.scrollTo(0, y); }

  // ---------- Aprende ----------
  function renderAprende(n) {
    const T = C.TEMAS, t = T.find(x => x.n === n);
    if (!t) {
      view.innerHTML = `
        <h1 class="page-title">Aprende</h1>
        <p class="page-lead">${T.length} temas, explicados fácil, para tener a mano mientras haces tu DAFO.</p>
        <div class="temas">${T.map(x => `<a class="tema-card pdca--${x.c}" href="#/aprende/${x.n}"><span class="tema-n">${x.n}</span><span><b>${x.titulo}</b><span>${x.sub}</span></span></a>`).join("")}</div>`;
      return;
    }
    const prev = T.find(x => x.n === n - 1), next = T.find(x => x.n === n + 1);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver("#/aprende", "Aprende")}<div class="tema-pills">${T.map(x => `<a href="#/aprende/${x.n}" class="pdca--${x.c}${x.n === n ? " actual" : ""}">${x.n}</a>`).join("")}</div></div>
      <div class="wiz-titulo"><span class="wiz-paso">Tema ${n} de ${T.length}</span><h1 class="page-title">${t.titulo}</h1><p class="page-lead">${t.sub}</p></div>
      <div class="card minuto pdca--${t.c}"><h2 class="sub-h">En un minuto</h2><ul>${t.minuto.map(x => `<li>${x}</li>`).join("")}</ul></div>
      ${t.secciones.map((s, i) => `<details class="facil"${i === 0 ? " open" : ""}><summary>${s.t}</summary><div class="facil-body">${s.h}</div></details>`).join("")}
      ${box("ejemplo", "Minicaso", t.minicaso)}
      <div class="toolbar"><a class="btn btn--primary" href="${t.practica.href}">${t.practica.texto} →</a></div>
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/aprende/${prev.n}">← ${prev.titulo}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/aprende/${next.n}">${next.titulo} →</a>` : "<span></span>"}</div>`;
  }

  // ---------- Ponte a prueba ----------
  const respuestas = {}, respEj = { clasifica: {}, sirve: {}, came: {} };
  // Orden de las opciones barajado pero estable (para que la correcta no esté siempre en el mismo sitio)
  const barajar = (n, semilla) => { const a = Array.from({ length: n }, (_, i) => i); let s = semilla * 9301 + 49297; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pillsPrueba = act => `<div class="tema-pills prueba-pills no-print"><a href="#/prueba" class="pdca--P${!act ? " actual" : ""}" title="Todas las preguntas">T</a>${Object.keys(C.TEMAS_TEST).map(k => `<a href="#/prueba/${k}" class="pdca--P${String(act) === k ? " actual" : ""}" title="${esc(C.TEMAS_TEST[k].nom)}">${k}</a>`).join("")}<a href="#/prueba/practica" class="pdca--V${act === "practica" ? " actual" : ""}" title="Ejercicios prácticos">✎</a></div>`;
  function marcadorHtml(Q) {
    const hechas = Q.filter(q => q.i in respuestas), bien = hechas.filter(q => respuestas[q.i] === q.ok).length;
    if (!hechas.length) return `<span class="field-sub">Aciertos: 0 de ${Q.length}</span>`;
    const p = bien / hechas.length;
    return `<span><b>${bien}</b> ${bien === 1 ? "acierto" : "aciertos"} de ${hechas.length} ${hechas.length === 1 ? "respondida" : "respondidas"} (de ${Q.length})</span>${hechas.length === Q.length ? `<span class="sem-b sem-b--${p >= 0.8 ? "verde" : p >= 0.6 ? "ambar" : "rojo"}">${p >= 0.8 ? "¡Muy bien!" : p >= 0.6 ? "Bien: repasa los fallos" : "Repasa «Aprende»"}</span>` : ""}`;
  }
  function renderPrueba(bloque) {
    if (bloque === "practica") { renderPractica(); return; }
    const Q = C.TEST.map((q, i) => Object.assign({ i }, q)).filter(q => !bloque || q.t === bloque);
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba</h1>
      <p class="page-lead">${C.TEST.length} preguntas sobre el DAFO y el CAME${bloque ? ` (aquí, las del bloque «${esc(C.TEMAS_TEST[bloque].nom)}»)` : ""}. Toca la respuesta que creas correcta y lee la explicación. En ✎, tres ejercicios prácticos.</p>
      ${pillsPrueba(bloque)}
      <div class="marcador" data-zona="marcador">${marcadorHtml(Q)}</div>
      <div class="card">${Q.map(q => { const ord = barajar(q.o.length, q.i + 1), r = respuestas[q.i]; return `<div class="quiz-q" data-q="${q.i}">
        <p><span class="badge">${esc(C.TEMAS_TEST[q.t].nom)}</span> <b>${esc(q.q)}</b></p>
        ${ord.map(j => `<button class="quiz-o${r != null ? (j === q.ok ? " quiz-o--ok" : j === r ? " quiz-o--mal" : "") : ""}" data-act="quiz" data-q="${q.i}" data-o="${j}">${esc(q.o[j])}</button>`).join("")}
        <p class="quiz-fb"${r == null ? " hidden" : ""}>${r != null ? `${r === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(q.e)} <a href="#/aprende/${C.TEMAS_TEST[q.t].aprende}">Repasar en «Aprende»</a>` : ""}</p>
      </div>`; }).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="quiz-reset">Empezar de nuevo</button><a class="btn btn--primary" href="#/prueba/practica">Ejercicios prácticos →</a></div>`;
  }
  const NOM_SIRVE = { bien: "Buen factor", solucion: "Es una solución", vago: "Es vago" };
  const EXPLICA_SIRVE = { bien: "Es concreto y tiene un dato: se podrá comprobar el año que viene si ha cambiado.", solucion: "Dice lo que hay que hacer, no la situación. Primero se describe el problema (con su dato); la solución vendrá en las estrategias.", vago: "Es tan general que no lleva a ninguna decisión. ¿Qué exactamente?, ¿desde cuándo?, ¿qué dato lo muestra?" };
  function ejercicio(k, titulo, sub, items, opciones, correcta, fb) {
    const R = respEj[k], hechas = Object.keys(R).length, bien = items.filter((x, i) => R[i] === correcta(x)).length;
    return `<h2 class="sec-t">${titulo}</h2><p class="field-sub">${sub} ${hechas ? `<b>${bien} de ${hechas}</b> bien.` : ""}</p>
      <div class="card">${items.map((x, i) => { const r = R[i], ok = correcta(x); return `<div class="quiz-q fec-q">
        ${x.html}
        <div class="seg seg--wrap" role="group">${opciones.map(([v, t]) => `<button type="button" class="${r === v ? (v === ok ? "fec-ok" : "fec-mal") : r && v === ok ? "fec-ok" : ""}" data-act="ej" data-k="${k}" data-i="${i}" data-v="${v}">${t}</button>`).join("")}</div>
        ${r ? `<p class="quiz-fb">${r === ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${fb(x)}</p>` : ""}</div>`; }).join("")}</div>`;
  }
  function renderPractica() {
    const E = C.EJERCICIOS;
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba · ejercicios</h1>
      <p class="page-lead">Tres ejercicios con frases como las de un DAFO real, para practicar lo que más cuesta al empezar.</p>
      ${pillsPrueba("practica")}
      ${ejercicio("clasifica", "1. ¿Fortaleza, debilidad, oportunidad o amenaza?", "En el DAFO de una UGC de Atención Primaria. Recuerda: si lo podéis cambiar vosotros, es interno; si viene de fuera, externo.",
        E.clasifica.map(x => Object.assign({ html: `<p><b>«${esc(x.texto)}»</b></p>` }, x)), L.TIPOS.map(t => [t, Q[t].uno[0].toUpperCase() + Q[t].uno.slice(1)]), x => x.tipo, x => `Es ${Q[x.tipo].art} <b>${Q[x.tipo].uno}</b>. ${esc(x.por)}`)}
      ${ejercicio("sirve", "2. ¿Sirve como factor?", "Un buen factor es concreto y tiene un dato; ni es una solución ni es vago.",
        E.sirve.map(x => Object.assign({ html: `<p><b>«${esc(x.texto)}»</b></p>` }, x)), Object.entries(NOM_SIRVE), x => x.k, x => EXPLICA_SIRVE[x.k])}
      ${ejercicio("came", "3. ¿Qué estrategia CAME sale de este cruce?", "FO → explotar; FA → mantener; DO → corregir; DA → afrontar.",
        E.came.map(x => Object.assign({ html: `<p><span class="fx-cod q-${x.tf}">${x.tf}</span> ${esc(x.fila)}<br><span class="fx-cod q-${x.tc}">${x.tc}</span> ${esc(x.col)}</p>` }, x)), L.TIPOS_CAME.map(k => [k, L.CAME[k].nom]), x => x.came, x => `Es un cruce ${x.tf}${x.tc}: <b>${L.CAME[x.came].nom.toLowerCase()}</b>. ${esc(L.CAME[x.came].que)}`)}
      <div class="toolbar no-print"><button class="btn" data-act="practica-reset">Empezar de nuevo</button><a class="btn" href="#/prueba">← Preguntas del test</a></div>`;
  }

  // ---------- Ejemplos ----------
  function renderEjemplos() {
    view.innerHTML = `
      <h1 class="page-title">Ejemplos</h1>
      <p class="page-lead">Para ver cómo queda cada paso antes de hacerlo tú. Están aparte: puedes tocarlos, pero <b>no se guardan ni se mezclan con tus datos</b>. Si te sirve de punto de partida, pulsa «Copiar a mis datos».</p>
      <h2 class="sec-t">Ejemplo completo: UGC de Atención Primaria</h2>
      <p class="field-sub">Una UGC inventada (un centro de salud y dos consultorios, 22.000 habitantes) prepara su <b>acuerdo de gestión</b> y la acreditación. Ocho fuentes de datos y 24 factores, cada uno con su dato: el factor externo de más peso es el <i>envejecimiento de la población</i> (5 × 5 = 25); las debilidades más importantes, la <i>demora de 6 días</i> y la <i>conciliación de la medicación al 45 %</i>. Con los 5 de más peso de cada cuadrante, la matriz cruzada (100 casillas) da una orientación <b>de reorientación</b>: el entorno ofrece oportunidades que hoy sus debilidades no dejan aprovechar.</p>
      <div class="ej-grid">${C.EJEMPLOS.fichas.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}<a class="ej-card" href="#/dafo/ej-dafo-ugc/4?informe=1"><b>Matriz DAFO</b><span>Todo en una vista imprimible</span></a></div>
      <h2 class="sec-t">Minicasos</h2>
      <p class="field-sub">DAFO cortos e inventados, cada uno con los errores típicos del paso que trabaja. Se abren en ese paso: mira los avisos y corrígelos.</p>
      <div class="ej-grid ej-grid--mini">${C.EJEMPLOS.minicasos.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}</div>
      ${practica("Las cifras del ejemplo son inventadas. Usa siempre los datos de tu unidad.")}`;
  }

  // ---------- Glosario ----------
  function renderGlosario() {
    view.innerHTML = `<h1 class="page-title">Glosario</h1><p class="page-lead">${C.GLOSARIO.length} términos en lenguaje llano.</p>
      <div class="input-wrap glos-buscar"><input id="glos-q" type="search" placeholder="Buscar término…" autocomplete="off" /></div>
      <dl class="glos-lista" id="glos-lista"></dl>`;
    const pinta = q => {
      const t = L.sinTildes(q);
      const l = C.GLOSARIO.filter(([a, b]) => !t || L.sinTildes(a + " " + b).includes(t)).sort((x, y) => x[0].localeCompare(y[0], "es"));
      $("#glos-lista").innerHTML = l.length ? l.map(([a, b]) => `<div class="glos-item"><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("") : `<p class="placeholder-box">Sin resultados.</p>`;
    };
    pinta(""); $("#glos-q").addEventListener("input", e => pinta(e.target.value));
  }

  // ---------- PDF en iOS (sin librerías; mismo método que Auditorías) ----------
  // En iOS, window.print() no hace nada cuando la app está instalada en la pantalla de inicio.
  function esIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function toast(msg, ms) {
    let t = $("#toast");
    if (!msg) { if (t) t.hidden = true; return; }
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toast.h);
    if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms);
  }
  function pdfDesdeJPEGs(paginas, wPt, hPt) {
    const enc = new TextEncoder(), partes = [], offs = []; let pos = 0;
    const push = x => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); pos += b.length; };
    const obj = (n, cuerpo) => { offs[n] = pos; push(`${n} 0 obj\n`); cuerpo(); push("\nendobj\n"); };
    push("%PDF-1.4\n"); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    const n = paginas.length;
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>`));
    paginas.forEach((p, i) => {
      const pg = 3 + i * 3, cont = pg + 1, img = pg + 2, flujo = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im${i} Do Q`;
      obj(pg, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im${i} ${img} 0 R >> >> /Contents ${cont} 0 R >>`));
      obj(cont, () => { push(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`); });
      obj(img, () => { push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push("\nendstream"); });
    });
    const total = 3 + n * 3, xref = pos;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, "0") + " 00000 n \n";
    push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }
  async function generarPDF() {
    const ANCHO = 720, K = 2;
    const A4W = 595.28, A4H = 841.89, MARGEN_PT = 34;
    const PX = (A4W - 2 * MARGEN_PT) / ANCHO;
    const PW = A4W / PX, PH = A4H / PX, M = MARGEN_PT / PX, ALTO_UTIL = PH - 2 * M;
    const hoja = document.createElement("div");
    hoja.className = "view";
    hoja.style.cssText = `position:absolute;left:-20000px;top:0;width:${ANCHO}px;max-width:none;margin:0;padding:0;box-shadow:none;`;
    hoja.innerHTML = $("#view").innerHTML;
    $$(".informe-bar, [id]", hoja).forEach(el => { if (el.classList.contains("informe-bar")) el.remove(); else el.removeAttribute("id"); });
    $$("details", hoja).forEach(d => { d.open = true; });
    document.body.appendChild(hoja);
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const R0 = hoja.getBoundingClientRect();
      const ops = [], cortes = [0], bloques = [];
      const SIN_CORTE = ".print-head, .chart-card, tr, .formula, .box, .print-foot, h1, h2, h3, .ficha-cab, .leyenda";
      const rel = r => ({ x: r.left - R0.left, y: r.top - R0.top, w: r.width, h: r.height });
      const hayColor = c => !!c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const LADOS = ["Top", "Right", "Bottom", "Left"];
      const texto = (n, cs) => {
        const t = n.textContent, re = /\S+/g, rg = document.createRange(); let m;
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const rs = rg.getClientRects(); if (!rs.length) continue;
          ops.push({ t: "txt", s: cs.textTransform === "uppercase" ? m[0].toUpperCase() : m[0], r: rel(rs[0]), font, col: cs.color, ls: cs.letterSpacing });
        }
      };
      const recorre = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = rel(el.getBoundingClientRect());
        if (r.h > 0) cortes.push(r.y + r.h);
        if (el.matches(SIN_CORTE)) bloques.push([r.y, r.y + r.h]);
        if (el instanceof SVGSVGElement) { ops.push({ t: "svg", el, r }); return; }
        const bordes = LADOS.map(l => [parseFloat(cs[`border${l}Width`]) || 0, cs[`border${l}Color`]]);
        if (hayColor(cs.backgroundColor) || bordes.some(b => b[0] > 0 && hayColor(b[1]))) ops.push({ t: "caja", r, bg: cs.backgroundColor, rad: parseFloat(cs.borderTopLeftRadius) || 0, bordes });
        if (el.tagName === "LI") {
          const ol = el.parentElement.tagName === "OL", idx = Array.prototype.indexOf.call(el.parentElement.children, el) + 1;
          ops.push({ t: "txt", s: ol ? idx + "." : "•", r: { x: r.x - (ol ? 20 : 14), y: r.y, w: 16, h: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 }, font: `normal 700 ${cs.fontSize} ${cs.fontFamily}`, col: ol ? "#5b21b6" : cs.color, ls: "normal" });
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 1) recorre(n);
          else if (n.nodeType === 3 && n.textContent.trim()) texto(n, cs);
        }
      };
      recorre(hoja);
      for (const op of ops.filter(o => o.t === "svg")) {
        const cl = op.el.cloneNode(true), orig = [op.el, ...op.el.querySelectorAll("*")], copia = [cl, ...cl.querySelectorAll("*")];
        orig.forEach((o, i) => { const cs = getComputedStyle(o); copia[i].setAttribute("style", ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-family", "font-size", "font-weight"].map(p => `${p}:${cs.getPropertyValue(p)}`).join(";")); });
        cl.setAttribute("xmlns", "http://www.w3.org/2000/svg"); cl.setAttribute("width", op.r.w); cl.setAttribute("height", op.r.h);
        op.img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
      }
      const alto = Math.ceil(R0.height);
      const parte = y => bloques.some(([a, b]) => a < y - 0.5 && y + 0.5 < b && b - a < ALTO_UTIL);
      const cands = [...new Set(cortes.map(c => Math.ceil(c)))].sort((a, b) => a - b);
      const pags = []; let y0 = 0;
      while (y0 < alto - 1) {
        const lim = y0 + ALTO_UTIL;
        if (lim >= alto) { pags.push([y0, alto]); break; }
        const y = cands.filter(c => c > y0 + 80 && c <= lim && !parte(c)).pop() || Math.floor(lim);
        pags.push([y0, y]); y0 = y;
      }
      const ponFuente = (ctx, f) => { ctx.font = "10px serif"; ctx.font = f; if (ctx.font === "10px serif") ctx.font = f.replace(/^(.*?\d+(\.\d+)?px).*$/, "$1 sans-serif"); };
      const caja = (ctx, op) => {
        const { x, y, w, h } = op.r, rad = Math.min(op.rad, w / 2, h / 2);
        const camino = () => { ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h); };
        if (hayColor(op.bg)) { ctx.fillStyle = op.bg; camino(); ctx.fill(); }
        const [t, d, b, l] = op.bordes;
        if (op.bordes.every(z => z[0] === t[0] && z[1] === t[1]) && t[0] > 0 && hayColor(t[1])) { ctx.strokeStyle = t[1]; ctx.lineWidth = t[0]; ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0], Math.max(0, rad - t[0] / 2)); else ctx.rect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0]); ctx.stroke(); return; }
        const lado = (z, rx, ry, rw, rh) => { if (z[0] > 0 && hayColor(z[1])) { ctx.fillStyle = z[1]; ctx.fillRect(rx, ry, rw, rh); } };
        lado(t, x, y, w, t[0]); lado(b, x, y + h - b[0], w, b[0]); lado(l, x, y, l[0], h); lado(d, x + w - d[0], y, d[0], h);
      };
      const dibujaPaginas = conSVG => pags.map(([a, b]) => {
        const cv = document.createElement("canvas"); cv.width = Math.round(PW * K); cv.height = Math.round(PH * K);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.scale(K, K); ctx.translate(M, M - a);
        ctx.beginPath(); ctx.rect(-2, a, ANCHO + 4, b - a); ctx.clip();
        for (const op of ops) {
          if (op.r.y >= b || op.r.y + op.r.h <= a) continue;
          if (op.t === "caja") caja(ctx, op);
          else if (op.t === "svg") { if (conSVG && op.img) ctx.drawImage(op.img, op.r.x, op.r.y, op.r.w, op.r.h); }
          else {
            ponFuente(ctx, op.font); ctx.fillStyle = op.col; ctx.textBaseline = "alphabetic";
            if ("letterSpacing" in ctx) ctx.letterSpacing = op.ls && op.ls !== "normal" ? op.ls : "0px";
            const mt = ctx.measureText(op.s), asc = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent || op.r.h * 0.8, desc = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent || op.r.h * 0.2;
            ctx.fillText(op.s, op.r.x, op.r.y + (op.r.h - (asc + desc)) / 2 + asc);
          }
        }
        const url = cv.toDataURL("image/jpeg", 0.9), bin = atob(url.slice(url.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return { bytes, w: cv.width, h: cv.height };
      });
      let paginas;
      try { paginas = dibujaPaginas(true); } catch (e) { paginas = dibujaPaginas(false); }
      return pdfDesdeJPEGs(paginas, A4W, A4H);
    } finally { hoja.remove(); }
  }
  let pdfListo = null;
  const rutaActual = () => location.hash.split("?")[0];
  const fechaArchivo = () => new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
  function nombreArchivo(ext) {
    const base = actual ? "DAFO " + (nombreDafo(actual) || "").slice(0, 60) : "DAFO";
    return `${base.replace(/[\\/:*?"<>|%]/g, "").trim()} ${fechaArchivo()}.${ext}`;
  }
  function prepararPDF() {
    pdfListo = null; const r = rutaActual();
    setTimeout(() => { if (rutaActual() === r && document.body.classList.contains("ver-informe")) generarPDF().then(b => { pdfListo = { r, blob: b }; }).catch(() => {}); }, 300);
  }
  async function guardarPDF() {
    if (!document.body.classList.contains("ver-informe")) { irInforme(); toast("Preparando el PDF… pulsa de nuevo «Guardar / imprimir» en un momento.", 4000); return; }
    let blob = pdfListo && pdfListo.r === rutaActual() ? pdfListo.blob : null;
    if (!blob) { toast("Preparando el PDF…"); try { blob = await generarPDF(); pdfListo = { r: rutaActual(), blob }; } catch (e) { toast("No se ha podido crear el PDF.", 4000); return; } }
    const file = new File([blob], nombreArchivo("pdf"), { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: file.name }); toast(""); }
      catch (e) { if (e && e.name === "AbortError") { toast(""); return; } toast("PDF listo: pulsa otra vez «Guardar / imprimir».", 4000); }
      return;
    }
    descargar(blob, file.name); toast("PDF descargado.", 3000);
  }
  function descargar(blob, nombre) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }
  function exportarExcel(d) {
    try {
      const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcel(d, new Date().toLocaleDateString("es-ES")));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo("xlsx"), "Excel descargado.");
    } catch (e) { toast("No se ha podido crear el Excel.", 4000); }
  }
  function compartirOBajar(blob, nombre, msg) {
    const file = new File([blob], nombre, { type: blob.type });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: nombre }).catch(() => {});
    else { descargar(blob, nombre); toast(msg, 3000); }
  }
  function irInforme(doc) { location.hash = rutaActual() + "?informe=1" + (doc ? "&doc=" + doc : ""); }
  function imprimir() {
    if (esIOS()) { guardarPDF(); return; }
    if (!document.body.classList.contains("ver-informe")) { irInforme(); setTimeout(() => window.print(), 400); return; }
    window.print();
  }

  // ---------- Copia de seguridad e importar ----------
  async function copiaSeguridad() {
    const contenido = JSON.stringify({ app: "dafo", v: L.VERSION_DATOS, exportado: hoy(), dafos: datosUsuario.dafos, intercambio: L.paqueteIntercambio(datosUsuario.dafos, APP_VERSION, hoy()) }, null, 1);
    const nombre = `DAFO copia ${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([contenido], { type: "application/json" });
    const file = new File([blob], nombre, { type: "application/json" });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: nombre }); } catch (e) { if (e && e.name === "AbortError") return; }
    } else descargar(blob, nombre);
    datosUsuario.ultimaCopia = hoy(); guardar(true);
    toast("Copia guardada. Guárdala en un sitio seguro (Archivos, Drive, correo…).", 4500);
    if (rutaActual() === "#/" || rutaActual() === "") renderHome();
  }
  function importar(file) {
    const fr = new FileReader();
    fr.onload = () => {
      let s = null; try { s = L.sanearDatos(JSON.parse(fr.result), genId, hoy()); } catch (e) { /* */ }
      if (!s) { toast("Ese archivo no es una copia de DAFO.", 4000); return; }
      // Nunca se importa nada con id de ejemplo
      s.dafos.forEach(x => { if (esIdEjemplo(x.id)) x.id = genId(); });
      const aplicar = modo => {
        const r = modo === "sustituir" ? s : L.fusionar(datosUsuario, s);
        datosUsuario.dafos = r.dafos; guardar(true);
        toast(`Importados ${plural(s.dafos.length, "DAFO", "DAFO")}.`, 4000);
        location.hash = "#/"; route();
      };
      if (!datosUsuario.dafos.length) { aplicar("sustituir"); return; }
      confirmar(`<p>La copia tiene <b>${plural(s.dafos.length, "DAFO", "DAFO")}</b>.</p><p><b>Añadir</b> los junta con los tuyos (si uno está en los dos, se queda el más reciente): así se trabaja en equipo. Si prefieres <b>sustituir</b> todo lo tuyo por la copia, pulsa «Sustituir».</p>`, "Añadir a mis datos", () => aplicar("anadir"), { titulo: "Importar copia", peligro: false, otro: ["Sustituir", () => confirmar("<p>Se borrarán tus DAFO actuales y se quedará solo lo de la copia. Esto no se puede deshacer.</p>", "Sustituir", () => aplicar("sustituir"))] });
    };
    fr.readAsText(file);
  }

  // ---------- Confirmación ----------
  function confirmar(html, siTxt, alSi, o = {}) {
    const m = $("#modal-confirmar");
    $("#conf-titulo").textContent = o.titulo || "¿Seguro?";
    $("#conf-texto").innerHTML = html;
    const si = $("#btn-conf-si"), no = $("#btn-conf-no");
    si.textContent = siTxt; si.className = "btn " + (o.peligro === false ? "btn--primary" : "btn--peligro");
    let extra = $("#btn-conf-otro"); if (extra) extra.remove();
    if (o.otro) { extra = document.createElement("button"); extra.id = "btn-conf-otro"; extra.className = "btn"; extra.textContent = o.otro[0]; no.after(extra); extra.onclick = () => { m.hidden = true; o.otro[1](); }; }
    si.onclick = () => { m.hidden = true; alSi(); };
    no.onclick = () => { m.hidden = true; };
    m.hidden = false; si.focus();
  }

  // ---------- Copiar un ejemplo a mis datos ----------
  function copiarAMisDatos() {
    if (!actual || !esIdEjemplo(actual.id)) return;
    const c = L.renovarIds(L.sanearDafo(Object.assign(clon(actual), { id: genId(), creado: hoy(), modificado: hoy() }), genId, hoy()), genId);
    c.notas = "";
    datosUsuario.dafos.push(c); guardar(true); location.hash = `#/dafo/${c.id}/${pasoActual}`;
    toast("Copiado a tus DAFO. Ya es tuyo: cámbialo a tu gusto.", 4000);
  }

  // ---------- Llevar un candidato a otra app ----------
  // Cada app escribe solo en sus datos: DAFO deja el candidato en su paquete de intercambio y abre la otra app.
  function llevarA(d, f) {
    if (!f || !f.candidato.destino) return;
    const D = L.DESTINOS[f.candidato.destino], proc = f.candidato.proceso || f.texto;
    guardar(true);
    try { if (navigator.clipboard) navigator.clipboard.writeText(proc).catch(() => {}); } catch (e) { /* */ }
    const donde = f.candidato.destino === "amfe" ? "<p>En <b>AMFE</b>, crea un AMFE nuevo y pega el nombre del proceso.</p>"
      : f.candidato.destino === "mapa" ? "<p>En <b>Mapa de Riesgos</b>, pulsa «Traer de DAFO» para traer este factor con su dato y su motivo, o crea un mapa nuevo y pega el nombre del proceso.</p>"
      : "<p>En <b>Auditorías</b>, crea una auditoría nueva (o añádela a tu Plan Anual) con esta práctica como objeto.</p>";
    confirmar(`<p>Se abrirá ${D.nom} en otra pestaña. He copiado el nombre del proceso: <b>«${esc(proc)}»</b>.</p>${donde}<p class="field-sub">${f.candidato.destino === "mapa" ? "Si trabajas en el mismo navegador, «Traer de DAFO» lo encuentra solo." : `Cuando ${D.nom === "AMFE" ? "AMFE" : "esa app"} tenga el botón «Traer de DAFO», podrá traer este factor con su dato y su motivo directamente.`} Para otro dispositivo, descarga la copia de seguridad de DAFO: lleva el factor dentro.</p>`,
      "Abrir " + D.nom, () => window.open(D.url, "_blank", "noopener"), { titulo: "Llevar a " + D.nom, peligro: false, otro: ["Descargar la copia", copiaSeguridad] });
  }
  // Indicadores de la app Indicadores (su copia o localStorage["indicadores-datos"]), como en AMFE
  function indicadoresDe(o) {
    if (!o || typeof o !== "object" || !Array.isArray(o.indicadores)) return null;
    const t = v => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, 500) : "";
    return o.indicadores.slice(0, 300).filter(x => x && typeof x === "object" && lleno(x.nombre)).map(x => {
      const e = t(x.estandar).replace(/[^\d.,]/g, "");
      return { nombre: t(x.nombre), formula: [t(x.numerador), t(x.denominador)].every(lleno) ? `${t(x.numerador)} / ${t(x.denominador)} × 100` : "",
        estandar: e ? `${x.sentido === "menos" ? "≤" : "≥"} ${e} %` : "", fuente: [...(Array.isArray(x.fuentes) ? x.fuentes.map(t) : []), t(x.fuenteOtra)].filter(lleno).join(", ") };
    });
  }

  // ---------- Enrutado ----------
  const NAV = [["", "Inicio"], ["dafo", "Mis DAFO"], ["ejemplos", "Ejemplos"], ["aprende", "Aprende"], ["prueba", "Ponte a prueba"], ["glosario", "Glosario"]];
  function buildNav() { $("#calc-nav").innerHTML = NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join(""); }
  function noEncontrado(que, href, txt) { view.innerHTML = `<div class="error-box">No se encuentra ${que} en este dispositivo.</div><p><a href="${href}">${txt}</a></p>`; }
  let previo = null, docActual = "";
  function route() {
    const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const partes = ruta.split("/"), q = new URLSearchParams(qs || "");
    const informe = q.get("informe") === "1";
    docActual = informe ? (q.get("doc") || "") : "";
    document.body.classList.toggle("ver-informe", informe);
    actual = null;
    const idR = partes[1] || "", ej = ejemplos();
    modoEjemplo = partes[0] === "ejemplos" || (esIdEjemplo(idR) && ej.dafos.some(x => x.id === idR));
    datos = modoEjemplo ? ej : datosUsuario;
    $("#banner-ejemplo").hidden = !modoEjemplo || informe || partes[0] === "ejemplos";
    let navR = partes[0];
    if (partes[0] === "dafo" && partes[1] === "nuevo") {
      const d = L.nuevoDafo(genId(), hoy()); borradores.set(d.id, d); abiertos.clear(); pegarAbierto = false; previo = d.id;
      history.replaceState(null, "", `#/dafo/${d.id}/1`); renderDafo(d, 1);
    } else if (partes[0] === "dafo" && partes[1]) {
      const d = buscaDafo(partes[1]) || borradores.get(partes[1]);
      if (!d) noEncontrado("ese DAFO", "#/dafo", "Ir a mis DAFO");
      else {
        if (previo !== d.id) { abiertos.clear(); pegarAbierto = false; amfeLista = null; previo = d.id; }
        let n = HERRAMIENTAS[partes[2]] ? partes[2] : parseInt(partes[2], 10);
        if (!HERRAMIENTAS[n] && !(n >= 1 && n <= 8)) { const p = L.pasoPendiente(d, ENTREGA); n = p ? p.n : 1; history.replaceState(null, "", `#/dafo/${d.id}/${n}${informe ? "?informe=1" : ""}`); }
        renderDafo(d, n);
      }
      navR = "dafo";
    } else if (partes[0] === "dafo") renderLista();
    else if (partes[0] === "ejemplos") renderEjemplos();
    else if (partes[0] === "aprende") renderAprende(parseInt(partes[1], 10) || 0);
    else if (partes[0] === "glosario") renderGlosario();
    else if (partes[0] === "prueba") renderPrueba(partes[1] === "practica" ? "practica" : Number(partes[1]) || 0);
    else { renderHome(); navR = ""; }
    if (modoEjemplo) navR = "ejemplos";
    if (informe) { $$("details").forEach(d => { d.open = true; }); if (esIOS()) prepararPDF(); }
    $$("#calc-nav a").forEach(a => a.classList.toggle("active", a.dataset.r === navR));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }

  // ---------- Eventos ----------
  function tocado(d) {
    d.modificado = hoy();
    if (d === actual && !esVacio(d) && !datos.dafos.includes(d)) { datos.dafos.push(d); borradores.delete(d.id); }
    guardar();
  }
  const buscaEn = (lista, id) => lista.find(x => x.id === id);
  function buscaAccion(d, id) { for (const e of d.estrategias) { const x = e.acciones.find(y => y.id === id); if (x) return { e, x }; } return null; }
  function buscaMedida(d, id) { for (const e of d.estrategias) for (const x of e.acciones) { const m = x.seguimiento.find(y => y.id === id); if (m) return { e, x, m }; } return null; }
  const hoyIso = () => new Date().toISOString().slice(0, 10);
  // Los cuadros de texto crecen con lo escrito
  function autoAlto(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }
  new MutationObserver(() => $$("textarea.txt-in", view).forEach(el => { if (!el.closest("[hidden]") && !el.closest("details:not([open])")) autoAlto(el); })).observe(view, { childList: true, subtree: true });

  function pegarVista() {
    const t = $("#pegar-txt"); if (!t) return;
    const p = L.parsearFactores(t.value, $("#pegar-tipo") ? $("#pegar-tipo").value : ""), z = $("[data-zona='pegar']"), b = $("[data-act='pegar-ok']");
    const cuenta = L.TIPOS.map(k => [k, p.filas.filter(r => r.tipo === k).length]).filter(x => x[1]);
    z.innerHTML = t.value.trim() ? (p.filas.length ? `<div class="note">ℹ Se ${p.filas.length === 1 ? "ha reconocido 1 factor" : "han reconocido " + p.filas.length + " factores"}${p.cabecera ? " (con fila de títulos)" : ""}: ${cuenta.map(([k, v]) => `${v} ${v === 1 ? Q[k].uno : Q[k].nom.toLowerCase()}`).join(", ")}. Primero: «${esc(L.corto(p.filas[0].texto, 70))}».</div>` : "") + p.errores.map(x => `<div class="warn">⚠ ${esc(x)}</div>`).join("") : "";
    b.disabled = !p.filas.length; b.textContent = p.filas.length ? `Añadir ${plural(p.filas.length, "factor", "factores")}` : "Añadir los factores";
  }
  view.addEventListener("input", e => {
    const t = e.target, d = actual;
    if (t.matches("textarea.txt-in")) autoAlto(t);
    if (t.id === "pegar-txt" || t.id === "pegar-tipo") { pegarVista(); return; }
    if (!d) return;
    const f = t.dataset.f, esSel = t.tagName === "SELECT";
    if (t.dataset.u) {
      const x = buscaEn(d.fuentes, t.dataset.u); if (!x) return; x[f] = t.value; tocado(d);
      if (esSel) repintar(); else refrescar(); return;
    }
    if (t.dataset.fx) { const fx = buscaEn(d.factores, t.dataset.fx); if (!fx) return; setPath(fx, f, t.value); tocado(d); refrescar(fx.id); return; }
    if (t.dataset.m) { const m = buscaEn(d.equipo, t.dataset.m); if (!m) return; m[f] = t.value; tocado(d); if (esSel) repintar(); else refrescar(); return; }
    if (t.dataset.x) { const x = buscaEn(d.sesiones, t.dataset.x); if (!x) return; x[f] = t.value; tocado(d); refrescar(); return; }
    if (t.dataset.idea) { const i = buscaEn(d.ideas, t.dataset.idea); if (!i) return; i[f] = t.value; tocado(d); if (esSel) repintar(); else refrescar(); return; }
    if (t.dataset.bq) { const b = buscaEn(d.bloques, t.dataset.bq); if (!b) return; b[f] = t.value; tocado(d); refrescar(); return; }
    if (t.dataset.v321) { L.ponerVoto321(d, t.dataset.v321, t.dataset.t, Number(t.dataset.p), t.value); tocado(d); repintar(); return; }
    if (t.dataset.voto) { const fx = buscaEn(d.factores, t.dataset.voto); if (!fx) return; L.ponerVoto(fx, t.dataset.mi, f, t.value); tocado(d); refrescar(); return; }
    if (t.dataset.es) { const e = buscaEn(d.estrategias, t.dataset.es); if (!e) return; setPath(e, f, t.value); tocado(d); refrescar(); return; }
    if (t.dataset.ac) { const r = buscaAccion(d, t.dataset.ac); if (!r) return; setPath(r.x, f, t.value); tocado(d); refrescar(); return; }
    if (t.dataset.me) { const r = buscaMedida(d, t.dataset.me); if (!r) return; r.m[f] = t.value; tocado(d); refrescar(); return; }
    if (t.dataset.cp) { const x = d.control[t.dataset.cp][Number(t.dataset.i)]; if (!x) return; x[f] = t.value; tocado(d); refrescar(); return; }
    if (t.dataset.ch) { const x = d.control.historial[Number(t.dataset.ch)]; if (!x) return; x[f] = t.value; tocado(d); return; }
    if (t.dataset.actSel === "usar-ind") {
      const r = buscaAccion(d, t.dataset.acInd), y = indImportados && indImportados[Number(t.value)]; if (!r || !y) return;
      const hacer = () => { Object.assign(r.x.indicador, y); indPara = null; tocado(d); repintar(); toast("Indicador copiado. Revisa el estándar.", 3000); };
      if (lleno(r.x.indicador.nombre)) confirmar("<p>Se sustituirá el indicador que has escrito por el de la app Indicadores.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
      return;
    }
    if (t.dataset.k) { setPath(d, t.dataset.k, t.value); tocado(d); refrescar(); }
  });
  view.addEventListener("toggle", e => {
    const el = e.target; if (!el.matches) return;
    if (el.matches("details[data-recordar]") && !document.body.classList.contains("ver-informe")) escribir(KEY_FACIL, el.open ? "1" : "0");
    if (el.matches("details[data-fmas]")) { if (el.open) { abiertos.add(el.dataset.fmas); $$("textarea.txt-in", el).forEach(autoAlto); } else abiertos.delete(el.dataset.fmas); }
  }, true);

  view.addEventListener("click", e => {
    const t = e.target; let b;
    if ((b = t.closest(".info-btn"))) { const h = $("#help-" + b.dataset.info); if (!h) return; const open = h.hidden; h.hidden = !open; b.setAttribute("aria-expanded", String(open)); return; }
    if ((b = t.closest("[data-asis]")) && actual) {
      const x = buscaEn(actual.sesiones, b.dataset.asis); if (!x) return;
      const i = x.asistentes.indexOf(b.dataset.v); if (i < 0) x.asistentes.push(b.dataset.v); else x.asistentes.splice(i, 1);
      b.classList.toggle("active", i < 0); tocado(actual); return;
    }
    if (!(b = t.closest("[data-act]"))) return;
    const d = actual, act = b.dataset.act, id = b.dataset.id;
    // --- Lista ---
    if (act === "dafo-dup") {
      const o = buscaDafo(id); if (!o) return;
      const c = Object.assign(clon(o), { id: genId(), titulo: (nombreDafo(o) || "DAFO") + " (copia)", creado: hoy(), modificado: hoy() });
      datos.dafos.push(c); guardar(); renderLista(); toast("DAFO duplicado.", 2500);
    }
    else if (act === "dafo-del") {
      const o = buscaDafo(id); if (!o) return;
      confirmar(`<p>Se borrará «${esc(L.corto(nombreDafo(o) || "DAFO sin nombre", 80))}» con sus ${plural(o.factores.length, "factor", "factores")}. Esto no se puede deshacer${datosUsuario.ultimaCopia ? "" : " (y aún no tienes ninguna copia de seguridad)"}.</p>`, "Borrar", () => {
        datos.dafos = datos.dafos.filter(x => x.id !== id); if (!modoEjemplo) datosUsuario.dafos = datos.dafos; guardar(true); renderLista();
      });
    }
    // --- Paso 1 · textos propuestos ---
    else if (["sug-titulo", "sug-horizonte", "sug-mision", "sug-vision"].includes(act) && d) {
      const k = act.slice(4), fn = { titulo: () => L.sugerirTitulo(d, new Date().getFullYear() + 1), horizonte: () => L.sugerirHorizonte(d), mision: () => L.sugerirMision(d), vision: () => L.sugerirVision(d) }[k];
      const s = fn ? fn() : "";
      if (!s) { toast(k === "horizonte" ? "Elige primero la finalidad del análisis." : "Escribe primero qué vais a analizar.", 3000); return; }
      const hacer = () => { d[k] = s; tocado(d); repintar(); };
      if (lleno(d[k]) && d[k] !== s) confirmar("<p>Se sustituirá lo que has escrito por el texto propuesto.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    // --- Paso 2 · fuentes ---
    else if (act === "fu-sug" && d) {
      const k = b.dataset.t, T = L.FUENTES_TIPO[k]; if (!T) return;
      if (d.fuentes.some(x => x.tipo === k)) { toast("Ya tienes una fuente de ese tipo. Si es otra distinta, usa «Añadir otra fuente».", 3000); return; }
      d.fuentes.push(Object.assign(L.nuevaFuente(genId()), { tipo: k, nombre: T.ej })); tocado(d); repintar();
    }
    else if (act === "fu-add" && d) {
      const x = L.nuevaFuente(genId()); d.fuentes.push(x); tocado(d); repintar();
      const el = $(`[data-u="${x.id}"][data-f="nombre"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "fu-del" && d) {
      const x = buscaEn(d.fuentes, id); if (!x) return;
      const n = usosFuente(d, x);
      const hacer = () => { d.fuentes = d.fuentes.filter(y => y.id !== id); d.factores.forEach(f => { if (f.fuenteId === id) f.fuenteId = ""; }); tocado(d); repintar(); };
      if (n || lleno(x.nombre) || lleno(x.nota)) confirmar(`<p>Se quitará la fuente «${esc(L.corto(L.nombreFuente(x) || "sin nombre", 60))}».${n ? ` ${n === 1 ? "Un factor la cita: se quedará" : n + " factores la citan: se quedarán"} sin fuente, pero con su dato.` : ""}</p>`, "Quitar", hacer); else hacer();
    }
    // --- Pasos 3 y 4 · factores ---
    else if (act === "fx-add" && d) {
      const tipo = b.dataset.tipo; if (!Q[tipo]) return;
      const f = Object.assign(L.nuevoFactor(genId(), tipo, L.siguienteNum(d, tipo)), { area: b.dataset.area || "" });
      d.factores.push(f); tocado(d); repintar();
      const el = $(`[data-fx="${f.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "fx-del" && d) {
      const f = buscaEn(d.factores, id); if (!f) return;
      const hacer = () => { d.factores = d.factores.filter(x => x.id !== id); abiertos.delete(id); tocado(d); repintar(); };
      if (lleno(f.texto) || lleno(f.evidencia)) confirmar(`<p>Se quitará ${L.codigo(f)} «${esc(L.corto(f.texto || "sin escribir", 60))}».</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "fx-punt" && d) {
      const f = buscaEn(d.factores, id), k = b.dataset.f; if (!f || !["importancia", "probabilidad"].includes(k)) return;
      f[k] = f[k] === b.dataset.v ? "" : b.dataset.v; tocado(d); refrescar(f.id);
    }
    // --- Paso 5 · priorizar ---
    else if (act === "prio-n" && d) { d.prioridad.n = Number(b.dataset.v); tocado(d); repintar(); }
    else if (act === "fx-manual" && d) {
      const f = buscaEn(d.factores, id); if (!f) return;
      f.manual = b.dataset.v; tocado(d); repintar();
      if (f.manual && !lleno(f.motivo)) { const el = $(`[data-fx="${f.id}"][data-f="motivo"]`); if (el) el.focus(); }
    }
    else if (act === "sug-motivo" && d) {
      const f = buscaEn(d.factores, id); if (!f) return;
      const s = L.sugerirMotivo(d, f); f.motivo = lleno(f.motivo) ? f.motivo.trim() + " " + s : s; tocado(d); repintar();
    }
    // --- Paso 6 · cruzar ---
    else if ((act === "cruce" || act === "cruce-v") && d) {
      const f = buscaEn(d.factores, b.dataset.f), g = buscaEn(d.factores, b.dataset.g); if (!f || !g) return;
      const k = L.claveCruce(f, g), v = L.valorCruce(d, f, g);
      const nv = act === "cruce" ? (v === null ? 0 : v === 3 ? null : v + 1) : (v === Number(b.dataset.v) ? null : Number(b.dataset.v));
      if (nv === null) delete d.cruces[k]; else d.cruces[k] = String(nv);
      tocado(d);
      if (act === "cruce") b.outerHTML = celdaCruce(d, f, g);
      else $$("button", b.parentElement).forEach(x => x.classList.toggle("active", nv !== null && Number(x.dataset.v) === nv));
      refrescar();
    }
    else if (act === "cruce-vista") { escribir(KEY_VISTA_CRUCE, b.dataset.v); repintar(); }
    else if (act === "cruce-ceros" && d) {
      const r = L.resultadoCruces(d), vacias = r.total - r.rellenas;
      confirmar(`<p>Se pondrá <b>0 (sin relación)</b> en las ${vacias} casillas que quedan sin valorar. Las que ya tienen valor no cambian.</p>`, "Poner 0", () => {
        [...r.ejes.F, ...r.ejes.D].forEach(f => [...r.ejes.O, ...r.ejes.A].forEach(g => { const k = L.claveCruce(f, g); if (d.cruces[k] === undefined) d.cruces[k] = "0"; }));
        tocado(d); repintar();
      }, { peligro: false });
    }
    else if (act === "excel" && d) exportarExcel(d);
    // --- Equipo y sesiones ---
    else if (act === "eq-sug" && d) {
      const p = L.PERFILES_SUG[Number(b.dataset.i)]; if (!p) return;
      if (d.equipo.some(m => L.normal(m.perfil) === L.normal(p.perfil))) { toast("Ese perfil ya está en el equipo.", 2500); return; }
      const unico = p.rol === "coordinacion" || p.rol === "secretaria";
      d.equipo.push(Object.assign(L.nuevoMiembro(genId()), { perfil: p.perfil, rol: unico && d.equipo.some(x => x.rol === p.rol) ? "miembro" : p.rol })); tocado(d); repintar();
    }
    else if (act === "eq-add" && d) {
      const m = L.nuevoMiembro(genId()); d.equipo.push(m); tocado(d); repintar();
      const el = $(`[data-m="${m.id}"][data-f="perfil"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "eq-del" && d) {
      const m = buscaEn(d.equipo, id); if (!m) return;
      const nv = d.factores.reduce((s, f) => s + f.votos.filter(v => v.miembroId === id).length, 0) + d.tgn.votos.filter(v => v.miembroId === id).length;
      const hacer = () => { d.equipo = d.equipo.filter(x => x.id !== id); d.sesiones.forEach(x => { x.asistentes = x.asistentes.filter(y => y !== id); }); d.factores.forEach(f => { f.votos = f.votos.filter(v => v.miembroId !== id); }); d.tgn.votos = d.tgn.votos.filter(v => v.miembroId !== id); tocado(d); repintar(); };
      if (lleno(m.perfil) || nv) confirmar(`<p>Se quitará «${esc(L.corto(L.etiquetaMiembro(m), 60))}» del equipo${nv ? `, con sus ${plural(nv, "voto", "votos")}` : ""}.</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "ses-add" && d) { const x = L.nuevaSesion(genId()); d.sesiones.push(x); tocado(d); repintar(); }
    else if (act === "ses-tipo" && d) {
      L.SESIONES_TIPO.forEach(z => d.sesiones.push(Object.assign(L.nuevaSesion(genId()), z, { asistentes: d.equipo.map(m => m.id) })));
      tocado(d); repintar(); toast("Propuestas las sesiones habituales. Pon las fechas y ajústalas.", 3500);
    }
    else if (act === "ses-del" && d) {
      const x = buscaEn(d.sesiones, id); if (!x) return;
      const hacer = () => { d.sesiones = d.sesiones.filter(y => y.id !== id); tocado(d); repintar(); };
      if (lleno(x.actividad) || lleno(x.resultados)) confirmar("<p>Se quitará esta sesión.</p>", "Quitar", hacer); else hacer();
    }
    // --- Lluvia de ideas y grupo nominal ---
    else if (act === "ideas-cuad") { cuadIdeas = b.dataset.v; repintar(); }
    else if (act === "votar-cuad") { cuadVotar = b.dataset.v; repintar(); }
    else if (act === "idea-add" && d) {
      const el = $("#idea-txt"); if (!el || !lleno(el.value)) { if (el) el.focus(); return; }
      d.ideas.push(Object.assign(L.nuevaIdea(genId(), cuadIdeas), { texto: el.value.trim() })); tocado(d); repintar();
      const n2 = $("#idea-txt"); if (n2) n2.focus();
    }
    else if (act === "idea-del" && d) { d.ideas = d.ideas.filter(i => i.id !== id); tocado(d); repintar(); }
    else if (act === "idea-factor" && d) {
      const i = buscaEn(d.ideas, id); if (!i || !lleno(i.texto)) return;
      const f = L.ideaAFactor(d, i, genId); tocado(d); repintar(); if (f) toast(`Ahora es ${L.codigo(f)}. Complétalo en el paso ${L.esInterno(f.tipo) ? 3 : 4} con su dato y su importancia.`, 3500);
    }
    else if (act === "bloque-add" && d) {
      const el = $("#bloque-txt"); if (!el || !lleno(el.value)) { if (el) el.focus(); return; }
      d.bloques.push(L.nuevoBloque(genId(), cuadIdeas, el.value.trim())); tocado(d); repintar();
    }
    else if (act === "bloque-del" && d) {
      const bq = buscaEn(d.bloques, id); if (!bq) return;
      const hacer = () => { d.bloques = d.bloques.filter(x => x.id !== id); d.ideas.forEach(i => { if (i.bloqueId === id) i.bloqueId = ""; }); d.tgn.votos = d.tgn.votos.filter(v => v.bloqueId !== id); tocado(d); repintar(); };
      if (d.tgn.votos.some(v => v.bloqueId === id)) confirmar(`<p>Se quitará el bloque «${esc(bq.nombre)}» con sus votos. Sus ideas no se borran: quedan sin bloque.</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "bloque-factor" && d) {
      const bq = buscaEn(d.bloques, id); if (!bq) return;
      const f = L.bloqueAFactor(d, bq, genId); tocado(d); repintar(); if (f) toast(`El bloque es ahora ${L.codigo(f)}. Complétalo en el paso ${L.esInterno(f.tipo) ? 3 : 4}.`, 3500);
    }
    else if (act === "reunion") ponerReunion(!document.body.classList.contains("modo-reunion"));
    // --- Votación de la importancia ---
    else if (act === "voto-usar" && d) { const f = buscaEn(d.factores, id); if (!f) return; if (L.usarMedia(f)) { tocado(d); repintar(); toast(`${L.codigo(f)}: puesta la media de los votos.`, 2500); } else toast("No hay votos, o el valor ya es la media.", 2500); }
    else if (act === "votos-usar-todos" && d) {
      const l = d.factores.filter(f => f.tipo === cuadVotar && f.votos.length);
      const disc = l.filter(f => L.discrepancia(f).length);
      const hacer = () => { const n = l.filter(L.usarMedia).length; tocado(d); repintar(); toast(n ? `Puesta la media en ${plural(n, "factor", "factores")}.` : "Nada que cambiar: ya coinciden con la media.", 3000); };
      if (disc.length) confirmar(`<p>${disc.map(L.codigo).join(", ")} ${disc.length === 1 ? "tiene" : "tienen"} los votos muy separados. ¿Usar la media igualmente?</p>`, "Usar las medias", hacer, { peligro: false }); else hacer();
    }
    // --- Vista ACSA y ediciones ---
    else if (act === "vista-int") { escribir(KEY_VISTA_INT, b.dataset.v); repintar(); }
    else if (act === "ed-nueva" && d) {
      confirmar(`<p>Se creará la edición ${String((parseInt(d.edicion, 10) || 0) + 1).padStart(2, "0")}: una copia completa de este DAFO para revisarlo. Esta edición se queda como está, para compararla.</p>`, "Crear la edición", () => {
        // En los ejemplos, la edición nueva también es de ejemplo (id «ej-…»): no se guarda
        const c = L.nuevaEdicion(d, modoEjemplo ? () => "ej-ed-" + genId() : genId, hoy()); datos.dafos.push(c); if (!modoEjemplo) guardar(true);
        location.hash = `#/dafo/${c.id}/1`; toast("Edición nueva creada. Revisa cada paso y actualiza lo que haya cambiado.", 4500);
      }, { peligro: false });
    }
    // --- Paso 7 · estrategias ---
    else if (act === "es-proponer" && d) {
      const P = L.estrategiasPropuestas(d); if (!P.length) return;
      P.forEach(p => d.estrategias.push(Object.assign(L.nuevaEstrategia(genId(), p.tipo, L.siguienteNumEst(d)), { texto: p.texto, factores: p.factores, origen: p.origen })));
      tocado(d); repintar(); toast(`Propuestas ${plural(P.length, "estrategia", "estrategias")}. Reescríbelas a tu manera y puntúa su impacto y su viabilidad.`, 4500);
    }
    else if (act === "es-add" && d) {
      const e = L.nuevaEstrategia(genId(), "C", L.siguienteNumEst(d)); d.estrategias.push(e); tocado(d); repintar();
      const el = $(`[data-es="${e.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "es-del" && d) {
      const e = buscaEn(d.estrategias, id); if (!e) return;
      const hacer = () => { d.estrategias = d.estrategias.filter(x => x.id !== id); tocado(d); repintar(); };
      if (lleno(e.texto) || e.acciones.length) confirmar(`<p>Se quitará ${L.codigoEst(e)} «${esc(L.corto(e.texto || "sin escribir", 60))}»${e.acciones.length ? ` con sus ${plural(e.acciones.length, "acción", "acciones")} del plan` : ""}.</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "es-tipo" && d) { const e = buscaEn(d.estrategias, id); if (!e) return; e.tipo = b.dataset.v; tocado(d); repintar(); }
    else if (act === "es-fac" && d) {
      const e = buscaEn(d.estrategias, id); if (!e) return;
      const i = e.factores.indexOf(b.dataset.fx); if (i < 0) e.factores.push(b.dataset.fx); else e.factores.splice(i, 1);
      tocado(d); repintar(); const det = $(`.est[data-eid="${e.id}"] details`); if (det) det.open = true;
    }
    else if (act === "es-punt" && d) { const e = buscaEn(d.estrategias, id); if (!e) return; e[b.dataset.f] = e[b.dataset.f] === b.dataset.v ? "" : b.dataset.v; tocado(d); repintar(); }
    else if (act === "es-elegir" && d) {
      const e = buscaEn(d.estrategias, id); if (!e) return; e.elegida = b.dataset.v; tocado(d); repintar();
      if (e.elegida && !lleno(e.motivo)) { const el = $(`[data-es="${e.id}"][data-f="motivo"]`); if (el) el.focus(); }
    }
    else if (act === "cand" && d) {
      const f = buscaEn(d.factores, id); if (!f) return;
      f.candidato.destino = b.dataset.v;
      if (f.candidato.destino && !lleno(f.candidato.proceso)) f.candidato.proceso = L.corto(f.texto, 120);
      tocado(d); repintar();
    }
    else if (act === "llevar" && d) llevarA(d, buscaEn(d.factores, id));
    // --- Paso 8 · plan ---
    else if (act === "ac-add" && d) {
      const e = buscaEn(d.estrategias, id); if (!e) return;
      const x = L.nuevaAccion(genId()); e.acciones.push(x); tocado(d); repintar();
      const el = $(`[data-ac="${x.id}"][data-f="que"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "ac-del" && d) {
      const r = buscaAccion(d, id); if (!r) return;
      const hacer = () => { r.e.acciones = r.e.acciones.filter(x => x.id !== id); tocado(d); repintar(); };
      if (lleno(r.x.que) || r.x.seguimiento.length) confirmar(`<p>Se quitará la acción «${esc(L.corto(r.x.que || "sin escribir", 60))}»${r.x.seguimiento.length ? " con sus medidas de seguimiento" : ""}.</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "ac-estado" && d) { const r = buscaAccion(d, id); if (!r) return; r.x.estado = b.dataset.v; tocado(d); repintar(); }
    else if (act === "me-add" && d) { const r = buscaAccion(d, id); if (!r) return; r.x.seguimiento.push(Object.assign(L.nuevaMedida(genId()), { fecha: hoyIso() })); tocado(d); repintar(); }
    else if (act === "me-del" && d) { const r = buscaMedida(d, id); if (!r) return; r.x.seguimiento = r.x.seguimiento.filter(m => m.id !== id); tocado(d); repintar(); }
    else if (act === "ind-traer" && d) {
      let l = null; try { l = indicadoresDe(JSON.parse(leer("indicadores-datos") || "null")); } catch (er) { /* */ }
      indPara = id;
      if (l && l.length) { indImportados = l; const z = $(`[data-zind="${id}"]`), r = buscaAccion(d, id); if (z && r) z.innerHTML = zonaInd(r.x); }
      else confirmar("<p>No hay indicadores de la app <b>Indicadores</b> en este navegador.</p><p>Si los tienes en otro dispositivo, carga su copia de seguridad (.json).</p>", "Cargar una copia", () => $("#input-ind").click(), { titulo: "Traer de Indicadores", peligro: false });
    }
    else if (act === "sug-concl" && d) {
      const s = L.conclusionesSugeridas(d); if (!s) { toast("Aún no hay datos suficientes para proponer un texto.", 3000); return; }
      const hacer = () => { d.conclusiones = s; tocado(d); repintar(); };
      if (lleno(d.conclusiones)) confirmar("<p>Se sustituirá lo que has escrito por el texto propuesto.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (act === "cp-add" && d) { d.control[b.dataset.k].push(L.nuevaPersona()); tocado(d); repintar(); }
    else if (act === "cp-del" && d) { d.control[b.dataset.k].splice(Number(b.dataset.i), 1); tocado(d); repintar(); }
    else if (act === "ch-add" && d) {
      const H = d.control.historial, ult = H.length ? parseInt(H[H.length - 1].edicion, 10) : -1;
      H.push({ edicion: String((Number.isFinite(ult) ? ult : -1) + 1).padStart(2, "0"), fecha: hoyIso(), cambio: "" }); tocado(d); repintar();
    }
    else if (act === "ch-del" && d) { d.control.historial.splice(Number(b.dataset.i), 1); tocado(d); repintar(); }
    else if (act === "doc-ver") irInforme(b.dataset.doc);
    else if (act === "doc-word" && d) descargarWord(d, b.dataset.doc);
    else if (act === "amfe-traer" && d) {
      let l = null; try { l = L.leerAmfe(JSON.parse(leer("amfe-intercambio") || "null")); } catch (er) { /* */ }
      if (l && l.length) { amfeLista = l; repintar(); }
      else confirmar("<p>No hay ningún AMFE de la app <b>AMFE</b> en este navegador.</p><p>Si lo tienes en otro dispositivo, carga su copia de seguridad (.json).</p>", "Cargar la copia", () => $("#input-amfe").click(), { titulo: "Traer de AMFE", peligro: false });
    }
    else if (act === "amfe-copia") $("#input-amfe").click();
    else if (act === "amfe-cerrar") { amfeLista = null; repintar(); }
    else if (act === "amfe-add" && d) {
      const x = amfeLista && amfeLista[Number(b.dataset.i)]; if (!x) return;
      const f = L.factorDeAmfe(d, x, genId); if (!f) return;
      tocado(d); repintar(); toast(`Añadido ${L.codigo(f)} con su fuente. Revisa el texto y la importancia.`, 3500);
    }
    else if (act === "quiz") {
      const qi = Number(b.dataset.q), q = C.TEST[qi]; if (!q || qi in respuestas) return;
      respuestas[qi] = Number(b.dataset.o);
      const y = window.scrollY; renderPrueba(Number(rutaActual().split("/")[2]) || 0); window.scrollTo(0, y);
    }
    else if (act === "quiz-reset") { Object.keys(respuestas).forEach(k => delete respuestas[k]); renderPrueba(Number(rutaActual().split("/")[2]) || 0); }
    else if (act === "ej") { const R = respEj[b.dataset.k], i = Number(b.dataset.i); if (R && !(i in R)) { R[i] = b.dataset.v; const y = window.scrollY; renderPractica(); window.scrollTo(0, y); } }
    else if (act === "practica-reset") { Object.values(respEj).forEach(R => Object.keys(R).forEach(k => delete R[k])); renderPractica(); }
    else if (act === "pegar-abrir") { pegarAbierto = true; repintar(); const el = $("#pegar-txt"); if (el) el.focus(); }
    else if (act === "pegar-cerrar") { pegarAbierto = false; repintar(); }
    else if (act === "pegar-ok" && d) {
      const p = L.parsearFactores($("#pegar-txt").value, $("#pegar-tipo") ? $("#pegar-tipo").value : ""); if (!p.filas.length) return;
      const cuenta = L.incorporarFactores(d, p.filas, genId);
      pegarAbierto = false; tocado(d); repintar();
      const fuera = (pasoActual === 3 ? ["O", "A"] : ["F", "D"]).filter(k => cuenta[k]);
      toast(`Añadidos ${plural(p.filas.length, "factor", "factores")}.${fuera.length ? ` ${fuera.map(k => cuenta[k] + " " + (cuenta[k] === 1 ? Q[k].uno : Q[k].nom.toLowerCase())).join(" y ")} ${fuera.reduce((s, k) => s + cuenta[k], 0) === 1 ? "está" : "están"} en el paso ${pasoActual === 3 ? 4 : 3}.` : ""}`, 4500);
    }
    // --- Generales ---
    else if (act === "informe") irInforme();
    else if (act === "volver") location.hash = rutaActual();
    else if (act === "imprimir") imprimir();
    else if (act === "copia") copiaSeguridad();
    else if (act === "importar") $("#input-importar").click();
  });
  view.addEventListener("change", e => { if (e.target.id === "pegar-tipo") pegarVista(); });
  view.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (e.target.id === "idea-txt") { e.preventDefault(); const b = $("[data-act='idea-add']"); if (b) b.click(); }
    else if (e.target.id === "bloque-txt") { e.preventDefault(); const b = $("[data-act='bloque-add']"); if (b) b.click(); }
  });
  $("#banner-copiar").addEventListener("click", copiarAMisDatos);
  $("#input-importar").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) importar(f); e.target.value = ""; });
  // Copia de seguridad de la app AMFE (para «Traer de AMFE» desde otro dispositivo)
  $("#input-amfe").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let l = null; try { l = L.leerAmfe(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!l) { toast("Ese archivo no es una copia de la app AMFE (o es de una versión que esta app no entiende).", 4500); return; }
      amfeLista = l; if (actual) repintar(); toast(`Cargados ${plural(l.length, "AMFE", "AMFE")}.`, 3000);
    };
    fr.readAsText(f);
  });
  // Copia de seguridad de la app Indicadores (para «Traer de Indicadores» desde otro dispositivo)
  $("#input-ind").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let l = null; try { l = indicadoresDe(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!l || !l.length) { toast("Ese archivo no es una copia de la app Indicadores (o no tiene indicadores con nombre).", 4500); return; }
      indImportados = l; if (actual) repintar(); toast(`Cargados ${plural(l.length, "indicador", "indicadores")}. Elige el que quieras usar.`, 3500);
    };
    fr.readAsText(f);
  });

  // Imprimir: abrir los desplegables y restaurarlos después
  let cerrados = [];
  window.addEventListener("beforeprint", () => { cerrados = $$("details").filter(d => !d.open); cerrados.forEach(d => { d.open = true; }); });
  window.addEventListener("afterprint", () => { cerrados.forEach(d => { d.open = false; }); cerrados = []; });

  // ---------- Tema ----------
  function setTema(t) {
    document.documentElement.setAttribute("data-tema", t);
    const m = $("#meta-theme-color"); if (m) m.content = t === "claro" ? "#f0f7fb" : "#0d1b2a";
  }
  setTema(document.documentElement.getAttribute("data-tema") || "claro");
  $("#btn-tema").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    setTema(t); escribir("dafo-tema", t);
  });
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => { if (!leer("dafo-tema")) setTema(ev.matches ? "oscuro" : "claro"); });

  // ---------- Modales ----------
  const KEY_BIENV = "dafo-bienvenida-vista";
  const mb = $("#modal-bienvenida"), ma = $("#modal-acerca");
  const vista = leer(KEY_BIENV);
  if (!vista) mb.hidden = false;
  $("#btn-bienv-ok").addEventListener("click", () => { if ($("#modal-no-repetir").checked) escribir(KEY_BIENV, "1"); mb.hidden = true; });
  $("#btn-acerca").addEventListener("click", () => { ma.hidden = false; });
  $("#btn-acerca-cerrar").addEventListener("click", () => { ma.hidden = true; });
  ma.addEventListener("click", e => { if (e.target === ma) ma.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; $("#modal-confirmar").hidden = true; if (document.body.classList.contains("modo-reunion")) ponerReunion(false); } });

  // ---------- Versiones y novedades ----------
  const KEY_VERSION = "dafo-version-vista";
  const listaCambios = n => `<div class="version-item"><div class="version-cab"><b>${esc(n.titulo)}</b><span class="version-tag">v${esc(n.version)} · ${esc(n.fecha)}</span></div><ul>${n.cambios.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  $("#historial-versiones").innerHTML = NOVEDADES.map(listaCambios).join("");
  $("#about-version").textContent = $("#footer-version").textContent = `Versión ${APP_VERSION}`;
  const mn = $("#modal-novedades");
  $("#btn-novedades-ok").addEventListener("click", () => { mn.hidden = true; escribir(KEY_VERSION, APP_VERSION); });
  (function gestionarNovedades() {
    const vistaV = leer(KEY_VERSION);
    if (vistaV === APP_VERSION) return;
    if (!vistaV && !vista) { escribir(KEY_VERSION, APP_VERSION); return; }
    const idx = NOVEDADES.findIndex(n => n.version === vistaV);
    const nuevas = idx > 0 ? NOVEDADES.slice(0, idx) : [NOVEDADES[0]];
    $("#novedades-sub").textContent = nuevas.length > 1 ? "Esto es lo nuevo desde tu última visita" : "Gracias por mantener la app al día";
    $("#novedades-body").innerHTML = nuevas.map(listaCambios).join("");
    if (mb.hidden) mn.hidden = false;
  })();

  // ---------- Service worker y aviso de nueva versión ----------
  let actualizando = false;
  function avisoActualizacion(reg) {
    if ($("#update-banner")) return;
    const b = document.createElement("div");
    b.id = "update-banner"; b.className = "update-banner no-print"; b.setAttribute("role", "status");
    b.innerHTML = "<span>Nueva versión disponible</span><button type=\"button\">Actualizar</button>";
    b.querySelector("button").addEventListener("click", () => { guardar(true); actualizando = true; if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); b.remove(); });
    document.body.appendChild(b);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) avisoActualizacion(reg);
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) avisoActualizacion(reg); });
      });
    }).catch(() => {});
    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando || !actualizando) return; recargando = true; location.reload(); });
  }

  // ---------- Instalar como aplicación ----------
  let avisoInstalar = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); avisoInstalar = e; const b = $("#btn-instalar"); if (b) b.hidden = false; });
  $("#btn-instalar").addEventListener("click", async () => { if (!avisoInstalar) return; avisoInstalar.prompt(); try { await avisoInstalar.userChoice; } catch (e) { /* */ } avisoInstalar = null; $("#btn-instalar").hidden = true; });
  window.addEventListener("appinstalled", () => { const b = $("#btn-instalar"); if (b) b.hidden = true; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) { const i = $("#instalar-bloque"); if (i) i.classList.add("instalada"); }

  window.DAFO = { generarPDF, datos: () => datos };   // solo para pruebas desde la consola

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();

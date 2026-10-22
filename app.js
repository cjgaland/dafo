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
  const APP_VERSION = "2026.01";
  const NOVEDADES = [
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión: mirar hacia dentro y hacia fuera", cambios: [
      "Asistente en 8 pasos con «Tu siguiente paso» en la portada. En esta versión están disponibles los pasos 1 a 4.",
      "Qué se analiza y para qué: objeto, finalidad (acuerdo de gestión, acreditación, plan estratégico, proyecto…), horizonte, alcance, misión y visión, con textos propuestos.",
      "Las fuentes de información del análisis, con propuestas según la finalidad.",
      "Fortalezas y debilidades, oportunidades y amenazas, con preguntas guía por área y por ámbito del entorno (PESTEL adaptado a sanidad), el dato que respalda cada factor, su importancia y, en lo externo, su probabilidad y su peso.",
      "Avisos de las trampas más habituales: algo externo escrito como interno (o al revés), una solución escrita como factor, factores vagos, repetidos o sin datos.",
      "Pegar los factores desde Excel, Calc o Word.",
      "Matriz DAFO imprimible y en PDF, ejemplo completo de una UGC de Atención Primaria, Aprende (7 temas), glosario y copia de seguridad."] }
  ];
  const ENTREGA = 1;   // pasos ya construidos (ver L.PASOS[].entrega)

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
  const KEY_DATOS = "dafo-datos";
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
      if (!ok && !avisoSinEspacio) { avisoSinEspacio = true; toast("No se ha podido guardar en este navegador (¿modo privado o sin espacio?). Haz una copia de seguridad.", 6000); }
    };
    if (inmediato) fn(); else tGuardar = setTimeout(fn, 250);
  }
  window.addEventListener("pagehide", () => guardar(true));
  const buscaDafo = id => datos.dafos.find(x => x.id === id);
  // Un DAFO recién creado no se guarda hasta que se escribe algo
  const borradores = new Map();
  const esVacio = d => !d.factores.length && !d.fuentes.length && !["titulo", "objeto", "tipoObjeto", "finalidad", "horizonte", "mision", "vision", "incluye", "excluye", "responsable", "fecha"].some(k => lleno(d[k]));

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
    view.innerHTML = `
      <section class="hero">
        <h1 class="hero-t"><span>DAFO · CAME</span></h1>
        <p class="hero-p">Haz el <b>análisis DAFO</b> de tu servicio, tu unidad o tu proyecto y conviértelo en <b>estrategias CAME</b> y en un <b>plan de acción</b>, paso a paso y aprendiendo mientras lo haces.</p>
        <div class="hero-btns">
          <a class="btn btn--primary btn--grande" href="#/dafo/nuevo">+ Nuevo DAFO</a>
          <a class="btn btn--grande" href="#/dafo">Mis DAFO${n ? ` <span class="contador">${n}</span>` : ""}</a>
        </div>
      </section>
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
        <a class="guide-card" href="#/glosario"><span class="guide-num">A–Z</span><div><div class="guide-q">Glosario</div><div class="guide-a">${C.GLOSARIO.length} términos <b>en lenguaje llano</b>, con buscador.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AMFE}" target="_blank" rel="noopener"><span class="guide-num">!</span><div><div class="guide-q">AMFE ↗</div><div class="guide-a">App hermana: si una debilidad es un <b>proceso con riesgo</b> para el paciente, analiza qué puede fallar en él.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AUD}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Auditorías ↗</div><div class="guide-a">App hermana: <b>mide con una auditoría</b> si una práctica se cumple (higiene de manos, registros…).</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_IND}" target="_blank" rel="noopener"><span class="guide-num">%</span><div><div class="guide-q">Indicadores ↗</div><div class="guide-a">App hermana: <b>diseña los indicadores</b> con los que medirás tu plan de acción.</div></div><span class="guide-go">›</span></a>
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
  const avisosGenerales = (d, n) => L.avisosDe(d, n).filter(x => !x.factor).map(avisoHtml).join("");
  const avisosFactor = (d, n, id) => L.avisosDe(d, n).filter(x => x.factor === id).map(avisoHtml).join("");

  function renderDafo(d, n) {
    actual = d; pasoActual = n; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) { renderInforme(d); return; }
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
      <p>${p.n <= 6 ? "Mientras, en la matriz DAFO tienes los factores de cada cuadrante ordenados por su peso." : "Mientras, puedes repasar cómo se hace en «Aprende»."}</p>
      <div class="toolbar" style="justify-content:center"><a class="btn" href="#/aprende/${tema}">Repasarlo en «Aprende»</a><a class="btn btn--primary" href="#/dafo/${d.id}/4?informe=1">Ver la matriz DAFO →</a></div></div>`;
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
      <h2 class="sec-t">Fuentes <span class="contador" data-zona="nfu">${d.fuentes.length}</span></h2>
      <div class="card no-print"><p class="field-sub">Añade con un toque las fuentes habituales${fin ? ` (primero, las que suelen servir para «${esc(fin.nom)}»)` : ""} y después ajústalas:</p>
        <div class="quick">${tipos.map(k => `<button type="button" class="chip${d.fuentes.some(x => x.tipo === k) ? " active" : sug.includes(k) ? " chip--accent" : ""}" data-act="fu-sug" data-t="${k}">+ ${esc(L.FUENTES_TIPO[k].nom)}</button>`).join("")}</div></div>
      <div class="sub-lista">${d.fuentes.map((x, i) => fuenteCard(d, x, i)).join("")}</div>
      <div class="toolbar no-print"><button class="btn${d.fuentes.length ? "" : " btn--primary"}" data-act="fu-add">+ Añadir otra fuente</button></div>
      <div data-zona="avisos">${avisosGenerales(d, 2)}</div>
      <div class="placeholder-box no-print"><p><b>El equipo y las sesiones de trabajo</b> (quién participa y cuándo os reunís), con lluvia de ideas y votación, llegarán a este paso en una próxima versión.</p></div>`;
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
      <div class="toolbar no-print"><button class="btn" data-act="pegar-abrir">Pegar desde Excel</button>${d.factores.length ? `<button class="btn" data-act="informe">Ver matriz DAFO / PDF</button>` : ""}</div>
      ${pegarAbierto ? pegarHtml(n) : ""}
      <div data-zona="avisos">${avisosGenerales(d, n)}</div>
      <div class="cuad-2">${columna(d, t1)}${columna(d, t2)}</div>
      ${n === 4 ? `<h2 class="sec-t">Matriz DAFO</h2><p class="page-lead">Los cuatro cuadrantes, cada uno ordenado por su peso. En la próxima versión os quedaréis con los más importantes y los cruzaréis para sacar las estrategias.</p>
        <div data-zona="matriz">${matrizHtml(d)}</div>` : ""}`;
  }
  const paso3 = d => pasoCuadrantes(d, 3);
  const paso4 = d => pasoCuadrantes(d, 4);
  const RENDER = { 1: paso1, 2: paso2, 3: paso3, 4: paso4 };

  // ---------- Matriz DAFO (2 × 2) ----------
  function celdaMatriz(d, m, t) {
    const l = m[t];
    return `<div class="dm-c q-${t}"><h3 class="dm-t"><span class="cuad-letra">${t}</span>${Q[t].nom}</h3>
      ${l.length ? `<ol class="dm-l">${l.map(f => `<li><span class="dm-cod">${L.codigo(f)}</span><span>${esc(f.texto)}</span>${L.peso(f) ? `<span class="dm-peso">${L.peso(f)}</span>` : ""}</li>`).join("")}</ol>` : `<p class="dm-vacio">Sin ${Q[t].nom.toLowerCase()}</p>`}</div>`;
  }
  function matrizHtml(d) {
    const m = L.matrizDafo(d);
    return `<div class="dafo-m" role="table" aria-label="Matriz DAFO">
      <span></span><span class="dm-h">A favor</span><span class="dm-h">En contra</span>
      <span class="dm-lado">Interno</span>${celdaMatriz(d, m, "F")}${celdaMatriz(d, m, "D")}
      <span class="dm-lado">Externo</span>${celdaMatriz(d, m, "O")}${celdaMatriz(d, m, "A")}
    </div>
    <p class="field-sub">El número de cada factor es su peso: la importancia en los internos (1–5) y la importancia × probabilidad en los externos (1–25).</p>`;
  }

  // ---------- Vista imprimible: la matriz y los factores ----------
  function renderInforme(d) {
    const fila = (k, v) => lleno(v) ? `<tr><th>${k}</th><td>${escMl(v)}</td></tr>` : "";
    const r = L.resumen(d), fin = L.FINALIDADES[d.finalidad];
    const tablaQ = t => {
      const l = L.delTipo(d, t).filter(f => lleno(f.texto)), ext = !L.esInterno(t);
      if (!l.length) return "";
      return `<h3 class="sub-h">${Q[t].nom}</h3><div class="table-wrap"><table class="mini tabla-riesgos tabla-fx"><thead><tr><th>Cód.</th><th>Factor</th><th>${ext ? "Ámbito" : "Área"}</th><th>Dato y fuente</th><th>Imp.</th>${ext ? "<th>Prob.</th><th>Peso</th>" : ""}</tr></thead><tbody>
        ${l.map(f => { const fu = L.fuenteDe(d, f); return `<tr><td><b>${L.codigo(f)}</b></td><td><b>${esc(f.texto)}</b></td><td>${esc(L.nombreArea(f))}</td><td>${esc(f.evidencia)}${fu ? `<br><small>${esc(L.nombreFuente(fu))}</small>` : ""}</td><td>${esc(f.importancia)}</td>${ext ? `<td>${esc(f.probabilidad)}</td><td><b>${L.peso(f) || ""}</b></td>` : ""}</tr>`; }).join("")}
      </tbody></table></div>`;
    };
    view.innerHTML = `${informeBar()}${informeCab("DAFO" + (lleno(nombreDafo(d)) ? " · " + nombreDafo(d) : ""), fin ? fin.nom : "")}
      <div class="ficha">
        <div class="ficha-cab"><span class="wiz-paso">Análisis DAFO</span><h2 class="ficha-nombre">${esc(d.objeto || nombreDafo(d) || "Sin nombre")}</h2></div>
        <table class="ficha-t">${fila("Tipo", L.TIPOS_OBJETO[d.tipoObjeto])}${fila("Finalidad", fin ? fin.nom : "")}${fila("Horizonte", d.horizonte)}${fila("Misión", d.mision)}${fila("Visión", d.vision)}${fila("Qué queda dentro", d.incluye)}${fila("Qué queda fuera", d.excluye)}${fila("Responsable", d.responsable)}${fila("Fecha", d.fecha)}
          <tr><th>Resumen</th><td>${L.TIPOS.map(t => `${r[t]} ${Q[t].nom.toLowerCase()}`).join(" · ")} · ${r.conEvidencia} de ${r.n} con su dato · ${plural(r.fuentes, "fuente", "fuentes")}</td></tr></table>
      </div>
      <h2 class="sec-t">Matriz DAFO</h2>
      ${matrizHtml(d)}
      ${d.fuentes.length ? `<h2 class="sec-t">Fuentes de información</h2><div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Nº</th><th>Fuente</th><th>Tipo</th><th>Fecha</th><th>Qué dice</th></tr></thead><tbody>${d.fuentes.map((x, i) => `<tr><td>${i + 1}</td><td><b>${esc(L.nombreFuente(x))}</b></td><td>${esc(L.FUENTES_TIPO[x.tipo] ? L.FUENTES_TIPO[x.tipo].nom : "")}</td><td>${esc(x.fecha)}</td><td>${esc(x.nota)}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <h2 class="sec-t">Análisis interno</h2>${tablaQ("F")}${tablaQ("D")}
      <h2 class="sec-t">Análisis externo</h2>${tablaQ("O")}${tablaQ("A")}
      <h2 class="sec-t">Escalas</h2>
      <div class="table-wrap"><table class="mini facil-tabla tabla-escalas"><tr><th></th><th>Importancia</th><th>Probabilidad (solo externos)</th></tr>${[0, 1, 2, 3, 4].map(i => `<tr><td><b>${i + 1}</b></td><td>${esc(L.ESC_IMP[i])}</td><td>${esc(L.ESC_PROB[i])}</td></tr>`).join("")}</table></div>
      ${lleno(d.notas) ? `<p class="field-sub">${escMl(d.notas)}</p>` : ""}
      ${informePie()}`;
  }

  // Refresca lo que depende de lo escrito sin repintar los campos (no se pierde el foco)
  function refrescar(idFactor) {
    const d = actual; if (!d) return;
    const n = pasoActual;
    const Z = {
      pasos: () => pasosInner(d, n), avisos: () => avisosGenerales(d, n), consejo: () => consejoHtml(d),
      nfu: () => String(d.fuentes.length), matriz: () => matrizHtml(d)
    };
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

  // ---------- Ejemplos ----------
  function renderEjemplos() {
    view.innerHTML = `
      <h1 class="page-title">Ejemplos</h1>
      <p class="page-lead">Para ver cómo queda cada paso antes de hacerlo tú. Están aparte: puedes tocarlos, pero <b>no se guardan ni se mezclan con tus datos</b>. Si te sirve de punto de partida, pulsa «Copiar a mis datos».</p>
      <h2 class="sec-t">Ejemplo completo: UGC de Atención Primaria</h2>
      <p class="field-sub">Una UGC inventada (un centro de salud y dos consultorios, 22.000 habitantes) prepara su <b>acuerdo de gestión</b> y la acreditación. Ocho fuentes de datos y 24 factores, cada uno con su dato: el factor externo de más peso es el <i>envejecimiento de la población</i> (5 × 5 = 25); las debilidades más importantes, la <i>demora de 6 días</i> y la <i>conciliación de la medicación al 45 %</i>.</p>
      <div class="ej-grid">${C.EJEMPLOS.fichas.map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}<a class="ej-card" href="#/dafo/ej-dafo-ugc/4?informe=1"><b>Matriz DAFO</b><span>Todo en una vista imprimible</span></a></div>
      <h2 class="sec-t">Minicasos</h2>
      <p class="placeholder-box">Próximamente: casos cortos (Urgencias, Farmacia, un proyecto nuevo, el bloque quirúrgico…) para practicar cada paso.</p>
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
  function irInforme() { location.hash = rutaActual() + "?informe=1"; }
  function imprimir() {
    if (esIOS()) { guardarPDF(); return; }
    if (!document.body.classList.contains("ver-informe")) { irInforme(); setTimeout(() => window.print(), 400); return; }
    window.print();
  }

  // ---------- Copia de seguridad e importar ----------
  async function copiaSeguridad() {
    const contenido = JSON.stringify({ app: "dafo", v: L.VERSION_DATOS, exportado: hoy(), dafos: datosUsuario.dafos }, null, 1);
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
    const c = L.sanearDafo(Object.assign(clon(actual), { id: genId(), creado: hoy(), modificado: hoy() }), genId, hoy());
    // Ids nuevos para todo lo de dentro (nunca se guarda un id «ej-»), conservando qué fuente cita cada factor
    const mapa = {}; c.fuentes.forEach(x => { const n = genId(); mapa[x.id] = n; x.id = n; });
    c.factores.forEach(f => { f.id = genId(); f.fuenteId = mapa[f.fuenteId] || ""; });
    c.notas = "";
    datosUsuario.dafos.push(c); guardar(true); location.hash = `#/dafo/${c.id}/${pasoActual}`;
    toast("Copiado a tus DAFO. Ya es tuyo: cámbialo a tu gusto.", 4000);
  }

  // ---------- Enrutado ----------
  const NAV = [["", "Inicio"], ["dafo", "Mis DAFO"], ["ejemplos", "Ejemplos"], ["aprende", "Aprende"], ["glosario", "Glosario"]];
  function buildNav() { $("#calc-nav").innerHTML = NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join(""); }
  function noEncontrado(que, href, txt) { view.innerHTML = `<div class="error-box">No se encuentra ${que} en este dispositivo.</div><p><a href="${href}">${txt}</a></p>`; }
  let previo = null;
  function route() {
    const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const partes = ruta.split("/"), q = new URLSearchParams(qs || "");
    const informe = q.get("informe") === "1";
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
        if (previo !== d.id) { abiertos.clear(); pegarAbierto = false; previo = d.id; }
        let n = parseInt(partes[2], 10);
        if (!(n >= 1 && n <= 8)) { const p = L.pasoPendiente(d, ENTREGA); n = p ? p.n : 1; history.replaceState(null, "", `#/dafo/${d.id}/${n}${informe ? "?informe=1" : ""}`); }
        renderDafo(d, n);
      }
      navR = "dafo";
    } else if (partes[0] === "dafo") renderLista();
    else if (partes[0] === "ejemplos") renderEjemplos();
    else if (partes[0] === "aprende") renderAprende(parseInt(partes[1], 10) || 0);
    else if (partes[0] === "glosario") renderGlosario();
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
    if (t.dataset.fx) { const fx = buscaEn(d.factores, t.dataset.fx); if (!fx) return; fx[f] = t.value; tocado(d); refrescar(fx.id); return; }
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
    else if (act.startsWith("sug-") && d) {
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
  $("#banner-copiar").addEventListener("click", copiarAMisDatos);
  $("#input-importar").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) importar(f); e.target.value = ""; });

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
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; $("#modal-confirmar").hidden = true; } });

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

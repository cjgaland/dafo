// ============================================================
//  logic.js — Lógica PURA (sin DOM) · DAFO · CAME
//  Modelo del análisis (objeto y finalidad, fuentes, factores F·D·O·A),
//  importancia, probabilidad y peso, orden, avisos didácticos por paso
//  (¿interno o externo?, ¿factor o solución?, factor vago…), textos propuestos,
//  progreso, pegar desde Excel, saneado por esquema y fusión.
//  window.Logica en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const VERSION_DATOS = 1;
  const URL_AUD = "https://cjgaland.github.io/auditorias/";
  const URL_IND = "https://cjgaland.github.io/indicadores-calidad/";
  const URL_TM = "https://cjgaland.github.io/tamano-muestral/";
  const URL_AMFE = "https://cjgaland.github.io/amfe/";

  // ---------- Utilidades ----------
  const lleno = v => v != null && String(v).trim() !== "";
  const sinTildes = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const num = v => { if (typeof v === "number") return v; const s = String(v == null ? "" : v).trim().replace(/\s/g, "").replace(",", "."); return s === "" || isNaN(s) ? NaN : Number(s); };
  const entero1a5 = v => { const n = num(v); return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null; };
  const corto = (s, n = 60) => { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s || "sin nombre"; };
  const normal = s => sinTildes(s).replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const minuscula = s => { s = String(s || "").trim().replace(/[.]$/, ""); return s && /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s; };

  // ---------- Los cuatro cuadrantes ----------
  // interno: lo controla la unidad (F, D); externo: viene del entorno (O, A). came = estrategia que le corresponde.
  const CUADRANTES = {
    F: { k: "F", nom: "Fortalezas", uno: "fortaleza", interno: true, favor: true, came: "M", camenom: "Mantener", art: "una",
      que: "Lo que hacéis bien y depende de vosotros: capacidades, resultados y recursos que os acercan a vuestra visión." },
    D: { k: "D", nom: "Debilidades", uno: "debilidad", interno: true, favor: false, came: "C", camenom: "Corregir", art: "una",
      que: "Lo que hacéis peor o os falta, y depende de vosotros: limita vuestros resultados y se puede cambiar desde dentro." },
    O: { k: "O", nom: "Oportunidades", uno: "oportunidad", interno: false, favor: true, came: "E", camenom: "Explotar", art: "una",
      que: "Lo que pasa fuera y os puede ayudar si lo aprovecháis: planes, recursos, alianzas, tecnología, cambios sociales." },
    A: { k: "A", nom: "Amenazas", uno: "amenaza", interno: false, favor: false, came: "A", camenom: "Afrontar", art: "una",
      que: "Lo que pasa fuera y os puede perjudicar si no os preparáis: demografía, presupuesto, normativa, plantillas." }
  };
  const TIPOS = ["F", "D", "O", "A"];
  const esInterno = t => t === "F" || t === "D";

  // ---------- Pasos ----------
  // entrega = versión de la app en que se activa cada paso
  const PASOS = [
    { n: 1, k: "objeto", corto: "Qué", titulo: "Qué analizamos y para qué", que: "El servicio, la unidad o el proyecto, la finalidad del análisis y su horizonte.", entrega: 1 },
    { n: 2, k: "fuentes", corto: "Datos", titulo: "Fuentes de información", que: "Los datos con los que vais a trabajar: un DAFO sin datos es una lista de opiniones.", entrega: 1 },
    { n: 3, k: "interno", corto: "Dentro", titulo: "Mirar hacia dentro", que: "Fortalezas y debilidades: lo que depende de vosotros.", entrega: 1 },
    { n: 4, k: "externo", corto: "Fuera", titulo: "Mirar hacia fuera", que: "Oportunidades y amenazas: lo que viene del entorno.", entrega: 1 },
    { n: 5, k: "priorizar", corto: "Priorizar", titulo: "Quedarse con lo importante", que: "La matriz DAFO con los factores de más peso de cada cuadrante.", entrega: 2 },
    { n: 6, k: "cruzar", corto: "Cruzar", titulo: "Cruzar los factores", que: "La matriz cruzada: qué fortalezas y debilidades pesan ante cada oportunidad y amenaza.", entrega: 2 },
    { n: 7, k: "estrategias", corto: "CAME", titulo: "Estrategias CAME", que: "Corregir, afrontar, mantener y explotar: proponer estrategias y elegir las mejores.", entrega: 3 },
    { n: 8, k: "plan", corto: "Plan", titulo: "Plan de acción", que: "Objetivos, acciones, responsables, plazos e indicadores, y su seguimiento.", entrega: 3 }
  ];

  // ---------- Objeto y finalidad ----------
  const TIPOS_OBJETO = {
    ugc: "Unidad de Gestión Clínica", servicio: "Servicio o unidad hospitalaria", centro: "Centro (de salud, hospital…)",
    unidad: "Unidad de apoyo o de gestión", proceso: "Proceso asistencial", proyecto: "Proyecto o servicio nuevo"
  };
  // horizonte propuesto, consejo y fuentes que suelen hacer falta según la finalidad
  const FINALIDADES = {
    acuerdo: { nom: "Acuerdo de gestión", horizonte: "1 año (el del acuerdo de gestión)",
      consejo: "El DAFO prepara los objetivos del acuerdo: partid de los resultados del acuerdo anterior y terminad con objetivos medibles que puedan entrar en el nuevo.",
      fuentes: ["acuerdo", "indicadores", "encuesta", "memoria", "notificaciones"] },
    acsa: { nom: "Acreditación ACSA", horizonte: "El ciclo de la certificación (unos 5 años, con seguimiento a los 2–3)",
      consejo: "Mirad hacia dentro con los bloques del manual de estándares y usad el informe de la acreditación anterior, si lo hay. Las debilidades suelen ser los estándares que aún no cumplís.",
      fuentes: ["acreditacion", "auditorias", "cultura", "notificaciones", "encuesta"] },
    estrategico: { nom: "Plan estratégico", horizonte: "3 a 5 años",
      consejo: "Con un horizonte largo pesa más el entorno: dedicad tiempo a las oportunidades y amenazas (demografía, tecnología, planes del sistema sanitario).",
      fuentes: ["plan", "memoria", "indicadores", "encuesta", "normativa"] },
    proyecto: { nom: "Proyecto o servicio nuevo", horizonte: "Hasta su puesta en marcha y su primer año",
      consejo: "El DAFO de un proyecto dice si es viable y qué riesgos tiene: las fortalezas y debilidades son las de quien lo va a poner en marcha.",
      fuentes: ["memoria", "plan", "indicadores", "otros"] },
    cambio: { nom: "Tras un cambio importante", horizonte: "1 a 2 años",
      consejo: "Fusión, traslado, nueva dirección o un evento adverso grave: el DAFO ayuda a ordenar qué se pierde, qué se gana y qué hay que proteger.",
      fuentes: ["notificaciones", "reclamaciones", "cultura", "memoria"] },
    otra: { nom: "Otra", horizonte: "", consejo: "Escribid en el título para qué es el análisis: un DAFO sin finalidad clara no lleva a ninguna decisión.", fuentes: ["memoria", "indicadores", "encuesta"] }
  };
  // Horizonte en años que se lee de un texto («2 años», «3 a 5 años»…): el mayor número que va justo antes de «año»
  function aniosHorizonte(t) {
    const m = [...sinTildes(t).matchAll(/(\d+(?:[.,]\d+)?)(?:\s*(?:a|-|–|o)\s*(\d+(?:[.,]\d+)?))?\s*anos?\b/g)];
    const nums = m.flatMap(x => [x[1], x[2]]).filter(Boolean).map(num).filter(Number.isFinite);
    return nums.length ? Math.max(...nums) : null;
  }

  // ---------- Fuentes de información ----------
  const FUENTES_TIPO = {
    acuerdo: { nom: "Resultados del acuerdo de gestión", ej: "Evaluación del acuerdo de gestión del año anterior" },
    acreditacion: { nom: "Informe de acreditación", ej: "Informe de la acreditación ACSA (o autoevaluación)" },
    indicadores: { nom: "Indicadores asistenciales", ej: "Cuadro de mando de indicadores del Distrito o del hospital" },
    encuesta: { nom: "Encuesta de satisfacción", ej: "Encuesta de satisfacción de pacientes y usuarios" },
    cultura: { nom: "Cultura de seguridad", ej: "Encuesta de cultura de seguridad del paciente" },
    notificaciones: { nom: "Notificaciones de incidentes", ej: "Incidentes de seguridad notificados en los últimos 12 meses" },
    reclamaciones: { nom: "Reclamaciones y sugerencias", ej: "Reclamaciones y sugerencias del último año" },
    auditorias: { nom: "Auditorías", ej: "Auditorías internas o externas hechas (higiene de manos, registros…)" },
    amfe: { nom: "AMFE o mapas de riesgos", ej: "AMFE o mapas de riesgos de procesos de la unidad" },
    memoria: { nom: "Memoria de actividad y plantilla", ej: "Memoria de actividad, cartera de servicios y plantilla" },
    plan: { nom: "Planes y estrategias del sistema", ej: "Plan estratégico del Área, estrategias del sistema sanitario" },
    normativa: { nom: "Normativa", ej: "Normativa nueva o en preparación que os afecta" },
    profesionales: { nom: "Opinión de los profesionales", ej: "Encuesta o grupo con el personal de la unidad" },
    otros: { nom: "Otra fuente", ej: "" }
  };
  // Quién aporta el factor (para ver si se ha escuchado a todos)
  const APORTA = { equipo: "El equipo", direccion: "La dirección", pacientes: "Pacientes o ciudadanía", datos: "Los datos", otros: "Otros" };

  // ---------- Áreas del análisis interno y ámbitos del externo, con preguntas guía ----------
  const AREAS = {
    personas: { nom: "Personas y equipo", preg: ["¿Cómo es la plantilla: estable, suficiente, con qué experiencia?", "¿Qué formación tiene el equipo y qué le falta?", "¿Cómo es el clima de trabajo y la implicación?"] },
    organizacion: { nom: "Organización y liderazgo", preg: ["¿Están claros los objetivos y quién decide qué?", "¿Cómo os coordináis dentro de la unidad?", "¿Se reúne el equipo y se comparten los resultados?"] },
    procesos: { nom: "Procesos asistenciales y continuidad", preg: ["¿Qué procesos funcionan bien y cuáles dan problemas?", "¿Tenéis protocolos al día? ¿Se cumplen?", "¿Cómo es la continuidad con otros niveles (alta, derivaciones)?"] },
    seguridad: { nom: "Seguridad del paciente", preg: ["¿Qué incidentes se repiten en las notificaciones?", "¿Cómo están la higiene de manos, la identificación, la conciliación de la medicación?", "¿Hay cultura de notificar y aprender de los errores?"] },
    resultados: { nom: "Resultados", preg: ["¿En qué indicadores estáis por encima del estándar? ¿Y por debajo?", "¿Cómo salió el último acuerdo de gestión?", "¿Cuál es la demora o la accesibilidad?"] },
    recursos: { nom: "Recursos, espacios y equipamiento", preg: ["¿Los espacios sirven para lo que hacéis?", "¿Qué equipamiento falta o está viejo?", "¿Tenéis presupuesto propio o margen para decidir?"] },
    sistemas: { nom: "Sistemas de información", preg: ["¿Se registra bien en la historia clínica?", "¿Tenéis los datos que necesitáis para decidir?", "¿Usáis bien las herramientas digitales disponibles?"] },
    ciudadania: { nom: "Relación con la ciudadanía", preg: ["¿Qué os reconocen los pacientes? ¿De qué se quejan?", "¿Participan los pacientes en las decisiones?", "¿Cómo informáis y educáis en salud?"] },
    docencia: { nom: "Docencia e investigación", preg: ["¿Tenéis residentes o alumnado?", "¿Participáis en proyectos de investigación o mejora?", "¿Compartís lo que hacéis (jornadas, publicaciones)?"] }
  };
  const AMBITOS = {
    politico: { nom: "Político e institucional", preg: ["¿Qué planes o estrategias del sistema sanitario os afectan?", "¿Hay cambios en la dirección del Área o del Distrito?", "¿Qué prioridades marcan los responsables?"] },
    economico: { nom: "Económico y plantillas", preg: ["¿Cómo viene el presupuesto?", "¿Es fácil cubrir plazas y sustituciones?", "¿Hay financiación para proyectos o equipamiento?"] },
    social: { nom: "Social y demográfico", preg: ["¿Cómo cambia la población: edad, cronicidad, inmigración, población flotante?", "¿Qué esperan ahora los pacientes?", "¿Qué problemas sociales llegan a la consulta?"] },
    tecnologico: { nom: "Tecnológico", preg: ["¿Qué herramientas digitales llegan (telemedicina, historia digital, receta)?", "¿Qué técnicas o tratamientos nuevos cambiarán el trabajo?", "¿Cómo de fiables son los sistemas que usáis?"] },
    ecologico: { nom: "Territorio y entorno", preg: ["¿Cómo es el territorio: dispersión, accesos, transporte?", "¿Hay riesgos ambientales o climáticos (calor, inundaciones)?"] },
    legal: { nom: "Legal y normativo", preg: ["¿Qué normas nuevas os obligan o ayudan?", "¿Qué requisitos de acreditación o de protección de datos os afectan?"] },
    sanitario: { nom: "Entorno sanitario cercano", preg: ["¿Cómo es la relación con el hospital, otros centros y otros niveles?", "¿Qué apoyo dan el Distrito, el Área o la Agencia de Calidad?", "¿Qué hacen otras unidades parecidas?"] },
    comunidad: { nom: "Comunidad y aliados", preg: ["¿Hay asociaciones de pacientes o vecinales activas?", "¿Qué puede aportar el ayuntamiento o los servicios sociales?", "¿Hay colegios, empresas o voluntariado con los que colaborar?"] },
    conocimiento: { nom: "Formación e investigación", preg: ["¿Hay universidad, unidad docente o grupos de investigación cerca?", "¿Qué oferta formativa existe?"] }
  };
  // Bloques del manual de estándares de unidades (confirmados por el autor); la vista por bloques llega más adelante
  const BLOQUES_ACSA = {
    ciudadano: "El ciudadano, centro del sistema sanitario", organizacion: "Organización de la actividad centrada en el paciente",
    profesionales: "Los profesionales", soporte: "Procesos de soporte", resultados: "Resultados"
  };
  const AREA_A_BLOQUE = { personas: "profesionales", organizacion: "organizacion", procesos: "organizacion", seguridad: "organizacion", resultados: "resultados", recursos: "soporte", sistemas: "soporte", ciudadania: "ciudadano", docencia: "profesionales" };
  const areasDe = t => esInterno(t) ? AREAS : AMBITOS;
  const nombreArea = f => { const A = areasDe(f.tipo)[f.area]; return A ? A.nom : ""; };

  // ---------- Escalas ----------
  const ESC_IMP = ["Poco importante: apenas cambia nada.", "Algo importante.", "Importante: se nota en los resultados o en el día a día.", "Muy importante.", "Clave: decide si se cumple la finalidad del análisis."];
  const ESC_PROB = ["Muy poco probable en el horizonte del análisis.", "Poco probable.", "Puede ocurrir (50 %).", "Probable.", "Casi seguro, o ya está ocurriendo."];
  const ESC_PREG = { importancia: "¿Cuánto pesa en lo que queréis conseguir?", probabilidad: "¿Cuánto es de esperar que ocurra en el horizonte elegido?" };

  // ---------- Peso y orden ----------
  // Interno: peso = importancia (1–5). Externo: peso = importancia × probabilidad (1–25). Sin datos: null.
  function peso(f) {
    const i = entero1a5(f.importancia); if (!i) return null;
    if (esInterno(f.tipo)) return i;
    const p = entero1a5(f.probabilidad); return p ? i * p : null;
  }
  const PESO_MAX = t => esInterno(t) ? 5 : 25;
  const codigo = f => f.tipo + f.num;
  // Orden dentro de un cuadrante: más peso primero; a igual peso, más importancia; luego por número. Sin peso al final.
  function ordenar(factores, por = "peso") {
    const l = factores.map((f, i) => ({ f, i, p: peso(f) || 0, im: entero1a5(f.importancia) || 0, n: Number(f.num) || 0 }));
    if (por === "peso") l.sort((a, b) => b.p - a.p || b.im - a.im || a.n - b.n || a.i - b.i);
    else l.sort((a, b) => a.n - b.n || a.i - b.i);
    return l.map(x => x.f);
  }
  // Factores de un cuadrante (con texto) ordenados
  const delTipo = (d, t, por) => ordenar(d.factores.filter(f => f.tipo === t), por);
  function matrizDafo(d, por = "peso") { const m = {}; TIPOS.forEach(t => { m[t] = delTipo(d, t, por).filter(f => lleno(f.texto)); }); return m; }
  // Puesto de cada factor dentro de su cuadrante por peso (empates comparten puesto)
  function puestos(d) {
    const m = {};
    TIPOS.forEach(t => {
      const l = d.factores.filter(f => f.tipo === t), vals = l.map(peso).filter(v => v).sort((a, b) => b - a);
      l.forEach(f => { const v = peso(f); m[f.id] = v ? vals.indexOf(v) + 1 : null; });
    });
    return m;
  }

  // ---------- Modelo ----------
  function nuevoDafo(id, fecha) {
    return { id, titulo: "", objeto: "", tipoObjeto: "", finalidad: "", horizonte: "", mision: "", vision: "", incluye: "", excluye: "",
      responsable: "", fecha: "", fuentes: [], factores: [], notas: "", creado: fecha, modificado: fecha };
  }
  function nuevaFuente(id) { return { id, tipo: "", nombre: "", fecha: "", nota: "" }; }
  function nuevoFactor(id, tipo = "F", n = 0) { return { id, tipo, num: n, texto: "", area: "", evidencia: "", fuenteId: "", aporta: "", importancia: "", probabilidad: "" }; }
  const siguienteNum = (d, t) => d.factores.filter(f => f.tipo === t).reduce((m, f) => Math.max(m, Number(f.num) || 0), 0) + 1;
  const fuenteDe = (d, f) => d.fuentes.find(x => x.id === f.fuenteId) || null;
  const nombreFuente = x => x ? (lleno(x.nombre) ? x.nombre : FUENTES_TIPO[x.tipo] ? FUENTES_TIPO[x.tipo].nom : "") : "";

  // ---------- Textos propuestos ----------
  const sugerirHorizonte = d => FINALIDADES[d.finalidad] ? FINALIDADES[d.finalidad].horizonte : "";
  function sugerirTitulo(d, anio) {
    if (!lleno(d.objeto)) return "";
    return `DAFO ${d.objeto.trim()}${anio ? " " + anio : ""}`;
  }
  function sugerirMision(d) {
    if (!lleno(d.objeto)) return "";
    if (d.tipoObjeto === "proyecto") return `Poner en marcha «${d.objeto.trim()}» para dar a la población una atención segura, accesible y de calidad, con los recursos disponibles.`;
    return `Prestar a la población que atiende ${articulo(d)} una atención sanitaria segura, accesible, eficiente y de calidad, centrada en las personas y basada en el conocimiento.`;
  }
  function sugerirVision(d) {
    if (!lleno(d.objeto)) return "";
    return `Ser ${d.tipoObjeto === "proyecto" ? "un servicio" : "una unidad"} de referencia por la seguridad y la calidad de su atención, con un equipo implicado y unos resultados que se miden y se comparten.`;
  }
  // «la UGC de…» → «la UGC de…»; «UGC de…» → «la UGC de…» (para las frases propuestas)
  function articulo(d) {
    const o = d.objeto.trim();
    if (/^(el|la|los|las)\s/i.test(o)) return minuscula(o.split(" ")[0]) + o.slice(o.indexOf(" "));
    const fem = /^(ugc|unidad|uci|consulta|planta|area|zona)\b/i.test(sinTildes(o));
    return (fem ? "la " : "el ") + o;
  }

  // ---------- Redacción: ¿interno o externo?, ¿factor o solución?, ¿concreto? ----------
  // Patrones estrechos a propósito: es mejor callar que avisar en falso.
  const RE_SOLUCION = /^(hay que|habria que|se debe|se deberia|debemos|deberiamos|tenemos que|necesitamos|mejorar|implantar|crear|aumentar|potenciar|fomentar|establecer|elaborar|realizar|disenar|promover|impulsar|reforzar|contratar|formar a|revisar los|actualizar los|poner en marcha|conseguir)\b/;
  const RE_EXTERNO = /\b(consejeria|ministerio|servicio andaluz de salud|gobierno|normativa|legislacion|ley|decreto|envejecimiento de la poblacion|poblacion (envejecida|flotante|inmigrante)|demografi[a-z]*|crisis economica|pandemia|epidemia|ola de calor|recortes? presupuestari[oa]s?|restricciones? presupuestari[oa]s?|politica sanitaria|desinformacion|mercado laboral)\b/;
  const RE_INTERNO = /(\bnuestr[oa]s?\b|^(falta de|escasa|escaso|poca|poco|baja|bajo|mala|deficiente|buena|buen|alta|alto) (formacion|motivacion|implicacion|cumplimentacion|coordinacion interna|comunicacion interna|liderazgo|adherencia|cohesion)\b|\b(formacion|motivacion|implicacion) del (equipo|personal)\b|\bel equipo de la unidad\b)/;
  const GENERICOS = new Set(["comunicacion", "recursos", "motivacion", "organizacion", "coordinacion", "formacion", "personal", "calidad", "presupuesto", "falta de recursos", "falta de personal", "falta de medios", "falta de tiempo", "pocos recursos", "buen equipo", "buen ambiente", "mal ambiente", "la crisis", "crisis", "tecnologia", "el equipo", "equipo", "liderazgo", "infraestructura", "espacio", "la demanda", "demanda", "sobrecarga", "presion asistencial", "burocracia"]);
  const RE_PERSONA = /(\b(dr|dra|doctor|doctora|sr|sra|senor|senora|d|dna)\.?\s+[a-z]{3,}|\bnhc\b|\bnuhsa\b|\b\d{8,}\b)/;
  // Devuelve una lista de { k, texto } con lo que la app detecta en la frase de un factor de tipo t
  function revisarRedaccion(texto, t) {
    const s = normal(texto), C = CUADRANTES[t], R = [];
    if (!s) return R;
    if (RE_SOLUCION.test(s)) R.push({ k: "solucion", texto: "Parece una acción o una solución, no un factor. ¿Qué problema o qué situación hay detrás? Escribe eso; la solución vendrá en las estrategias." });
    else if (esInterno(t) && RE_EXTERNO.test(s)) R.push({ k: "externo", texto: `Parece algo que viene de fuera (${C.favor ? "una oportunidad" : "una amenaza"}). ¿Lo podéis cambiar vosotros? Si no, va en ${C.favor ? "oportunidades" : "amenazas"}.` });
    else if (!esInterno(t) && RE_INTERNO.test(s)) R.push({ k: "interno", texto: `Parece algo de dentro de la unidad (${C.favor ? "una fortaleza" : "una debilidad"}). Si depende de vosotros, va en ${C.favor ? "fortalezas" : "debilidades"}.` });
    const palabras = s.split(" ").filter(Boolean);
    if (GENERICOS.has(s) || palabras.length < 3) R.push({ k: "vago", texto: "Es muy general. Concreta: ¿qué exactamente?, ¿desde cuándo?, ¿qué dato lo muestra? Un factor vago no lleva a ninguna decisión." });
    if (RE_PERSONA.test(s)) R.push({ k: "persona", texto: "Parece que nombra a una persona o trae un número de historia. El DAFO analiza la unidad, no a personas: no escribas nombres ni datos de pacientes." });
    return R;
  }
  // Parecido entre dos frases: proporción de palabras con contenido que comparten (0 a 1)
  const VACIAS = new Set(["para", "como", "pero", "sobre", "entre", "desde", "hasta", "este", "esta", "estos", "estas", "unidad", "muy", "poco", "mucho", "tiene", "tienen", "hay", "sin", "con", "por", "los", "las", "del", "que", "una", "uno", "más", "mas"]);
  const palabrasDe = s => new Set(normal(s).split(" ").filter(w => w.length >= 4 && !VACIAS.has(w)));
  function parecido(a, b) {
    const A = palabrasDe(a), B = palabrasDe(b);
    if (A.size < 2 || B.size < 2) return normal(a) && normal(a) === normal(b) ? 1 : 0;
    let c = 0; A.forEach(w => { if (B.has(w)) c++; });
    return c / Math.min(A.size, B.size);
  }

  // ---------- Avisos didácticos por paso ----------
  // Cada aviso: { paso, nivel: nota|warn|error, texto } y, si es de un factor, factor = id
  const conPaso = (n, l) => l.map(x => Object.assign({ paso: n }, x));
  function avisosObjeto(d) {
    const A = [];
    if (!lleno(d.objeto)) A.push({ nivel: "nota", texto: "Escribe qué vais a analizar: el servicio, la unidad, el centro o el proyecto." });
    else if (/\b(todo el|toda la|todos los|todas las) (area|hospital|distrito|sistema|servicios|centros|unidades)\b/.test(normal(d.objeto))) A.push({ nivel: "warn", texto: "El objeto es muy amplio. Un DAFO de «todo el Área» sale tan general que no ayuda a decidir: mejor uno por unidad o por servicio." });
    if (!lleno(d.finalidad)) A.push({ nivel: "nota", texto: "Elige para qué es el análisis. Un DAFO «por hacerlo» no lleva a ninguna decisión; la finalidad cambia qué datos buscar y qué preguntas haceros." });
    if (!lleno(d.horizonte)) { if (lleno(d.finalidad)) A.push({ nivel: "nota", texto: "Marca el horizonte temporal: no es lo mismo una oportunidad para el año que viene que para dentro de cinco." }); }
    else { const n = aniosHorizonte(d.horizonte); if (n && n > 5) A.push({ nivel: "warn", texto: `Un horizonte de ${n} años es muy largo: el entorno cambia antes. Lo habitual es de 1 a 5 años.` }); }
    if (lleno(d.finalidad) && d.finalidad !== "otra" && lleno(d.objeto) && !lleno(d.vision)) A.push({ nivel: "nota", texto: "La visión (a dónde queréis llegar) es opcional, pero ayuda: una fortaleza o una debilidad lo son respecto a esa meta." });
    return conPaso(1, A);
  }
  function avisosFuentes(d) {
    const A = [], F = d.fuentes.filter(x => lleno(x.nombre) || lleno(x.tipo));
    if (!F.length) A.push({ nivel: "warn", texto: "Aún no hay ninguna fuente de datos. Un DAFO sin datos es una lista de opiniones: el año que viene no sabréis si algo ha mejorado." });
    const sinNombre = d.fuentes.filter(x => !lleno(x.nombre) && !lleno(x.tipo)).length;
    if (sinNombre) A.push({ nivel: "nota", texto: `${sinNombre === 1 ? "Hay una fuente" : "Hay " + sinNombre + " fuentes"} sin nombre.` });
    const fin = FINALIDADES[d.finalidad];
    if (fin && F.length) {
      const faltan = fin.fuentes.filter(t => t !== "otros" && !F.some(x => x.tipo === t)).slice(0, 3);
      if (faltan.length) A.push({ nivel: "nota", texto: `Para ${d.finalidad === "otra" ? "este análisis" : "un DAFO para «" + fin.nom + "»"} suelen servir también: ${faltan.map(t => FUENTES_TIPO[t].nom.toLowerCase()).join(", ")}.` });
    }
    if (F.length && !F.some(x => ["encuesta", "reclamaciones"].includes(x.tipo))) A.push({ nivel: "nota", texto: "Ninguna fuente recoge la voz de los pacientes (encuesta de satisfacción, reclamaciones). Lo que ven ellos no siempre coincide con lo que vemos nosotros." });
    return conPaso(2, A);
  }
  // Avisos de un par de cuadrantes (paso 3: F y D; paso 4: O y A)
  function avisosCuadrantes(d, n) {
    const [t1, t2] = n === 3 ? ["F", "D"] : ["O", "A"], A = [];
    const L1 = d.factores.filter(f => f.tipo === t1), L2 = d.factores.filter(f => f.tipo === t2), todos = [...L1, ...L2];
    const conTexto = todos.filter(f => lleno(f.texto));
    [t1, t2].forEach(t => { if (!d.factores.some(f => f.tipo === t && lleno(f.texto))) A.push({ nivel: "nota", texto: `Aún no hay ${CUADRANTES[t].nom.toLowerCase()}. ${CUADRANTES[t].que}` }); });
    if (!conTexto.length) return conPaso(n, A);
    const vacios = todos.filter(f => !lleno(f.texto)).length;
    if (vacios) A.push({ nivel: "warn", texto: `${vacios === 1 ? "Hay un factor" : "Hay " + vacios + " factores"} sin escribir.` });
    // Redacción, factor a factor
    todos.forEach(f => revisarRedaccion(f.texto, f.tipo).forEach(r => A.push({ nivel: r.k === "vago" ? "nota" : "warn", factor: f.id, k: r.k, texto: `${codigo(f)}: ${r.texto}` })));
    // Repetidos dentro de un cuadrante y el mismo asunto a favor y en contra
    [L1, L2].forEach(L => L.forEach((f, i) => L.slice(i + 1).forEach(g => {
      if (lleno(f.texto) && lleno(g.texto) && parecido(f.texto, g.texto) >= 0.8) A.push({ nivel: "nota", factor: g.id, texto: `${codigo(g)} se parece mucho a ${codigo(f)}. Si dicen lo mismo, júntalos; si no, distingue mejor la diferencia.` });
    })));
    L1.forEach(f => L2.forEach(g => {
      if (lleno(f.texto) && lleno(g.texto) && parecido(f.texto, g.texto) >= 0.6) A.push({ nivel: "nota", factor: g.id, texto: `${codigo(f)} y ${codigo(g)} parecen hablar de lo mismo, a favor y en contra. Decidid cuál pesa más, o separad los dos aspectos (por ejemplo, «equipo estable» y «equipo con poca formación en seguridad»).` });
    }));
    // Puntuación
    const sinImp = conTexto.filter(f => !lleno(f.importancia)).length;
    const malImp = conTexto.filter(f => lleno(f.importancia) && !entero1a5(f.importancia)).length;
    if (malImp) A.push({ nivel: "error", texto: "La importancia tiene que ser un número entero del 1 al 5." });
    if (sinImp) A.push({ nivel: "nota", texto: `${sinImp === 1 ? "Un factor no tiene" : sinImp + " factores no tienen"} importancia. Sin ella no se puede priorizar.` });
    if (n === 4) {
      const sinProb = conTexto.filter(f => !lleno(f.probabilidad)).length;
      if (sinProb) A.push({ nivel: "nota", texto: `${sinProb === 1 ? "Un factor del entorno no tiene" : sinProb + " factores del entorno no tienen"} probabilidad. En lo externo, el peso es importancia × probabilidad.` });
    }
    const imps = conTexto.map(f => entero1a5(f.importancia)).filter(Boolean);
    if (imps.length >= 5 && new Set(imps).size === 1) A.push({ nivel: "nota", texto: `Todos los factores tienen importancia ${imps[0]}. Si todo es igual de importante, nada lo es: usad la escala completa para que se vea qué pesa más.` });
    else if (imps.length >= 6 && imps.filter(v => v >= 4).length / imps.length >= 0.8) A.push({ nivel: "nota", texto: "Casi todo tiene importancia 4 o 5. Comparad los factores entre sí: ¿cuáles pesan de verdad en la finalidad del análisis?" });
    // Evidencia
    const sinEv = conTexto.filter(f => !lleno(f.evidencia) && !lleno(f.fuenteId)).length;
    if (conTexto.length >= 3 && sinEv / conTexto.length > 0.5) A.push({ nivel: "nota", texto: `${sinEv} de ${conTexto.length} factores no tienen un dato que los respalde. Sin evidencia, el DAFO es una lista de opiniones: anotad la cifra o la fuente.` });
    // Cantidad y equilibrio
    [t1, t2].forEach(t => { const k = d.factores.filter(f => f.tipo === t && lleno(f.texto)).length; if (k > 10) A.push({ nivel: "nota", texto: `Hay ${k} ${CUADRANTES[t].nom.toLowerCase()}. Está bien para empezar; en el paso 5 os quedaréis con las de más peso (lo habitual, unas 5).` }); });
    const k1 = L1.filter(f => lleno(f.texto)).length, k2 = L2.filter(f => lleno(f.texto)).length;
    if (Math.min(k1, k2) >= 1 && Math.max(k1, k2) >= 4 && Math.max(k1, k2) >= 3 * Math.min(k1, k2)) {
      const mas = k1 > k2 ? t1 : t2, menos = mas === t1 ? t2 : t1;
      A.push({ nivel: "nota", texto: n === 3
        ? (mas === "D" ? `Hay muchas más debilidades (${k2}) que fortalezas (${k1}). La autocrítica está bien, pero ¿no hay nada que hagáis bien? Las fortalezas son las que permiten mejorar.` : `Hay muchas más fortalezas (${k1}) que debilidades (${k2}). ¿Autocomplacencia? Mirad los indicadores, las notificaciones y las reclamaciones.`)
        : (mas === "A" ? `Hay muchas más amenazas (${k2}) que oportunidades (${k1}). Un DAFO sin oportunidades suele ser un DAFO pesimista, no un entorno sin oportunidades.` : `Hay muchas más oportunidades (${k1}) que amenazas (${k2}). ¿Seguro que el entorno no trae ningún riesgo (plantillas, presupuesto, demografía)?`) });
    }
    return conPaso(n, A);
  }
  const avisosInterno = d => avisosCuadrantes(d, 3);
  const avisosExterno = d => avisosCuadrantes(d, 4);
  const avisosDe = (d, n) => ({ 1: avisosObjeto, 2: avisosFuentes, 3: avisosInterno, 4: avisosExterno }[n] || (() => []))(d);

  // ---------- Resumen y progreso ----------
  function resumen(d) {
    const r = { fuentes: d.fuentes.filter(x => lleno(x.nombre) || lleno(x.tipo)).length, n: 0, conEvidencia: 0 };
    TIPOS.forEach(t => { r[t] = d.factores.filter(f => f.tipo === t && lleno(f.texto)).length; r.n += r[t]; });
    r.conEvidencia = d.factores.filter(f => lleno(f.texto) && (lleno(f.evidencia) || lleno(f.fuenteId))).length;
    r.puntuados = d.factores.filter(f => lleno(f.texto) && peso(f)).length;
    return r;
  }
  function progreso(d) {
    const listo = t => { const l = d.factores.filter(f => f.tipo === t && lleno(f.texto)); return l.length >= 1 && l.every(f => peso(f)); };
    return {
      1: lleno(d.objeto) && lleno(d.finalidad),
      2: d.fuentes.some(x => lleno(x.nombre) || lleno(x.tipo)),
      3: listo("F") && listo("D"),
      4: listo("O") && listo("A"),
      5: false, 6: false, 7: false, 8: false
    };
  }
  // Primer paso disponible sin terminar
  function pasoPendiente(d, entrega) {
    const g = progreso(d);
    return PASOS.filter(p => p.entrega <= entrega).find(p => !g[p.n]) || null;
  }
  const nombreDafo = d => d.titulo || d.objeto || "";
  const TEXTO_PASO = {
    1: d => lleno(d.objeto) ? `Elige la finalidad del análisis de «${corto(d.objeto, 50)}» y su horizonte temporal.` : "Decide qué vais a analizar (servicio, unidad o proyecto) y para qué.",
    2: () => "Apunta las fuentes de datos con las que vais a trabajar: resultados, encuestas, notificaciones, indicadores…",
    3: d => d.factores.some(f => esInterno(f.tipo)) ? "Completa las fortalezas y debilidades: cada una con su dato y su importancia." : "Mira hacia dentro: ¿qué hacéis bien (fortalezas) y qué hacéis peor (debilidades)?",
    4: d => d.factores.some(f => !esInterno(f.tipo)) ? "Completa las oportunidades y amenazas: cada una con su importancia y su probabilidad." : "Mira hacia fuera: ¿qué os puede ayudar (oportunidades) y qué os puede perjudicar (amenazas)?"
  };
  function siguientePaso(datos, entrega) {
    const L = datos.dafos;
    if (!L.length) return { k: "crear", texto: "Empieza tu primer DAFO: elige tu servicio, tu unidad o un proyecto, y para qué lo necesitáis (acuerdo de gestión, acreditación…).", href: "#/dafo/nuevo", btn: "Crear un DAFO" };
    const d = L.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)))[0];
    const p = pasoPendiente(d, entrega), nom = corto(nombreDafo(d) || "tu DAFO", 50);
    if (p) return { k: "paso" + p.n, texto: `«${nom}»: ${TEXTO_PASO[p.n](d)}`, href: `#/dafo/${d.id}/${p.n}`, btn: `Ir al paso ${p.n}` };
    return { k: "listo", texto: `«${nom}» tiene sus cuatro cuadrantes completos y puntuados. La priorización, la matriz cruzada y las estrategias CAME llegan en la próxima versión; mientras, revisa la matriz DAFO.`, href: `#/dafo/${d.id}/4?informe=1`, btn: "Ver la matriz DAFO" };
  }

  // ---------- Pegar una lista desde Excel/Calc/Word ----------
  const CAB_PEGAR = {
    tipo: ["tipo", "cuadrante", "dafo", "categoria"],
    texto: ["factor", "factores", "texto", "descripcion", "fortaleza", "debilidad", "oportunidad", "amenaza"],
    area: ["area", "ambito", "aspecto"],
    evidencia: ["evidencia", "dato", "datos", "fuente", "prueba"],
    importancia: ["importancia", "imp", "i", "peso"],
    probabilidad: ["probabilidad", "prob", "p"]
  };
  const ORDEN_PEGAR = ["tipo", "texto", "evidencia", "importancia", "probabilidad"];
  function tipoDeTexto(v) {
    const t = sinTildes(v).replace(/s$/, "");
    if (["f", "fortaleza"].includes(t)) return "F";
    if (["d", "debilidad", "debilidade"].includes(t)) return "D";
    if (["o", "oportunidad", "oportunidade"].includes(t)) return "O";
    if (["a", "amenaza"].includes(t)) return "A";
    return null;
  }
  // tipoDef: cuadrante para las filas que no dicen el suyo (por ejemplo, una lista de una sola columna)
  function parsearFactores(texto, tipoDef) {
    const lineas = String(texto || "").replace(/\r\n?/g, "\n").split("\n").map(l => l.replace(/^\s*[-•·*]\s*/, "")).filter(l => l.trim());
    if (!lineas.length) return { filas: [], errores: ["No hay nada que importar."], cabecera: false };
    const sep = lineas.some(l => l.includes("\t")) ? "\t" : lineas.some(l => l.includes(";")) ? ";" : null;
    const filas = [], errores = [];
    if (!sep) {
      if (!tipoDef) return { filas: [], errores: ["Elige en qué cuadrante van estos factores."], cabecera: false };
      lineas.forEach(l => filas.push({ tipo: tipoDef, texto: l.trim().slice(0, 500), area: "", evidencia: "", importancia: "", probabilidad: "" }));
      return { filas, errores, cabecera: false };
    }
    const celdas = lineas.map(l => l.split(sep).map(c => c.trim().replace(/^"(.*)"$/, "$1")));
    let mapa = ORDEN_PEGAR.slice(), cabecera = false;
    const recon = celdas[0].map(c => { const t = sinTildes(c); return Object.keys(CAB_PEGAR).find(k => CAB_PEGAR[k].includes(t)) || null; });
    if (recon.filter(Boolean).length >= 2 && !celdas[0].some(c => Number.isFinite(num(c)))) { cabecera = true; mapa = recon; celdas.shift(); }
    // Sin columna de tipo reconocible en la primera celda: todas las columnas se corren una posición
    if (!cabecera && celdas.length && !tipoDeTexto(celdas[0][0])) mapa = ORDEN_PEGAR.slice(1);
    celdas.forEach((c, i) => {
      const r = { tipo: "", texto: "", area: "", evidencia: "", importancia: "", probabilidad: "" };
      c.forEach((v, j) => { const k = mapa[j]; if (k && r[k] === "") r[k] = v.slice(0, k === "texto" ? 500 : 1000); });
      if (!lleno(r.texto)) return;
      const fila = i + 1 + (cabecera ? 1 : 0);
      r.tipo = tipoDeTexto(r.tipo) || tipoDef || "";
      if (!r.tipo) { errores.push(`Fila ${fila}: no se sabe si es fortaleza, debilidad, oportunidad o amenaza (no se importa).`); return; }
      if (lleno(r.importancia) && !entero1a5(r.importancia)) errores.push(`Fila ${fila}: la importancia no es un entero del 1 al 5 (se importa igualmente para que la corrijas).`);
      if (lleno(r.probabilidad) && !entero1a5(r.probabilidad)) errores.push(`Fila ${fila}: la probabilidad no es un entero del 1 al 5.`);
      if (esInterno(r.tipo)) r.probabilidad = "";
      // Área o ámbito escrito con su nombre
      const areas = areasDe(r.tipo), ka = Object.keys(areas).find(k => normal(areas[k].nom) === normal(r.area) || k === normal(r.area));
      r.area = ka || "";
      filas.push(r);
    });
    if (!filas.length && !errores.length) errores.push("No se ha encontrado ninguna fila con un factor escrito.");
    return { filas, errores, cabecera };
  }
  function incorporarFactores(d, filas, genId) {
    const cuenta = { F: 0, D: 0, O: 0, A: 0 };
    filas.forEach(r => {
      const f = Object.assign(nuevoFactor(genId(), r.tipo, siguienteNum(d, r.tipo)), { texto: r.texto, area: r.area, evidencia: r.evidencia, importancia: r.importancia, probabilidad: r.probabilidad });
      d.factores.push(f); cuenta[r.tipo]++;
    });
    return cuenta;
  }

  // ---------- Saneado por esquema (lo que se carga o se importa nunca se usa sin pasar por aquí) ----------
  // [max] = texto; "id" = id propio; "ref" = id de otro objeto; "ent" = entero ≥ 0; {en} = enumerado;
  // {de: esquema, max} = lista de objetos
  const idValido = v => typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v);
  const txt = (v, max) => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, max) : "";
  const ESQ = {
    fuente: { id: "id", tipo: { en: Object.keys(FUENTES_TIPO) }, nombre: [300], fecha: [40], nota: [1000] },
    factor: { id: "id", tipo: { en: TIPOS }, num: "ent", texto: [500], area: { en: [...Object.keys(AREAS), ...Object.keys(AMBITOS)] }, evidencia: [1000], fuenteId: "ref",
      aporta: { en: Object.keys(APORTA) }, importancia: [2], probabilidad: [2] },
    dafo: { id: "id", titulo: [200], objeto: [300], tipoObjeto: { en: Object.keys(TIPOS_OBJETO) }, finalidad: { en: Object.keys(FINALIDADES) }, horizonte: [200],
      mision: [1500], vision: [1500], incluye: [1500], excluye: [1500], responsable: [300], fecha: [40],
      fuentes: { de: "fuente", max: 60 }, factores: { de: "factor", max: 400 }, notas: [3000], creado: [40], modificado: [40] }
  };
  const FABRICA = { fuente: nuevaFuente, factor: id => nuevoFactor(id), dafo: id => nuevoDafo(id, "") };
  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "ent") { const n = num(v); r[k] = Number.isInteger(n) && n >= 0 && n < 1e6 ? n : 0; }
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla.en) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
    });
    return r;
  }
  function sanearDafo(o, genId, fecha) {
    const d = sanear("dafo", o, genId); if (!d) return null;
    if (!d.creado) d.creado = fecha; if (!d.modificado) d.modificado = d.creado;
    const fuentes = new Set(d.fuentes.map(x => x.id));
    d.factores.forEach(f => {
      if (!fuentes.has(f.fuenteId)) f.fuenteId = "";
      if (f.area && !areasDe(f.tipo)[f.area]) f.area = "";     // un área interna en un factor externo, o al revés
      if (esInterno(f.tipo)) f.probabilidad = "";
    });
    // Números únicos dentro de cada cuadrante (los repetidos o a 0 se renumeran al final)
    TIPOS.forEach(t => {
      const usados = new Set(), l = d.factores.filter(f => f.tipo === t);
      l.forEach(f => { if (!f.num || usados.has(f.num)) f.num = 0; else usados.add(f.num); });
      l.filter(f => !f.num).forEach(f => { f.num = siguienteNum(d, t); });
    });
    return d;
  }
  function sanearDatos(o, genId, fecha) {
    if (!o || typeof o !== "object" || !Array.isArray(o.dafos)) return null;
    return { dafos: o.dafos.slice(0, 300).map(x => sanearDafo(x, genId, fecha)).filter(Boolean) };
  }
  // Fusiona sin duplicar: si un id ya existe se conserva el más reciente
  function fusionar(actual, nuevo) {
    const m = new Map(actual.dafos.map(x => [x.id, x]));
    nuevo.dafos.forEach(x => { const y = m.get(x.id); if (!y || String(x.modificado) > String(y.modificado)) m.set(x.id, x); });
    return { dafos: Array.from(m.values()) };
  }

  const API = {
    VERSION_DATOS, URL_AUD, URL_IND, URL_TM, URL_AMFE,
    lleno, sinTildes, num, entero1a5, corto, normal, plural, minuscula,
    CUADRANTES, TIPOS, esInterno, PASOS,
    TIPOS_OBJETO, FINALIDADES, aniosHorizonte, FUENTES_TIPO, APORTA, AREAS, AMBITOS, BLOQUES_ACSA, AREA_A_BLOQUE, areasDe, nombreArea,
    ESC_IMP, ESC_PROB, ESC_PREG, peso, PESO_MAX, codigo, ordenar, delTipo, matrizDafo, puestos,
    nuevoDafo, nuevaFuente, nuevoFactor, siguienteNum, fuenteDe, nombreFuente, nombreDafo,
    sugerirHorizonte, sugerirTitulo, sugerirMision, sugerirVision,
    revisarRedaccion, parecido,
    avisosObjeto, avisosFuentes, avisosInterno, avisosExterno, avisosDe,
    resumen, progreso, pasoPendiente, siguientePaso,
    tipoDeTexto, parsearFactores, incorporarFactores,
    ESQ, sanear, sanearDafo, sanearDatos, fusionar
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Logica = API;
})(typeof window !== "undefined" ? window : this);

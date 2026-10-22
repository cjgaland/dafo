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
  const URL_FLUJO = "https://cjgaland.github.io/flujograma/";

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
    acuerdo: { para: "para preparar el acuerdo de gestión", nom: "Acuerdo de gestión", horizonte: "1 año (el del acuerdo de gestión)",
      consejo: "El DAFO prepara los objetivos del acuerdo: partid de los resultados del acuerdo anterior y terminad con objetivos medibles que puedan entrar en el nuevo.",
      fuentes: ["acuerdo", "indicadores", "encuesta", "memoria", "notificaciones"] },
    acsa: { para: "para preparar la acreditación ACSA", nom: "Acreditación ACSA", horizonte: "El ciclo de la certificación (unos 5 años, con seguimiento a los 2–3)",
      consejo: "Mirad hacia dentro con los bloques del manual de estándares y usad el informe de la acreditación anterior, si lo hay. Las debilidades suelen ser los estándares que aún no cumplís.",
      fuentes: ["acreditacion", "auditorias", "cultura", "notificaciones", "encuesta"] },
    estrategico: { para: "para elaborar el plan estratégico", nom: "Plan estratégico", horizonte: "3 a 5 años",
      consejo: "Con un horizonte largo pesa más el entorno: dedicad tiempo a las oportunidades y amenazas (demografía, tecnología, planes del sistema sanitario).",
      fuentes: ["plan", "memoria", "indicadores", "encuesta", "normativa"] },
    proyecto: { para: "para valorar un proyecto o servicio nuevo", nom: "Proyecto o servicio nuevo", horizonte: "Hasta su puesta en marcha y su primer año",
      consejo: "El DAFO de un proyecto dice si es viable y qué riesgos tiene: las fortalezas y debilidades son las de quien lo va a poner en marcha.",
      fuentes: ["memoria", "plan", "indicadores", "otros"] },
    cambio: { para: "tras un cambio importante en la unidad", nom: "Tras un cambio importante", horizonte: "1 a 2 años",
      consejo: "Fusión, traslado, nueva dirección o un evento adverso grave: el DAFO ayuda a ordenar qué se pierde, qué se gana y qué hay que proteger.",
      fuentes: ["notificaciones", "reclamaciones", "cultura", "memoria"] },
    otra: { para: "", nom: "Otra", horizonte: "", consejo: "Escribid en el título para qué es el análisis: un DAFO sin finalidad clara no lleva a ninguna decisión.", fuentes: ["memoria", "indicadores", "encuesta"] }
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
      responsable: "", fecha: "", fuentes: [], equipo: [], sesiones: [], ideas: [], bloques: [], tgn: { votos: [] }, factores: [], prioridad: { n: 5 }, cruces: {}, estrategias: [], edicion: "00", anteriorId: "", conclusiones: "", proxRevision: "", control: nuevoControl(), notas: "", creado: fecha, modificado: fecha };
  }
  function nuevaFuente(id) { return { id, tipo: "", nombre: "", fecha: "", nota: "" }; }
  function nuevoFactor(id, tipo = "F", n = 0) { return { id, tipo, num: n, texto: "", area: "", evidencia: "", fuenteId: "", aporta: "", importancia: "", probabilidad: "", manual: "", motivo: "", candidato: nuevoCandidato(), votos: [], bloqueAcsa: "", origen: "" }; }
  const nuevoCandidato = () => ({ destino: "", proceso: "", motivo: "" });
  const nuevoIndicador = () => ({ nombre: "", formula: "", estandar: "", fuente: "" });
  const nuevoObjetivo = () => ({ texto: "", meta: "", fecha: "" });
  function nuevaEstrategia(id, tipo = "C", n = 0) { return { id, tipo, num: n, texto: "", factores: [], impacto: "", viabilidad: "", elegida: "", motivo: "", origen: "", objetivo: nuevoObjetivo(), acciones: [] }; }
  function nuevaAccion(id) { return { id, que: "", quien: "", inicio: "", fin: "", recursos: "", como: "", indicador: nuevoIndicador(), estado: "pendiente", nota: "", seguimiento: [] }; }
  function nuevaMedida(id) { return { id, fecha: "", valor: "", nota: "" }; }
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
    // Preparando la acreditación: bloques del manual sin ningún factor
    if (n === 3 && d.finalidad === "acsa" && conTexto.length >= 4) {
      const vacios = porBloquesAcsa(d).filter(b => !b.F.length && !b.D.length);
      if (vacios.length) A.push({ nivel: "nota", texto: `Ningún factor habla de ${vacios.length === 1 ? "el bloque" : "los bloques"} ${vacios.map(b => "«" + b.nom + "»").join(", ")} del manual de estándares. Si vais a la acreditación, revisadlo${vacios.length === 1 ? "" : "s"} (vista «Por bloques ACSA»).` });
    }
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
  const avisosDe = (d, n, hoy = new Date().toISOString()) => ({ 1: avisosObjeto, 2: d => [...avisosFuentes(d), ...conPaso(2, avisosEquipo(d))], ideas: avisosIdeas, votar: avisosVotos, 3: avisosInterno, 4: avisosExterno, 5: avisosPriorizar, 6: avisosCruzar, 7: avisosEstrategias, 8: avisosPlan }[n] || (() => []))(d, hoy);

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
      5: TIPOS.every(t => prioritarios(d, t).length) && !d.factores.some(f => lleno(f.texto) && f.manual && !lleno(f.motivo)),
      6: (() => { const r = resultadoCruces(d); return r.listo && r.valores.some(v => v > 0); })(),
      7: (() => { const EL = elegidas(d); return EL.length > 0 && EL.every(e => e.factores.length && n3(e.impacto) && n3(e.viabilidad)) && !d.estrategias.some(e => e.elegida && !lleno(e.motivo)); })(),
      8: (() => { const EL = elegidas(d); return EL.length > 0 && EL.every(e => lleno(e.objetivo.texto) && accionesDe(e).length && accionesDe(e).every(x => lleno(x.quien) && lleno(x.fin) && lleno(x.indicador.nombre))); })()
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
    4: d => d.factores.some(f => !esInterno(f.tipo)) ? "Completa las oportunidades y amenazas: cada una con su importancia y su probabilidad." : "Mira hacia fuera: ¿qué os puede ayudar (oportunidades) y qué os puede perjudicar (amenazas)?",
    5: d => `Quedaos con lo importante: los ${nPrioridad(d)} factores de más peso de cada cuadrante, y decidid a mano los empates.`,
    6: d => { const r = resultadoCruces(d); return r.rellenas ? `Termina la matriz cruzada: quedan ${r.total - r.rellenas} de ${r.total} casillas por valorar.` : "Cruza los factores prioritarios: ¿qué fortalezas y debilidades pesan ante cada oportunidad y amenaza?"; },
    7: d => d.estrategias.length ? "Puntúa el impacto y la viabilidad de cada estrategia y elige las que vais a llevar al plan." : "Saca las estrategias CAME de los cruces fuertes: corregir, afrontar, mantener y explotar.",
    8: d => `Convierte ${elegidas(d).length === 1 ? "la estrategia elegida" : "las " + elegidas(d).length + " estrategias elegidas"} en objetivos y acciones, con responsable, plazo e indicador.`
  };
  function siguientePaso(datos, entrega) {
    const L = datos.dafos;
    if (!L.length) return { k: "crear", texto: "Empieza tu primer DAFO: elige tu servicio, tu unidad o un proyecto, y para qué lo necesitáis (acuerdo de gestión, acreditación…).", href: "#/dafo/nuevo", btn: "Crear un DAFO" };
    const d = L.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)))[0];
    const p = pasoPendiente(d, entrega), nom = corto(nombreDafo(d) || "tu DAFO", 50);
    if (p) return { k: "paso" + p.n, texto: `«${nom}»: ${TEXTO_PASO[p.n](d)}`, href: `#/dafo/${d.id}/${p.n}`, btn: `Ir al paso ${p.n}` };
    const nc = notaCalidad(d);
    return { k: "listo", texto: `«${nom}» tiene su plan de acción completo (nota de calidad: ${nc.nota} de ${nc.de}). Saca el informe en Word o PDF, y haced el seguimiento de los indicadores.`, href: `#/dafo/${d.id}/8`, btn: "Ver el plan y los documentos" };
  }

  // ---------- Paso 5 · Priorizar: los N de más peso por cuadrante ----------
  const nPrioridad = d => { const n = Number(d.prioridad && d.prioridad.n); return Number.isInteger(n) && n >= 1 && n <= 15 ? n : 5; };
  // Por factor con texto: { prio, auto, por: "criterio"|"manual"|null, puesto, peso }.
  // Manda la decisión a mano (sí/no, con motivo); si no la hay, entran los N de más peso de su cuadrante.
  function prioridad(d) {
    const N = nPrioridad(d), P = puestos(d), m = {};
    TIPOS.forEach(t => {
      const l = delTipo(d, t).filter(f => lleno(f.texto));
      let i = 0;
      l.forEach(f => {
        const p = peso(f), auto = !!p && i++ < N;
        const prio = f.manual === "si" ? true : f.manual === "no" ? false : auto;
        m[f.id] = { prio, auto, por: f.manual ? "manual" : auto ? "criterio" : null, puesto: P[f.id], peso: p };
      });
    });
    return m;
  }
  const esPrio = (m, f) => !!(m[f.id] && m[f.id].prio);
  function prioritarios(d, t) { const m = prioridad(d); return delTipo(d, t).filter(f => lleno(f.texto) && esPrio(m, f)); }
  // Empates en el corte: factores que quedan fuera con el mismo peso que el último que entra
  function empatesCorte(d) {
    const N = nPrioridad(d), r = {};
    TIPOS.forEach(t => {
      const l = delTipo(d, t).filter(f => lleno(f.texto) && peso(f));
      if (l.length <= N) return;
      const ult = peso(l[N - 1]), fuera = l.slice(N).filter(f => peso(f) === ult);
      if (fuera.length) r[t] = { dentro: l.slice(0, N).filter(f => peso(f) === ult), fuera };
    });
    return r;
  }
  function sugerirMotivo(d, f) {
    const l = delTipo(d, f.tipo).filter(x => lleno(x.texto)), pos = puestos(d)[f.id], C = CUADRANTES[f.tipo];
    const base = esInterno(f.tipo) ? `Importancia ${f.importancia || "sin puntuar"}` : `Importancia ${f.importancia || "?"} × probabilidad ${f.probabilidad || "?"} = peso ${peso(f) || "?"}`;
    return `${base}; ${pos ? `el ${pos}.º` : "sin puesto"} de ${l.length} ${l.length === 1 ? C.uno : C.nom.toLowerCase()}.`;
  }
  function avisosPriorizar(d) {
    const A = [], m = prioridad(d), N = nPrioridad(d);
    TIPOS.forEach(t => {
      const C = CUADRANTES[t], l = d.factores.filter(f => f.tipo === t && lleno(f.texto));
      if (!l.length) { A.push({ nivel: "warn", texto: `No hay ${C.nom.toLowerCase()}: complétalas en el paso ${esInterno(t) ? 3 : 4} antes de priorizar.` }); return; }
      const sinPeso = l.filter(f => !peso(f)).length;
      if (sinPeso) A.push({ nivel: "nota", texto: `${sinPeso === 1 ? "Una " + C.uno + " no tiene" : sinPeso + " " + C.nom.toLowerCase() + " no tienen"} ${esInterno(t) ? "importancia" : "importancia y probabilidad"}: no entra${sinPeso === 1 ? "" : "n"} en el orden.` });
      const pr = l.filter(f => esPrio(m, f));
      if (!pr.length) A.push({ nivel: "warn", texto: `Ninguna ${C.uno} es prioritaria. Sin ellas no se puede cruzar en el paso 6.` });
      else if (pr.length > N + 3) A.push({ nivel: "nota", texto: `Hay ${pr.length} ${C.nom.toLowerCase()} prioritarias. Con muchas, la matriz cruzada se hace eterna y nada destaca.` });
      const sinDato = pr.filter(f => !lleno(f.evidencia) && !lleno(f.fuenteId)).length;
      if (sinDato) A.push({ nivel: "nota", texto: `${sinDato === 1 ? "Una " + C.uno + " prioritaria no tiene" : sinDato + " " + C.nom.toLowerCase() + " prioritarias no tienen"} un dato que la${sinDato === 1 ? "" : "s"} respalde. Lo que más pesa debería ser lo mejor documentado.` });
    });
    d.factores.filter(f => lleno(f.texto) && f.manual && !lleno(f.motivo)).forEach(f => A.push({ nivel: "warn", factor: f.id, texto: `${codigo(f)}: ${f.manual === "si" ? "lo has añadido" : "lo has quitado"} a mano sin escribir el motivo. Quien lea el análisis tiene que saber por qué.` }));
    // Uno añadido a mano con menos peso que otro que queda fuera por el criterio
    d.factores.filter(f => lleno(f.texto) && f.manual === "si" && peso(f)).forEach(f => {
      const mas = d.factores.filter(g => g.tipo === f.tipo && lleno(g.texto) && !esPrio(m, g) && !g.manual && peso(g) > peso(f));
      if (mas.length) A.push({ nivel: "nota", factor: f.id, texto: `${codigo(f)} entra a mano con peso ${peso(f)}, y ${mas.map(codigo).join(", ")} ${mas.length === 1 ? "queda" : "quedan"} fuera con más peso. Si es a propósito, que el motivo lo explique.` });
    });
    const disc = d.factores.filter(f => lleno(f.texto) && discrepancia(f).length);
    if (disc.length) A.push({ nivel: "nota", texto: `${disc.map(codigo).join(", ")}: los votos del equipo están muy separados. Revisadlos en «Votar» antes de dar la priorización por buena.` });
    const E = empatesCorte(d);
    Object.keys(E).forEach(t => A.push({ nivel: "nota", texto: `Empate en el corte de ${CUADRANTES[t].nom.toLowerCase()}: ${E[t].fuera.map(codigo).join(", ")} ${E[t].fuera.length === 1 ? "tiene" : "tienen"} el mismo peso (${peso(E[t].fuera[0])}) que ${E[t].dentro.map(codigo).join(", ")} y ${E[t].fuera.length === 1 ? "queda" : "quedan"} fuera. Decidid a mano cuál entra.` }));
    return conPaso(5, A);
  }

  // ---------- Paso 6 · Matriz cruzada y orientación estratégica ----------
  const BLOQUES = {
    FO: { k: "FO", fila: "F", col: "O", came: "E", verbo: "Explotar", postura: "ofensiva", nom: "Ofensiva",
      preg: "¿Esta fortaleza nos ayuda a aprovechar esta oportunidad?",
      informe: "Las fortalezas de la unidad encajan con las oportunidades del entorno: conviene aprovecharlas para crecer (estrategias de explotar).",
      texto: "Vuestras fortalezas encajan con las oportunidades del entorno: es el momento de crecer y aprovecharlas (estrategias de explotar)." },
    FA: { k: "FA", fila: "F", col: "A", came: "M", verbo: "Mantener", postura: "defensiva", nom: "Defensiva",
      preg: "¿Esta fortaleza nos ayuda a hacer frente a esta amenaza?",
      informe: "Las fortalezas de la unidad son su mejor defensa frente a las amenazas: hay que protegerlas y apoyarse en ellas (estrategias de mantener).",
      texto: "Vuestras fortalezas son la mejor defensa frente a las amenazas: protegedlas y apoyaos en ellas (estrategias de mantener)." },
    DO: { k: "DO", fila: "D", col: "O", came: "C", verbo: "Corregir", postura: "reorientacion", nom: "De reorientación",
      preg: "¿Esta debilidad nos impide aprovechar esta oportunidad?",
      informe: "El entorno ofrece oportunidades que hoy las debilidades de la unidad no dejan aprovechar: hay que corregirlas para poder hacerlo (estrategias de corregir).",
      texto: "El entorno ofrece oportunidades que hoy vuestras debilidades no dejan aprovechar: corregidlas para poder hacerlo (estrategias de corregir)." },
    DA: { k: "DA", fila: "D", col: "A", came: "A", verbo: "Afrontar", postura: "supervivencia", nom: "De supervivencia",
      preg: "¿Esta debilidad nos hace más vulnerables a esta amenaza?",
      informe: "Las debilidades de la unidad la dejan expuesta ante las amenazas: lo primero es reducir esa vulnerabilidad (estrategias de afrontar).",
      texto: "Vuestras debilidades os dejan expuestos ante las amenazas: reducid primero esa vulnerabilidad (estrategias de afrontar)." }
  };
  const ORDEN_BLOQUES = ["FO", "FA", "DO", "DA"];
  // Texto de partida de la estrategia que sugiere un cruce (se revisará en el paso 7)
  function estrategiaPropuesta(f, g) {
    const k = bloqueDe(f, g), a = codigo(f), b = codigo(g);
    return { FO: `Usar ${a} para aprovechar ${b}`, FA: `Apoyarse en ${a} para hacer frente a ${b}`, DO: `Aprovechar ${b} para corregir ${a}`, DA: `Reducir ${a} para que ${b} nos afecte menos` }[k];
  }
  const bloqueDe = (f, g) => f.tipo + g.tipo;
  const ESC_CRUCE = ["Sin relación", "Débil", "Media", "Fuerte"];
  const claveCruce = (f, g) => f.id + "|" + g.id;
  const valorCruce = (d, f, g) => { const v = d.cruces[claveCruce(f, g)]; return v === undefined || v === "" ? null : Number(v); };
  // Filas (F y D) y columnas (O y A) de la matriz: solo los prioritarios, en orden de peso
  function ejesCruce(d) {
    const m = prioridad(d), pr = t => delTipo(d, t).filter(f => lleno(f.texto) && esPrio(m, f));
    return { F: pr("F"), D: pr("D"), O: pr("O"), A: pr("A") };
  }
  const redondea = v => Math.round(v * 100) / 100;
  function resultadoCruces(d) {
    const E = ejesCruce(d), bloques = {}, fuertes = [];
    let total = 0, rellenas = 0, valores = [];
    ORDEN_BLOQUES.forEach(k => {
      const B = BLOQUES[k]; let suma = 0, n = 0, casillas = 0;
      E[B.fila].forEach(f => E[B.col].forEach(g => {
        casillas++; const v = valorCruce(d, f, g);
        if (v !== null) { n++; suma += v; valores.push(v); if (v === 3) fuertes.push({ fila: f, col: g, bloque: k }); }
      }));
      // La media se calcula sobre todas las casillas del bloque (vacía = 0) para comparar bloques de distinto tamaño
      bloques[k] = { suma, rellenas: n, casillas, media: casillas ? redondea(suma / casillas) : 0 };
      total += casillas; rellenas += n;
    });
    const listo = total > 0 && rellenas === total && ORDEN_BLOQUES.every(k => bloques[k].casillas);
    const orden = ORDEN_BLOQUES.slice().sort((a, b) => bloques[b].media - bloques[a].media);
    const orientacion = listo && bloques[orden[0]].suma > 0 ? orden[0] : null;
    const empate = orientacion && bloques[orden[0]].media - bloques[orden[1]].media < 0.1 ? orden[1] : null;
    // Factores llave: los de más media en su fila (internos) o su columna (externos)
    const porFactor = [];
    const linea = (f, otros, val) => { const v = otros.map(val).filter(x => x !== null), s = v.reduce((a, b) => a + b, 0); porFactor.push({ f, suma: s, media: otros.length ? redondea(s / otros.length) : 0 }); };
    [...E.F, ...E.D].forEach(f => linea(f, [...E.O, ...E.A], g => valorCruce(d, f, g)));
    [...E.O, ...E.A].forEach(g => linea(g, [...E.F, ...E.D], f => valorCruce(d, f, g)));
    const llaves = porFactor.filter(x => x.media >= 1).sort((a, b) => b.media - a.media || b.suma - a.suma).slice(0, 3);
    return { ejes: E, bloques, total, rellenas, listo, orden, orientacion, empate, porFactor, llaves, fuertes, valores };
  }
  function avisosCruzar(d) {
    const A = [], r = resultadoCruces(d);
    const faltan = TIPOS.filter(t => !r.ejes[t].length);
    if (faltan.length) { A.push({ nivel: "warn", texto: `Faltan factores prioritarios en ${faltan.map(t => CUADRANTES[t].nom.toLowerCase()).join(", ")}. Vuelve al paso 5: sin ellos no se puede cruzar.` }); return conPaso(6, A); }
    if (r.total > 150) A.push({ nivel: "nota", texto: `Son ${r.total} casillas. Es mucho trabajo: valora quedarte con menos prioritarios en el paso 5 (con 5 por cuadrante son 100).` });
    if (!r.rellenas) A.push({ nivel: "nota", texto: `Hay ${r.total} casillas por valorar, de 0 (sin relación) a 3 (fuerte). Id bloque a bloque: cada uno responde a una pregunta distinta.` });
    else if (r.rellenas < r.total) A.push({ nivel: "nota", texto: `Quedan ${r.total - r.rellenas} de ${r.total} casillas sin valorar. Hasta completarlas, la orientación no es fiable.` });
    if (r.valores.length >= 10) {
      if (r.valores.every(v => v === 0)) A.push({ nivel: "warn", texto: "Todas las casillas valoradas tienen 0. Si nada se relaciona con nada, revisad si los factores están bien escritos y son de verdad los importantes." });
      else if (new Set(r.valores).size === 1) A.push({ nivel: "nota", texto: `Todas las casillas tienen ${r.valores[0]}. Así la matriz no distingue nada: usad la escala completa.` });
      else if (r.valores.filter(v => v === 3).length / r.valores.length > 0.5) A.push({ nivel: "nota", texto: "Más de la mitad de las casillas tienen 3. Si todo se relaciona mucho, nada destaca: reservad el 3 para los cruces de verdad fuertes." });
    }
    if (r.orientacion && r.empate) A.push({ nivel: "nota", texto: `Los bloques ${r.orientacion} y ${r.empate} pesan casi lo mismo: la unidad está entre una postura ${BLOQUES[r.orientacion].nom.toLowerCase()} y una ${BLOQUES[r.empate].nom.toLowerCase()}. Tenedlo en cuenta al elegir estrategias.` });
    return conPaso(6, A);
  }

  // ---------- Paso 2 · Equipo y sesiones ----------
  const ROLES = {
    coordinacion: { nom: "Coordinación", que: "Dirige las sesiones, modera y vela por que se llegue a acuerdos." },
    secretaria: { nom: "Secretaría", que: "Apunta lo que se dice y se decide, y prepara los documentos." },
    miembro: { nom: "Miembro", que: "Aporta su experiencia y su punto de vista." },
    pacientes: { nom: "Representante de pacientes", que: "Aporta la mirada de quien recibe la atención." },
    metodologia: { nom: "Asesoría metodológica", que: "Conoce el método DAFO · CAME y ayuda a aplicarlo (por ejemplo, de la Unidad de Calidad)." }
  };
  const ESTAMENTOS = [
    ["medico", "Medicina", /medic|facultativ|pediatr|cirujan|anestesi|internist|radiolog/],
    ["tcae", "TCAE", /tcae|auxiliar de enfer|tecnico\/a en cuidados|tecnico en cuidados|cuidados aux/],
    ["enfermeria", "Enfermería", /enfermer|supervisor|matron|gestora de casos|cuidados/],
    ["administrativo", "Administración", /administrativ|admision|atencion a la ciudadania|atencion ciudadana/],
    ["social", "Trabajo social", /trabajador|trabajo social/],
    ["farmacia", "Farmacia", /farmac/],
    ["tecnico", "Técnicos sanitarios", /tecnico.*(rayos|radiodiagn|laborator|imagen)|fisioterap/],
    ["calidad", "Calidad y seguridad", /calidad|seguridad del paciente/],
    ["direccion", "Dirección", /direct|gerent|jef[ea] de/],
    ["paciente", "Pacientes", /paciente|usuari|familiar|asociacion/]
  ];
  const estamentoDe = texto => { const t = sinTildes(texto); const e = ESTAMENTOS.find(([, , re]) => re.test(t)); return e ? e[0] : null; };
  const ESTAMENTO_NOM = Object.fromEntries(ESTAMENTOS.map(([k, nom]) => [k, nom]));
  const PERFILES_SUG = [
    { perfil: "Director/a de la unidad", rol: "coordinacion" },
    { perfil: "Coordinador/a de cuidados de enfermería", rol: "miembro" },
    { perfil: "Médico/a de la unidad", rol: "miembro" },
    { perfil: "Enfermero/a de la unidad", rol: "miembro" },
    { perfil: "Técnico/a en Cuidados Auxiliares de Enfermería (TCAE)", rol: "miembro" },
    { perfil: "Administrativo/a o atención a la ciudadanía", rol: "miembro" },
    { perfil: "Trabajador/a social", rol: "miembro" },
    { perfil: "Representante de una asociación de pacientes", rol: "pacientes" },
    { perfil: "Técnico/a de Calidad", rol: "secretaria" }
  ];
  const SESIONES_TIPO = [
    { actividad: "Lluvia de ideas y matriz DAFO (fortalezas, debilidades, oportunidades y amenazas)", duracion: "2 h", resultados: "Factores de los cuatro cuadrantes, con su dato" },
    { actividad: "Priorización, matriz cruzada y estrategias CAME", duracion: "2 h", resultados: "Factores prioritarios, orientación estratégica y estrategias elegidas" },
    { actividad: "Plan de acción: objetivos, responsables, plazos e indicadores", duracion: "1 h 30 min", resultados: "Plan de acción aprobado por el equipo" }
  ];
  function nuevoMiembro(id) { return { id, perfil: "", cargo: "", rol: "miembro", nombre: "" }; }
  function nuevaSesion(id) { return { id, fecha: "", actividad: "", duracion: "", asistentes: [], resultados: "" }; }
  const etiquetaMiembro = m => lleno(m.nombre) ? m.nombre : lleno(m.perfil) ? m.perfil : "Sin perfil";
  function avisosEquipo(d) {
    const A = [], E = d.equipo.filter(m => lleno(m.perfil));
    if (!E.length) return A;   // el equipo es opcional: los avisos solo salen si se empieza a rellenar
    if (E.length < 4) A.push({ nivel: "nota", texto: `El equipo tiene ${plural(E.length, "perfil", "perfiles")}. Un DAFO sale mejor con 5 a 10 personas de distintos estamentos: cada una ve una parte de la unidad.` });
    if (!E.some(m => m.rol === "coordinacion")) A.push({ nivel: "nota", texto: "Nadie tiene el papel de coordinación: alguien tiene que dirigir las sesiones y moderar." });
    if (!E.some(m => m.rol === "secretaria")) A.push({ nivel: "nota", texto: "Nadie tiene el papel de secretaría: alguien tiene que apuntar lo que se decide y preparar los documentos." });
    const est = [...new Set(E.map(m => estamentoDe(m.perfil + " " + m.cargo)).filter(Boolean))];
    if (E.length >= 3 && est.length === 1) A.push({ nivel: "warn", texto: `Todo el equipo es del mismo estamento (${ESTAMENTO_NOM[est[0]]}). Faltan otras miradas de la unidad.` });
    if (E.length >= 3 && E.every(m => /direct|gerent|\bjef[ea]\b/.test(sinTildes(m.perfil + " " + m.cargo)))) A.push({ nivel: "warn", texto: "Solo hay dirección en el equipo. Un DAFO hecho solo desde arriba suele ver muchas fortalezas y pocas debilidades." });
    if (E.length >= 4 && !E.some(m => m.rol === "pacientes" || estamentoDe(m.perfil + " " + m.cargo) === "paciente")) A.push({ nivel: "nota", texto: "Nadie representa a los pacientes. Si no es posible, que al menos entren como fuente la encuesta de satisfacción y las reclamaciones." });
    if (!d.sesiones.length) A.push({ nivel: "nota", texto: "Planifica las sesiones de trabajo. Lo habitual son dos de unas dos horas, y una tercera para el plan de acción." });
    return A;
  }

  // ---------- Lluvia de ideas y técnica de grupo nominal (por cuadrante) ----------
  const PREGUNTAS_IDEAS = {
    F: ["¿Qué hacemos bien?", "¿Qué nos reconocen los pacientes y la dirección?", "¿En qué somos mejores que otras unidades?"],
    D: ["¿Qué hacemos peor de lo que deberíamos?", "¿De qué se quejan los pacientes?", "¿Qué nos falta o nos frena?"],
    O: ["¿Qué cambios del entorno nos pueden ayudar?", "¿Qué planes, recursos o alianzas hay a nuestro alcance?", "¿Qué tecnología nueva llega?"],
    A: ["¿Qué cambios del entorno nos pueden perjudicar?", "¿Qué pasa con el presupuesto, las plantillas, la población?", "¿Qué hacen otros que nos pueda afectar?"]
  };
  function nuevaIdea(id, cuadrante = "F") { return { id, cuadrante, texto: "", bloqueId: "", factorId: "" }; }
  function nuevoBloque(id, cuadrante = "F", nombre = "") { return { id, cuadrante, nombre, comentario: "" }; }
  // Parejas de ideas parecidas dentro de un mismo cuadrante
  function ideasParecidas(d) {
    const r = [];
    TIPOS.forEach(t => { const l = d.ideas.filter(i => i.cuadrante === t && lleno(i.texto)); for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) if (parecido(l[i].texto, l[j].texto) >= 0.6) r.push([l[i], l[j]]); });
    return r;
  }
  // Grupo nominal: en cada cuadrante, cada miembro reparte 3, 2 y 1 puntos entre los bloques
  const bloqueDeVoto = (d, v) => d.bloques.find(b => b.id === v.bloqueId);
  const voto321 = (d, miembroId, t, puntos) => { const v = d.tgn.votos.find(x => x.miembroId === miembroId && String(x.puntos) === String(puntos) && (bloqueDeVoto(d, x) || {}).cuadrante === t); return v ? v.bloqueId : ""; };
  function ponerVoto321(d, miembroId, t, puntos, bloqueId) {
    d.tgn.votos = d.tgn.votos.filter(x => !(x.miembroId === miembroId && (bloqueDeVoto(d, x) || {}).cuadrante === t && (String(x.puntos) === String(puntos) || (bloqueId && x.bloqueId === bloqueId))));
    if (bloqueId) d.tgn.votos.push({ miembroId, bloqueId, puntos: String(puntos) });
  }
  function ranking(d, t) {
    return d.bloques.filter(b => b.cuadrante === t).map((b, i) => { const v = d.tgn.votos.filter(x => x.bloqueId === b.id).map(x => num(x.puntos)).filter(n => n > 0); return { b, i, total: v.reduce((s, n) => s + n, 0), votos: v.length, ideas: d.ideas.filter(x => x.bloqueId === b.id && lleno(x.texto)).length }; })
      .sort((x, y) => y.total - x.total || y.votos - x.votos || x.i - y.i);
  }
  // Una idea o un bloque pasan a factor de su cuadrante (las ideas guardan el factor creado)
  function ideaAFactor(d, idea, genId) {
    if (idea.factorId && d.factores.some(f => f.id === idea.factorId)) return null;
    const f = Object.assign(nuevoFactor(genId(), idea.cuadrante, siguienteNum(d, idea.cuadrante)), { texto: idea.texto.trim(), aporta: "equipo" });
    d.factores.push(f); idea.factorId = f.id; return f;
  }
  function bloqueAFactor(d, b, genId) {
    const ideas = d.ideas.filter(i => i.bloqueId === b.id && lleno(i.texto) && !(i.factorId && d.factores.some(f => f.id === i.factorId)));
    if (!ideas.length && !lleno(b.nombre)) return null;
    const f = Object.assign(nuevoFactor(genId(), b.cuadrante, siguienteNum(d, b.cuadrante)), { texto: (lleno(b.nombre) ? b.nombre : ideas[0].texto).trim(), evidencia: lleno(b.comentario) ? b.comentario : "", aporta: "equipo" });
    d.factores.push(f); ideas.forEach(i => { i.factorId = f.id; }); return f;
  }
  function avisosIdeas(d) {
    const A = [], I = d.ideas.filter(i => lleno(i.texto)), M = d.equipo.filter(m => lleno(m.perfil));
    if (!I.length) { A.push({ nivel: "nota", texto: "Apuntad todas las ideas sin juzgarlas, cuadrante a cuadrante. Se puede pedir tres ideas por cuadrante a cada persona." }); return conPaso("ideas", A); }
    TIPOS.forEach(t => { if (!I.some(i => i.cuadrante === t)) A.push({ nivel: "nota", texto: `Aún no hay ideas de ${CUADRANTES[t].nom.toLowerCase()}.` }); });
    ideasParecidas(d).slice(0, 5).forEach(([x, y]) => A.push({ nivel: "nota", texto: `«${corto(x.texto, 50)}» y «${corto(y.texto, 50)}» parecen la misma idea. Agrupadlas en el mismo bloque o quitad una.` }));
    I.forEach(i => revisarRedaccion(i.texto, i.cuadrante).filter(r => r.k === "externo" || r.k === "interno").forEach(r => A.push({ nivel: "nota", texto: `«${corto(i.texto, 50)}»: ${r.texto}` })));
    const sinBloque = I.filter(i => !d.bloques.some(b => b.id === i.bloqueId)).length;
    if (I.length >= 6 && sinBloque) A.push({ nivel: "nota", texto: `${sinBloque === 1 ? "Una idea está" : sinBloque + " ideas están"} sin agrupar. Agruparlas en bloques ayuda a ver los temas y a votar.` });
    if (M.length && d.tgn.votos.length) {
      const votaron = new Set(d.tgn.votos.map(v => v.miembroId)), faltan = M.filter(m => !votaron.has(m.id));
      if (faltan.length) A.push({ nivel: "nota", texto: `Falta el voto de ${faltan.length === 1 ? "un miembro" : faltan.length + " miembros"} del equipo (${faltan.map(m => corto(m.perfil, 30)).join(", ")}).` });
    }
    const pendientes = I.filter(i => !i.factorId || !d.factores.some(f => f.id === i.factorId)).length;
    if (pendientes && d.tgn.votos.length) A.push({ nivel: "nota", texto: `${pendientes === 1 ? "Queda una idea" : "Quedan " + pendientes + " ideas"} sin pasar a factores. Pasad las de los bloques más votados; después, en los pasos 3 y 4, se completan con su dato y su importancia.` });
    return conPaso("ideas", A);
  }

  // ---------- Votación del equipo de la importancia y la probabilidad ----------
  // La media se redondea al entero (0,5 hacia arriba); si entre el voto más alto y el más bajo hay 3 puntos o más, hay que hablarlo
  function mediaVotos(f) {
    const r = {};
    ["importancia", "probabilidad"].forEach(k => {
      const v = f.votos.map(x => entero1a5(x[k])).filter(Boolean);
      r[k] = v.length ? { n: v.length, media: Math.round(v.reduce((s, x) => s + x, 0) / v.length + 1e-9), exacta: v.reduce((s, x) => s + x, 0) / v.length, rango: Math.max(...v) - Math.min(...v) } : null;
    });
    if (esInterno(f.tipo)) r.probabilidad = null;
    return r;
  }
  const discrepancia = f => { const m = mediaVotos(f); return ["importancia", "probabilidad"].filter(k => m[k] && m[k].n >= 2 && m[k].rango >= 3); };
  function ponerVoto(f, miembroId, k, valor) {
    let v = f.votos.find(x => x.miembroId === miembroId);
    if (!v) { v = { miembroId, importancia: "", probabilidad: "" }; f.votos.push(v); }
    v[k] = String(valor).trim();
    f.votos = f.votos.filter(x => lleno(x.importancia) || lleno(x.probabilidad));
  }
  // Pone en el factor la media redondeada de los votos (devuelve si ha cambiado algo)
  function usarMedia(f) {
    const m = mediaVotos(f); let cambia = false;
    ["importancia", "probabilidad"].forEach(k => { if (m[k] && String(m[k].media) !== String(f[k])) { f[k] = String(m[k].media); cambia = true; } });
    return cambia;
  }
  function avisosVotos(d) {
    const A = [], M = d.equipo.filter(m => lleno(m.perfil)), F = d.factores.filter(f => lleno(f.texto) && f.votos.length);
    if (!M.length) { A.push({ nivel: "nota", texto: "Para votar hace falta el equipo: añádelo en el paso 2." }); return conPaso("votar", A); }
    F.forEach(f => {
      discrepancia(f).forEach(k => { const m = mediaVotos(f)[k]; A.push({ nivel: "warn", factor: f.id, texto: `${codigo(f)}: en ${k} hay ${m.rango} puntos entre el voto más alto y el más bajo. Habladlo antes de cerrar el valor: quizá cada uno entiende el factor de una forma.` }); });
      const m = mediaVotos(f), dif = ["importancia", "probabilidad"].filter(k => m[k] && lleno(f[k]) && String(m[k].media) !== String(f[k]));
      if (dif.length) A.push({ nivel: "nota", factor: f.id, texto: `${codigo(f)}: el valor final (${dif.map(k => k + " " + f[k]).join(", ")}) no coincide con la media de los votos (${dif.map(k => m[k].media).join(", ")}). Puede estar bien si el equipo lo decidió así.` });
    });
    const conVoto = new Set(d.factores.flatMap(f => f.votos.map(v => v.miembroId)));
    if (conVoto.size) { const faltan = M.filter(m => !conVoto.has(m.id)); if (faltan.length) A.push({ nivel: "nota", texto: `${faltan.length === 1 ? "Un miembro no ha" : faltan.length + " miembros no han"} votado todavía (${faltan.map(m => corto(m.perfil, 30)).join(", ")}).` }); }
    return conPaso("votar", A);
  }

  // ---------- Vista por bloques ACSA (análisis interno) ----------
  const bloqueAcsaDe = f => esInterno(f.tipo) ? (BLOQUES_ACSA[f.bloqueAcsa] ? f.bloqueAcsa : AREA_A_BLOQUE[f.area] || "") : "";
  function porBloquesAcsa(d) {
    return Object.keys(BLOQUES_ACSA).map(k => {
      const l = d.factores.filter(f => lleno(f.texto) && esInterno(f.tipo) && bloqueAcsaDe(f) === k);
      return { k, nom: BLOQUES_ACSA[k], F: ordenar(l.filter(f => f.tipo === "F")), D: ordenar(l.filter(f => f.tipo === "D")) };
    });
  }

  // ---------- Ediciones y revisión anual (mejora H) ----------
  // Una edición nueva copia el DAFO (mismos ids de factores y estrategias, para poder comparar) y la enlaza con la anterior
  function nuevaEdicion(d, genId, fechaIso) {
    const c = JSON.parse(JSON.stringify(d)), ed = String((parseInt(d.edicion, 10) || 0) + 1).padStart(2, "0");
    Object.assign(c, { id: genId(), edicion: ed, anteriorId: d.id, proxRevision: "", conclusiones: "", fecha: "", creado: fechaIso, modificado: fechaIso });
    c.titulo = lleno(d.titulo) ? d.titulo.replace(/\b(20\d\d)\b/, (m, a) => String(Number(a) + 1)) : "";
    c.control.historial.push({ edicion: ed, fecha: fechaIso.slice(0, 10), cambio: "Revisión anual del DAFO" });
    c.ideas = []; c.bloques = []; c.tgn = { votos: [] };   // la lluvia de ideas es de cada edición
    return c;
  }
  // Cómo acabó una estrategia elegida de la edición anterior
  function estadoEstrategia(e) {
    const AC = accionesDe(e); if (!AC.length) return "sin";
    const hechas = AC.filter(x => x.estado === "hecha" || x.estado === "verificada").length;
    const medidas = AC.filter(x => lleno(x.indicador.nombre) && ultimaMedida(x));
    const ok = medidas.length && medidas.every(x => semaforo(x.indicador.estandar, ultimaMedida(x).valor) === "ok");
    if (hechas === AC.length) return ok ? "cumplida" : medidas.length ? "sinlograr" : "hecha";
    return hechas || AC.some(x => x.estado === "curso") ? "curso" : "pendiente";
  }
  const ESTADOS_EST = { cumplida: "Cumplida: acciones hechas e indicadores en el estándar", hecha: "Acciones hechas, sin medir", sinlograr: "Acciones hechas, pero el indicador no llega al estándar", curso: "En curso", pendiente: "Sin empezar", sin: "Sin acciones" };
  function compararEdiciones(ant, act) {
    const vivo = l => l.filter(f => lleno(f.texto));
    const A0 = vivo(ant.factores), A1 = vivo(act.factores), mant = [], nuevos = [], desap = [];
    A1.forEach(f => { const g = A0.find(x => x.id === f.id); if (!g) nuevos.push(f); else { const p0 = peso(g), p1 = peso(f); mant.push({ f, g, antes: p0, ahora: p1, cambio: !p0 || !p1 ? "sin" : p1 > p0 ? "sube" : p1 < p0 ? "baja" : "igual" }); } });
    A0.forEach(g => { if (!A1.some(f => f.id === g.id)) desap.push(g); });
    const est = elegidas(ant).map(e => ({ e, estado: estadoEstrategia(e), sigue: act.estrategias.some(x => x.id === e.id && esElegida(x)) }));
    const r0 = resultadoCruces(ant), r1 = resultadoCruces(act);
    return { mantienen: mant, nuevos, desaparecen: desap, estrategias: est, orientacion: { antes: r0.orientacion, ahora: r1.orientacion },
      cuenta: { mantienen: mant.length, nuevos: nuevos.length, desaparecen: desap.length, suben: mant.filter(x => x.cambio === "sube").length, bajan: mant.filter(x => x.cambio === "baja").length, cumplidas: est.filter(x => x.estado === "cumplida").length } };
  }
  // ¿Toca revisar? (fecha de próxima revisión pasada o en los próximos 30 días)
  function revisionProxima(d, hoyIso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.proxRevision || "")) return null;
    const dias = Math.round((new Date(d.proxRevision) - new Date(String(hoyIso).slice(0, 10))) / 864e5);
    return dias <= 30 ? { dias, vencida: dias < 0 } : null;
  }

  // ---------- Hoja de trabajo para las sesiones presenciales (mejora J) ----------
  function documentoHoja(d, fecha, vacias = 5) {
    const B = [], nom = d.objeto || nombreDafo(d) || "Unidad", L_ = n => Array.from({ length: n }, () => " "), r = resultadoCruces(d);
    B.push({ t: "portada", titulo: "DAFO · Hoja de trabajo", sub: nom, extra: [FINALIDADES[d.finalidad] ? FINALIDADES[d.finalidad].nom : "", "Sesión del ____ / ____ / ________", "Asistentes: ____________________________________________"].filter(lleno) });
    B.push({ t: "h1", texto: "1. Lluvia de ideas" }, { t: "p", texto: "Sin juzgar ni debatir: una idea por línea. Recordad: si lo podemos cambiar nosotros, es interno (fortaleza o debilidad); si viene de fuera, es externo (oportunidad o amenaza)." });
    TIPOS.forEach(t => B.push({ t: "h2", texto: `${CUADRANTES[t].nom} · ${PREGUNTAS_IDEAS[t].join(" ")}` }, { t: "tabla", fuente: 9, cab: ["Idea", "Dato que la respalda"], anchos: [62, 38], filas: [...d.ideas.filter(i => i.cuadrante === t && lleno(i.texto)).map(i => [i.texto, " "]), ...L_(vacias).map(() => L_(2))] }));
    const F = TIPOS.flatMap(t => delTipo(d, t, "num").filter(f => lleno(f.texto)));
    B.push({ t: "salto" }, { t: "h1", texto: "2. Mi votación de la importancia" }, { t: "p", texto: "Perfil o nombre: ______________________________. Puntúa cada factor de 1 (poco importante) a 5 (clave) sin hablar con los demás; en oportunidades y amenazas, también la probabilidad de 1 a 5. Después se comparan los votos y se calcula la media." },
      { t: "tabla", fuente: 8, cab: ["Cód.", "Factor", "Importancia (1–5)", "Probabilidad (1–5)"], anchos: [8, 60, 16, 16], filas: [...F.map(f => [{ texto: codigo(f), negrita: true }, f.texto, " ", esInterno(f.tipo) ? { texto: "—", centro: true } : " "]), ...L_(vacias).map(() => L_(4))] });
    if (r.total) {
      const cols = [...r.ejes.O, ...r.ejes.A], ancho = Math.min(7, 86 / Math.max(cols.length, 1));
      B.push({ t: "salto" }, { t: "h1", texto: "3. Matriz cruzada" }, { t: "p", texto: "Valora de 0 (sin relación) a 3 (fuerte). FO: ¿esta fortaleza ayuda a aprovechar esta oportunidad? FA: ¿ayuda a hacer frente a esta amenaza? DO: ¿esta debilidad impide aprovechar esta oportunidad? DA: ¿nos hace más vulnerables a esta amenaza?" },
        { t: "tabla", fuente: 8, cab: ["", ...cols.map(codigo)], anchos: [100 - ancho * cols.length, ...Array(cols.length).fill(ancho)], filas: [...r.ejes.F, ...r.ejes.D].map(f => [{ texto: codigo(f), negrita: true }, ...cols.map(() => " ")]) },
        { t: "tabla", fuente: 8, cab: ["Cód.", "Factor"], anchos: [10, 90], filas: [...r.ejes.F, ...r.ejes.D, ...cols].map(f => [{ texto: codigo(f), negrita: true }, f.texto]) });
    }
    B.push({ t: "h1", texto: `${r.total ? 4 : 3}. Escalas` }, { t: "tabla", fuente: 8, cab: ["Puntos", "Importancia", "Probabilidad (externos)"], anchos: [10, 45, 45], filas: ESC_IMP.map((x, i) => [{ texto: String(i + 1), centro: true }, x, ESC_PROB[i]]) });
    return { titulo: "DAFO · Hoja de trabajo · " + nom, bloques: B };
  }
  // Comparación con la edición anterior, como bloques para el informe
  function bloquesComparacion(ant, act) {
    const C = compararEdiciones(ant, act), B = [];
    B.push({ t: "p", texto: `Respecto a la edición ${ant.edicion || "00"}: ${C.cuenta.mantienen} factores se mantienen (${C.cuenta.suben} pesan más y ${C.cuenta.bajan} menos), ${C.cuenta.nuevos} son nuevos y ${C.cuenta.desaparecen} desaparecen.${C.orientacion.antes && C.orientacion.ahora ? ` La orientación ${C.orientacion.antes === C.orientacion.ahora ? "se mantiene" : `pasa de ${C.orientacion.antes} a ${C.orientacion.ahora}`}.` : ""}` });
    const filas = [...C.nuevos.map(f => [{ texto: codigo(f), negrita: true }, f.texto, "Nuevo"]), ...C.desaparecen.map(f => [{ texto: codigo(f), negrita: true }, f.texto, "Desaparece"]), ...C.mantienen.filter(x => x.cambio === "sube" || x.cambio === "baja").map(x => [{ texto: codigo(x.f), negrita: true }, x.f.texto, `Peso ${x.antes} → ${x.ahora}`])];
    if (filas.length) B.push({ t: "tabla", fuente: 8, cab: ["Cód.", "Factor", "Cambio"], anchos: [8, 70, 22], filas });
    if (C.estrategias.length) B.push({ t: "tabla", fuente: 8, cab: ["Estrategia de la edición anterior", "Cómo acabó"], anchos: [65, 35], filas: C.estrategias.map(x => [`${codigoEst(x.e)} · ${x.e.texto}`, ESTADOS_EST[x.estado]]) });
    return B;
  }

  // ---------- Traer de AMFE (el AMFE de un proceso como evidencia de un factor) ----------
  // Lee el paquete «amfe-fallos» v1 que publica AMFE en localStorage["amfe-intercambio"] (o su copia .json, clave «intercambio»).
  // Devuelve null si no es un paquete válido; si lo es, una lista de AMFE con un factor propuesto para cada uno.
  function leerAmfe(o) {
    if (o && typeof o === "object" && o.intercambio) o = o.intercambio;
    if (!o || typeof o !== "object" || o.formato !== "amfe-fallos" || o.version !== 1 || !Array.isArray(o.amfes)) return null;
    const t = (v, n = 300) => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, n) : "";
    const n = v => Number.isFinite(v) ? v : null;
    return o.amfes.slice(0, 100).filter(a => a && typeof a === "object" && Array.isArray(a.fallos)).map(a => {
      const F = a.fallos.filter(f => f && typeof f === "object"), PR = F.filter(f => f.prioritario === true);
      const iprs = F.map(f => n(f.ipr)).filter(v => v), max = iprs.length ? Math.max(...iprs) : null;
      const sinAccion = PR.filter(f => !Array.isArray(f.acciones) || !f.acciones.length).length;
      const conResidual = PR.filter(f => f.residual && n(f.residual.ipr));
      const antes = conResidual.reduce((s, f) => s + (n(f.ipr) || 0), 0), despues = conResidual.reduce((s, f) => s + n(f.residual.ipr), 0);
      const proceso = t(a.proceso) || t(a.titulo) || "sin nombre", titulo = t(a.titulo) || proceso;
      const evidencia = `AMFE «${titulo}»${t(a.fecha, 40) ? " (" + t(a.fecha, 40) + ")" : ""}: ${plural(F.length, "fallo analizado", "fallos analizados")}, ${PR.length} prioritarios${max ? `, IPR máximo ${max}` : ""}${conResidual.length && antes ? `; el IPR de ${plural(conResidual.length, "prioritario reevaluado", "prioritarios reevaluados")} bajaría de ${antes} a ${despues} (−${Math.round((1 - despues / antes) * 100)} %)` : ""}.`;
      // Fortaleza si todos los prioritarios tienen acciones y su riesgo residual baja; si no, debilidad
      const resuelto = PR.length > 0 && !sinAccion && conResidual.length === PR.length && despues < antes;
      const factor = resuelto
        ? { tipo: "F", texto: `AMFE del proceso «${proceso}» hecho, con acciones de mejora en ${PR.length === 1 ? "su fallo prioritario" : `sus ${PR.length} fallos prioritarios`}`, area: "seguridad", importancia: "3", evidencia }
        : { tipo: "D", texto: `El proceso «${proceso}» tiene ${plural(PR.length, "fallo prioritario", "fallos prioritarios")} en su AMFE${sinAccion ? `, ${sinAccion} sin acción de mejora` : PR.length && conResidual.length < PR.length ? ", sin reevaluar el riesgo tras las acciones" : ""}`, area: "seguridad",
            importancia: String(max >= 300 ? 5 : max >= 200 ? 4 : 3), evidencia };
      return { id: t(a.id, 60), titulo, proceso, unidad: t(a.unidad), fecha: t(a.fecha, 40), fallos: F.length, prioritarios: PR.length, max, sinAccion, factor };
    });
  }
  // Añade al DAFO el factor propuesto de un AMFE, con su fuente; no lo repite si ya se trajo
  function factorDeAmfe(d, x, genId) {
    const origen = "amfe:" + x.id;
    if (d.factores.some(f => f.origen === origen)) return null;
    let fu = d.fuentes.find(y => y.tipo === "amfe" && normal(y.nombre) === normal("AMFE «" + x.titulo + "»"));
    if (!fu) { fu = Object.assign(nuevaFuente(genId()), { tipo: "amfe", nombre: "AMFE «" + x.titulo + "»", fecha: x.fecha, nota: `${x.fallos} fallos, ${x.prioritarios} prioritarios` }); d.fuentes.push(fu); }
    const f = Object.assign(nuevoFactor(genId(), x.factor.tipo, siguienteNum(d, x.factor.tipo)), { texto: x.factor.texto, area: x.factor.area, evidencia: x.factor.evidencia, importancia: x.factor.importancia, fuenteId: fu.id, aporta: "datos", origen });
    d.factores.push(f); return f;
  }

  // ---------- Paso 7 · Estrategias CAME ----------
  // Cada estrategia: código E1, E2… (E de «estrategia»; su tipo CAME va aparte, con su nombre, para no confundirla con A1 = amenaza)
  const CAME = {
    C: { k: "C", nom: "Corregir", bloque: "DO", sobre: "D", que: "Corregir una debilidad, sobre todo la que impide aprovechar una oportunidad." },
    A: { k: "A", nom: "Afrontar", bloque: "DA", sobre: "A", que: "Afrontar una amenaza, sobre todo la que os pilla débiles." },
    M: { k: "M", nom: "Mantener", bloque: "FA", sobre: "F", que: "Mantener y proteger una fortaleza, sobre todo la que os defiende de una amenaza." },
    E: { k: "E", nom: "Explotar", bloque: "FO", sobre: "O", que: "Explotar una oportunidad apoyándoos en lo que hacéis bien." }
  };
  const TIPOS_CAME = ["C", "A", "M", "E"];
  const CAME_DE_BLOQUE = { FO: "E", FA: "M", DO: "C", DA: "A" };
  const IMPACTO = ["Poco: mejora algo, pero no cambia los resultados", "Medio: se notará en algún resultado", "Alto: ataca lo que más pesa en la finalidad del análisis"];
  const VIABILIDAD = ["Difícil: necesita recursos o decisiones que no dependen de la unidad", "Posible con esfuerzo o algún recurso", "Fácil: depende de la unidad y casi no cuesta"];
  const n3 = v => { const n = num(v); return Number.isInteger(n) && n >= 1 && n <= 3 ? n : null; };
  // Matriz impacto × viabilidad (la misma lógica que las acciones de Auditorías)
  const ZONAS_EST = {
    ya: { nom: "Hazla ya", que: "Mucho impacto y viable: es de lo primero del plan.", orden: 1 },
    planificar: { nom: "Planifícala", que: "Mucho impacto pero difícil: hay que buscar recursos y plazos.", orden: 2 },
    pronto: { nom: "Siguiente en la cola", que: "Impacto y viabilidad medios: para cuando avancen las primeras.", orden: 3 },
    rapida: { nom: "Victoria rápida", que: "Poco impacto pero fácil: puede hacerse sin quitar sitio a las importantes.", orden: 4 },
    reconsiderar: { nom: "Reconsidérala", que: "Poco impacto y difícil: probablemente no compensa.", orden: 5 }
  };
  function zonaEstrategia(e) {
    const i = n3(e.impacto), v = n3(e.viabilidad);
    if (!i || !v) return null;
    if (i + v >= 5) return "ya";
    if (i === 3 && v === 1) return "planificar";
    if (i === 2 && v === 2) return "pronto";
    if (i === 1 && v >= 2) return "rapida";
    return "reconsiderar";
  }
  const AUTO_ELEGIDA = ["ya", "planificar"];
  const eligeAuto = e => AUTO_ELEGIDA.includes(zonaEstrategia(e));
  const esElegida = e => e.elegida === "si" || (e.elegida !== "no" && eligeAuto(e));
  const codigoEst = e => "E" + e.num;
  const siguienteNumEst = d => d.estrategias.reduce((m, e) => Math.max(m, Number(e.num) || 0), 0) + 1;
  function ordenarEstrategias(lista) {
    return lista.map((e, i) => ({ e, i, z: zonaEstrategia(e) })).sort((a, b) => (esElegida(b.e) - esElegida(a.e)) || ((a.z ? ZONAS_EST[a.z].orden : 9) - (b.z ? ZONAS_EST[b.z].orden : 9)) || (n3(b.e.impacto) || 0) - (n3(a.e.impacto) || 0) || a.e.num - b.e.num || a.i - b.i).map(x => x.e);
  }
  const elegidas = d => ordenarEstrategias(d.estrategias.filter(e => lleno(e.texto) && esElegida(e)));
  const factoresDe = (d, e) => e.factores.map(id => d.factores.find(f => f.id === id)).filter(Boolean);
  const listaY = l => l.length <= 1 ? (l[0] || "") : l.slice(0, -1).join(", ") + " y " + l[l.length - 1];
  const cita = f => `«${corto(minuscula(f.texto), 70)}» (${codigo(f)})`;
  // Propuestas: de los cruces fuertes (3) de la matriz, agrupados por el factor interno; si no hay, de los factores prioritarios
  function estrategiasPropuestas(d) {
    const r = resultadoCruces(d), P = [];
    if (r.fuertes.length) {
      const grupos = new Map();
      r.fuertes.forEach(x => { const k = x.bloque + "|" + x.fila.id; if (!grupos.has(k)) grupos.set(k, { bloque: x.bloque, fila: x.fila, cols: [] }); grupos.get(k).cols.push(x.col); });
      grupos.forEach(g => {
        const f = g.fila, c = listaY(g.cols.map(cita));
        const texto = { FO: `Usar ${cita(f)} para aprovechar ${c}`, FA: `Apoyarse en ${cita(f)} para hacer frente a ${c}`, DO: `Aprovechar ${c} para corregir ${cita(f)}`, DA: `Reducir ${cita(f)} para que ${c} nos afecte${g.cols.length > 1 ? "n" : ""} menos` }[g.bloque];
        P.push({ tipo: CAME_DE_BLOQUE[g.bloque], texto, factores: [f.id, ...g.cols.map(x => x.id)], origen: "cruce:" + g.bloque + ":" + f.id });
      });
    } else {
      const sobre = { D: "C", A: "A", F: "M", O: "E" }, verbo = { C: "Corregir", A: "Afrontar", M: "Mantener", E: "Explotar" };
      TIPOS.forEach(t => prioritarios(d, t).forEach(f => P.push({ tipo: sobre[t], texto: `${verbo[sobre[t]]} ${cita(f)}`, factores: [f.id], origen: "factor:" + f.id })));
    }
    // Las que ya se propusieron antes no se repiten
    const ya = new Set(d.estrategias.map(e => e.origen).filter(Boolean));
    return P.filter(p => !ya.has(p.origen));
  }
  function avisosEstrategias(d) {
    const A = [], L_ = d.estrategias, conTexto = L_.filter(e => lleno(e.texto)), EL = elegidas(d);
    if (!L_.length) { A.push({ nivel: "nota", texto: "Aún no hay estrategias. Pulsa «Proponer estrategias»: la app las saca de los cruces fuertes del paso 6 (o, si no hiciste la matriz cruzada, de los factores prioritarios)." }); return conPaso(7, A); }
    L_.forEach(e => {
      const c = codigoEst(e), base = { estrategia: e.id };
      if (!lleno(e.texto)) { A.push(Object.assign({ nivel: "warn", texto: `${c}: escribe la estrategia.` }, base)); return; }
      const s = normal(e.texto);
      if (s.split(" ").length < 4 || /^(mejorar|aumentar|potenciar|fomentar) (la |el )?(calidad|atencion|comunicacion|coordinacion|seguridad)$/.test(s)) A.push(Object.assign({ nivel: "nota", texto: `${c}: es muy general. ¿Qué se va a hacer exactamente, y con qué?` }, base));
      const F = factoresDe(d, e);
      if (!F.length) A.push(Object.assign({ nivel: "warn", texto: `${c}: no se apoya en ningún factor del análisis. ¿De dónde sale? Marca los factores que la justifican.` }, base));
      else if (!F.some(f => f.tipo === CAME[e.tipo].sobre)) A.push(Object.assign({ nivel: "nota", texto: `${c}: una estrategia de «${CAME[e.tipo].nom.toLowerCase()}» suele apoyarse en ${CUADRANTES[CAME[e.tipo].sobre].art} ${CUADRANTES[CAME[e.tipo].sobre].uno}, y esta no cita ninguna. ¿Es de otro tipo?` }, base));
      if (!n3(e.impacto) || !n3(e.viabilidad)) A.push(Object.assign({ nivel: "nota", texto: `${c}: puntúa su impacto y su viabilidad para saber si conviene elegirla.` }, base));
      if (e.elegida && !lleno(e.motivo)) A.push(Object.assign({ nivel: "warn", texto: `${c}: la has ${e.elegida === "si" ? "elegido" : "descartado"} a mano sin escribir el motivo.` }, base));
      if (esElegida(e) && n3(e.viabilidad) === 1 && !lleno(e.motivo)) A.push(Object.assign({ nivel: "nota", texto: `${c}: es difícil de hacer (viabilidad 1). Si la mantenéis, apuntad de dónde saldrán los recursos.` }, base));
    });
    if (conTexto.length && !EL.length) A.push({ nivel: "warn", texto: "Ninguna estrategia está elegida. Puntúa impacto y viabilidad, o elige a mano las que vais a llevar al plan." });
    if (EL.length > 8) A.push({ nivel: "nota", texto: `Hay ${EL.length} estrategias elegidas. Un plan con tantas no se cumple: quedaos con 6 u 8 como mucho.` });
    if (EL.length >= 3 && new Set(EL.map(e => e.tipo)).size === 1) A.push({ nivel: "nota", texto: `Todas las estrategias elegidas son de «${CAME[EL[0].tipo].nom.toLowerCase()}». ¿No hay nada que ${(o => o.slice(0, -1).join(", ") + " o " + o[o.length - 1])(TIPOS_CAME.filter(k => k !== EL[0].tipo).map(k => CAME[k].nom.toLowerCase()))}?` });
    // Lo que más pesa tiene que tener alguna estrategia
    ["D", "A"].forEach(t => {
      const top = delTipo(d, t).filter(f => lleno(f.texto) && peso(f))[0];
      if (top && EL.length && !EL.some(e => e.factores.includes(top.id))) A.push({ nivel: "warn", texto: `${CUADRANTES[t].art === "una" ? "La" : "El"} ${CUADRANTES[t].uno} de más peso (${codigo(top)}: «${corto(top.texto, 60)}») no tiene ninguna estrategia elegida. ¿La dejáis sin respuesta a propósito?` });
    });
    const r = resultadoCruces(d);
    if (r.orientacion && EL.length >= 3) {
      const cuenta = {}; EL.forEach(e => { cuenta[e.tipo] = (cuenta[e.tipo] || 0) + 1; });
      const dom = Object.keys(cuenta).sort((a, b) => cuenta[b] - cuenta[a])[0], esperado = CAME_DE_BLOQUE[r.orientacion];
      if (cuenta[esperado] === undefined) A.push({ nivel: "nota", texto: `La matriz cruzada sugiere una postura ${BLOQUES[r.orientacion].nom.toLowerCase()} (estrategias de ${CAME[esperado].nom.toLowerCase()}), y ninguna de las elegidas es de ese tipo. Puede estar bien, pero revisadlo.` });
      else if (dom !== esperado && cuenta[dom] > cuenta[esperado] + 1) A.push({ nivel: "nota", texto: `La matriz cruzada sugiere sobre todo ${CAME[esperado].nom.toLowerCase()}, y la mayoría de las elegidas son de ${CAME[dom].nom.toLowerCase()}. Solo es un aviso: la orientación es una ayuda, no una orden.` });
    }
    return conPaso(7, A);
  }

  // ---------- Candidatos para otras apps (AMFE, Mapa de Riesgos, Auditorías) ----------
  const DESTINOS = {
    amfe: { nom: "AMFE", que: "Un proceso concreto con riesgo para el paciente: analizar paso a paso qué puede fallar.", url: URL_AMFE },
    mapa: { nom: "Mapa de Riesgos", que: "Un proceso completo que hay que ver de principio a fin, con su flujograma.", url: URL_AUD },
    auditoria: { nom: "Auditoría", que: "Una práctica que hay que medir: si se cumple y en qué medida.", url: URL_AUD }
  };
  const RE_AUDITAR = /higiene de manos|registr|cumpliment|cumplimiento|adherencia|identificacion del paciente|consentimiento|caducad/;
  const RE_PROCESO = /conciliacion|medicacion|transfusion|alta|ingreso|derivacion|triaje|cirugia|quirofan|identificacion|caidas|ulceras|lesiones por presion|extraccion|muestras|vacuna|urgencias|traslado/;
  function sugerirDestino(f) {
    if (!["D", "A"].includes(f.tipo)) return "";
    const s = normal(f.texto + " " + f.evidencia);
    if (RE_AUDITAR.test(s)) return "auditoria";
    if (RE_PROCESO.test(s) || (f.tipo === "D" && f.area === "seguridad")) return "amfe";
    return "";
  }
  const candidatos = d => d.factores.filter(f => lleno(f.texto) && f.candidato && f.candidato.destino);

  // ---------- Paso 8 · Plan de acción y seguimiento ----------
  const ESTADOS = { pendiente: "Pendiente", curso: "En curso", hecha: "Hecha", verificada: "Verificada" };
  const FUERZAS = {
    fuerte: { nom: "Medida fuerte", que: "Cambia el sistema: obliga, automatiza o elimina el paso que falla." },
    intermedia: { nom: "Medida intermedia", que: "Apoya la práctica: listas de verificación, circuitos, protocolos, auditorías." },
    debil: { nom: "Medida débil", que: "Depende de la memoria o la voluntad: formación, avisos, sensibilización." }
  };
  // Igual que AMFE y Auditorías (palabras clave; ojo con los falsos positivos)
  function fuerzaMedida(texto) {
    const t = sinTildes(texto);
    if (!t) return "";
    if (/campo obligatori|no permit|\bbloque(e|ar|a)\b|forzad|automat|alerta autom|alerta en la historia|integracion|interoperab|redisen|eliminar|simplific|en tiempo real|sistema de alerta|checklist (digital )?obligatori|canal directo|agenda de acto unico/.test(t)) return "fuerte";
    if (/checklist|lista de verificacion|listado de control|doble (verificacion|validacion|identificacion|chequeo|revision)|protocolo|procedimiento|estandariz|auditori|revision (cruzada|semanal|periodica|sistematica)|recordatorio visual|circuito|reunion|etiquetado|designacion|cuestionario|plan de contingencia|agenda/.test(t)) return "intermedia";
    if (/formacion|\bformar\b|sesion|sensibiliz|concienci|charla|informar|difundir|recordar|insistir|cartel|curso/.test(t)) return "debil";
    return "";
  }
  const vencida = (x, hoy) => /^\d{4}-\d{2}-\d{2}$/.test(x.fin || "") && x.fin < String(hoy).slice(0, 10) && (x.estado === "pendiente" || x.estado === "curso");
  // Estándar «≥ 80 %», «≤ 2», «10 de 10»… → { op, valor }
  function leerEstandar(t) {
    const s = String(t || "").replace(",", ".").replace(/\s/g, "");
    let m = s.match(/^(\d+(?:\.\d+)?)de\d+/i); if (m) return { op: ">=", valor: Number(m[1]) };
    m = s.match(/^(≥|>=|>|≤|<=|<|=)?(\d+(?:\.\d+)?)/); if (!m) return null;
    const op = { "≥": ">=", "≤": "<=" }[m[1]] || m[1] || ">=";
    return { op, valor: Number(m[2]) };
  }
  // Semáforo de un valor frente a su estándar: "ok", "no" o null (sin datos)
  function semaforo(estandar, valor) {
    const e = leerEstandar(estandar), v = num(String(valor || "").replace(/\s*%/, "").replace(/\s*de\s*\d+$/i, ""));
    if (!e || !Number.isFinite(v)) return null;
    const ok = { ">=": v >= e.valor, ">": v > e.valor, "<=": v <= e.valor, "<": v < e.valor, "=": v === e.valor }[e.op];
    return ok ? "ok" : "no";
  }
  const ultimaMedida = x => x.seguimiento.filter(m => lleno(m.valor)).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))).pop() || null;
  // Comprobación SMART orientativa de un objetivo (la decisión es del equipo; esto solo avisa)
  function smartAuto(o) {
    const t = normal(o.texto + " " + o.meta);
    return { medible: /\d/.test(o.texto + o.meta), plazo: /^\d{4}-\d{2}-\d{2}$/.test(o.fecha || "") || /\b20\d\d\b|\bmes|\bano|\bsemestre|\btrimestre/.test(t), especifico: palabrasDe(o.texto).size >= 3 };
  }
  const accionesDe = e => e.acciones.filter(x => lleno(x.que));
  function avisosPlan(d, hoy) {
    const A = [], EL = elegidas(d);
    if (!EL.length) { A.push({ nivel: "nota", texto: "Elige primero las estrategias (paso 7): el plan de acción se hace para las elegidas." }); return conPaso(8, A); }
    EL.forEach(e => {
      const c = codigoEst(e), base = { estrategia: e.id }, o = e.objetivo, sm = smartAuto(o);
      if (!lleno(o.texto)) A.push(Object.assign({ nivel: "warn", texto: `${c}: escribe su objetivo: qué queréis conseguir y cuánto.` }, base));
      else {
        if (!sm.medible) A.push(Object.assign({ nivel: "nota", texto: `${c}: el objetivo no tiene ninguna cifra. Sin ella, ¿cómo sabréis si se ha cumplido?` }, base));
        if (!sm.plazo) A.push(Object.assign({ nivel: "nota", texto: `${c}: el objetivo no tiene fecha. Un objetivo sin plazo se queda en deseo.` }, base));
      }
      const AC = accionesDe(e);
      if (!AC.length) A.push(Object.assign({ nivel: "warn", texto: `${c}: no tiene ninguna acción. ¿Qué se va a hacer, quién y cuándo?` }, base));
      AC.forEach((x, i) => {
        const n = `${c}.${i + 1}`, b2 = Object.assign({ accion: x.id }, base);
        const falta = [!lleno(x.quien) && "responsable", !lleno(x.fin) && "fecha de fin", !lleno(x.indicador.nombre) && "indicador"].filter(Boolean);
        if (falta.length) A.push(Object.assign({ nivel: "warn", texto: `${n}: falta ${listaY(falta)}. Sin ${falta.length === 1 ? "eso" : "ellos"} no se puede hacer el seguimiento.` }, b2));
        if (lleno(x.indicador.nombre) && !lleno(x.indicador.estandar)) A.push(Object.assign({ nivel: "nota", texto: `${n}: el indicador no tiene estándar. ¿Qué valor consideraréis bueno (por ejemplo, ≥ 80 %)?` }, b2));
        if (/^(todos|todo el equipo|el servicio|la unidad|el equipo)$/.test(normal(x.quien))) A.push(Object.assign({ nivel: "nota", texto: `${n}: «${x.quien}» como responsable es lo mismo que nadie. Poned un cargo o una persona concreta.` }, b2));
        if (vencida(x, hoy)) A.push(Object.assign({ nivel: "warn", texto: `${n}: el plazo terminó el ${x.fin.split("-").reverse().join("/")} y sigue ${ESTADOS[x.estado].toLowerCase()}.` }, b2));
      });
    });
    const todas = EL.flatMap(accionesDe), fz = todas.map(x => fuerzaMedida(x.que));
    if (todas.length >= 3 && fz.every(z => z === "debil")) A.push({ nivel: "warn", texto: "Todas las acciones son de formación, avisos o sensibilización: medidas débiles, que dependen de la memoria y la buena voluntad. Añadid alguna que cambie el sistema (un circuito, una alerta, una agenda distinta)." });
    else if (todas.length >= 4 && !fz.includes("fuerte") && !fz.includes("intermedia")) A.push({ nivel: "nota", texto: "Ninguna acción cambia el sistema ni la forma de trabajar. Si es posible, combinadlas con alguna medida intermedia o fuerte." });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.proxRevision || "")) A.push({ nivel: "nota", texto: "Pon la fecha de la próxima revisión del DAFO: lo habitual es cada año, con el nuevo acuerdo de gestión." });
    return conPaso(8, A);
  }

  // ---------- Nota de calidad del análisis (mejora M) ----------
  function notaCalidad(d) {
    const r = resumen(d), rc = resultadoCruces(d), EL = elegidas(d), m = prioridad(d);
    const fuentesPac = d.fuentes.some(x => ["encuesta", "reclamaciones"].includes(x.tipo));
    const topCubiertos = ["D", "A"].every(t => { const top = delTipo(d, t).filter(f => lleno(f.texto) && peso(f))[0]; return !top || EL.some(e => e.factores.includes(top.id)); });
    const objOk = EL.length && EL.every(e => { const s = smartAuto(e.objetivo); return lleno(e.objetivo.texto) && s.medible && s.plazo; });
    const acOk = EL.length && EL.every(e => accionesDe(e).length && accionesDe(e).every(x => lleno(x.quien) && lleno(x.fin) && lleno(x.indicador.nombre)));
    const C_ = [
      { ok: lleno(d.objeto) && lleno(d.finalidad) && lleno(d.horizonte), texto: "Objeto, finalidad y horizonte claros", consejo: "Completa el paso 1.", paso: 1 },
      { ok: r.fuentes >= 3 && fuentesPac, texto: "Tres fuentes de datos o más, con la voz de los pacientes", consejo: "Añade fuentes en el paso 2 (encuesta de satisfacción, reclamaciones…).", paso: 2 },
      { ok: TIPOS.every(t => r[t] >= 3), texto: "Al menos tres factores en cada cuadrante", consejo: "Revisa los cuadrantes con menos factores (pasos 3 y 4).", paso: 3 },
      { ok: r.n > 0 && r.conEvidencia / r.n >= 0.7, texto: "La mayoría de los factores (70 % o más) con un dato que los respalde", consejo: "Anota la cifra o la fuente de cada factor.", paso: 3 },
      { ok: progreso(d)[5], texto: "Priorización hecha, con motivo en las decisiones a mano", consejo: "Termina el paso 5.", paso: 5 },
      { ok: rc.listo, texto: "Matriz cruzada completa", consejo: "Valora todas las casillas del paso 6.", paso: 6 },
      { ok: EL.length > 0 && new Set(EL.map(e => e.tipo)).size >= 2 && EL.every(e => e.factores.length), texto: "Estrategias elegidas de más de un tipo y apoyadas en factores", consejo: "Revisa el paso 7.", paso: 7 },
      { ok: EL.length > 0 && topCubiertos, texto: "La debilidad y la amenaza de más peso tienen respuesta", consejo: "Añade o elige una estrategia para ellas (paso 7).", paso: 7 },
      { ok: !!objOk, texto: "Objetivos con cifra y fecha", consejo: "Completa los objetivos del paso 8.", paso: 8 },
      { ok: !!acOk, texto: "Acciones con responsable, fecha e indicador", consejo: "Completa las acciones del paso 8.", paso: 8 }
    ];
    const nota = C_.filter(c => c.ok).length;
    return { nota, de: C_.length, nivel: nota >= 9 ? "verde" : nota >= 6 ? "ambar" : "rojo", comprobaciones: C_,
      texto: nota >= 9 ? "Listo para presentar." : nota >= 6 ? "Va bien, pero conviene completar lo que falta antes de presentarlo." : "Todavía es un borrador: faltan piezas importantes." };
  }

  // ---------- Textos propuestos del cierre ----------
  function conclusionesSugeridas(d) {
    const r = resumen(d), rc = resultadoCruces(d), EL = elegidas(d), nom = nombreDafo(d) || "la unidad";
    if (!r.n) return "";
    const top = t => { const f = delTipo(d, t).filter(x => lleno(x.texto) && peso(x))[0]; return f ? `«${minuscula(f.texto)}»` : ""; };
    const partes = [`El análisis DAFO de ${articulo(d)}${FINALIDADES[d.finalidad] && FINALIDADES[d.finalidad].para ? ", hecho " + FINALIDADES[d.finalidad].para + "," : ""} recoge ${r.F} fortalezas, ${r.D} debilidades, ${r.O} oportunidades y ${r.A} amenazas, ${r.conEvidencia} de ellas con un dato que las respalda.`];
    const td = top("D"), ta = top("A"), tf = top("F"), to = top("O");
    if (td || ta) partes.push(`Lo que más pesa en contra es ${[td, ta].filter(Boolean).join(" y ")}; a favor, ${[tf, to].filter(Boolean).join(" y ") || "—"}.`);
    if (rc.orientacion) partes.push(`La matriz cruzada da una orientación ${BLOQUES[rc.orientacion].nom.toLowerCase()} (${rc.orientacion}): ${minuscula(BLOQUES[rc.orientacion].informe)}.`);
    if (EL.length) {
      const cuenta = TIPOS_CAME.map(k => [k, EL.filter(e => e.tipo === k).length]).filter(x => x[1]).map(([k, n]) => `${n} de ${CAME[k].nom.toLowerCase()}`);
      const nAc = EL.reduce((s, e) => s + accionesDe(e).length, 0), completas = nAc && EL.every(e => accionesDe(e).every(x => lleno(x.quien) && lleno(x.fin) && lleno(x.indicador.nombre)));
      partes.push(`Se eligen ${plural(EL.length, "estrategia", "estrategias")} (${listaY(cuenta)})${nAc ? `, con ${plural(nAc, "acción", "acciones")} en el plan${completas ? ", cada una con su responsable, su plazo y su indicador" : ""}` : ""}.`);
    }
    const cand = candidatos(d);
    if (cand.length) partes.push(`Además, ${cand.length === 1 ? "un factor merece" : cand.length + " factores merecen"} un análisis propio: ${cand.map(f => `${codigo(f)} (${DESTINOS[f.candidato.destino].nom})`).join(", ")}.`);
    partes.push("El DAFO se revisará cada año, con el nuevo acuerdo de gestión o antes si cambia algo importante.");
    return partes.join(" ");
  }
  function introduccionSugerida(d) {
    if (!lleno(d.objeto)) return "";
    const fin = FINALIDADES[d.finalidad];
    return `Este documento recoge el análisis DAFO (debilidades, amenazas, fortalezas y oportunidades) de ${articulo(d)}${fin && fin.para ? " " + fin.para : ""}${lleno(d.horizonte) ? `, con un horizonte de ${minuscula(d.horizonte)}` : ""}, y las estrategias CAME (corregir, afrontar, mantener y explotar) y el plan de acción que se derivan de él.`;
  }
  // Control del documento
  const nuevaPersona = () => ({ nombre: "", cargo: "" });
  const nuevoControl = () => ({ elaborado: [nuevaPersona()], revisado: [nuevaPersona()], aprobado: [nuevaPersona()], historial: [{ edicion: "00", fecha: "", cambio: "Documento inicial" }] });

  // ---------- Ids nuevos para todo lo de dentro (copiar un ejemplo, importar…) ----------
  // Conserva las referencias: la fuente de cada factor, los cruces y los factores de cada estrategia.
  function renovarIds(d, genId) {
    const mapa = {};
    d.fuentes.forEach(x => { mapa[x.id] = genId(); x.id = mapa[x.id]; });
    d.factores.forEach(f => { const n = genId(); mapa[f.id] = n; f.id = n; f.fuenteId = mapa[f.fuenteId] || ""; });
    d.equipo.forEach(m => { mapa[m.id] = genId(); m.id = mapa[m.id]; });
    d.sesiones.forEach(x => { x.id = genId(); x.asistentes = x.asistentes.map(id => mapa[id]).filter(Boolean); });
    d.bloques.forEach(b => { mapa[b.id] = genId(); b.id = mapa[b.id]; });
    d.ideas.forEach(i => { i.id = genId(); i.bloqueId = mapa[i.bloqueId] || ""; i.factorId = mapa[i.factorId] || ""; });
    d.tgn.votos = d.tgn.votos.map(v => ({ miembroId: mapa[v.miembroId], bloqueId: mapa[v.bloqueId], puntos: v.puntos })).filter(v => v.miembroId && v.bloqueId);
    d.factores.forEach(f => { f.votos = f.votos.map(v => Object.assign(v, { miembroId: mapa[v.miembroId] || "" })).filter(v => v.miembroId); });
    d.anteriorId = "";
    const cr = {}; Object.keys(d.cruces).forEach(k => { const [a, b] = k.split("|"); if (mapa[a] && mapa[b]) cr[mapa[a] + "|" + mapa[b]] = d.cruces[k]; }); d.cruces = cr;
    d.estrategias.forEach(e => {
      e.id = genId(); e.factores = e.factores.map(id => mapa[id]).filter(Boolean);
      if (/^(cruce:..:|factor:)/.test(e.origen)) e.origen = e.origen.replace(/[^:]+$/, x => mapa[x] || x);
      e.acciones.forEach(x => { x.id = genId(); x.seguimiento.forEach(m => { m.id = genId(); }); });
    });
    return d;
  }

  // ---------- Documentos (bloques que docx.js convierte en Word y app.js en HTML para imprimir/PDF) ----------
  // Bloques: {t:"portada"}, {t:"h1"|"h2", texto}, {t:"p", texto|runs, estilo}, {t:"lista", items}, {t:"tabla", cab, filas, anchos, fuente, sinCab}, {t:"salto"}
  const FONDO_Q = { F: "DCFCE7", D: "FEF3C7", O: "DBEAFE", A: "FFE4E6" }, TINTA_Q = { F: "15803D", D: "B45309", O: "1D4ED8", A: "BE123C" };
  const FONDO_CRUCE = ["FFFFFF", "EDE9FE", "C4B5FD", "8B5CF6"];
  const C_ = t => ({ texto: t == null ? "" : String(t), centro: true });
  const fmtF = s => /^\d{4}-\d{2}-\d{2}$/.test(s || "") ? s.split("-").reverse().join("/") : (s || "");
  function bloquesControl(control) {
    const filas = [];
    [["Elaborado", control.elaborado], ["Revisado", control.revisado], ["Aprobado", control.aprobado]].forEach(([k, ps]) => {
      const v = ps.filter(x => lleno(x.nombre) || lleno(x.cargo));
      (v.length ? v : [nuevaPersona()]).forEach((x, i) => filas.push([{ texto: i === 0 ? k : "", negrita: true, fondo: "F5F0FF" }, x.nombre || " ", x.cargo || " "]));
    });
    return [{ t: "tabla", cab: ["", "Nombre", "Cargo"], filas, anchos: [18, 41, 41] }, { t: "h2", texto: "Histórico de revisiones" },
      { t: "tabla", cab: ["Edición", "Fecha", "Cambio"], filas: control.historial.filter(h => lleno(h.edicion) || lleno(h.cambio)).map(h => [h.edicion, fmtF(h.fecha), h.cambio]), anchos: [14, 22, 64] }];
  }
  // La matriz DAFO como tabla de 2 × 2 (solo los prioritarios)
  function bloqueMatrizDafo(d, fuente = 9) {
    const celda = t => ({ texto: prioritarios(d, t).map(f => `${codigo(f)} · ${f.texto}`).join("\n") || "—", fondo: FONDO_Q[t] });
    const cab = t => ({ texto: CUADRANTES[t].nom, negrita: true, centro: true, fondo: FONDO_Q[t] });
    return { t: "tabla", fuente, sinCab: true, anchos: [14, 43, 43], filas: [
      [{ texto: "" }, { texto: "A favor", negrita: true, centro: true }, { texto: "En contra", negrita: true, centro: true }],
      [{ texto: "Interno", negrita: true, centro: true }, cab("F"), cab("D")], [{ texto: "" }, celda("F"), celda("D")],
      [{ texto: "Externo", negrita: true, centro: true }, cab("O"), cab("A")], [{ texto: "" }, celda("O"), celda("A")]] };
  }
  function bloqueCruce(d, r) {
    const filas = [...r.ejes.F, ...r.ejes.D], cols = [...r.ejes.O, ...r.ejes.A];
    const n = cols.length, ancho = Math.min(7, 86 / Math.max(n, 1));
    return { t: "tabla", fuente: 8, cab: ["", ...cols.map(codigo)], anchos: [100 - ancho * n, ...Array(n).fill(ancho)],
      filas: filas.map(f => [{ texto: codigo(f), negrita: true, fondo: FONDO_Q[f.tipo] }, ...cols.map(g => { const v = valorCruce(d, f, g); return { texto: v === null ? "" : String(v), centro: true, negrita: v === 3, fondo: v === null ? "F1F5F9" : FONDO_CRUCE[v] }; })]) };
  }
  const tablaFactores = (d, t) => {
    const l = delTipo(d, t).filter(f => lleno(f.texto)), ext = !esInterno(t), m = prioridad(d);
    return { t: "tabla", fuente: 8, cab: ["Cód.", "Factor", "Dato que lo respalda", ext ? "I × P" : "Imp.", "Prior."], anchos: [7, 44, 33, 8, 8],
      filas: l.map(f => { const fu = fuenteDe(d, f); return [{ texto: codigo(f), negrita: true, fondo: FONDO_Q[t] }, { texto: f.texto + (m[f.id].por === "manual" ? `\n(${m[f.id].prio ? "añadido" : "quitado"} a mano: ${f.motivo})` : ""), negrita: m[f.id].prio }, [f.evidencia, fu ? nombreFuente(fu) : ""].filter(lleno).join("\n"), C_(ext ? (peso(f) ? `${f.importancia} × ${f.probabilidad} = ${peso(f)}` : "") : f.importancia), C_(m[f.id].prio ? "Sí" : "No")]; }) };
  };
  const textoAccion = x => [x.que, lleno(x.como) ? "Cómo: " + x.como : "", lleno(x.recursos) ? "Recursos: " + x.recursos : ""].filter(lleno).join("\n");
  const textoIndicador = i => [i.nombre, lleno(i.estandar) ? "Estándar: " + i.estandar : "", lleno(i.formula) ? i.formula : ""].filter(lleno).join("\n");
  function documentoInforme(d, fecha, ant) {
    const B = [], r = resumen(d), rc = resultadoCruces(d), EL = elegidas(d), fin = FINALIDADES[d.finalidad], nom = d.objeto || nombreDafo(d) || "Sin nombre";
    B.push({ t: "portada", titulo: "Análisis DAFO y estrategias CAME", sub: nom, extra: [fin ? fin.nom : "", d.fecha || fecha, lleno(d.responsable) ? "Responsable: " + d.responsable : ""].filter(lleno) });
    B.push({ t: "h1", texto: "Control del documento" }, ...bloquesControl(d.control), { t: "salto" });
    B.push({ t: "h1", texto: "1. Introducción" }, { t: "p", texto: introduccionSugerida(d) || "Análisis DAFO y CAME." });
    const ficha = [["Qué se analiza", nom], ["Tipo", TIPOS_OBJETO[d.tipoObjeto]], ["Finalidad", fin ? fin.nom : ""], ["Horizonte", d.horizonte], ["Misión", d.mision], ["Visión", d.vision], ["Qué queda dentro", d.incluye], ["Qué queda fuera", d.excluye]].filter(x => lleno(x[1]));
    B.push({ t: "tabla", sinCab: true, anchos: [26, 74], filas: ficha.map(([k, v]) => [{ texto: k, negrita: true, fondo: "F5F0FF" }, v]) });
    B.push({ t: "h1", texto: "2. Metodología" }, { t: "p", texto: `Se revisaron por separado el análisis interno (fortalezas y debilidades, lo que depende de la unidad) y el externo (oportunidades y amenazas, lo que viene del entorno, con el método PESTEL adaptado a sanidad). Cada factor se apoyó en un dato y se puntuó su importancia de 1 a 5; en los externos, también su probabilidad, y su peso es importancia × probabilidad. Se consideraron prioritarios los ${nPrioridad(d)} de más peso de cada cuadrante, con las correcciones del equipo que se indican. Después se cruzaron los factores prioritarios (de 0 a 3) para encontrar las estrategias CAME, que se eligieron por su impacto y su viabilidad.` });
    const EQ = d.equipo.filter(m => lleno(m.perfil));
    if (EQ.length) B.push({ t: "h2", texto: "Equipo de trabajo" }, { t: "tabla", fuente: 8, cab: ["Nº", "Perfil", "Cargo", "Papel"], anchos: [6, 40, 34, 20], filas: EQ.map((m, i) => [C_(i + 1), { texto: m.perfil + (lleno(m.nombre) ? "\n" + m.nombre : ""), negrita: true }, m.cargo, ROLES[m.rol] ? ROLES[m.rol].nom : ""]) });
    if (d.sesiones.length) B.push({ t: "h2", texto: "Sesiones" }, { t: "tabla", fuente: 8, cab: ["Sesión", "Fecha", "Actividad", "Duración", "Resultados"], anchos: [9, 13, 36, 11, 31], filas: d.sesiones.map((x, i) => [C_(i + 1), C_(fmtF(x.fecha)), x.actividad, C_(x.duracion), x.resultados]) });
    if (d.fuentes.length) B.push({ t: "h2", texto: "Fuentes de información" }, { t: "tabla", fuente: 8, cab: ["Nº", "Fuente", "Fecha", "Qué dice"], anchos: [6, 40, 14, 40], filas: d.fuentes.map((x, i) => [C_(i + 1), { texto: nombreFuente(x), negrita: true }, C_(x.fecha), x.nota]) });
    B.push({ t: "h1", texto: "3. Análisis interno" }, { t: "h2", texto: "3.1. Fortalezas" }, tablaFactores(d, "F"), { t: "h2", texto: "3.2. Debilidades" }, tablaFactores(d, "D"));
    B.push({ t: "h1", texto: "4. Análisis externo" }, { t: "h2", texto: "4.1. Oportunidades" }, tablaFactores(d, "O"), { t: "h2", texto: "4.2. Amenazas" }, tablaFactores(d, "A"));
    B.push({ t: "h1", texto: "5. Matriz DAFO" }, { t: "p", texto: `Factores prioritarios de cada cuadrante (${r.F + r.D + r.O + r.A} factores en total; ${TIPOS.reduce((s, t) => s + prioritarios(d, t).length, 0)} prioritarios).` }, bloqueMatrizDafo(d));
    if (rc.total) {
      B.push({ t: "h1", texto: "6. Matriz cruzada y orientación estratégica" }, { t: "p", texto: "Cada casilla responde, de 0 (sin relación) a 3 (fuerte), a una pregunta: FO, ¿esta fortaleza ayuda a aprovechar esta oportunidad?; FA, ¿ayuda a hacer frente a esta amenaza?; DO, ¿esta debilidad impide aprovechar esta oportunidad?; DA, ¿nos hace más vulnerables a esta amenaza?" }, bloqueCruce(d, rc));
      B.push({ t: "tabla", fuente: 8, cab: ["Bloque", "Estrategia", "Postura", "Media (0–3)"], anchos: [14, 26, 34, 26], filas: ORDEN_BLOQUES.map(k => [{ texto: k, negrita: true }, BLOQUES[k].verbo, BLOQUES[k].nom, { texto: String(rc.bloques[k].media).replace(".", ","), centro: true, negrita: k === rc.orientacion, fondo: k === rc.orientacion ? "EDE9FE" : "" }]) });
      B.push({ t: "p", texto: rc.orientacion ? `Orientación ${BLOQUES[rc.orientacion].nom.toLowerCase()} (${rc.orientacion}). ${BLOQUES[rc.orientacion].informe}` : `Matriz incompleta (${rc.rellenas} de ${rc.total} casillas): sin orientación.` });
      if (rc.llaves.length) B.push({ t: "p", runs: [{ texto: "Factores llave: ", negrita: true }, { texto: rc.llaves.map(x => `${codigo(x.f)} (${corto(x.f.texto, 70)}; media ${String(x.media).replace(".", ",")})`).join("; ") + "." }] });
    }
    const n7 = rc.total ? 7 : 6;
    B.push({ t: "h1", texto: `${n7}. Estrategias CAME` });
    const ES = ordenarEstrategias(d.estrategias.filter(e => lleno(e.texto)));
    if (ES.length) B.push({ t: "tabla", fuente: 8, cab: ["Cód.", "Tipo", "Estrategia", "Factores", "Impacto", "Viabilidad", "Elegida"], anchos: [6, 11, 41, 13, 9, 10, 10],
      filas: ES.map(e => { const z = zonaEstrategia(e); return [{ texto: codigoEst(e), negrita: true }, CAME[e.tipo].nom, { texto: e.texto + (e.elegida ? `\n(${e.elegida === "si" ? "elegida" : "descartada"} a mano: ${e.motivo})` : ""), negrita: esElegida(e) }, factoresDe(d, e).map(codigo).join(", "), C_(e.impacto), C_(e.viabilidad), { texto: (esElegida(e) ? "Sí" : "No") + (z ? "\n" + ZONAS_EST[z].nom : ""), centro: true, fondo: esElegida(e) ? "EDE9FE" : "" }]; }) });
    else B.push({ t: "p", texto: "Pendiente de definir las estrategias." });
    B.push({ t: "h1", texto: `${n7 + 1}. Plan de acción` });
    if (EL.length) EL.forEach(e => {
      B.push({ t: "h2", texto: `${codigoEst(e)} · ${CAME[e.tipo].nom}: ${corto(e.texto, 120)}` });
      if (lleno(e.objetivo.texto)) B.push({ t: "p", runs: [{ texto: "Objetivo: ", negrita: true }, { texto: e.objetivo.texto + (lleno(e.objetivo.meta) ? ` (meta: ${e.objetivo.meta}` + (lleno(e.objetivo.fecha) ? `, antes del ${fmtF(e.objetivo.fecha)})` : ")") : lleno(e.objetivo.fecha) ? ` (antes del ${fmtF(e.objetivo.fecha)})` : "") }] });
      const AC = accionesDe(e);
      if (AC.length) B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Acción", "Responsable", "Plazo", "Indicador", "Estado"], anchos: [6, 34, 14, 13, 23, 10],
        filas: AC.map((x, i) => [C_(`${codigoEst(e)}.${i + 1}`), textoAccion(x), x.quien, C_([fmtF(x.inicio), fmtF(x.fin)].filter(lleno).join(" a ")), textoIndicador(x.indicador), C_(ESTADOS[x.estado])]) });
      else B.push({ t: "p", estilo: "nota", texto: "Sin acciones todavía." });
    });
    else B.push({ t: "p", texto: "Pendiente de elegir las estrategias." });
    const SEG = EL.flatMap(e => accionesDe(e).filter(x => lleno(x.indicador.nombre)).map((x, i) => ({ e, x, i, u: ultimaMedida(x) }))).filter(y => y.u);
    if (SEG.length) B.push({ t: "h2", texto: "Seguimiento de los indicadores" }, { t: "tabla", fuente: 8, cab: ["Acción", "Indicador", "Estándar", "Último valor", "Fecha", "¿Cumple?"], anchos: [9, 39, 13, 13, 13, 13],
      filas: SEG.map(({ e, x, i, u }) => { const s = semaforo(x.indicador.estandar, u.valor); return [C_(`${codigoEst(e)}.${accionesDe(e).indexOf(x) + 1}`), x.indicador.nombre, C_(x.indicador.estandar), C_(u.valor), C_(fmtF(u.fecha)), { texto: s === "ok" ? "Sí" : s === "no" ? "No" : "—", centro: true, negrita: true, fondo: s === "ok" ? "DCFCE7" : s === "no" ? "FFE4E6" : "" }]; }) });
    B.push({ t: "h1", texto: `${n7 + 2}. Conclusiones` }, { t: "p", texto: lleno(d.conclusiones) ? d.conclusiones : conclusionesSugeridas(d) });
    if (lleno(d.proxRevision)) B.push({ t: "p", runs: [{ texto: "Próxima revisión del DAFO: ", negrita: true }, { texto: fmtF(d.proxRevision) }] });
    if (ant) B.push({ t: "h2", texto: `Cambios respecto a la edición ${ant.edicion || "00"}` }, ...bloquesComparacion(ant, d));
    const cand = candidatos(d);
    if (cand.length) B.push({ t: "salto" }, { t: "h1", texto: "Anexo I. Factores que merecen un análisis propio" }, { t: "tabla", fuente: 8, cab: ["Cód.", "Factor", "Análisis", "Proceso", "Motivo"], anchos: [7, 33, 13, 22, 25],
      filas: cand.map(f => [{ texto: codigo(f), negrita: true, fondo: FONDO_Q[f.tipo] }, f.texto, DESTINOS[f.candidato.destino].nom, f.candidato.proceso, f.candidato.motivo]) });
    B.push({ t: "h1", texto: `Anexo ${cand.length ? "II" : "I"}. Escalas` }, { t: "tabla", fuente: 8, cab: ["Puntos", "Importancia", "Probabilidad (externos)"], anchos: [10, 45, 45], filas: ESC_IMP.map((x, i) => [C_(i + 1), x, ESC_PROB[i]]) },
      { t: "tabla", fuente: 8, cab: ["Puntos", "Impacto de una estrategia", "Viabilidad"], anchos: [10, 45, 45], filas: IMPACTO.map((x, i) => [C_(i + 1), x, VIABILIDAD[i]]) });
    return { titulo: "DAFO · CAME · " + nom, bloques: B };
  }
  function documentoResumen(d, fecha) {
    const B = [], rc = resultadoCruces(d), EL = elegidas(d), fin = FINALIDADES[d.finalidad], nom = d.objeto || nombreDafo(d) || "Sin nombre";
    B.push({ t: "h1", texto: "Resumen para la Dirección · " + nom }, { t: "p", estilo: "nota", texto: ["Análisis DAFO · CAME", fin ? fin.nom : "", d.horizonte, d.fecha || fecha].filter(lleno).join(" · ") });
    B.push({ t: "h2", texto: "La foto: matriz DAFO" }, bloqueMatrizDafo(d, 7));
    if (rc.orientacion) B.push({ t: "p", runs: [{ texto: `Orientación ${BLOQUES[rc.orientacion].nom.toLowerCase()} (${rc.orientacion}). `, negrita: true }, { texto: BLOQUES[rc.orientacion].informe }] });
    B.push({ t: "h2", texto: "Lo que vamos a hacer" });
    if (EL.length) B.push({ t: "tabla", fuente: 7, cab: ["Estrategia", "Objetivo", "Indicador principal", "Responsable"], anchos: [36, 30, 20, 14],
      filas: EL.map(e => { const x = accionesDe(e).find(y => lleno(y.indicador.nombre)) || accionesDe(e)[0]; return [{ texto: `${codigoEst(e)} · ${CAME[e.tipo].nom}\n${e.texto}`, negrita: false }, [e.objetivo.texto, fmtF(e.objetivo.fecha)].filter(lleno).join(" · "), x ? [x.indicador.nombre, x.indicador.estandar].filter(lleno).join(" · ") : "", x ? x.quien : ""]; }) });
    else B.push({ t: "p", texto: "Pendiente de elegir las estrategias." });
    // Conclusión breve: la matriz y la tabla ya dicen lo demás (así cabe en una página)
    const cand = candidatos(d), breve = [cand.length ? `${cand.length === 1 ? "Un factor merece" : cand.length + " factores merecen"} un análisis propio: ${cand.map(f => `${codigo(f)} (${DESTINOS[f.candidato.destino].nom})`).join(", ")}.` : "",
      lleno(d.proxRevision) ? `Próxima revisión del DAFO: ${fmtF(d.proxRevision)}.` : "El DAFO se revisará cada año."].filter(lleno).join(" ");
    B.push({ t: "h2", texto: "Conclusión" }, { t: "p", texto: lleno(d.conclusiones) ? d.conclusiones : breve });
    return { titulo: "DAFO · Resumen · " + nom, bloques: B };
  }
  // Lámina: la matriz y las estrategias elegidas, en una sola hoja apaisada
  function documentoLamina(d, fecha) {
    const EL = elegidas(d), nom = d.objeto || nombreDafo(d) || "Sin nombre";
    return { titulo: "DAFO · Lámina · " + nom, horizontal: true, bloques: [
      { t: "h1", texto: `DAFO · ${nom}${d.fecha ? " · " + d.fecha : ""}` }, bloqueMatrizDafo(d, 7.5),
      { t: "h2", texto: "Estrategias CAME elegidas" },
      EL.length ? { t: "tabla", fuente: 7.5, sinCab: true, anchos: [6, 10, 84], filas: EL.map(e => [{ texto: codigoEst(e), negrita: true }, { texto: CAME[e.tipo].nom, negrita: true, fondo: FONDO_Q[CAME[e.tipo].sobre] }, e.texto]) } : { t: "p", texto: "Pendiente de elegir las estrategias." }
    ] };
  }

  // ---------- Intercambio con las otras apps (formato dafo-came, versión 1) ----------
  // Las otras apps no leen dafo-datos: leen este paquete con forma fija (también va en la copia .json, clave «intercambio»).
  const FORMATO_INTERCAMBIO = "dafo-came", VERSION_INTERCAMBIO = 1;
  const numONull = v => { const n = entero1a5(v); return n || null; };
  function paqueteIntercambio(dafos, appVersion, fecha) {
    return {
      formato: FORMATO_INTERCAMBIO, version: VERSION_INTERCAMBIO, app: "dafo", appVersion, generado: fecha,
      dafos: dafos.map(d => {
        const m = prioridad(d), r = resultadoCruces(d), cod = {};
        d.factores.forEach(f => { cod[f.id] = codigo(f); });
        return {
          id: d.id, titulo: nombreDafo(d), objeto: d.objeto, tipoObjeto: d.tipoObjeto || null, finalidad: d.finalidad || null, horizonte: d.horizonte, fecha: d.fecha, edicion: d.edicion || "00",
          criterio: { n: nPrioridad(d) },
          orientacion: r.orientacion ? BLOQUES[r.orientacion].postura : null,
          factores: TIPOS.flatMap(t => delTipo(d, t).filter(f => lleno(f.texto)).map(f => {
            const e = m[f.id], fu = fuenteDe(d, f);
            return { id: f.id, codigo: codigo(f), tipo: f.tipo, texto: f.texto, area: f.area || null, areaNombre: nombreArea(f) || null, evidencia: f.evidencia, fuente: fu ? nombreFuente(fu) : null,
              importancia: numONull(f.importancia), probabilidad: esInterno(f.tipo) ? null : numONull(f.probabilidad), peso: peso(f), puesto: e.puesto || null,
              prioritario: e.prio, motivoPrioridad: e.por, motivo: f.motivo || null };
          })),
          cruces: ORDEN_BLOQUES.flatMap(k => { const B = BLOQUES[k]; return r.ejes[B.fila].flatMap(f => r.ejes[B.col].map(g => ({ fila: cod[f.id], columna: cod[g.id], bloque: k, valor: valorCruce(d, f, g) })).filter(x => x.valor !== null)); }),
          estrategias: ordenarEstrategias(d.estrategias.filter(e => lleno(e.texto))).map(e => ({
            id: e.id, codigo: codigoEst(e), tipo: e.tipo, tipoNombre: CAME[e.tipo].nom, bloque: CAME[e.tipo].bloque, texto: e.texto, factores: factoresDe(d, e).map(codigo),
            impacto: n3(e.impacto), viabilidad: n3(e.viabilidad), zona: zonaEstrategia(e), elegida: esElegida(e),
            objetivo: { texto: e.objetivo.texto, meta: e.objetivo.meta, fecha: e.objetivo.fecha || null },
            acciones: accionesDe(e).map(x => ({ que: x.que, quien: x.quien, inicio: x.inicio || null, fin: x.fin || null, recursos: x.recursos, como: x.como,
              indicador: { nombre: x.indicador.nombre, formula: x.indicador.formula, estandar: x.indicador.estandar, fuente: x.indicador.fuente }, fuerza: fuerzaMedida(x.que) || null, estado: x.estado,
              ultimo: (u => u ? { fecha: u.fecha, valor: u.valor, cumple: semaforo(x.indicador.estandar, u.valor) === "ok" } : null)(ultimaMedida(x)) }))
          })),
          candidatos: candidatos(d).map(f => ({ factorId: f.id, codigo: codigo(f), tipo: f.tipo, texto: f.texto, evidencia: f.evidencia, destino: f.candidato.destino, proceso: f.candidato.proceso, motivo: f.candidato.motivo,
            importancia: numONull(f.importancia), peso: peso(f) }))
        };
      })
    };
  }
  // Lo que hará la app que recibe: comprobar formato y versión antes de usar nada. Acepta el paquete o la copia .json.
  function leerIntercambio(o) {
    if (o && typeof o === "object" && o.intercambio) o = o.intercambio;
    if (!o || typeof o !== "object" || o.formato !== FORMATO_INTERCAMBIO || o.version !== VERSION_INTERCAMBIO || !Array.isArray(o.dafos)) return null;
    return o.dafos.filter(x => x && typeof x === "object" && Array.isArray(x.factores));
  }

  // ---------- Excel ----------
  const ESTILOS_XLSX = {
    titulo: { negrita: true, tamano: 14, colorTexto: "FFFFFF", colorFondo: "5B21B6", borde: false },
    sub: { cursiva: true, colorTexto: "444444", borde: false },
    cab: { negrita: true, colorTexto: "FFFFFF", colorFondo: "0D1B2A", alineacion: "center", ajustarTexto: true },
    celda: { ajustarTexto: true, vertical: "top" },
    negrita: { negrita: true, ajustarTexto: true, vertical: "top" },
    centro: { alineacion: "center", vertical: "top", ajustarTexto: true },
    prio: { negrita: true, alineacion: "center", vertical: "top", colorTexto: "5B21B6" },
    q_F: { negrita: true, colorTexto: "FFFFFF", colorFondo: "15803D", ajustarTexto: true },
    q_D: { negrita: true, colorTexto: "FFFFFF", colorFondo: "B45309", ajustarTexto: true },
    q_O: { negrita: true, colorTexto: "FFFFFF", colorFondo: "1D4ED8", ajustarTexto: true },
    q_A: { negrita: true, colorTexto: "FFFFFF", colorFondo: "BE123C", ajustarTexto: true },
    c_F: { ajustarTexto: true, vertical: "top", colorFondo: "EEF8F1" }, c_D: { ajustarTexto: true, vertical: "top", colorFondo: "FBF4EA" },
    c_O: { ajustarTexto: true, vertical: "top", colorFondo: "EEF3FD" }, c_A: { ajustarTexto: true, vertical: "top", colorFondo: "FCF0F3" },
    v0: { alineacion: "center", vertical: "center", colorTexto: "94A3B8" }, v1: { alineacion: "center", vertical: "center", colorFondo: "EDE9FE" },
    v2: { alineacion: "center", vertical: "center", negrita: true, colorFondo: "C4B5FD" }, v3: { alineacion: "center", vertical: "center", negrita: true, colorTexto: "FFFFFF", colorFondo: "6D28D9" },
    vacio: { alineacion: "center", vertical: "center", colorFondo: "F1F5F9" },
    eje: { negrita: true, alineacion: "center", vertical: "center", colorFondo: "E2E8F0", ajustarTexto: true }
  };
  function hojasExcel(d, fecha) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo });
    const N = x => x ? { numero: x, estilo: "centro" } : T("", "centro");
    const nom = nombreDafo(d) || "DAFO", m = prioridad(d), fin = FINALIDADES[d.finalidad];
    const cabecera = (titulo, cols) => { const f = [[T(titulo, "titulo")], [T([d.objeto !== nom ? d.objeto : "", fin ? fin.nom : "", "Exportado de la app DAFO · CAME · " + fecha].filter(lleno).join(" · "), "sub")], cols.map(x => T(x, "cab"))]; f[0][0].combinar = cols.length; f[1][0].combinar = cols.length; return f; };
    const motivo = f => { const e = m[f.id]; return !e ? "" : e.por === "manual" ? (e.prio ? "Añadido a mano: " : "Quitado a mano: ") + f.motivo : e.por === "criterio" ? `Entre los ${nPrioridad(d)} de más peso` : ""; };
    // 1. Factores
    const h1 = cabecera("Factores DAFO · " + nom, ["Código", "Cuadrante", "Factor", "Área o ámbito", "Dato que lo respalda", "Fuente", "Quién lo aporta", "Importancia", "Probabilidad", "Peso", "Puesto", "Prioritario", "Motivo"]);
    TIPOS.forEach(t => delTipo(d, t).filter(f => lleno(f.texto)).forEach(f => { const e = m[f.id], fu = fuenteDe(d, f);
      h1.push([T(codigo(f), "q_" + t), T(CUADRANTES[t].nom), T(f.texto, "negrita"), T(nombreArea(f)), T(f.evidencia), T(fu ? nombreFuente(fu) : ""), T(APORTA[f.aporta] || ""), N(entero1a5(f.importancia)), N(esInterno(t) ? null : entero1a5(f.probabilidad)), N(peso(f)), N(e.puesto), T(e.prio ? "Sí" : "No", e.prio ? "prio" : "centro"), T(motivo(f))]); }));
    // 2. Matriz DAFO (solo prioritarios)
    const h2 = [[T("Matriz DAFO · factores prioritarios", "titulo")], [T("Cada cuadrante, ordenado por su peso. Interno arriba (fortalezas y debilidades), externo abajo (oportunidades y amenazas).", "sub")]];
    h2[0][0].combinar = 2; h2[1][0].combinar = 2;
    [["F", "D"], ["O", "A"]].forEach(([a, b]) => {
      h2.push([T(CUADRANTES[a].nom, "q_" + a), T(CUADRANTES[b].nom, "q_" + b)]);
      const la = prioritarios(d, a), lb = prioritarios(d, b);
      for (let i = 0; i < Math.max(la.length, lb.length, 1); i++) h2.push([T(la[i] ? `${codigo(la[i])} · ${la[i].texto} (${peso(la[i]) || "—"})` : "", "c_" + a), T(lb[i] ? `${codigo(lb[i])} · ${lb[i].texto} (${peso(lb[i]) || "—"})` : "", "c_" + b)]);
    });
    // 3. Matriz cruzada
    const r = resultadoCruces(d), filas = [...r.ejes.F, ...r.ejes.D], cols = [...r.ejes.O, ...r.ejes.A];
    const h3 = [[T("Matriz cruzada (0 sin relación · 1 débil · 2 media · 3 fuerte)", "titulo")], [T("Filas: fortalezas y debilidades prioritarias. Columnas: oportunidades y amenazas prioritarias.", "sub")]];
    h3[0][0].combinar = cols.length + 2; h3[1][0].combinar = cols.length + 2;
    h3.push([T("", "eje"), ...cols.map(g => T(codigo(g), "q_" + g.tipo)), T("Media", "eje")]);
    filas.forEach(f => { const pf = r.porFactor.find(x => x.f === f); h3.push([T(codigo(f), "q_" + f.tipo), ...cols.map(g => { const v = valorCruce(d, f, g); return v === null ? T("", "vacio") : { numero: v, estilo: "v" + v }; }), { numero: pf ? pf.media : 0, estilo: "eje" }]); });
    h3.push([T("Media", "eje"), ...cols.map(g => { const pf = r.porFactor.find(x => x.f === g); return { numero: pf ? pf.media : 0, estilo: "eje" }; }), T("", "eje")]);
    h3.push([]); h3.push(["Bloque", "Estrategia", "Postura", "Suma", "Casillas", "Media"].map(x => T(x, "cab")));
    ORDEN_BLOQUES.forEach(k => { const b = r.bloques[k], B = BLOQUES[k]; h3.push([T(k, "negrita"), T(B.verbo), T(B.nom), { numero: b.suma, estilo: "centro" }, { numero: b.casillas, estilo: "centro" }, { numero: b.media, estilo: k === r.orientacion ? "prio" : "centro" }]); });
    h3.push([T(r.orientacion ? `Orientación: ${BLOQUES[r.orientacion].nom.toLowerCase()} (${r.orientacion}). ${BLOQUES[r.orientacion].informe}` : `Orientación: pendiente (${r.rellenas} de ${r.total} casillas valoradas).`, "sub")]);
    if (r.llaves.length) h3.push([T("Factores llave: " + r.llaves.map(x => `${codigo(x.f)} (media ${x.media})`).join(", "), "sub")]);
    h3.push([]); h3.push(["Código", "Factor"].map(x => T(x, "cab")));
    [...filas, ...cols].forEach(f => h3.push([T(codigo(f), "q_" + f.tipo), T(f.texto)]));
    // 4. Fuentes y 5. Ficha
    const h4 = cabecera("Fuentes de información · " + nom, ["Nº", "Fuente", "Tipo", "Fecha", "Qué dice", "Factores que la citan"]);
    d.fuentes.forEach((x, i) => h4.push([T(i + 1, "centro"), T(nombreFuente(x), "negrita"), T(FUENTES_TIPO[x.tipo] ? FUENTES_TIPO[x.tipo].nom : ""), T(x.fecha), T(x.nota), T(d.factores.filter(f => f.fuenteId === x.id).map(codigo).join(", "))]));
    const h5 = cabecera("Ficha del análisis · " + nom, ["Campo", "Valor"]);
    [["Qué se analiza", d.objeto], ["Tipo", TIPOS_OBJETO[d.tipoObjeto]], ["Finalidad", fin ? fin.nom : ""], ["Horizonte", d.horizonte], ["Misión", d.mision], ["Visión", d.vision], ["Qué queda dentro", d.incluye], ["Qué queda fuera", d.excluye], ["Responsable", d.responsable], ["Fecha", d.fecha], ["Prioritarios por cuadrante", String(nPrioridad(d))]].forEach(([k, v]) => h5.push([T(k, "negrita"), T(v)]));
    h5.push([]); h5.push(["Puntos", "Importancia", "Probabilidad (externos)"].map(x => T(x, "cab")));
    ESC_IMP.forEach((x, i) => h5.push([T(i + 1, "centro"), T(x), T(ESC_PROB[i])]));
    h5.push([T("Peso: importancia (internos, 1–5); importancia × probabilidad (externos, 1–25).", "sub")]);
    // 6. Estrategias, 7. Plan de acción, 8. Candidatos
    const h6 = cabecera("Estrategias CAME · " + nom, ["Código", "Tipo", "Estrategia", "Factores", "Impacto", "Viabilidad", "Zona", "Elegida", "Motivo", "Objetivo", "Meta", "Fecha"]);
    ordenarEstrategias(d.estrategias.filter(e => lleno(e.texto))).forEach(e => { const z = zonaEstrategia(e);
      h6.push([T(codigoEst(e), "negrita"), T(CAME[e.tipo].nom), T(e.texto, esElegida(e) ? "negrita" : "celda"), T(factoresDe(d, e).map(codigo).join(", ")), N(n3(e.impacto)), N(n3(e.viabilidad)), T(z ? ZONAS_EST[z].nom : ""), T(esElegida(e) ? "Sí" : "No", esElegida(e) ? "prio" : "centro"), T(e.motivo), T(e.objetivo.texto), T(e.objetivo.meta), T(fmtF(e.objetivo.fecha), "centro")]); });
    const h7 = cabecera("Plan de acción · " + nom, ["Acción", "Estrategia", "Qué", "Responsable", "Inicio", "Fin", "Recursos", "Cómo", "Fuerza", "Indicador", "Fórmula", "Estándar", "Fuente", "Estado", "Último valor", "Fecha", "¿Cumple?"]);
    elegidas(d).forEach(e => accionesDe(e).forEach((x, i) => { const u = ultimaMedida(x), sm = u ? semaforo(x.indicador.estandar, u.valor) : null;
      h7.push([T(`${codigoEst(e)}.${i + 1}`, "negrita"), T(codigoEst(e) + " · " + CAME[e.tipo].nom), T(x.que, "negrita"), T(x.quien), T(fmtF(x.inicio), "centro"), T(fmtF(x.fin), "centro"), T(x.recursos), T(x.como), T(FUERZAS[fuerzaMedida(x.que)] ? FUERZAS[fuerzaMedida(x.que)].nom : ""), T(x.indicador.nombre), T(x.indicador.formula), T(x.indicador.estandar, "centro"), T(x.indicador.fuente), T(ESTADOS[x.estado], "centro"), T(u ? u.valor : "", "centro"), T(u ? fmtF(u.fecha) : "", "centro"), T(sm === "ok" ? "Sí" : sm === "no" ? "No" : "", sm === "ok" ? "prio" : "centro")]); }));
    const h8 = cabecera("Factores que merecen un análisis propio · " + nom, ["Código", "Factor", "Análisis", "Proceso", "Motivo"]);
    candidatos(d).forEach(f => h8.push([T(codigo(f), "q_" + f.tipo), T(f.texto, "negrita"), T(DESTINOS[f.candidato.destino].nom), T(f.candidato.proceso), T(f.candidato.motivo)]));
    const h9 = cabecera("Equipo y sesiones · " + nom, ["Nº", "Perfil", "Cargo", "Papel", "Nombre"]);
    d.equipo.filter(m => lleno(m.perfil)).forEach((m, i) => h9.push([T(i + 1, "centro"), T(m.perfil, "negrita"), T(m.cargo), T(ROLES[m.rol] ? ROLES[m.rol].nom : ""), T(m.nombre)]));
    if (d.sesiones.length) { h9.push([]); h9.push(["Sesión", "Fecha", "Actividad", "Duración", "Resultados"].map(x => T(x, "cab"))); d.sesiones.forEach((x, i) => h9.push([T(i + 1, "centro"), T(fmtF(x.fecha), "centro"), T(x.actividad), T(x.duracion, "centro"), T(x.resultados)])); }
    return { estilos: ESTILOS_XLSX, hojas: [
      { nombre: "Factores", filas: h1, opciones: { anchoColumnas: [8, 14, 46, 22, 34, 28, 16, 11, 11, 7, 8, 11, 34], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 }, primera: true } },
      { nombre: "Matriz DAFO", filas: h2, opciones: { anchoColumnas: [60, 60], altoFilas: { 1: 24 } } },
      { nombre: "Matriz cruzada", filas: h3, opciones: { anchoColumnas: [9, ...cols.map(() => 7), 8], altoFilas: { 1: 24 } } },
      { nombre: "Estrategias", filas: h6, opciones: { anchoColumnas: [8, 11, 50, 16, 9, 10, 18, 9, 34, 40, 14, 11], congelar: { filas: 3, columnas: 0 } } },
      { nombre: "Plan de acción", filas: h7, opciones: { anchoColumnas: [8, 16, 44, 22, 11, 11, 24, 30, 16, 34, 30, 11, 22, 11, 11, 11, 10], congelar: { filas: 3, columnas: 0 } } },
      { nombre: "Candidatos", filas: h8, opciones: { anchoColumnas: [8, 46, 14, 34, 46] } },
      { nombre: "Equipo y sesiones", filas: h9, opciones: { anchoColumnas: [7, 40, 40, 24, 40] } },
      { nombre: "Fuentes", filas: h4, opciones: { anchoColumnas: [5, 40, 26, 14, 40, 20], congelar: { filas: 3, columnas: 0 } } },
      { nombre: "Ficha", filas: h5, opciones: { anchoColumnas: [26, 70, 50] } }
    ] };
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
      aporta: { en: Object.keys(APORTA) }, importancia: [2], probabilidad: [2], manual: { en: ["si", "no"] }, motivo: [500], candidato: { obj: "candidato" }, votos: { de: "voto", max: 60 }, bloqueAcsa: { en: Object.keys(BLOQUES_ACSA) }, origen: [120] },
    candidato: { destino: { en: ["amfe", "mapa", "auditoria"] }, proceso: [300], motivo: [800] },
    indicador: { nombre: [300], formula: [500], estandar: [100], fuente: [300] },
    objetivo: { texto: [1000], meta: [200], fecha: [20] },
    medida: { id: "id", fecha: [20], valor: [40], nota: [300] },
    accion: { id: "id", que: [1000], quien: [300], inicio: [20], fin: [20], recursos: [500], como: [1000], indicador: { obj: "indicador" }, estado: { en: ["pendiente", "curso", "hecha", "verificada"] }, nota: [1000], seguimiento: { de: "medida", max: 60 } },
    estrategia: { id: "id", tipo: { en: ["C", "A", "M", "E"] }, num: "ent", texto: [1000], factores: { lista: "ref", max: 30 }, impacto: [2], viabilidad: [2], elegida: { en: ["si", "no"] }, motivo: [800], origen: [100],
      objetivo: { obj: "objetivo" }, acciones: { de: "accion", max: 30 } },
    persona: { nombre: [200], cargo: [200] },
    hist: { edicion: [10], fecha: [20], cambio: [300] },
    control: { elaborado: { de: "persona", max: 10 }, revisado: { de: "persona", max: 10 }, aprobado: { de: "persona", max: 10 }, historial: { de: "hist", max: 40 } },
    prioridad: { n: "ent" },
    voto: { miembroId: "ref", importancia: [2], probabilidad: [2] },
    miembro: { id: "id", perfil: [200], cargo: [200], rol: { en: ["coordinacion", "secretaria", "miembro", "pacientes", "metodologia"] }, nombre: [200] },
    sesion: { id: "id", fecha: [20], actividad: [500], duracion: [40], asistentes: { lista: "ref", max: 40 }, resultados: [1500] },
    idea: { id: "id", cuadrante: { en: TIPOS }, texto: [500], bloqueId: "ref", factorId: "ref" },
    bloque: { id: "id", cuadrante: { en: TIPOS }, nombre: [200], comentario: [800] },
    votoTgn: { miembroId: "ref", bloqueId: "ref", puntos: [2] },
    tgn: { votos: { de: "votoTgn", max: 3000 } },
    dafo: { id: "id", titulo: [200], objeto: [300], tipoObjeto: { en: Object.keys(TIPOS_OBJETO) }, finalidad: { en: Object.keys(FINALIDADES) }, horizonte: [200],
      mision: [1500], vision: [1500], incluye: [1500], excluye: [1500], responsable: [300], fecha: [40],
      fuentes: { de: "fuente", max: 60 }, equipo: { de: "miembro", max: 40 }, sesiones: { de: "sesion", max: 40 }, ideas: { de: "idea", max: 800 }, bloques: { de: "bloque", max: 200 }, tgn: { obj: "tgn" },
      edicion: [10], anteriorId: "ref", factores: { de: "factor", max: 400 }, prioridad: { obj: "prioridad" }, cruces: "cruces", estrategias: { de: "estrategia", max: 60 }, conclusiones: [4000], proxRevision: [20], control: { obj: "control" }, notas: [3000], creado: [40], modificado: [40] }
  };
  const FABRICA = { fuente: nuevaFuente, factor: id => nuevoFactor(id), prioridad: () => ({ n: 5 }), candidato: nuevoCandidato, indicador: nuevoIndicador, objetivo: nuevoObjetivo,
    medida: nuevaMedida, accion: nuevaAccion, estrategia: id => nuevaEstrategia(id), persona: nuevaPersona, hist: () => ({ edicion: "", fecha: "", cambio: "" }),
    control: () => ({ elaborado: [], revisado: [], aprobado: [], historial: [] }), dafo: id => nuevoDafo(id, ""),
    voto: () => ({ miembroId: "", importancia: "", probabilidad: "" }), miembro: nuevoMiembro, sesion: nuevaSesion, idea: id => nuevaIdea(id), bloque: id => nuevoBloque(id),
    votoTgn: () => ({ miembroId: "", bloqueId: "", puntos: "" }), tgn: () => ({ votos: [] }) };
  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "ent") { const n = num(v); r[k] = Number.isInteger(n) && n >= 0 && n < 1e6 ? n : 0; }
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla === "cruces") r[k] = sanearCruces(v);
      else if (regla.lista) r[k] = Array.isArray(v) ? [...new Set(v.slice(0, regla.max * 2).filter(idValido))].slice(0, regla.max) : [];
      else if (regla.en) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.obj) r[k] = sanear(regla.obj, v, genId) || r[k];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
    });
    return r;
  }
  // Cruces: { "<idFila>|<idColumna>": "0"–"3" }. Las claves con ids raros o valores fuera de 0–3 se descartan.
  function sanearCruces(v) {
    const r = {}; if (!v || typeof v !== "object" || Array.isArray(v)) return r;
    Object.keys(v).slice(0, 4000).forEach(k => { const [a, b, x] = k.split("|"); const val = String(v[k]); if (x === undefined && idValido(a) && idValido(b) && /^[0-3]$/.test(val)) r[k] = val; });
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
    if (!d.prioridad.n) d.prioridad.n = 5;
    // Cruces solo entre una fila interna (F, D) y una columna externa (O, A) que existan
    const tipoDe = {}; d.factores.forEach(f => { tipoDe[f.id] = f.tipo; });
    Object.keys(d.cruces).forEach(k => { const [a, b] = k.split("|"); if (!esInterno(tipoDe[a]) || !tipoDe[b] || esInterno(tipoDe[b])) delete d.cruces[k]; });
    // Equipo, sesiones, ideas, bloques y votos: referencias rotas fuera
    const miembros = new Set(d.equipo.map(m => m.id)), bloq = new Map(d.bloques.map(b => [b.id, b])), facs = new Set(d.factores.map(f => f.id));
    if (!lleno(d.edicion)) d.edicion = "00";
    d.sesiones.forEach(x => { x.asistentes = x.asistentes.filter(id => miembros.has(id)); });
    d.ideas.forEach(i => { const b = bloq.get(i.bloqueId); if (!b || b.cuadrante !== i.cuadrante) i.bloqueId = ""; if (!facs.has(i.factorId)) i.factorId = ""; });
    d.tgn.votos = d.tgn.votos.filter(v => miembros.has(v.miembroId) && bloq.has(v.bloqueId) && /^[123]$/.test(v.puntos));
    d.factores.forEach(f => { f.votos = f.votos.filter(v => miembros.has(v.miembroId)); if (!esInterno(f.tipo)) f.bloqueAcsa = ""; });
    // Estrategias: solo factores que existen; números únicos
    const ids = new Set(d.factores.map(f => f.id)), usadosE = new Set();
    d.estrategias.forEach(e => { e.factores = e.factores.filter(id => ids.has(id)); if (!e.num || usadosE.has(e.num)) e.num = 0; else usadosE.add(e.num); });
    d.estrategias.filter(e => !e.num).forEach(e => { e.num = siguienteNumEst(d); });
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
    VERSION_DATOS, URL_AUD, URL_IND, URL_TM, URL_AMFE, URL_FLUJO,
    lleno, sinTildes, num, entero1a5, corto, normal, plural, minuscula,
    CUADRANTES, TIPOS, esInterno, PASOS,
    TIPOS_OBJETO, FINALIDADES, aniosHorizonte, FUENTES_TIPO, APORTA, AREAS, AMBITOS, BLOQUES_ACSA, AREA_A_BLOQUE, areasDe, nombreArea,
    ESC_IMP, ESC_PROB, ESC_PREG, peso, PESO_MAX, codigo, ordenar, delTipo, matrizDafo, puestos,
    nuevoDafo, nuevaFuente, nuevoFactor, siguienteNum, fuenteDe, nombreFuente, nombreDafo,
    sugerirHorizonte, sugerirTitulo, sugerirMision, sugerirVision,
    revisarRedaccion, parecido,
    avisosObjeto, avisosFuentes, avisosInterno, avisosExterno, avisosDe,
    nPrioridad, prioridad, esPrio, prioritarios, empatesCorte, sugerirMotivo, avisosPriorizar,
    BLOQUES, ORDEN_BLOQUES, bloqueDe, estrategiaPropuesta, ESC_CRUCE, claveCruce, valorCruce, ejesCruce, resultadoCruces, avisosCruzar,
    FORMATO_INTERCAMBIO, VERSION_INTERCAMBIO, paqueteIntercambio, leerIntercambio, ESTILOS_XLSX, hojasExcel,
    CAME, TIPOS_CAME, CAME_DE_BLOQUE, IMPACTO, VIABILIDAD, ZONAS_EST, zonaEstrategia, esElegida, codigoEst, siguienteNumEst, ordenarEstrategias, elegidas, factoresDe, estrategiasPropuestas, avisosEstrategias,
    DESTINOS, sugerirDestino, candidatos, ESTADOS, FUERZAS, fuerzaMedida, vencida, leerEstandar, semaforo, ultimaMedida, smartAuto, accionesDe, avisosPlan, notaCalidad,
    conclusionesSugeridas, introduccionSugerida, nuevaPersona, nuevoControl, renovarIds, nuevaEstrategia, nuevaAccion, nuevaMedida, nuevoCandidato,
    documentoInforme, documentoResumen, documentoLamina, leerAmfe, factorDeAmfe,
    ROLES, ESTAMENTOS, ESTAMENTO_NOM, estamentoDe, PERFILES_SUG, SESIONES_TIPO, nuevoMiembro, nuevaSesion, etiquetaMiembro, avisosEquipo,
    PREGUNTAS_IDEAS, nuevaIdea, nuevoBloque, ideasParecidas, voto321, ponerVoto321, ranking, ideaAFactor, bloqueAFactor, avisosIdeas,
    mediaVotos, discrepancia, ponerVoto, usarMedia, avisosVotos, bloqueAcsaDe, porBloquesAcsa,
    nuevaEdicion, estadoEstrategia, ESTADOS_EST, compararEdiciones, revisionProxima, documentoHoja, bloquesComparacion,
    resumen, progreso, pasoPendiente, siguientePaso,
    tipoDeTexto, parsearFactores, incorporarFactores,
    ESQ, sanear, sanearDafo, sanearDatos, fusionar
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Logica = API;
})(typeof window !== "undefined" ? window : this);

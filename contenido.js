// ============================================================
//  contenido.js — Solo datos · DAFO · CAME
//  Aprende (7 temas), glosario y ejemplos. HTML de confianza escrito a mano.
//  Fuente: metodología estándar del análisis DAFO y CAME adaptada a la gestión
//  sanitaria (no hay curso propio). El ejemplo de la UGC es inventado.
//  window.Contenido en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span><p>${html}</p></div>`;

  // ---------- Aprende ----------
  // c = color del tema (clases pdca--P/H/V/A de styles.css, solo como color)
  const TEMAS = [
    { n: 1, c: "P", titulo: "Qué es un DAFO", sub: "Una foto de dónde estáis para decidir hacia dónde ir",
      minuto: [
        "El <b>DAFO</b> ordena en cuatro casillas lo que pesa en una unidad: <b>debilidades</b> y <b>fortalezas</b> (de dentro) y <b>amenazas</b> y <b>oportunidades</b> (de fuera).",
        "No es el fin, es el principio: del DAFO sale el <b>CAME</b>, las estrategias para <b>corregir</b> debilidades, <b>afrontar</b> amenazas, <b>mantener</b> fortalezas y <b>explotar</b> oportunidades.",
        "En sanidad se usa para preparar el <b>acuerdo de gestión</b> de una UGC, la <b>acreditación</b>, un <b>plan estratégico</b> o un <b>proyecto nuevo</b>.",
        "Un buen DAFO es <b>concreto</b>, se apoya en <b>datos</b> y termina en un <b>plan de acción</b> con indicadores."],
      secciones: [
        { t: "Las cuatro casillas", h: `<div class="table-wrap"><table class="mini"><tr><th></th><th>A favor</th><th>En contra</th></tr>
            <tr><th>Interno<br><small>depende de vosotros</small></th><td><b>Fortalezas</b><br>Lo que hacéis bien</td><td><b>Debilidades</b><br>Lo que hacéis peor o os falta</td></tr>
            <tr><th>Externo<br><small>viene del entorno</small></th><td><b>Oportunidades</b><br>Lo que os puede ayudar</td><td><b>Amenazas</b><br>Lo que os puede perjudicar</td></tr></table></div>
          <p>La regla para no equivocarse: <b>si lo podéis cambiar vosotros, es interno; si os viene de fuera, es externo.</b></p>` },
        { t: "¿Para qué sirve en sanidad?", h: `<ul><li><b>Acuerdo de gestión</b>: decidir qué objetivos proponer y qué hay que corregir antes.</li><li><b>Acreditación</b>: ver qué bloques del manual flojean y dónde estáis fuertes.</li><li><b>Plan estratégico</b>: elegir unas pocas líneas para los próximos años.</li><li><b>Proyecto nuevo</b>: saber si es viable y qué riesgos tiene antes de empezar.</li></ul>` },
        { t: "Cuándo NO basta un DAFO", h: `<p>El DAFO mira la unidad entera y en grande. No sustituye:</p><ul><li>un <b>AMFE</b> o un <b>mapa de riesgos</b>, cuando hay que analizar paso a paso qué puede fallar en un proceso concreto;</li><li>una <b>auditoría</b>, cuando hay que medir si una práctica se cumple.</li></ul>
          ${box("practica", "En la práctica", "Una debilidad del DAFO («la conciliación de la medicación al alta se hace en menos de la mitad de los casos») puede ser el punto de partida de un AMFE o de una auditoría.")}` }
      ],
      minicaso: `<p>Una UGC de Atención Primaria prepara su acuerdo de gestión. Su demora para cita con medicina de familia es de 6 días (<b>debilidad</b>), tiene enfermería gestora de casos consolidada (<b>fortaleza</b>), llega una herramienta corporativa de teleconsulta (<b>oportunidad</b>) y se jubilan tres médicos en dos años (<b>amenaza</b>). Del cruce sale una estrategia: usar la gestión enfermera de la demanda y la teleconsulta para bajar la demora aunque falten médicos.</p>`,
      practica: { texto: "Ver el ejemplo de la UGC", href: "#/dafo/ej-dafo-ugc/3" } },

    { n: 2, c: "P", titulo: "Preparar el análisis", sub: "Qué se analiza, para qué, con quién y con qué datos",
      minuto: [
        "Decidid el <b>objeto</b> (servicio, unidad, centro o proyecto) y no lo hagáis demasiado grande.",
        "Decidid la <b>finalidad</b> y el <b>horizonte</b>: no es lo mismo un acuerdo de gestión de un año que un plan a cinco.",
        "Una <b>visión</b> breve («a dónde queremos llegar») ayuda: algo es fortaleza o debilidad respecto a esa meta.",
        "Reunid <b>datos antes que opiniones</b>: resultados, encuestas, notificaciones, reclamaciones, indicadores."],
      secciones: [
        { t: "Objeto, finalidad y horizonte", h: `<p>El <b>objeto</b> es lo que se analiza; el <b>alcance</b>, qué queda dentro y fuera. La <b>finalidad</b> dice para qué: cambia las preguntas y los datos que hacen falta. El <b>horizonte</b> es el tiempo que cubre: oportunidades y amenazas se valoran para ese plazo.</p>
          ${box("trampa", "Ojo, trampa", "Un DAFO de «todo el Área» sale tan general que no ayuda a decidir. Mejor un DAFO por unidad o servicio, y luego juntar lo común.")}` },
        { t: "Quién participa", h: `<p>El DAFO lo hace un <b>equipo</b>, no una persona: dirección, profesionales de los distintos estamentos y, si se puede, alguien que represente a los pacientes. Cada uno ve una parte distinta de la unidad.</p><p>Lo habitual son <b>dos sesiones</b> de unas dos horas: una para el DAFO y otra para priorizar y decidir estrategias.</p>` },
        { t: "Las fuentes de datos", h: `<ul><li>Resultados del <b>acuerdo de gestión</b> anterior y cuadro de mando de <b>indicadores</b>.</li><li>Informe de la <b>acreditación</b> o autoevaluación.</li><li><b>Encuesta de satisfacción</b> y <b>reclamaciones</b> (la voz de los pacientes).</li><li><b>Encuesta de cultura de seguridad</b> y <b>notificaciones de incidentes</b>.</li><li><b>Auditorías</b> y <b>AMFE</b> hechos.</li><li><b>Memoria</b> de actividad y plantilla, <b>planes</b> del sistema sanitario y <b>normativa</b>.</li></ul>
          ${box("idea", "Idea clave", "Cada factor del DAFO debería poder responder a «¿cómo lo sabéis?». Si hay un dato, el año que viene sabréis si ha mejorado.")}` }
      ],
      minicaso: `<p>Un servicio de Farmacia quiere hacer «un DAFO». ¿Para qué? Tras hablarlo, la finalidad es preparar la <b>acreditación</b> en 18 meses. Eso decide el horizonte (el ciclo de la acreditación), las fuentes (autoevaluación con el manual de estándares, auditorías de conciliación, notificaciones de errores de medicación) y quién participa (farmacia, enfermería de planta, un representante de la Comisión de Seguridad).</p>`,
      practica: { texto: "Empezar un DAFO", href: "#/dafo/nuevo" } },

    { n: 3, c: "H", titulo: "Mirar hacia dentro", sub: "Fortalezas y debilidades: lo que depende de vosotros",
      minuto: [
        "Las <b>fortalezas</b> son lo que hacéis bien y os acerca a la visión; las <b>debilidades</b>, lo que hacéis peor o os falta.",
        "Las dos <b>dependen de vosotros</b>: se pueden cambiar desde dentro de la unidad.",
        "Recorred las <b>áreas</b>: personas, organización, procesos, seguridad del paciente, resultados, recursos, sistemas, ciudadanía, docencia.",
        "Escribidlas <b>concretas y con un dato</b>: «demora de 6 días para cita» mejor que «demora»."],
      secciones: [
        { t: "Preguntas que ayudan", h: `<ul><li>¿En qué indicadores estamos por encima del estándar? ¿Y por debajo?</li><li>¿Qué nos reconocen los pacientes? ¿De qué se quejan?</li><li>¿Qué incidentes se repiten en las notificaciones?</li><li>¿Qué protocolos están caducados o no se cumplen?</li><li>¿Cómo es la plantilla: estable, formada, implicada?</li></ul>
          <p>Si vais a la <b>acreditación</b>, podéis recorrer también los bloques del manual de estándares: el ciudadano en el centro, la organización de la actividad, los profesionales, los procesos de soporte y los resultados.</p>` },
        { t: "Un buen factor", h: `<div class="table-wrap"><table class="mini"><tr><th>Así no</th><th>Así sí</th></tr>
            <tr><td>Comunicación</td><td>No hay reunión de equipo desde hace un año; las novedades llegan por correo y no todos lo leen</td></tr>
            <tr><td>Buen equipo</td><td>El 85 % de la plantilla lleva más de 5 años en la unidad</td></tr>
            <tr><td>Hay que formar en seguridad</td><td>Solo el 30 % del personal ha hecho formación en seguridad del paciente en 3 años</td></tr></table></div>
          ${box("trampa", "Ojo, trampa", "«Hay que formar…», «Mejorar…», «Implantar…» no son factores: son soluciones. Primero se describe la situación; las soluciones vienen después, en el CAME.")}` },
        { t: "Interno, aunque cueste", h: `<p>Hay cosas que parecen externas y no lo son. «Los pacientes no acuden a las citas de enfermería» puede ser una debilidad (cómo se citan, cómo se explica) antes que una amenaza.</p><p>Y al revés: «presupuesto insuficiente para sustituciones» no lo decide la unidad: es una <b>amenaza</b>.</p>
          ${box("practica", "En la práctica", "Si dudáis, preguntaos: «¿podemos hacer algo nosotros mañana para cambiarlo?». Si la respuesta es sí, es interno.")}` }
      ],
      minicaso: `<p>Un equipo de Urgencias escribe como debilidad «La Consejería no cubre las bajas del verano». La app avisa: parece externo. Lo reescriben en dos: como <b>amenaza</b>, «restricciones para cubrir sustituciones en verano»; y como <b>debilidad</b>, lo que sí depende de ellos, «no hay plan de contingencia para los picos de demanda de verano».</p>`,
      practica: { texto: "Ver las fortalezas y debilidades del ejemplo", href: "#/dafo/ej-dafo-ugc/3" } },

    { n: 4, c: "H", titulo: "Mirar hacia fuera", sub: "Oportunidades y amenazas: lo que viene del entorno",
      minuto: [
        "Las <b>oportunidades</b> son cambios del entorno que os pueden ayudar; las <b>amenazas</b>, los que os pueden perjudicar.",
        "No dependen de vosotros, pero sí <b>cómo os preparáis</b> para ellas.",
        "El método <b>PESTEL</b> ayuda a no olvidar nada: político, económico, social, tecnológico, ecológico (territorio) y legal.",
        "En lo externo cuentan dos cosas: <b>importancia</b> (cuánto os afectaría) y <b>probabilidad</b> (cuánto es de esperar). <b>Peso = importancia × probabilidad</b>."],
      secciones: [
        { t: "PESTEL adaptado a sanidad", h: `<div class="table-wrap"><table class="mini"><tr><th>Ámbito</th><th>Ejemplos</th></tr>
            <tr><td><b>Político e institucional</b></td><td>Planes y estrategias del sistema sanitario, cambios de dirección, prioridades</td></tr>
            <tr><td><b>Económico y plantillas</b></td><td>Presupuesto, sustituciones, plazas difíciles de cubrir, financiación de proyectos</td></tr>
            <tr><td><b>Social y demográfico</b></td><td>Envejecimiento, cronicidad, población flotante, expectativas de los pacientes</td></tr>
            <tr><td><b>Tecnológico</b></td><td>Telemedicina, historia digital, nuevas técnicas, fiabilidad de los sistemas</td></tr>
            <tr><td><b>Territorio y entorno</b></td><td>Dispersión, accesos, transporte, calor extremo</td></tr>
            <tr><td><b>Legal y normativo</b></td><td>Normas nuevas, requisitos de acreditación, protección de datos</td></tr></table></div>
          <p>Y el <b>entorno sanitario cercano</b>: el hospital de referencia, otros centros y niveles, el Distrito o el Área, la Agencia de Calidad; la <b>comunidad</b> (asociaciones de pacientes, ayuntamiento, servicios sociales) y la <b>formación e investigación</b> (universidad, unidades docentes).</p>` },
        { t: "Importancia y probabilidad", h: `<p>Una amenaza muy grave pero casi imposible pesa menos que una algo menos grave que ya está ocurriendo. Por eso se multiplican:</p>
          <div class="formula">Peso = importancia (1–5) × probabilidad (1–5) → de 1 a 25</div>
          <p>La probabilidad se juzga para el <b>horizonte</b> del análisis: en un acuerdo de gestión de un año, lo que pasará dentro de cinco cuenta poco.</p>` },
        { t: "Oportunidades que no lo son", h: `${box("trampa", "Ojo, trampa", "Una oportunidad que nadie va a aprovechar es solo un deseo. Al escribirla, pensad qué fortaleza tenéis para aprovecharla o qué haría falta. Eso se verá al cruzar los factores.")}
          ${box("trampa", "Ojo, trampa", "«Nuestro equipo está poco formado» no es una amenaza aunque preocupe: depende de vosotros, es una debilidad.")}` }
      ],
      minicaso: `<p>Una unidad de Calidad apunta como oportunidad «la nueva estrategia de seguridad del paciente financia proyectos en Atención Primaria». Importancia 4 (encaja con sus objetivos), probabilidad 4 (la convocatoria ya está anunciada): <b>peso 16</b>. Como amenaza, «cambio de dirección del Área»: importancia 3, probabilidad 2, <b>peso 6</b>. La primera pesa bastante más.</p>`,
      practica: { texto: "Ver las oportunidades y amenazas del ejemplo", href: "#/dafo/ej-dafo-ugc/4" } },

    { n: 5, c: "V", titulo: "Priorizar", sub: "Quedarse con lo que de verdad pesa",
      minuto: [
        "Una lluvia de ideas suele dar 10, 15 o 20 factores por casilla. <b>No se puede trabajar con todos</b>.",
        "Se ordenan por <b>peso</b> y se eligen los más importantes de cada cuadrante: lo habitual, <b>unos 5</b>.",
        "Si el equipo puntúa por separado, la <b>media</b> da el valor; si los votos están muy separados, <b>hay que hablarlo</b>.",
        "Cuidado con los <b>sesgos</b>: autocomplacencia, culpar al entorno, y «todo es importante»."],
      secciones: [
        { t: "Cómo se puntúa", h: `<p>Cada factor lleva su <b>importancia</b> de 1 a 5 (y en los externos, su probabilidad). Comparad unos con otros: ¿qué fortaleza os ayuda más?, ¿qué debilidad os frena más en la finalidad del análisis?</p>
          ${box("trampa", "Ojo, trampa", "Si todo tiene un 4 o un 5, la escala no sirve para elegir. Obligaos a usarla entera.")}` },
        { t: "Sesgos frecuentes", h: `<ul><li><b>Autocomplacencia</b>: muchas fortalezas y casi ninguna debilidad. Mirad las reclamaciones y los indicadores que no se cumplen.</li><li><b>Pesimismo</b>: todo amenazas y ninguna oportunidad.</li><li><b>Culpar al entorno</b>: escribir como amenazas cosas que dependen de la unidad.</li><li><b>La voz más alta</b>: lo que dice la persona con más cargo pesa más. Para evitarlo, que cada uno puntúe por separado antes de hablar.</li></ul>` }
      ],
      minicaso: `<p>En el DAFO de una UGC hay 9 debilidades. Ordenadas por importancia, las dos primeras (demora de 6 días e higiene de manos al 55 %) tienen un 5 y un 4; la última, «el aparcamiento es pequeño», un 1. El equipo se queda con las 5 de más peso para el resto del análisis.</p>`,
      practica: { texto: "Ver la matriz DAFO del ejemplo", href: "#/dafo/ej-dafo-ugc/4?informe=1" } },

    { n: 6, c: "V", titulo: "Cruzar y decidir: el CAME", sub: "De la foto a las estrategias",
      minuto: [
        "Se cruzan los factores de dentro con los de fuera: cada cruce sugiere un tipo de estrategia.",
        "<b>FO</b> (fortaleza + oportunidad): <b>explotar</b>. <b>FA</b>: <b>mantener</b> y defenderse. <b>DO</b>: <b>corregir</b> para poder aprovechar. <b>DA</b>: <b>afrontar</b>, reducir la vulnerabilidad.",
        "Una <b>matriz cruzada</b> de 0 a 3 dice qué cruces pesan más y cuál es la <b>orientación</b> de la unidad: ofensiva, defensiva, de reorientación o de supervivencia.",
        "Las estrategias se eligen por su <b>impacto</b> y su <b>viabilidad</b>: pocas y bien hechas."],
      secciones: [
        { t: "Las cuatro estrategias", h: `<div class="table-wrap"><table class="mini"><tr><th></th><th>Oportunidades</th><th>Amenazas</th></tr>
            <tr><th>Fortalezas</th><td><b>FO · Explotar</b><br>Estrategias ofensivas: usar lo que hacéis bien para aprovechar el entorno</td><td><b>FA · Mantener</b><br>Estrategias defensivas: apoyarse en lo que hacéis bien para resistir</td></tr>
            <tr><th>Debilidades</th><td><b>DO · Corregir</b><br>Estrategias de reorientación: corregir lo que impide aprovechar</td><td><b>DA · Afrontar</b><br>Estrategias de supervivencia: que lo de fuera no os pille débiles</td></tr></table></div>` },
        { t: "La matriz cruzada", h: `<p>En cada casilla se responde con un número de 0 (nada) a 3 (mucho) a una pregunta distinta según el bloque: «¿esta fortaleza nos ayuda a aprovechar esta oportunidad?», «¿esta debilidad nos impide aprovecharla?»… La media de cada bloque indica la postura de la unidad y los cruces con un 3 son las estrategias candidatas.</p>
          ${box("idea", "Idea clave", "La orientación es una ayuda, no una orden: una unidad en «supervivencia» también debe mantener sus fortalezas.")}` },
        { t: "Elegir con cabeza", h: `<ul><li>¿La debilidad o la amenaza más importante tiene alguna estrategia?</li><li>¿Hay estrategias de más de un tipo, o solo «corregir»?</li><li>¿Cada estrategia se apoya en algún factor del análisis?</li><li>¿Es viable con los recursos que hay?</li></ul>` }
      ],
      minicaso: `<p>La UGC del ejemplo cruza su <b>enfermería gestora de casos</b> (F3) con la <b>nueva teleconsulta</b> (O2): un 3. Estrategia <b>explotar</b>: «seguimiento de los crónicos complejos por teleconsulta liderado por enfermería gestora de casos». Y cruza su <b>conciliación de la medicación baja</b> (D2) con la <b>consultoría del hospital</b> (O5): otro 3. Estrategia <b>corregir</b>: «circuito de conciliación al alta con la enfermera de enlace del hospital».</p>`,
      practica: { texto: "Ver el ejemplo de la UGC", href: "#/dafo/ej-dafo-ugc/4" } },

    { n: 7, c: "A", titulo: "Del DAFO al plan de acción", sub: "Objetivos, acciones, indicadores y seguimiento",
      minuto: [
        "Cada estrategia elegida se convierte en un <b>objetivo</b> medible y con fecha (SMART).",
        "Cada objetivo, en <b>acciones</b> con responsable, plazo, recursos e <b>indicador</b> con su estándar.",
        "El plan se <b>sigue</b>: se mide el indicador y se revisa el DAFO cada año.",
        "Si una debilidad pide un análisis más fino, se pasa a un <b>AMFE</b>, un <b>mapa de riesgos</b> o una <b>auditoría</b>."],
      secciones: [
        { t: "Objetivos SMART", h: `<p>Un objetivo es SMART si es <b>e</b>specífico, <b>m</b>edible, <b>a</b>lcanzable, <b>r</b>elevante y con <b>t</b>iempo.</p>
          <div class="table-wrap"><table class="mini"><tr><th>Así no</th><th>Así sí</th></tr><tr><td>Mejorar la conciliación de la medicación</td><td>Que el 80 % de los pacientes dados de alta del hospital tengan la medicación conciliada en 7 días antes de diciembre de 2027</td></tr></table></div>` },
        { t: "Acciones fuertes y débiles", h: `<p>«Formar», «recordar» o «sensibilizar» son medidas <b>débiles</b>: ayudan, pero solas cambian poco. Las <b>fuertes</b> cambian el sistema: un circuito nuevo, una alerta en la historia clínica, una lista de verificación obligatoria, un cambio en la agenda.</p>` },
        { t: "Con las otras apps", h: `<ul><li>Una debilidad o amenaza de un <b>proceso concreto</b> con riesgo para el paciente → <b>AMFE</b>.</li><li>Un <b>proceso completo</b> que hay que ver de principio a fin → <b>Mapa de Riesgos</b>.</li><li>Una <b>práctica que hay que medir</b> (higiene de manos, registros) → <b>Auditoría</b>.</li><li>Los indicadores de las acciones se diseñan bien en <b>Indicadores</b>.</li></ul>` }
      ],
      minicaso: `<p>La UGC del ejemplo elige cuatro estrategias. Para «corregir la conciliación de la medicación», el objetivo es llegar al 80 % en 2027; la acción, un circuito con la enfermera de enlace del hospital; el responsable, la coordinación de cuidados; el indicador, «% de altas con medicación conciliada en 7 días», con estándar ≥ 80 %. Además, marca la conciliación como candidata a un <b>AMFE</b> y la higiene de manos como candidata a una <b>auditoría</b>.</p>`,
      practica: { texto: "Ver el ejemplo de la UGC", href: "#/dafo/ej-dafo-ugc/1" } }
  ];

  // ---------- Glosario ----------
  const GLOSARIO = [
    ["DAFO", "Análisis de las Debilidades, Amenazas, Fortalezas y Oportunidades de una unidad, servicio o proyecto. También se llama FODA o, en inglés, SWOT."],
    ["CAME", "Estrategias que salen del DAFO: Corregir las debilidades, Afrontar las amenazas, Mantener las fortalezas y Explotar las oportunidades."],
    ["Fortaleza", "Algo que la unidad hace bien o tiene a su favor y que depende de ella: capacidades, resultados, recursos."],
    ["Debilidad", "Algo que la unidad hace peor o le falta y que depende de ella; limita sus resultados y se puede cambiar desde dentro."],
    ["Oportunidad", "Un hecho o cambio del entorno que puede ayudar a la unidad si sabe aprovecharlo."],
    ["Amenaza", "Un hecho o cambio del entorno que puede perjudicar a la unidad si no se prepara."],
    ["Análisis interno", "La parte del DAFO que mira hacia dentro: fortalezas y debilidades."],
    ["Análisis externo", "La parte del DAFO que mira hacia fuera: oportunidades y amenazas."],
    ["PEST / PESTEL", "Lista para revisar el entorno sin olvidar nada: político, económico, social, tecnológico y, en PESTEL, también ecológico (territorio) y legal."],
    ["Factor", "Cada una de las frases del DAFO: una fortaleza, una debilidad, una oportunidad o una amenaza."],
    ["Evidencia", "El dato que respalda un factor (una cifra, un resultado, una encuesta). Sin evidencia, el factor es una opinión."],
    ["Fuente de información", "De dónde sale el dato: resultados del acuerdo de gestión, encuestas, notificaciones, indicadores, auditorías…"],
    ["Importancia", "Cuánto pesa un factor en lo que la unidad quiere conseguir, de 1 (poco) a 5 (clave)."],
    ["Probabilidad", "En oportunidades y amenazas, cuánto es de esperar que ocurran en el horizonte del análisis, de 1 a 5."],
    ["Peso", "Valor que ordena los factores: en los internos, la importancia; en los externos, importancia × probabilidad (de 1 a 25)."],
    ["Priorización", "Quedarse con los factores de más peso de cada cuadrante (habitualmente unos 5) para trabajar con ellos."],
    ["Matriz DAFO", "La tabla de dos por dos con las cuatro casillas: fortalezas y debilidades arriba, oportunidades y amenazas abajo."],
    ["Matriz cruzada", "Tabla que cruza cada factor interno con cada externo y puntúa de 0 a 3 cuánto se relacionan. También se llama matriz de impacto cruzado."],
    ["Orientación estratégica", "La postura que sugiere la matriz cruzada: ofensiva (FO), defensiva (FA), de reorientación (DO) o de supervivencia (DA)."],
    ["Estrategia ofensiva", "FO: usar las fortalezas para aprovechar las oportunidades (explotar)."],
    ["Estrategia defensiva", "FA: apoyarse en las fortalezas para hacer frente a las amenazas (mantener)."],
    ["Estrategia de reorientación", "DO: corregir las debilidades que impiden aprovechar las oportunidades (corregir)."],
    ["Estrategia de supervivencia", "DA: reducir las debilidades que más expuestos dejan ante las amenazas (afrontar)."],
    ["Factor llave", "Un factor que se relaciona con muchos otros en la matriz cruzada: actuar sobre él mueve varias estrategias."],
    ["Objetivo SMART", "Objetivo específico, medible, alcanzable, relevante y con fecha."],
    ["Plan de acción", "Las acciones concretas para cumplir los objetivos, con responsable, plazo, recursos e indicador."],
    ["Indicador", "Medida que dice si una acción o un objetivo se cumple; se compara con un estándar."],
    ["Estándar", "El valor del indicador que se considera aceptable (por ejemplo, ≥ 80 %)."],
    ["Misión", "Para qué existe la unidad: a quién atiende y qué le ofrece."],
    ["Visión", "A dónde quiere llegar la unidad en el horizonte del análisis. Una fortaleza o una debilidad lo son respecto a esa meta."],
    ["Horizonte temporal", "El tiempo que cubre el análisis: un año en un acuerdo de gestión, de 3 a 5 en un plan estratégico."],
    ["Alcance", "Lo que queda dentro y fuera del análisis."],
    ["Grupo de interés", "Personas o entidades a las que afecta la unidad o que influyen en ella: pacientes, profesionales, dirección, otros servicios, ayuntamiento…"],
    ["Acuerdo de gestión", "Documento anual en el que una Unidad de Gestión Clínica pacta con la dirección sus objetivos, indicadores y recursos."],
    ["UGC", "Unidad de Gestión Clínica: unidad asistencial que gestiona sus recursos y se compromete con unos objetivos."],
    ["Acreditación ACSA", "Certificación de la calidad de una unidad o centro por la Agencia de Calidad Sanitaria de Andalucía, según un manual de estándares."],
    ["Lluvia de ideas", "Técnica de grupo para generar muchas ideas rápido, sin juzgarlas, que después se agrupan y se priorizan."],
    ["Grupo nominal", "Técnica en la que cada persona puntúa por separado y se suman los votos, para que no domine la voz más alta."],
    ["Sesgo de autocomplacencia", "Tendencia a ver muchas fortalezas y pocas debilidades. Se corrige con datos: indicadores, reclamaciones, notificaciones."]
  ];

  // ---------- Ejemplos ----------
  // DAFO de una UGC de Atención Primaria (inventada): acuerdo de gestión y acreditación. Ids «ej-…»: viven en memoria.
  const fte = (id, tipo, nombre, fecha, nota) => ({ id: "ej-fu-" + id, tipo, nombre, fecha, nota });
  const fac = (tipo, num, texto, area, evidencia, fuente, importancia, probabilidad = "", aporta = "datos") =>
    ({ id: `ej-fa-${tipo}${num}`, tipo, num, texto, area, evidencia, fuenteId: fuente ? "ej-fu-" + fuente : "", aporta, importancia: String(importancia), probabilidad: String(probabilidad) });
  const DAFO_UGC = {
    id: "ej-dafo-ugc", titulo: "DAFO UGC de Atención Primaria 2027", objeto: "UGC de Atención Primaria", tipoObjeto: "ugc", finalidad: "acuerdo",
    horizonte: "1 año (el del acuerdo de gestión 2027), preparando también la acreditación",
    mision: "Prestar a las 22.000 personas de la zona básica una atención primaria segura, accesible y de calidad, centrada en las personas y en la continuidad de los cuidados.",
    vision: "Ser una UGC acreditada, con una demora que permita la cita en 48 horas y con los pacientes crónicos complejos seguidos de forma proactiva.",
    incluye: "El centro de salud y sus dos consultorios: medicina de familia, enfermería, pediatría, trabajo social y atención a la ciudadanía.",
    excluye: "El dispositivo de urgencias de atención primaria y la unidad de salud mental comunitaria.",
    responsable: "Dirección de la UGC y coordinación de cuidados", fecha: "Noviembre de 2026",
    fuentes: [
      fte("ag", "acuerdo", "Evaluación del acuerdo de gestión 2026", "2026", "Demora, accesibilidad, control de crónicos, conciliación."),
      fte("enc", "encuesta", "Encuesta de satisfacción de usuarios", "2026", "91 % satisfechos o muy satisfechos."),
      fte("cul", "cultura", "Encuesta de cultura de seguridad del paciente", "2025", "Participó el 64 % de la plantilla."),
      fte("not", "notificaciones", "Notificaciones de incidentes de seguridad", "Últimos 12 meses", "38 notificaciones, la mayoría sin daño."),
      fte("ind", "indicadores", "Cuadro de mando de indicadores del Distrito", "2026", ""),
      fte("hm", "auditorias", "Observación de la higiene de manos (auditoría interna)", "2026", "120 oportunidades observadas."),
      fte("mem", "memoria", "Memoria de actividad y plantilla", "2026", ""),
      fte("plan", "plan", "Plan estratégico del Distrito y estrategia de seguridad del paciente", "2026", "")
    ],
    factores: [
      fac("F", 1, "Equipo estable: el 85 % de la plantilla de medicina y enfermería lleva más de 5 años en la UGC", "personas", "Plantilla 2026: 17 de 20 profesionales con más de 5 años", "mem", 4),
      fac("F", 2, "Control de la diabetes por encima de la media del Distrito", "resultados", "62 % de pacientes con HbA1c menor de 8 % (Distrito: 54 %)", "ind", 4),
      fac("F", 3, "Enfermería gestora de casos consolidada, con 140 pacientes crónicos complejos en seguimiento", "procesos", "Registro de gestión de casos 2026", "mem", 5),
      fac("F", 4, "Cultura de notificación de incidentes: 38 notificaciones en el último año", "seguridad", "La mayoría sin daño; 3 análisis hechos", "not", 3),
      fac("F", 5, "Buena valoración de los pacientes en la encuesta de satisfacción", "ciudadania", "91 % satisfechos o muy satisfechos", "enc", 3, "", "pacientes"),
      fac("F", 6, "Unidad docente acreditada con residentes de Medicina Familiar y Comunitaria y de Enfermería", "docencia", "4 residentes por año", "mem", 3, "", "equipo"),
      fac("D", 1, "Demora media de 6 días para cita con medicina de familia (objetivo del acuerdo: 48 horas)", "resultados", "Acuerdo de gestión 2026: objetivo no cumplido", "ag", 5),
      fac("D", 2, "Conciliación de la medicación tras el alta hospitalaria en el 45 % de los casos", "seguridad", "Estándar del acuerdo: 80 %", "ag", 5),
      fac("D", 3, "Cuatro de los diez protocolos de la UGC llevan más de 5 años sin revisar", "procesos", "Revisión del archivo de protocolos", "mem", 3, "", "equipo"),
      fac("D", 4, "Solo el 30 % del personal ha hecho formación en seguridad del paciente en los últimos 3 años", "personas", "Registro de formación", "cul", 3),
      fac("D", 5, "Cumplimiento de la higiene de manos del 55 % en la observación directa", "seguridad", "66 de 120 oportunidades observadas", "hm", 4),
      fac("D", 6, "El consultorio de la pedanía no tiene sala de curas separada ni espacio para la toma de muestras", "recursos", "Visita a los consultorios", "", 2, "", "equipo"),
      fac("O", 1, "La estrategia de seguridad del paciente financia proyectos de mejora en Atención Primaria", "politico", "Convocatoria anunciada para 2027", "plan", 3, 4),
      fac("O", 2, "Nueva herramienta corporativa de teleconsulta y telemonitorización disponible en 2027", "tecnologico", "Plan estratégico del Distrito", "plan", 4, 4),
      fac("O", 3, "Asociación de pacientes crónicos activa en el municipio, con escuela de pacientes", "comunidad", "Colabora ya con el ayuntamiento", "", 3, 4, "pacientes"),
      fac("O", 4, "Apoyo metodológico de la Agencia de Calidad Sanitaria para la acreditación de la UGC", "sanitario", "Programa de acompañamiento a unidades", "plan", 4, 5, "direccion"),
      fac("O", 5, "El hospital de referencia ofrece una consultoría de medicina interna y una enfermera de enlace para el alta", "sanitario", "Propuesta de la dirección del hospital para 2027", "plan", 5, 4, "direccion"),
      fac("O", 6, "El ayuntamiento ofrece ceder un local junto al consultorio de la pedanía", "comunidad", "Ofrecimiento verbal del alcalde", "", 2, 3, "direccion"),
      fac("A", 1, "Envejecimiento de la población: el 24 % tiene más de 65 años y la cronicidad crece cada año", "social", "Pirámide de población de la zona básica", "mem", 5, 5),
      fac("A", 2, "Tres jubilaciones en medicina de familia en los próximos 2 años, en plazas difíciles de cubrir", "economico", "Previsión de jubilaciones del Distrito", "mem", 5, 4, "direccion"),
      fac("A", 3, "La población flotante aumenta la demanda un 30 % en julio y agosto", "social", "Actividad de los veranos 2024 a 2026", "mem", 4, 5),
      fac("A", 4, "Restricciones presupuestarias para sustituciones y nuevas contrataciones", "economico", "Instrucciones del Distrito para 2027", "plan", 4, 3, "direccion"),
      fac("A", 5, "Caídas del sistema corporativo de historia digital varias veces al año, que paralizan la consulta", "tecnologico", "5 incidentes notificados; dependen de los servicios centrales", "not", 3, 3),
      fac("A", 6, "Bulos sanitarios en redes sociales que generan consultas evitables", "social", "Percepción del equipo; sin datos", "", 2, 3, "equipo")
    ],
    notas: "Ejemplo inventado: la UGC, sus cifras y sus fuentes no corresponden a ningún centro real.",
    creado: "2026-10-22T08:00:00.000Z", modificado: "2026-10-22T08:00:00.000Z"
  };

  const EJEMPLOS = {
    dafos: [DAFO_UGC],
    fichas: [
      { t: "1 · Qué analizamos", s: "Objeto, finalidad (acuerdo de gestión), horizonte, misión y visión", href: "#/dafo/ej-dafo-ugc/1" },
      { t: "2 · Fuentes", s: "Ocho fuentes de datos: acuerdo, encuestas, notificaciones, indicadores…", href: "#/dafo/ej-dafo-ugc/2" },
      { t: "3 · Dentro", s: "6 fortalezas y 6 debilidades, cada una con su dato", href: "#/dafo/ej-dafo-ugc/3" },
      { t: "4 · Fuera", s: "6 oportunidades y 6 amenazas con importancia y probabilidad", href: "#/dafo/ej-dafo-ugc/4" }
    ]
  };

  const API = { TEMAS, GLOSARIO, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : this);

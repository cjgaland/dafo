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
  // Matriz cruzada escrita como tabla: filas y columnas por código, valores 0–3
  const cruces = (filas, cols, valores) => {
    const r = {};
    filas.forEach((f, i) => cols.forEach((c, j) => { r[`ej-fa-${f}|ej-fa-${c}`] = String(valores[i][j]); }));
    return r;
  };
  // Estrategias y plan de acción del ejemplo
  const ind = (nombre, formula, estandar, fuente) => ({ nombre, formula, estandar, fuente });
  const acc = (id, que, quien, inicio, fin, recursos, como, indicador, estado = "pendiente", seguimiento = []) =>
    ({ id: "ej-ac-" + id, que, quien, inicio, fin, recursos, como, indicador, estado, nota: "", seguimiento: seguimiento.map((m, i) => ({ id: `ej-me-${id}-${i}`, fecha: m[0], valor: m[1], nota: m[2] || "" })) });
  const est = (num, tipo, texto, factores, impacto, viabilidad, origen, objetivo, acciones, elegida = "", motivo = "") =>
    ({ id: "ej-es-" + num, tipo, num, texto, factores: factores.map(c => "ej-fa-" + c), impacto: String(impacto), viabilidad: String(viabilidad), elegida, motivo, origen,
      objetivo: { texto: objetivo[0], meta: objetivo[1], fecha: objetivo[2] }, acciones });
  const IND_CONC = ind("% de altas hospitalarias con la medicación conciliada en 7 días", "Altas con conciliación registrada en 7 días / altas hospitalarias × 100", "≥ 80 %", "Historia de salud digital");
  const ESTRATEGIAS_UGC = [
    est(1, "C", "Circuito de conciliación de la medicación al alta con la enfermera de enlace del hospital, dentro del plan de acreditación", ["D2", "O5", "O4"], 3, 3, "cruce:DO:ej-fa-D2",
      ["Que el 80 % de los pacientes dados de alta del hospital tengan la medicación conciliada en 7 días", "≥ 80 %", "2027-12-31"],
      [acc("1-1", "Circuito de aviso de altas: la enfermera de enlace del hospital envía cada alta a la enfermera gestora de casos", "Coordinación de cuidados", "2027-01-15", "2027-03-31", "Sin coste: tiempo de enfermería", "Listado diario de altas y cita de conciliación en los 7 días siguientes", IND_CONC, "pendiente", [["2026-09-30", "45", "Línea de base (acuerdo 2026)"]]),
       acc("1-2", "Alerta automática en la historia clínica cuando llega un informe de alta sin conciliar", "Dirección de la UGC con Sistemas de Información del Distrito", "2027-04-01", "2027-09-30", "Desarrollo de Sistemas de Información", "Aviso en la agenda del médico y la enfermera de familia", IND_CONC)]),
    est(2, "A", "Gestión enfermera de la demanda y plan de verano para bajar la demora ante el envejecimiento, las jubilaciones y la población flotante", ["D1", "A1", "A2", "A3"], 3, 2, "cruce:DA:ej-fa-D1",
      ["Bajar la demora media para cita con medicina de familia de 6 días a 48 horas", "≤ 2 días", "2027-12-31"],
      [acc("2-1", "Gestión enfermera de la demanda aguda con protocolos consensuados para los motivos de consulta más frecuentes", "Coordinación de cuidados", "2027-01-15", "2027-04-30", "Formación de 10 h para enfermería", "Protocolos de resfriado, cistitis, quemaduras leves, heridas…", ind("Demora media para cita con medicina de familia (días)", "Media de días entre la petición y la cita", "≤ 2", "Cuadro de mando del Distrito"), "pendiente", [["2026-09-30", "6", "Línea de base"]]),
       acc("2-2", "Plan de contingencia de verano: agenda reforzada y redistribución de cupos en julio y agosto", "Dirección de la UGC", "2027-03-01", "2027-06-15", "Refuerzo de verano del Distrito", "Agendas de acto único y consultas de enfermería sin cita previa", ind("Demora media en julio y agosto (días)", "Media de días entre la petición y la cita en julio y agosto", "≤ 3", "Cuadro de mando del Distrito"))]),
    est(3, "E", "Seguimiento por teleconsulta de los pacientes crónicos complejos, liderado por la enfermería gestora de casos y con la consultoría de medicina interna del hospital", ["F3", "O2", "O5"], 3, 2, "cruce:FO:ej-fa-F3",
      ["Seguir por teleconsulta al menos al 60 % de los 140 pacientes crónicos complejos", "≥ 60 %", "2027-12-31"],
      [acc("3-1", "Agenda de teleconsulta de enfermería gestora de casos, con 2 horas semanales de consultoría de medicina interna", "Enfermería gestora de casos", "2027-02-01", "2027-06-30", "Herramienta corporativa de teleconsulta", "Llamada o videollamada programada cada trimestre y tras cada ingreso", ind("% de crónicos complejos con al menos una teleconsulta al trimestre", "Crónicos complejos con teleconsulta en el trimestre / crónicos complejos × 100", "≥ 60 %", "Registro de gestión de casos"))]),
    est(4, "M", "Usar la unidad docente y la estabilidad del equipo como reclamo para cubrir las jubilaciones", ["F6", "F1", "A2"], 2, 2, "cruce:FA:ej-fa-F6",
      ["Cubrir las tres plazas que quedarán vacantes por jubilación antes de que se produzcan", "3 de 3", "2028-06-30"],
      [acc("4-1", "Ofrecer contrato de continuidad a los residentes que terminan y presentar la UGC en las jornadas de residentes del Distrito", "Dirección de la UGC y tutores", "2027-01-01", "2027-05-31", "", "", ind("Plazas cubiertas antes de la jubilación", "Plazas cubiertas / plazas que quedan vacantes", "3 de 3", "Recursos Humanos del Distrito"))],
      "si", "Es la única estrategia que protege a la UGC de las jubilaciones, y la dirección del Distrito la apoya."),
    est(5, "C", "Plan de mejora de la higiene de manos con el apoyo metodológico de la Agencia", ["D5", "O4"], 2, 3, "cruce:DO:ej-fa-D5",
      ["Llegar a un cumplimiento de la higiene de manos del 80 % en la observación directa", "≥ 80 %", "2027-12-31"],
      [acc("5-1", "Soluciones alcohólicas en el punto de atención de todas las consultas y salas de curas", "Responsable de seguridad del paciente de la UGC", "2027-01-15", "2027-02-28", "Dispensadores para 24 puestos", "", ind("Puestos de atención con solución alcohólica", "Puestos con dispensador / puestos de atención × 100", "100 %", "Revisión de consultas")),
       acc("5-2", "Auditoría trimestral de la higiene de manos con devolución de los resultados al equipo", "Responsable de seguridad del paciente de la UGC", "2027-03-01", "2027-12-31", "", "Observación directa de 120 oportunidades por trimestre", ind("Cumplimiento de la higiene de manos (observación directa)", "Oportunidades con higiene correcta / oportunidades observadas × 100", "≥ 80 %", "Auditoría interna"), "pendiente", [["2026-06-30", "55", "Línea de base"]])]),
    est(6, "C", "Revisar los cuatro protocolos caducados con la metodología de la Agencia, para la acreditación", ["D3", "O4"], 2, 3, "cruce:DO:ej-fa-D3",
      ["Tener los diez protocolos de la UGC revisados en los últimos cinco años", "10 de 10", "2027-09-30"],
      [acc("6-1", "Revisión de los cuatro protocolos caducados por grupos de trabajo, con fecha de próxima revisión", "Comisión de calidad de la UGC", "2027-01-15", "2027-09-30", "Dos sesiones de trabajo por protocolo", "", ind("Protocolos revisados en los últimos 5 años", "Protocolos vigentes revisados / protocolos de la UGC", "10 de 10", "Archivo de protocolos"), "pendiente", [["2026-10-01", "6", "Línea de base"]])]),
    est(7, "C", "Proyecto de formación en seguridad del paciente, financiado por la estrategia de seguridad", ["D4", "O1"], 2, 2, "cruce:DO:ej-fa-D4", ["", "", ""], []),
    est(8, "M", "Reforzar la gestión de casos ante el aumento de la cronicidad", ["F3", "A1"], 2, 2, "cruce:FA:ej-fa-F3", ["", "", ""], []),
    est(9, "C", "Teleconsulta de medicina de familia para descargar la agenda presencial", ["D1", "O2"], 2, 3, "cruce:DO:ej-fa-D1", ["", "", ""], [], "no", "Se incluye en E2 (gestión de la demanda) y en E3 (teleconsulta de crónicos).")
  ];
  // Equipo, sesiones, lluvia de ideas y votos del ejemplo
  const EQUIPO_UGC = [
    ["Director/a de la UGC", "Médico/a de familia", "coordinacion"], ["Coordinador/a de cuidados de enfermería", "Enfermero/a", "miembro"],
    ["Médico/a de familia", "Tutor/a de residentes", "miembro"], ["Enfermero/a gestor/a de casos", "Enfermero/a", "miembro"],
    ["Técnico/a en Cuidados Auxiliares de Enfermería (TCAE)", "", "miembro"], ["Administrativo/a de atención a la ciudadanía", "", "miembro"],
    ["Representante de la asociación de pacientes crónicos", "", "pacientes"], ["Técnico/a de Calidad del Distrito", "", "secretaria"]
  ].map(([perfil, cargo, rol], i) => ({ id: "ej-mi-" + (i + 1), perfil, cargo, rol, nombre: "" }));
  const TODOS = EQUIPO_UGC.map(m => m.id);
  const SESIONES_UGC = [
    { id: "ej-se-1", fecha: "2026-11-04", actividad: "Lluvia de ideas y matriz DAFO (fortalezas, debilidades, oportunidades y amenazas)", duracion: "2 h", asistentes: TODOS, resultados: "36 ideas en 12 bloques; 24 factores con su dato" },
    { id: "ej-se-2", fecha: "2026-11-11", actividad: "Votación de la importancia, priorización, matriz cruzada y estrategias CAME", duracion: "2 h", asistentes: TODOS, resultados: "20 factores prioritarios, orientación de reorientación y 6 estrategias elegidas" },
    { id: "ej-se-3", fecha: "2026-11-18", actividad: "Plan de acción: objetivos, responsables, plazos e indicadores", duracion: "1 h 30 min", asistentes: TODOS.filter(x => x !== "ej-mi-7"), resultados: "Plan de acción con 9 acciones e indicadores" }
  ];
  // Bloques de la lluvia de ideas: [cuadrante, nombre, factor al que pasó, ideas]
  const BLOQUES_UGC = [
    ["F", "Equipo estable", "F1", ["La mayoría llevamos años aquí", "Casi no hay rotación de médicos ni de enfermeras", "Nos conocemos y nos cubrimos"]],
    ["F", "Gestión de casos", "F3", ["Las gestoras de casos conocen a todos los crónicos complejos", "Los crónicos complejos tienen su enfermera de referencia", "Las altas de los crónicos se ven en pocos días"]],
    ["F", "Docencia", "F6", ["Tenemos residentes de medicina y de enfermería", "Los residentes nos obligan a estar al día", "Somos unidad docente acreditada"]],
    ["D", "Demora para la cita", "D1", ["Se tarda casi una semana en dar cita con el médico", "Muchas reclamaciones por la demora", "La agenda está llena todo el año"]],
    ["D", "Conciliación al alta", "D2", ["No sabemos qué medicación traen del hospital", "Los informes de alta llegan tarde", "Nadie revisa la medicación tras el alta"]],
    ["D", "Higiene de manos", "D5", ["No hay solución alcohólica en todas las consultas", "La observación de la higiene de manos salió baja", "Con prisa nos saltamos la higiene de manos"]],
    ["O", "Apoyo del hospital", "O5", ["El hospital quiere una enfermera de enlace", "Medicina interna ofrece consultoría", "Hay buena relación con el hospital"]],
    ["O", "Acreditación", "O4", ["La Agencia ayuda a preparar la acreditación", "Otras UGC del Distrito ya están acreditadas", "Hay guías y talleres para la acreditación"]],
    ["O", "Teleconsulta", "O2", ["Llega la teleconsulta corporativa", "Los pacientes ya usan la app de salud", "Se podrá seguir a pacientes desde casa"]],
    ["A", "Envejecimiento", "A1", ["Cada vez hay más mayores", "Más pacientes con varias enfermedades crónicas", "Más personas que viven solas"]],
    ["A", "Jubilaciones", "A2", ["Se jubilan tres médicos en dos años", "Nadie quiere venir a un pueblo", "Las plazas tardan en cubrirse"]],
    ["A", "Población de verano", "A3", ["En verano viene mucha gente de fuera", "En agosto se dispara la demanda", "Los desplazados no tienen historia aquí"]]
  ];
  const IDEAS_UGC = [], BLOQ_UGC = [], VOTOS_TGN_UGC = [];
  BLOQUES_UGC.forEach(([t, nombre, fac, ideas], i) => {
    const bid = "ej-bq-" + (i + 1);
    BLOQ_UGC.push({ id: bid, cuadrante: t, nombre, comentario: "" });
    ideas.forEach((texto, j) => IDEAS_UGC.push({ id: `ej-id-${i + 1}-${j + 1}`, cuadrante: t, texto, bloqueId: bid, factorId: "ej-fa-" + fac }));
  });
  // Grupo nominal: en cada cuadrante, cada miembro reparte 3, 2 y 1 puntos (tres pautas distintas)
  const PAUTAS = [[3, 2, 1], [2, 3, 1], [3, 1, 2]];
  ["F", "D", "O", "A"].forEach(t => {
    const bq = BLOQ_UGC.filter(b => b.cuadrante === t);
    EQUIPO_UGC.forEach((m, k) => PAUTAS[k % 3].forEach((p, j) => VOTOS_TGN_UGC.push({ miembroId: m.id, bloqueId: bq[j].id, puntos: String(p) })));
  });
  // Votación de la importancia (y la probabilidad) de cuatro factores: la media redondeada es el valor final
  const VOTOS_UGC = {
    D1: [[5], [5], [4], [5], [5], [5], [4], [5]], D2: [[5], [4], [5], [5], [5], [5], [5], [4]],
    A1: [[5, 5], [4, 5], [5, 4], [5, 5], [5, 5], [5, 5], [4, 5], [5, 5]], A2: [[5, 4], [5, 4], [4, 4], [5, 5], [5, 4], [5, 4], [5, 4], [4, 3]]
  };
  const conVotos = f => { const v = VOTOS_UGC[f.tipo + f.num]; if (v) f.votos = v.map(([i, p], k) => ({ miembroId: "ej-mi-" + (k + 1), importancia: String(i), probabilidad: p ? String(p) : "" })); return f; };

  // Edición anterior (2026) del mismo DAFO, para enseñar la comparación año a año
  const DAFO_UGC_00 = {
    id: "ej-dafo-ugc-00", titulo: "DAFO UGC de Atención Primaria 2026", objeto: "UGC de Atención Primaria", tipoObjeto: "ugc", finalidad: "acuerdo",
    horizonte: "1 año (el del acuerdo de gestión 2026)", mision: "", vision: "", incluye: "", excluye: "", responsable: "Dirección de la UGC", fecha: "Noviembre de 2025",
    edicion: "00", anteriorId: "", fuentes: [], equipo: [], sesiones: [], ideas: [], bloques: [], tgn: { votos: [] },
    factores: [
      fac("F", 1, "Equipo estable: el 80 % de la plantilla lleva más de 5 años en la UGC", "personas", "Plantilla 2025", "", 4),
      fac("F", 2, "Control de la diabetes algo por encima de la media del Distrito", "resultados", "58 % con HbA1c menor de 8 % (Distrito: 54 %)", "", 3),
      fac("F", 4, "Cultura de notificación de incidentes: 25 notificaciones en el último año", "seguridad", "Sistema de notificación", "", 3),
      fac("F", 6, "Unidad docente acreditada con residentes", "docencia", "4 residentes por año", "", 3),
      Object.assign(fac("F", 7, "Buena relación con el hospital de referencia", "procesos", "Sin datos", "", 3), { id: "ej-fa-F7-00" }),
      fac("D", 1, "Demora media de 4 días para cita con medicina de familia", "resultados", "Acuerdo de gestión 2025", "", 4),
      fac("D", 2, "Conciliación de la medicación tras el alta hospitalaria en el 30 % de los casos", "seguridad", "Acuerdo de gestión 2025", "", 4),
      fac("D", 4, "Poca formación en seguridad del paciente", "personas", "Registro de formación", "", 3),
      Object.assign(fac("D", 7, "No hay seguimiento proactivo de los pacientes crónicos complejos", "procesos", "Sin enfermería gestora de casos", "", 5), { id: "ej-fa-D7-00" }),
      fac("O", 4, "Apoyo de la Agencia de Calidad Sanitaria para la acreditación", "sanitario", "Programa de acompañamiento", "", 4, 4),
      Object.assign(fac("O", 7, "Programa del Distrito para implantar la enfermería gestora de casos", "sanitario", "Plan del Distrito 2026", "", 5, 5), { id: "ej-fa-O7-00" }),
      fac("A", 1, "Envejecimiento de la población y aumento de la cronicidad", "social", "Pirámide de población", "", 5, 5),
      fac("A", 2, "Jubilaciones próximas en medicina de familia", "economico", "Previsión del Distrito", "", 5, 3),
      fac("A", 4, "Restricciones presupuestarias para sustituciones", "economico", "Instrucciones del Distrito", "", 4, 3)
    ],
    prioridad: { n: 5 }, cruces: {},
    estrategias: [
      { id: "ej-es-00-1", tipo: "E", num: 1, texto: "Implantar la enfermería gestora de casos aprovechando el programa del Distrito", factores: ["ej-fa-D7-00", "ej-fa-O7-00"], impacto: "3", viabilidad: "3", elegida: "", motivo: "", origen: "",
        objetivo: { texto: "Seguir al menos a 100 pacientes crónicos complejos por gestión de casos", meta: "≥ 100", fecha: "2026-10-31" },
        acciones: [acc("00-1", "Designar y formar a dos enfermeras gestoras de casos y abrir su agenda", "Coordinación de cuidados", "2026-01-15", "2026-04-30", "", "", ind("Pacientes crónicos complejos en seguimiento por gestión de casos", "Número de pacientes en seguimiento", "≥ 100", "Registro de gestión de casos"), "verificada", [["2026-10-01", "140", ""]])] },
      { id: "ej-es-00-2", tipo: "A", num: 2, texto: "Reorganizar las agendas para bajar la demora ante el aumento de la demanda", factores: ["ej-fa-D1", "ej-fa-A1"], impacto: "3", viabilidad: "2", elegida: "", motivo: "", origen: "",
        objetivo: { texto: "Bajar la demora media para cita con medicina de familia a 3 días", meta: "≤ 3 días", fecha: "2026-10-31" },
        acciones: [acc("00-2", "Agenda de acto único en medicina de familia", "Dirección de la UGC", "2026-02-01", "2026-05-31", "", "", ind("Demora media para cita con medicina de familia (días)", "Media de días entre la petición y la cita", "≤ 3", "Cuadro de mando del Distrito"), "hecha", [["2026-09-30", "6", ""]])] }
    ],
    conclusiones: "El DAFO de 2026 señala como prioridades implantar la gestión de casos para los crónicos complejos y bajar la demora para cita con medicina de familia.",
    proxRevision: "2026-11-15",
    control: { elaborado: [{ nombre: "", cargo: "Dirección de la UGC" }], revisado: [{ nombre: "", cargo: "Coordinación de cuidados" }], aprobado: [{ nombre: "", cargo: "Dirección de Atención Primaria del Distrito" }],
      historial: [{ edicion: "00", fecha: "2025-11-14", cambio: "Documento inicial" }] },
    notas: "Edición anterior del ejemplo (inventada), para comparar con la de 2027.",
    creado: "2025-11-14T08:00:00.000Z", modificado: "2025-11-14T08:00:00.000Z"
  };
  const DAFO_UGC = {
    id: "ej-dafo-ugc", titulo: "DAFO UGC de Atención Primaria 2027", objeto: "UGC de Atención Primaria", tipoObjeto: "ugc", finalidad: "acuerdo",
    horizonte: "1 año (el del acuerdo de gestión 2027), preparando también la acreditación",
    mision: "Prestar a las 22.000 personas de la zona básica una atención primaria segura, accesible y de calidad, centrada en las personas y en la continuidad de los cuidados.",
    vision: "Ser una UGC acreditada, con una demora que permita la cita en 48 horas y con los pacientes crónicos complejos seguidos de forma proactiva.",
    incluye: "El centro de salud y sus dos consultorios: medicina de familia, enfermería, pediatría, trabajo social y atención a la ciudadanía.",
    excluye: "El dispositivo de urgencias de atención primaria y la unidad de salud mental comunitaria.",
    responsable: "Dirección de la UGC y coordinación de cuidados", fecha: "Noviembre de 2026",
    edicion: "01", anteriorId: "ej-dafo-ugc-00",
    equipo: EQUIPO_UGC, sesiones: SESIONES_UGC, ideas: IDEAS_UGC, bloques: BLOQ_UGC, tgn: { votos: VOTOS_TGN_UGC },
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
      fac("F", 5, "Buena valoración de los pacientes en la encuesta de satisfacción", "ciudadania", "91 % satisfechos o muy satisfechos", "enc", 2, "", "pacientes"),
      fac("F", 6, "Unidad docente acreditada con residentes de Medicina Familiar y Comunitaria y de Enfermería", "docencia", "4 residentes por año", "mem", 3, "", "equipo"),
      fac("D", 1, "Demora media de 6 días para cita con medicina de familia (objetivo del acuerdo: 48 horas)", "resultados", "Acuerdo de gestión 2026: objetivo no cumplido", "ag", 5),
      Object.assign(fac("D", 2, "Conciliación de la medicación tras el alta hospitalaria en el 45 % de los casos", "seguridad", "Estándar del acuerdo: 80 %", "ag", 5),
        { candidato: { destino: "amfe", proceso: "Conciliación de la medicación al alta hospitalaria", motivo: "Proceso con riesgo directo para el paciente: conviene saber qué puede fallar en cada paso antes de montar el circuito (E1)." } }),
      fac("D", 3, "Cuatro de los diez protocolos de la UGC llevan más de 5 años sin revisar", "procesos", "Revisión del archivo de protocolos", "mem", 3, "", "equipo"),
      fac("D", 4, "Solo el 30 % del personal ha hecho formación en seguridad del paciente en los últimos 3 años", "personas", "Registro de formación", "cul", 3),
      Object.assign(fac("D", 5, "Cumplimiento de la higiene de manos del 55 % en la observación directa", "seguridad", "66 de 120 oportunidades observadas", "hm", 4),
        { candidato: { destino: "auditoria", proceso: "Higiene de manos en consultas y salas de curas", motivo: "Práctica que hay que medir cada trimestre con un método fiable (E5)." } }),
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
    ].map(conVotos),
    prioridad: { n: 5 },
    cruces: cruces(
      ["F3", "F1", "F2", "F4", "F6", "D1", "D2", "D5", "D3", "D4"],
      ["O5", "O4", "O2", "O1", "O3", "A1", "A2", "A3", "A4", "A5"],
      [ // FO y FA (fortalezas) · DO y DA (debilidades)
        [3, 1, 3, 1, 2, /**/ 3, 1, 1, 1, 0],   // F3 enfermería gestora de casos
        [1, 2, 1, 1, 1, /**/ 1, 2, 1, 1, 0],   // F1 equipo estable
        [1, 1, 2, 0, 2, /**/ 2, 0, 0, 0, 0],   // F2 control de la diabetes
        [0, 2, 0, 2, 0, /**/ 0, 0, 0, 0, 1],   // F4 cultura de notificación
        [1, 1, 1, 1, 0, /**/ 0, 3, 1, 0, 0],   // F6 unidad docente
        [1, 2, 3, 1, 1, /**/ 3, 3, 3, 1, 1],   // D1 demora de 6 días
        [3, 3, 1, 2, 1, /**/ 2, 0, 0, 0, 1],   // D2 conciliación de la medicación
        [0, 3, 0, 2, 0, /**/ 1, 0, 1, 0, 0],   // D5 higiene de manos
        [1, 3, 1, 1, 0, /**/ 1, 1, 0, 0, 0],   // D3 protocolos sin revisar
        [1, 2, 0, 3, 0, /**/ 0, 1, 0, 0, 1]    // D4 formación en seguridad
      ]),
    estrategias: ESTRATEGIAS_UGC,
    conclusiones: "",
    proxRevision: "2027-11-15",
    control: { elaborado: [{ nombre: "", cargo: "Dirección de la UGC" }], revisado: [{ nombre: "", cargo: "Coordinación de cuidados" }], aprobado: [{ nombre: "", cargo: "Dirección de Atención Primaria del Distrito" }],
      historial: [{ edicion: "00", fecha: "2025-11-14", cambio: "Documento inicial" }, { edicion: "01", fecha: "2026-11-15", cambio: "Revisión anual del DAFO" }] },
    notas: "Ejemplo inventado: la UGC, sus cifras y sus fuentes no corresponden a ningún centro real.",
    creado: "2026-10-22T08:00:00.000Z", modificado: "2026-10-22T08:00:00.000Z"
  };

  // ---------- Ponte a prueba ----------
  // Bloques del test → tema de «Aprende» que conviene repasar
  const TEMAS_TEST = { 1: { nom: "El DAFO y su preparación", aprende: 2 }, 2: { nom: "Mirar dentro y fuera", aprende: 3 }, 3: { nom: "Priorizar y cruzar", aprende: 5 }, 4: { nom: "Estrategias y plan", aprende: 7 } };
  const TEST = [
    { t: 1, q: "¿Qué dos cuadrantes del DAFO forman el análisis interno?", o: ["Fortalezas y debilidades.", "Oportunidades y amenazas.", "Fortalezas y oportunidades.", "Debilidades y amenazas."], ok: 0, e: "Lo interno es lo que depende de la unidad: sus fortalezas y sus debilidades. Las oportunidades y las amenazas vienen del entorno." },
    { t: 1, q: "¿Qué significa CAME?", o: ["Corregir, afrontar, mantener y explotar.", "Comparar, analizar, medir y evaluar.", "Controlar, auditar, mejorar y estandarizar.", "Cambiar, actuar, motivar y ejecutar."], ok: 0, e: "Son las cuatro estrategias que salen del DAFO: corregir las debilidades, afrontar las amenazas, mantener las fortalezas y explotar las oportunidades." },
    { t: 1, q: "¿Cuál es la mejor razón para hacer el DAFO de una UGC?", o: ["Porque lo pide la dirección todos los años.", "Preparar el acuerdo de gestión del año siguiente.", "Sustituir el análisis de riesgos de los procesos.", "Evaluar el trabajo de cada profesional."], ok: 1, e: "Un DAFO necesita una finalidad: de ella dependen las preguntas, los datos y las decisiones. «Porque toca» no lleva a ninguna decisión, y no sirve ni para analizar riesgos de procesos ni para evaluar a personas." },
    { t: 1, q: "¿Por qué conviene apuntar las fuentes de datos del DAFO?", o: ["Para que el informe sea más largo.", "Porque un DAFO sin datos es una lista de opiniones y no permite saber si algo mejora.", "Porque lo exige la normativa de protección de datos.", "Para no tener que reunir al equipo."], ok: 1, e: "Cada factor debería responder a «¿cómo lo sabéis?». Con el dato, el año que viene se podrá ver si ha cambiado." },
    { t: 1, q: "¿Cuál de estos objetos es demasiado amplio para un DAFO útil?", o: ["La UGC de un centro de salud.", "El servicio de Farmacia del hospital.", "Todo el Área sanitaria, con sus hospitales y centros.", "Un proyecto de consulta de heridas crónicas."], ok: 2, e: "Un DAFO de «todo el Área» sale tan general que no ayuda a decidir. Mejor uno por unidad o servicio, y después juntar lo común." },
    { t: 2, q: "En el DAFO de una UGC, «la Consejería no cubre las sustituciones de verano» es…", o: ["Una debilidad.", "Una amenaza.", "Una fortaleza.", "Una oportunidad."], ok: 1, e: "No depende de la unidad: viene de fuera y la perjudica. Lo que sí depende de ella (por ejemplo, no tener plan de contingencia para el verano) sería una debilidad." },
    { t: 2, q: "«Solo el 30 % del personal se ha formado en seguridad del paciente en tres años» es…", o: ["Una amenaza.", "Una debilidad.", "Una oportunidad.", "No es un factor."], ok: 1, e: "Depende de la unidad y la limita: es una debilidad, y además está bien escrita, con su dato." },
    { t: 2, q: "¿Cuál de estos está bien escrito como factor?", o: ["«Comunicación».", "«Hay que mejorar la formación».", "«Demora media de 6 días para cita con medicina de familia».", "«Falta de recursos»."], ok: 2, e: "Un buen factor es concreto y tiene un dato. «Comunicación» y «falta de recursos» son vagos, y «hay que mejorar…» es una solución, no un factor." },
    { t: 2, q: "En el método PESTEL, «llega una herramienta corporativa de teleconsulta» es un factor…", o: ["Político.", "Económico.", "Tecnológico.", "Legal."], ok: 2, e: "Es un cambio tecnológico del entorno; para la unidad, una oportunidad." },
    { t: 2, q: "En oportunidades y amenazas, el peso de un factor es…", o: ["La importancia sola.", "La importancia por la probabilidad.", "La importancia más la probabilidad.", "La probabilidad sola."], ok: 1, e: "Peso = importancia × probabilidad, de 1 a 25. Así pesa más lo importante que además es probable en el horizonte del análisis." },
    { t: 3, q: "Una amenaza tiene importancia 5 y probabilidad 1; otra, importancia 3 y probabilidad 5. ¿Cuál pesa más?", o: ["La primera (peso 5).", "La segunda (peso 15).", "Pesan igual.", "No se puede saber."], ok: 1, e: "5 × 1 = 5 y 3 × 5 = 15. Algo muy grave pero casi imposible pesa menos que algo menos grave que ya está ocurriendo." },
    { t: 3, q: "Si todos los factores tienen importancia 4 o 5…", o: ["El análisis es excelente.", "La escala no sirve para elegir: hay que comparar los factores entre sí.", "Hay que quedarse con todos.", "Hay que subir los demás a 5."], ok: 1, e: "Si todo es importante, nada lo es. Comparad unos factores con otros para que se vea qué pesa más." },
    { t: 3, q: "¿Por qué conviene que cada persona vote en silencio y por separado?", o: ["Para ir más rápido.", "Para que no pese más la voz más alta o la persona con más cargo.", "Porque lo exige la acreditación.", "Para no tener que hablar después."], ok: 1, e: "Es la idea de la técnica de grupo nominal: primero cada uno decide solo; después se comparan los votos y se habla de los que están muy separados." },
    { t: 3, q: "En la matriz cruzada, el bloque DO responde a la pregunta…", o: ["¿Esta fortaleza ayuda a aprovechar esta oportunidad?", "¿Esta debilidad nos impide aprovechar esta oportunidad?", "¿Esta debilidad nos hace más vulnerables a esta amenaza?", "¿Esta fortaleza nos defiende de esta amenaza?"], ok: 1, e: "DO cruza debilidades con oportunidades: lo que no os deja aprovechar el entorno. De ahí salen las estrategias de corregir." },
    { t: 3, q: "Si el bloque con más media en la matriz cruzada es DA, la orientación es…", o: ["Ofensiva.", "Defensiva.", "De reorientación.", "De supervivencia."], ok: 3, e: "DA: las debilidades os dejan expuestos ante las amenazas. Lo primero es reducir esa vulnerabilidad (afrontar)." },
    { t: 4, q: "Una estrategia que usa una fortaleza para aprovechar una oportunidad es de tipo…", o: ["Corregir.", "Afrontar.", "Mantener.", "Explotar."], ok: 3, e: "FO → explotar: estrategias ofensivas que aprovechan el entorno con lo que hacéis bien." },
    { t: 4, q: "¿Qué estrategia conviene elegir primero?", o: ["Poco impacto y difícil de hacer.", "Mucho impacto y viable.", "Mucho impacto, pero imposible sin recursos que no hay.", "La más barata aunque no cambie nada."], ok: 1, e: "Las de «Hazla ya»: mucho impacto y viables. Las de mucho impacto pero difíciles se planifican; las de poco impacto y difíciles, se reconsideran." },
    { t: 4, q: "¿Cuál de estos es un objetivo SMART?", o: ["Mejorar la conciliación de la medicación.", "Que el 80 % de las altas tengan la medicación conciliada en 7 días antes de diciembre de 2027.", "Conciliar más y mejor.", "Concienciar al personal sobre la conciliación."], ok: 1, e: "Es específico, medible (80 %), alcanzable, relevante y tiene plazo (diciembre de 2027). Los demás no dicen cuánto ni cuándo." },
    { t: 4, q: "¿Cuál de estas acciones es una medida fuerte?", o: ["Una sesión de formación al equipo.", "Un cartel recordatorio en la consulta.", "Una alerta automática en la historia clínica cuando llega un alta sin conciliar.", "Un correo a todos los profesionales."], ok: 2, e: "Las medidas fuertes cambian el sistema y no dependen de la memoria. Formar, recordar o avisar ayudan, pero solas son débiles." },
    { t: 4, q: "Una debilidad que es un proceso concreto con riesgo para el paciente (por ejemplo, la conciliación al alta) pide además…", o: ["Nada más: basta con el DAFO.", "Un AMFE de ese proceso.", "Una encuesta de clima laboral.", "Cambiar el horizonte del análisis."], ok: 1, e: "El DAFO mira la unidad en grande. Para saber qué puede fallar en cada paso de un proceso con riesgo, hace falta un AMFE (y para medir una práctica, una auditoría)." }
  ];
  // Ejercicios prácticos
  const EJERCICIOS = {
    // ¿Fortaleza, debilidad, oportunidad o amenaza? (en el DAFO de una UGC de Atención Primaria)
    clasifica: [
      ["Tres médicos de familia se jubilan en los próximos dos años", "A", "Viene de fuera (plantillas y jubilaciones) y os perjudica."],
      ["El 91 % de los pacientes está satisfecho con la atención", "F", "Depende de vosotros y está a favor."],
      ["La Agencia de Calidad ofrece apoyo para preparar la acreditación", "O", "Viene de fuera y os puede ayudar si lo aprovecháis."],
      ["No hay reunión de equipo desde hace un año", "D", "Depende de vosotros y juega en contra."],
      ["La población de la zona envejece y aumenta la cronicidad", "A", "Es un cambio del entorno que aumentará la demanda."],
      ["Llega una herramienta corporativa de teleconsulta", "O", "Un cambio tecnológico del entorno que podéis aprovechar."],
      ["Los protocolos de la unidad llevan cinco años sin revisar", "D", "Revisarlos depende de vosotros: es interno."],
      ["Enfermería gestora de casos con 140 crónicos complejos en seguimiento", "F", "Una capacidad de la unidad, con su dato."],
      ["Restricciones presupuestarias para nuevas contrataciones", "A", "No lo decide la unidad: viene de fuera y la limita."],
      ["Una asociación de pacientes quiere colaborar con la unidad", "O", "Un aliado del entorno: oportunidad."]
    ].map(([texto, tipo, por]) => ({ texto, tipo, por })),
    // ¿Sirve como factor?
    sirve: [
      ["Comunicación", "vago"], ["Hay que formar al personal en seguridad del paciente", "solucion"], ["Solo el 30 % del personal se ha formado en seguridad del paciente en tres años", "bien"],
      ["Falta de recursos", "vago"], ["Implantar una agenda de acto único", "solucion"], ["Demora media de 6 días para cita con medicina de familia", "bien"],
      ["Buen ambiente", "vago"], ["Mejorar la higiene de manos", "solucion"], ["Cumplimiento de la higiene de manos del 55 % en la observación directa", "bien"]
    ].map(([texto, k]) => ({ texto, k })),
    // ¿Qué estrategia CAME sale de este cruce?
    came: [
      ["F", "Enfermería gestora de casos consolidada", "O", "Llega la teleconsulta corporativa", "E"],
      ["D", "Conciliación de la medicación al alta en el 45 % de los casos", "O", "El hospital ofrece una enfermera de enlace para el alta", "C"],
      ["D", "Demora de 6 días para la cita", "A", "Envejecimiento y más pacientes crónicos", "A"],
      ["F", "Unidad docente con residentes", "A", "Jubilaciones en plazas difíciles de cubrir", "M"],
      ["F", "Buena cultura de notificación de incidentes", "O", "La estrategia de seguridad financia proyectos", "E"],
      ["D", "Poca formación en seguridad del paciente", "A", "Caídas del sistema informático que paralizan la consulta", "A"]
    ].map(([tf, fila, tc, col, came]) => ({ tf, fila, tc, col, came }))
  };

  // ---------- Minicasos (inventados, para practicar un paso concreto) ----------
  const crucesDe = (id, filas, cols, valores) => { const r = {}; filas.forEach((f, i) => cols.forEach((c, j) => { r[`${id}-${f}|${id}-${c}`] = String(valores[i][j]); })); return r; };
  const MINICASOS = [
    { id: "ej-mini-urg", titulo: "Urgencias: ¿dentro o fuera?", objeto: "Servicio de Urgencias hospitalarias", tipoObjeto: "servicio", finalidad: "estrategico", horizonte: "3 años", paso: 3,
      foco: "Frases mezcladas: separa lo interno de lo externo y corrige las que son soluciones o están vagas (pasos 3 y 4).",
      factores: [
        ["F", 1, "Triaje de enfermería con el sistema Manchester implantado desde hace 10 años", "procesos", "Tiempo medio hasta el triaje: 9 minutos", 4],
        ["F", 2, "Equipo de enfermería con formación en soporte vital avanzado", "personas", "90 % con el curso al día", 4],
        ["D", 1, "La Consejería no cubre las sustituciones de verano", "personas", "", 4],
        ["D", 2, "Esperas de más de 4 horas para ingresar en planta", "resultados", "Mediana de 5 horas en invierno", 5],
        ["D", 3, "Hay que mejorar la comunicación con las plantas", "organizacion", "", 3],
        ["O", 1, "Nuestro equipo de enfermería está muy implicado", "sanitario", "", 3, 5],
        ["O", 2, "Plan del hospital para abrir una unidad de corta estancia", "sanitario", "Aprobado para 2027", 4, 4],
        ["A", 1, "Aumento de la población mayor de 80 años", "social", "+12 % en cinco años", 4, 5],
        ["A", 2, "Comunicación", "social", "", 3, 3]] },
    { id: "ej-mini-far", titulo: "Farmacia: ¿qué amenaza pesa más?", objeto: "Servicio de Farmacia hospitalaria", tipoObjeto: "servicio", finalidad: "acsa", horizonte: "El ciclo de la acreditación", paso: 4,
      foco: "Amenazas con distinta importancia y probabilidad: el peso decide cuál va primero (paso 4).",
      factores: [
        ["F", 1, "Validación farmacéutica del 100 % de las prescripciones de hospitalización", "procesos", "Informe anual 2026", 5],
        ["F", 2, "Dispensación automatizada en seis plantas", "recursos", "Armarios automatizados desde 2024", 4],
        ["D", 1, "Conciliación de la medicación al ingreso solo en el 40 % de los pacientes", "seguridad", "Auditoría 2026", 5],
        ["D", 2, "Un único farmacéutico de guardia localizada para todo el hospital", "personas", "Cuadrante de guardias", 3],
        ["O", 1, "Nueva prescripción electrónica integrada con atención primaria", "tecnologico", "Despliegue previsto en 2027", 4, 4],
        ["O", 2, "Programa de la Agencia para acreditar servicios de farmacia", "sanitario", "Convocatoria abierta", 4, 5],
        ["A", 1, "Desabastecimiento de medicamentos", "economico", "32 alertas de desabastecimiento en 2026", 3, 5],
        ["A", 2, "Ciberataque que paralice el sistema de prescripción", "tecnologico", "Ningún incidente en el hospital hasta ahora", 5, 1],
        ["A", 3, "Nueva normativa de preparación de medicamentos estériles", "legal", "En tramitación", 4, 3]] },
    { id: "ej-mini-her", titulo: "Proyecto: consulta de heridas crónicas", objeto: "Consulta de enfermería de heridas crónicas (proyecto)", tipoObjeto: "proyecto", finalidad: "proyecto", horizonte: "Hasta su puesta en marcha y su primer año", paso: 1,
      foco: "El DAFO de un proyecto nuevo: ¿es viable y qué riesgos tiene? Mira también sus estrategias (pasos 1 y 7).",
      factores: [
        ["F", 1, "Dos enfermeras con máster en heridas crónicas", "personas", "Títulos de 2023 y 2025", 5],
        ["F", 2, "Registro de úlceras en la historia digital desde 2025", "sistemas", "312 pacientes registrados", 4],
        ["D", 1, "No hay sala libre con lavabo para las curas complejas", "recursos", "Revisión de espacios de 2026", 4],
        ["D", 2, "Sin circuito de derivación desde los centros de salud", "procesos", "Sin protocolo escrito", 4],
        ["O", 1, "Plan de cronicidad del Distrito que prioriza las úlceras", "politico", "Plan 2026–2028", 4, 4],
        ["O", 2, "Asociación de pacientes con diabetes interesada en colaborar", "comunidad", "Reunión en 2026", 3, 4],
        ["A", 1, "Restricciones para nuevas contrataciones", "economico", "Instrucciones para 2027", 4, 4],
        ["A", 2, "Material de curas avanzado sujeto a un concurso centralizado", "economico", "Concurso en curso", 3, 4]],
      estrategias: [
        ["C", "Habilitar una sala de curas compartida y un circuito de derivación desde los centros de salud", ["D1", "D2", "O1"], 3, 2],
        ["E", "Abrir la consulta con las enfermeras expertas y el registro digital, apoyándose en el plan de cronicidad", ["F1", "F2", "O1"], 3, 3]] },
    { id: "ej-mini-cal", titulo: "Unidad de Calidad: la matriz cruzada", objeto: "Unidad de Calidad y Seguridad del Paciente del Área", tipoObjeto: "unidad", finalidad: "estrategico", horizonte: "3 años", paso: 6, n: 3,
      foco: "Una matriz cruzada completa de 3 × 3 por bloque: ¿qué orientación sale y qué factores son llave? (paso 6).",
      factores: [
        ["F", 1, "Equipo con formación avanzada en seguridad del paciente", "personas", "Tres técnicos con máster", 5],
        ["F", 2, "Sistema de notificación muy usado en el Área", "seguridad", "1.200 notificaciones en 2026", 4],
        ["F", 3, "Apps propias para auditorías, AMFE e indicadores", "sistemas", "En uso desde 2026", 4],
        ["D", 1, "Poco tiempo para acompañar a las unidades", "recursos", "Un técnico por cada 15 unidades", 5],
        ["D", 2, "Las devoluciones de las notificaciones llegan tarde", "procesos", "Media de 60 días", 4],
        ["D", 3, "Sin cuadro de mando común de indicadores de seguridad", "sistemas", "Cada unidad usa el suyo", 3],
        ["O", 1, "Nueva estrategia de seguridad del paciente con financiación", "politico", "Convocatoria de 2027", 5, 4],
        ["O", 2, "Interés de las UGC por acreditarse", "sanitario", "Ocho UGC en preparación", 4, 5],
        ["O", 3, "Convenio con la universidad para formación", "conocimiento", "Firmado en 2026", 3, 4],
        ["A", 1, "Recorte de las horas de liberación de los referentes de seguridad", "economico", "Instrucción de 2027", 4, 4],
        ["A", 2, "Cansancio de las unidades ante tantas auditorías", "social", "Encuesta de clima de 2026", 3, 4],
        ["A", 3, "Rotación alta de las direcciones de las UGC", "politico", "Cuatro cambios en 2026", 3, 3]],
      cruces: [["F1", "F2", "F3", "D1", "D2", "D3"], ["O1", "O2", "O3", "A1", "A2", "A3"], [
        [3, 3, 2, 1, 1, 0], [2, 2, 0, 0, 1, 0], [3, 3, 1, 2, 2, 1],
        [2, 3, 1, 3, 1, 1], [1, 1, 0, 0, 2, 0], [2, 2, 0, 0, 1, 1]]] },
    { id: "ej-mini-qui", titulo: "Bloque quirúrgico: estrategias que no cuadran", objeto: "Bloque quirúrgico", tipoObjeto: "servicio", finalidad: "acuerdo", horizonte: "1 año", paso: 7,
      foco: "Tres estrategias de «mantener» que dejan sin respuesta la debilidad y la amenaza que más pesan (paso 7).",
      factores: [
        ["F", 1, "Lista de verificación quirúrgica en el 98 % de las intervenciones", "seguridad", "Auditoría de 2026", 4],
        ["F", 2, "Equipo de enfermería de quirófano estable", "personas", "Rotación del 5 % al año", 3],
        ["D", 1, "El 18 % de las intervenciones programadas se suspenden el mismo día", "resultados", "Cuadro de mando de 2026", 5],
        ["D", 2, "Instrumental que llega incompleto a la sala", "procesos", "40 notificaciones en 2026", 4],
        ["O", 1, "Nuevo sistema de trazabilidad del instrumental", "tecnologico", "Compra aprobada", 4, 4],
        ["O", 2, "Programa del hospital de cirugía mayor ambulatoria", "sanitario", "Plan de 2027", 4, 4],
        ["A", 1, "Lista de espera quirúrgica creciente", "social", "+15 % en 2026", 5, 5],
        ["A", 2, "Escasez de anestesiólogos", "economico", "Dos plazas vacantes", 4, 4]],
      estrategias: [
        ["M", "Mantener la lista de verificación con auditorías periódicas", ["F1"], 3, 3],
        ["M", "Cuidar la estabilidad del equipo de enfermería de quirófano", ["F2", "A2"], 2, 3],
        ["M", "Reconocer en público el buen uso de la lista de verificación", ["F1"], 2, 3]] },
    { id: "ej-mini-onc", titulo: "Hospital de día: del objetivo vago al SMART", objeto: "Hospital de día oncohematológico", tipoObjeto: "servicio", finalidad: "acuerdo", horizonte: "1 año", paso: 8,
      foco: "Un objetivo vago y una acción sin responsable, sin fecha y sin indicador: conviértelos en un plan medible (paso 8).",
      factores: [
        ["F", 1, "Enfermería especializada en oncología con 10 años de experiencia media", "personas", "Plantilla de 2026", 4],
        ["D", 1, "Espera media de 2 h 30 min entre la llegada y el inicio del tratamiento", "resultados", "Registro de tiempos de 2026", 5],
        ["O", 1, "Preparación centralizada de citostáticos en Farmacia con un robot nuevo", "tecnologico", "Instalación en 2027", 4, 5],
        ["A", 1, "Aumento del 10 % anual de pacientes en tratamiento", "social", "Memoria 2024–2026", 5, 5]],
      estrategias: [
        ["C", "Preparar el día anterior los citostáticos de los pacientes con analítica previa", ["D1", "O1"], 3, 3, { texto: "Mejorar la espera", meta: "", fecha: "" },
          [{ que: "Formar al personal en la nueva organización", quien: "", fin: "" }]],
        ["A", "Abrir una segunda franja de tratamiento por la tarde ante el aumento de pacientes", ["A1", "F1"], 3, 2, { texto: "Atender al 100 % de los pacientes nuevos en su fecha sin alargar la espera, antes de junio de 2027", meta: "100 %", fecha: "2027-06-30" },
          [{ que: "Agenda de tarde con dos puestos de tratamiento", quien: "Supervisión de enfermería del hospital de día", fin: "2027-03-31", indicador: { nombre: "% de pacientes nuevos que empiezan en su fecha", formula: "Pacientes que empiezan en la fecha prevista / pacientes nuevos × 100", estandar: "100 %", fuente: "Agenda del hospital de día" } }]]] }
  ];
  function miniDafo(m) {
    const id = m.id, fid = c => `${id}-${c}`;
    const est = (m.estrategias || []).map(([tipo, texto, facs, impacto, viabilidad, objetivo, acciones], i) => ({
      id: `${id}-e${i + 1}`, tipo, num: i + 1, texto, factores: facs.map(fid), impacto: String(impacto), viabilidad: String(viabilidad), elegida: "", motivo: "", origen: "",
      objetivo: objetivo || { texto: "", meta: "", fecha: "" },
      acciones: (acciones || []).map((x, j) => Object.assign({ id: `${id}-a${i + 1}-${j + 1}`, que: "", quien: "", inicio: "", fin: "", recursos: "", como: "", indicador: { nombre: "", formula: "", estandar: "", fuente: "" }, estado: "pendiente", nota: "", seguimiento: [] }, x)) }));
    return { id, titulo: m.titulo, objeto: m.objeto, tipoObjeto: m.tipoObjeto, finalidad: m.finalidad, horizonte: m.horizonte, mision: "", vision: "", incluye: "", excluye: "", responsable: "", fecha: "",
      fuentes: [], factores: m.factores.map(([tipo, num, texto, area, evidencia, imp, prob]) => ({ id: fid(tipo + num), tipo, num, texto, area, evidencia, fuenteId: "", aporta: "equipo", importancia: String(imp), probabilidad: prob ? String(prob) : "" })),
      prioridad: { n: m.n || 5 }, cruces: m.cruces ? crucesDe(id, ...m.cruces) : {}, estrategias: est,
      notas: "Minicaso inventado para practicar. " + m.foco, creado: "2026-10-22T12:00:00.000Z", modificado: "2026-10-22T12:00:00.000Z" };
  }

  const EJEMPLOS = {
    dafos: [DAFO_UGC, DAFO_UGC_00, ...MINICASOS.map(miniDafo)],
    minicasos: MINICASOS.map(m => ({ t: m.titulo, s: m.foco, href: `#/dafo/${m.id}/${m.paso}` })),
    fichas: [
      { t: "1 · Qué analizamos", s: "Objeto, finalidad (acuerdo de gestión), horizonte, misión y visión", href: "#/dafo/ej-dafo-ugc/1" },
      { t: "2 · Equipo y fuentes", s: "8 perfiles, 3 sesiones y 8 fuentes de datos", href: "#/dafo/ej-dafo-ugc/2" },
      { t: "Lluvia de ideas", s: "36 ideas en 12 bloques, votadas por el grupo nominal", href: "#/dafo/ej-dafo-ugc/ideas" },
      { t: "3 · Dentro", s: "6 fortalezas y 6 debilidades, cada una con su dato", href: "#/dafo/ej-dafo-ugc/3" },
      { t: "4 · Fuera", s: "6 oportunidades y 6 amenazas con importancia y probabilidad", href: "#/dafo/ej-dafo-ugc/4" },
      { t: "Votar", s: "La votación de la importancia de D1, D2, A1 y A2", href: "#/dafo/ej-dafo-ugc/votar" },
      { t: "5 · Priorizar", s: "Los 5 de más peso de cada cuadrante", href: "#/dafo/ej-dafo-ugc/5" },
      { t: "6 · Cruzar", s: "Matriz cruzada de 100 casillas: orientación de reorientación (DO)", href: "#/dafo/ej-dafo-ugc/6" },
      { t: "7 · Estrategias CAME", s: "9 estrategias, 6 elegidas por impacto y viabilidad; 2 candidatos a AMFE y auditoría", href: "#/dafo/ej-dafo-ugc/7" },
      { t: "8 · Plan de acción", s: "Objetivos, 9 acciones con indicador, seguimiento, comparación con 2026 y documentos", href: "#/dafo/ej-dafo-ugc/8" }
    ]
  };

  const API = { TEMAS, GLOSARIO, EJEMPLOS, TEST, TEMAS_TEST, EJERCICIOS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : this);

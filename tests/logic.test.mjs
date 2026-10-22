// Pruebas de la lógica pura y de los ejemplos · node tests/logic.test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const L = require("../logic.js");
const C = require("../contenido.js");

let ok = 0, fallos = 0;
const t = (nombre, cond) => { if (cond) ok++; else { fallos++; console.error("✗ " + nombre); } };
const eq = (nombre, a, b) => t(`${nombre} (esperado ${JSON.stringify(b).slice(0, 300)}, obtenido ${JSON.stringify(a).slice(0, 300)})`, JSON.stringify(a) === JSON.stringify(b));
let n = 0; const gid = () => "id" + (++n);
const F = (tipo, num, texto, imp, prob = "") => Object.assign(L.nuevoFactor(gid(), tipo, num), { texto, importancia: String(imp), probabilidad: String(prob) });

// Cuadrantes y pasos
eq("Cuatro cuadrantes", L.TIPOS, ["F", "D", "O", "A"]);
eq("CAME de cada cuadrante", L.TIPOS.map(k => L.CUADRANTES[k].came), ["M", "C", "E", "A"]);
eq("Internos", L.TIPOS.map(L.esInterno), [true, true, false, false]);
eq("8 pasos", L.PASOS.length, 8);
eq("Pasos de la entrega 1", L.PASOS.filter(p => p.entrega === 1).map(p => p.n), [1, 2, 3, 4]);

// Peso
eq("Peso interno = importancia", L.peso(F("F", 1, "x", 4)), 4);
eq("Peso interno ignora probabilidad", L.peso(F("D", 1, "x", 3, 5)), 3);
eq("Peso externo = imp × prob", L.peso(F("A", 1, "x", 5, 4)), 20);
eq("Peso externo sin probabilidad", L.peso(F("O", 1, "x", 5, "")), null);
eq("Importancia fuera de rango", L.peso(F("F", 1, "x", 6)), null);
eq("Importancia decimal", L.peso(F("F", 1, "x", "2,5")), null);
eq("Peso máximo", [L.PESO_MAX("F"), L.PESO_MAX("A")], [5, 25]);
eq("Código", L.codigo(F("O", 3, "x", 1)), "O3");

// Orden y puestos
const d = L.nuevoDafo("d1", "2026-10-22");
d.factores = [F("A", 1, "Uno", 3, 3), F("A", 2, "Dos", 5, 4), F("A", 3, "Tres", 4, 5), F("A", 4, "Cuatro", "", ""), F("F", 1, "Fuerte", 2)];
eq("Orden por peso (a igual peso, más importancia)", L.delTipo(d, "A").map(f => f.num), [2, 3, 1, 4]);
eq("Orden por número", L.delTipo(d, "A", "num").map(f => f.num), [1, 2, 3, 4]);
const P = L.puestos(d);
eq("Puestos con empate", d.factores.filter(f => f.tipo === "A").map(f => P[f.id]), [3, 1, 1, null]);
eq("Siguiente número por cuadrante", [L.siguienteNum(d, "A"), L.siguienteNum(d, "F"), L.siguienteNum(d, "D")], [5, 2, 1]);
eq("Matriz DAFO sin factores vacíos", L.matrizDafo(d).A.length, 4);

// Redacción
const k = (txt, tipo) => L.revisarRedaccion(txt, tipo).map(r => r.k);
eq("Solución como factor", k("Hay que mejorar la formación en seguridad del paciente", "D"), ["solucion"]);
eq("Implantar… es solución", k("Implantar un circuito de conciliación de la medicación", "D"), ["solucion"]);
eq("Externo escrito como debilidad", k("La Consejería no cubre las bajas del verano", "D"), ["externo"]);
eq("Envejecimiento como debilidad", k("Envejecimiento de la población atendida", "D"), ["externo"]);
eq("Interno escrito como amenaza", k("Falta de formación del equipo en seguridad del paciente", "A"), ["interno"]);
eq("Nuestro… como oportunidad", k("Nuestro equipo de enfermería está muy implicado", "O"), ["interno"]);
eq("Factor vago", k("Comunicación", "D"), ["vago"]);
eq("Factor de dos palabras", k("Falta personal", "D"), ["vago"]);
eq("Persona nombrada", k("El Dr. Pérez no registra las alergias en la historia", "D"), ["persona"]);
eq("Número de historia", k("Paciente con NHC 12345678 sin conciliar la medicación", "D"), ["persona"]);
eq("Debilidad bien escrita", k("Demora media de 6 días para cita con medicina de familia", "D"), []);
eq("«Reducción de plantilla» no es solución", k("Reducción de la plantilla de enfermería en verano", "A"), []);
eq("Externo bien colocado", k("Restricciones presupuestarias para sustituciones", "A"), []);
t("Parecido alto", L.parecido("Equipo estable con poca rotación de la plantilla", "Plantilla estable con poca rotación") >= 0.6);
t("Parecido bajo", L.parecido("Demora de 6 días para cita", "Higiene de manos al 55 %") < 0.3);

// Horizonte
eq("Horizonte 1 año", L.aniosHorizonte("1 año (el del acuerdo de gestión 2027)"), 1);
eq("Horizonte 3 a 5 años", L.aniosHorizonte("3 a 5 años"), 5);
eq("Horizonte sin años", L.aniosHorizonte("Hasta su puesta en marcha"), null);

// Avisos
const v = L.nuevoDafo("v", "t");
const tiene = (lista, txt) => lista.some(a => a.texto.includes(txt));
t("Paso 1: falta el objeto", tiene(L.avisosObjeto(v), "qué vais a analizar"));
v.objeto = "Todo el Área sanitaria"; t("Paso 1: objeto amplio", tiene(L.avisosObjeto(v), "muy amplio"));
v.objeto = "UGC de Urgencias"; v.finalidad = "estrategico"; v.horizonte = "10 años";
t("Paso 1: horizonte largo", tiene(L.avisosObjeto(v), "10 años"));
t("Paso 2: sin fuentes", tiene(L.avisosFuentes(v), "lista de opiniones"));
v.fuentes = [Object.assign(L.nuevaFuente("fu1"), { tipo: "memoria", nombre: "Memoria" })];
t("Paso 2: fuentes que faltan según la finalidad", tiene(L.avisosFuentes(v), "plan"));
t("Paso 2: sin la voz de los pacientes", tiene(L.avisosFuentes(v), "voz de los pacientes"));
v.factores = [F("D", 1, "Hay que formar al personal en seguridad", 4), F("D", 2, "La Consejería no cubre las bajas del verano", 4), F("D", 3, "Demora de 6 días para cita con medicina", 4), F("D", 4, "Higiene de manos al 55 % en observación", 4), F("D", 5, "Protocolos sin revisar desde hace 5 años", 4)];
const a3 = L.avisosInterno(v);
t("Paso 3: sin fortalezas", tiene(a3, "Aún no hay fortalezas"));
t("Paso 3: solución detectada con su código", tiene(a3, "D1: Parece una acción"));
t("Paso 3: externo detectado", tiene(a3, "D2: Parece algo que viene de fuera"));
t("Paso 3: todo con la misma importancia", tiene(a3, "Todos los factores tienen importancia 4"));
t("Paso 3: sin evidencia", tiene(a3, "no tienen un dato"));
t("Avisos de factor llevan su id", a3.filter(x => x.factor).every(x => v.factores.some(f => f.id === x.factor)));
v.factores.push(F("F", 1, "Demora de 6 días para cita con medicina de familia", 3));
t("Paso 3: mismo asunto a favor y en contra", tiene(L.avisosInterno(v), "parecen hablar de lo mismo"));
v.factores = [F("O", 1, "Nueva teleconsulta corporativa en 2027", 4, ""), F("O", 2, "Asociación de pacientes activa en el municipio", 3, 4), F("O", 3, "Ayuntamiento ofrece un local para el consultorio", 2, 2), F("O", 4, "Financiación de proyectos de seguridad del paciente", 3, 3), F("A", 1, "Jubilaciones de tres médicos en dos años", 5, 4)];
const a4 = L.avisosExterno(v);
t("Paso 4: sin probabilidad", tiene(a4, "no tiene probabilidad"));
t("Paso 4: desequilibrio", tiene(a4, "más oportunidades"));
eq("avisosDe por paso", L.avisosDe(v, 4).length, a4.length);

// Progreso y siguiente paso
const pr = L.nuevoDafo("p", "t");
eq("Progreso vacío", L.progreso(pr), { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false });
eq("Siguiente paso sin DAFO", L.siguientePaso({ dafos: [] }, 1).k, "crear");
pr.objeto = "UGC"; pr.finalidad = "acuerdo";
eq("Siguiente paso: fuentes", L.siguientePaso({ dafos: [pr] }, 1).k, "paso2");

// Pegar desde Excel
const pg = L.parsearFactores("Tipo\tFactor\tDato\tImportancia\tProbabilidad\nD\tDemora de 6 días\t6 días\t5\t\nAmenaza\tJubilaciones\t3 en 2 años\t5\t4\nX\tRaro\t\t2\t", "");
eq("Pegar con cabecera", pg.filas.map(r => [r.tipo, r.texto, r.importancia, r.probabilidad]), [["D", "Demora de 6 días", "5", ""], ["A", "Jubilaciones", "5", "4"]]);
t("Pegar: fila sin tipo da error", pg.errores.some(e => e.includes("Fila 4")));
const pg2 = L.parsearFactores("Equipo estable\n- Buen control de la diabetes\n• Docencia", "F");
eq("Pegar una lista de una columna", pg2.filas.map(r => r.tipo + ":" + r.texto), ["F:Equipo estable", "F:Buen control de la diabetes", "F:Docencia"]);
eq("Lista sin cuadrante elegido", L.parsearFactores("Uno\nDos", "").filas.length, 0);
const pg3 = L.parsearFactores("Demora de 6 días\t6 días\t5\nPoca formación\t30 %\t3", "D");
eq("Pegar sin columna de tipo", pg3.filas.map(r => [r.tipo, r.texto, r.evidencia, r.importancia]), [["D", "Demora de 6 días", "6 días", "5"], ["D", "Poca formación", "30 %", "3"]]);
const dp = L.nuevoDafo("dp", "t"); dp.factores = [F("D", 1, "Ya estaba", 2)];
eq("Incorporar cuenta por cuadrante", L.incorporarFactores(dp, pg.filas, gid), { F: 0, D: 1, O: 0, A: 1 });
eq("Incorporar numera tras los existentes", dp.factores.filter(f => f.tipo === "D").map(f => f.num), [1, 2]);

// Saneado
const s = L.sanearDafo({ id: "x1", objeto: "UGC", finalidad: "nada", tipoObjeto: "ugc", fuentes: [{ id: "f1", tipo: "encuesta", nombre: "Encuesta" }],
  factores: [{ id: "a", tipo: "F", num: 1, texto: "Uno", fuenteId: "f1", importancia: "4", probabilidad: "5", area: "politico" },
    { id: "b", tipo: "F", num: 1, texto: "Dos", fuenteId: "zz" }, { id: "c", tipo: "Q", texto: "Malo" }, { id: "<script>", tipo: "A", num: 0, texto: "Sin id válido", area: "social" }],
  peligro: "<b>no</b>" }, gid, "2026-10-22");
eq("Saneado: finalidad desconocida", s.finalidad, "");
eq("Saneado: tipo de objeto válido", s.tipoObjeto, "ugc");
eq("Saneado: factores", s.factores.map(f => [f.tipo, f.num, f.fuenteId, f.probabilidad, f.area]), [["F", 1, "f1", "", ""], ["F", 2, "", "", ""], ["F", 3, "", "", ""], ["A", 1, "", "", "social"]]);
t("Saneado: id inválido se cambia", s.factores[3].id !== "<script>");
t("Saneado: campo desconocido fuera", !("peligro" in s));
eq("Saneado: datos sin lista", L.sanearDatos({ amfes: [] }, gid, "t"), null);
const fu = L.fusionar({ dafos: [{ id: "a", modificado: "2026-01-01" }, { id: "b", modificado: "2026-05-01" }] }, { dafos: [{ id: "a", modificado: "2026-03-01" }, { id: "b", modificado: "2026-02-01" }, { id: "c", modificado: "2026-01-01" }] });
eq("Fusionar: gana el más reciente", fu.dafos.map(x => x.id + x.modificado.slice(5, 7)), ["a03", "b05", "c01"]);

// Textos propuestos
const sp = L.nuevoDafo("sp", "t"); sp.objeto = "UGC de Atención Primaria"; sp.finalidad = "acuerdo";
eq("Título propuesto", L.sugerirTitulo(sp, 2027), "DAFO UGC de Atención Primaria 2027");
t("Misión propuesta con artículo", L.sugerirMision(sp).includes("la UGC de Atención Primaria"));
eq("Horizonte propuesto", L.sugerirHorizonte(sp), L.FINALIDADES.acuerdo.horizonte);
t("Cada finalidad sugiere fuentes que existen", Object.values(L.FINALIDADES).every(f => f.fuentes.every(x => L.FUENTES_TIPO[x])));
t("Cada área va a un bloque ACSA", Object.keys(L.AREAS).every(a => L.BLOQUES_ACSA[L.AREA_A_BLOQUE[a]]));

// Ejemplo de la UGC
const ej = L.sanearDafo(JSON.parse(JSON.stringify(C.EJEMPLOS.dafos[0])), gid, "t");
eq("Ejemplo: 6 factores por cuadrante", L.TIPOS.map(k => ej.factores.filter(f => f.tipo === k).length), [6, 6, 6, 6]);
eq("Ejemplo: 8 fuentes", ej.fuentes.length, 8);
t("Ejemplo: ids de ejemplo", ej.id === "ej-dafo-ugc" && ej.factores.every(f => /^ej-/.test(f.id)));
t("Ejemplo: todas las fuentes citadas existen", ej.factores.every(f => !f.fuenteId || ej.fuentes.some(x => x.id === f.fuenteId)));
eq("Ejemplo: progreso de los pasos 1 a 4", [1, 2, 3, 4].map(p => L.progreso(ej)[p]), [true, true, true, true]);
eq("Ejemplo: sin avisos de redacción", [3, 4].flatMap(p => L.avisosDe(ej, p)).filter(a => a.factor).map(a => a.texto), []);
eq("Ejemplo: sin avisos de error", [1, 2, 3, 4].flatMap(p => L.avisosDe(ej, p)).filter(a => a.nivel !== "nota").map(a => a.texto), []);
eq("Ejemplo: amenaza de más peso", L.matrizDafo(ej).A.slice(0, 1).map(f => L.codigo(f) + " " + L.peso(f)), ["A1 25"]);
eq("Ejemplo: debilidades de más peso", L.matrizDafo(ej).D.slice(0, 2).map(L.codigo), ["D1", "D2"]);
t("Ejemplo: todo con su dato", ej.factores.every(f => L.lleno(f.evidencia)));
eq("Ejemplo: siguiente paso lleva a la matriz", L.siguientePaso({ dafos: [ej] }, 1).k, "listo");

// ---------- Entrega 2 ----------
// Prioridad
const pz = L.nuevoDafo("pz", "t");
pz.factores = [F("D", 1, "Uno", 5), F("D", 2, "Dos", 4), F("D", 3, "Tres", 3), F("D", 4, "Cuatro", 3), F("D", 5, "Cinco", 2), F("D", 6, "Seis", ""), F("F", 1, "Fuerte", 4)];
pz.prioridad.n = 3;
const mz = L.prioridad(pz), cod = l => l.map(L.codigo);
eq("Prioridad: los N de más peso", cod(L.prioritarios(pz, "D")), ["D1", "D2", "D3"]);
eq("Prioridad: sin peso nunca entra por criterio", mz[pz.factores[5].id].prio, false);
eq("Empate en el corte", Object.keys(L.empatesCorte(pz)), ["D"]);
eq("Empate: quién queda fuera", cod(L.empatesCorte(pz).D.fuera), ["D4"]);
t("Aviso de empate", L.avisosPriorizar(pz).some(a => a.texto.includes("Empate en el corte")));
t("Aviso de cuadrante vacío", L.avisosPriorizar(pz).some(a => a.texto.includes("No hay oportunidades")));
pz.factores[4].manual = "si";
eq("A mano: entra aunque pese poco", cod(L.prioritarios(pz, "D")), ["D1", "D2", "D3", "D5"]);
t("A mano sin motivo avisa", L.avisosPriorizar(pz).some(a => a.factor === pz.factores[4].id && a.texto.includes("sin escribir el motivo")));
t("A mano con menos peso que otro que queda fuera", L.avisosPriorizar(pz).some(a => a.texto.includes("D5 entra a mano") && a.texto.includes("D4")));
pz.factores[0].manual = "no"; pz.factores[0].motivo = "Ya hay un proyecto";
eq("A mano: se quita aunque pese mucho", cod(L.prioritarios(pz, "D")), ["D2", "D3", "D5"]);
eq("Por qué es prioritario", [L.prioridad(pz)[pz.factores[1].id].por, L.prioridad(pz)[pz.factores[0].id].por], ["criterio", "manual"]);
t("Motivo propuesto", L.sugerirMotivo(pz, pz.factores[2]).startsWith("Importancia 3; el 3.º de 6"));
eq("N fuera de rango vuelve a 5", L.nPrioridad({ prioridad: { n: 99 } }), 5);

// Cruces
const cz = L.nuevoDafo("cz", "t");
const f1 = F("F", 1, "Fortaleza", 5), d1 = F("D", 1, "Debilidad", 5), o1 = F("O", 1, "Oportunidad", 5, 5), o2 = F("O", 2, "Otra oportunidad", 4, 4), a1 = F("A", 1, "Amenaza", 5, 5);
cz.factores = [f1, d1, o1, o2, a1];
let rz = L.resultadoCruces(cz);
eq("Cruces: casillas", [rz.total, rz.rellenas, rz.listo, rz.orientacion], [6, 0, false, null]);
eq("Bloque de un cruce", [L.bloqueDe(f1, o1), L.bloqueDe(d1, a1)], ["FO", "DA"]);
t("Aviso: casillas por valorar", L.avisosCruzar(cz).some(a => a.texto.includes("6 casillas por valorar")));
cz.cruces[L.claveCruce(f1, o1)] = "3"; cz.cruces[L.claveCruce(f1, o2)] = "1"; cz.cruces[L.claveCruce(f1, a1)] = "1";
cz.cruces[L.claveCruce(d1, o1)] = "2"; cz.cruces[L.claveCruce(d1, o2)] = "2";
rz = L.resultadoCruces(cz);
eq("Cruces incompletos: sin orientación", [rz.rellenas, rz.orientacion], [5, null]);
eq("Valor de un cruce y vacío", [L.valorCruce(cz, f1, o1), L.valorCruce(cz, d1, a1)], [3, null]);
cz.cruces[L.claveCruce(d1, a1)] = "0";
rz = L.resultadoCruces(cz);
eq("Medias por bloque", L.ORDEN_BLOQUES.map(k => rz.bloques[k].media), [2, 1, 2, 0]);
eq("Orientación: el primero en caso de empate exacto", rz.orientacion, "FO");
eq("Empate de orientación detectado", rz.empate, "DO");
t("Aviso de empate de orientación", L.avisosCruzar(cz).some(a => a.texto.includes("pesan casi lo mismo")));
eq("Cruces fuertes", rz.fuertes.map(x => L.codigo(x.fila) + L.codigo(x.col)), ["F1O1"]);
eq("Estrategia propuesta por bloque", [L.estrategiaPropuesta(f1, o1), L.estrategiaPropuesta(d1, o2), L.estrategiaPropuesta(d1, a1)], ["Usar F1 para aprovechar O1", "Aprovechar O2 para corregir D1", "Reducir D1 para que A1 nos afecte menos"]);
eq("Factores llave (media por fila o columna)", rz.llaves.map(x => L.codigo(x.f) + " " + x.media), ["O1 2.5", "F1 1.67", "O2 1.5"]);
t("Progreso del paso 6 con todo valorado", L.progreso(cz)[6] === true);
const sc = L.sanearDafo(Object.assign(JSON.parse(JSON.stringify(cz)), { cruces: Object.assign({}, cz.cruces, { "malo|x": "2", [o1.id + "|" + f1.id]: "1", [f1.id + "|" + o2.id + "|z"]: "1", [d1.id + "|" + o1.id]: "7" }) }), gid, "t");
eq("Saneado de cruces: solo interno × externo, valores 0–3", Object.keys(sc.cruces).length, 5);

// Intercambio
const pq = L.paqueteIntercambio([ej], "2026.02", "2026-10-22T10:00:00Z");
eq("Intercambio: cabecera", [pq.formato, pq.version, pq.app], ["dafo-came", 1, "dafo"]);
const pd = pq.dafos[0];
eq("Intercambio: orientación y criterio", [pd.orientacion, pd.criterio.n], ["reorientacion", 5]);
eq("Intercambio: 24 factores, 20 prioritarios", [pd.factores.length, pd.factores.filter(f => f.prioritario).length], [24, 20]);
const a1x = pd.factores.find(f => f.codigo === "A1");
eq("Intercambio: números ya calculados", [a1x.importancia, a1x.probabilidad, a1x.peso, a1x.puesto, a1x.motivoPrioridad], [5, 5, 25, 1, "criterio"]);
eq("Intercambio: los internos sin probabilidad", pd.factores.find(f => f.codigo === "F1").probabilidad, null);
eq("Intercambio: 100 cruces con su bloque", [pd.cruces.length, pd.cruces.filter(x => x.bloque === "DO").length, pd.cruces.find(x => x.fila === "D2" && x.columna === "O5").valor], [100, 25, 3]);
t("Intercambio: fuente con su nombre", pd.factores.find(f => f.codigo === "D5").fuente.includes("higiene de manos"));
eq("Leer el paquete", L.leerIntercambio(pq).length, 1);
eq("Leer desde la copia .json", L.leerIntercambio({ dafos: [], intercambio: pq }).length, 1);
eq("Formato o versión distintos: nada", [L.leerIntercambio(Object.assign({}, pq, { version: 2 })), L.leerIntercambio({ formato: "amfe-fallos", version: 1, dafos: [] })], [null, null]);
t("Intercambio en JSON sin pérdidas", JSON.parse(JSON.stringify(pq)).dafos[0].factores.length === 24);

// Ejemplo de la UGC: priorización y cruces
eq("Ejemplo: prioritarios", L.TIPOS.map(k => cod(L.prioritarios(ej, k)).join(" ")), ["F3 F1 F2 F4 F6", "D1 D2 D5 D3 D4", "O5 O4 O2 O1 O3", "A1 A2 A3 A4 A5"]);
const rej = L.resultadoCruces(ej);
eq("Ejemplo: 100 casillas valoradas", [rej.total, rej.rellenas], [100, 100]);
eq("Ejemplo: medias por bloque", L.ORDEN_BLOQUES.map(k => rej.bloques[k].media), [1.2, 0.72, 1.4, 0.8]);
eq("Ejemplo: orientación de reorientación", [rej.orientacion, rej.empate], ["DO", null]);
eq("Ejemplo: factores llave", rej.llaves.map(x => L.codigo(x.f)), ["O4", "D1", "F3"]);
eq("Ejemplo: 13 cruces fuertes", rej.fuertes.length, 13);
eq("Ejemplo: sin avisos en los pasos 5 y 6", [5, 6].flatMap(p => L.avisosDe(ej, p)).map(a => a.texto), []);
eq("Ejemplo: progreso de los pasos 5 y 6", [L.progreso(ej)[5], L.progreso(ej)[6]], [true, true]);

// Excel
const X = require("../xlsx.js");
const libro = L.hojasExcel(ej, "22/10/2026");
eq("Excel: hojas", libro.hojas.map(h => h.nombre), ["Factores", "Matriz DAFO", "Matriz cruzada", "Fuentes", "Ficha"]);
eq("Excel: una fila por factor", libro.hojas[0].filas.length - 3, 24);
t("Excel: estilos usados existen", libro.hojas.every(h => h.filas.every(f => f.every(c => !c || !c.estilo || L.ESTILOS_XLSX[c.estilo]))));
const bytes = X.construirLibroXlsx(libro);
t("Excel: se construye un .xlsx (ZIP)", bytes.length > 3000 && bytes[0] === 0x50 && bytes[1] === 0x4b);
t("Excel de un DAFO vacío", X.construirLibroXlsx(L.hojasExcel(L.nuevoDafo("v", "t"), "hoy")).length > 1000);

// Contenido
eq("Aprende: 7 temas", C.TEMAS.map(x => x.n), [1, 2, 3, 4, 5, 6, 7]);
t("Aprende: cada tema completo", C.TEMAS.every(x => x.titulo && x.minuto.length >= 3 && x.secciones.length >= 2 && x.minicaso && x.practica.href));
t("Glosario: más de 30 términos sin repetir", C.GLOSARIO.length >= 30 && new Set(C.GLOSARIO.map(g => g[0])).size === C.GLOSARIO.length);

console.log(`${ok} pruebas correctas, ${fallos} fallidas`);
if (fallos) process.exit(1);

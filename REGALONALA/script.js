// ==========================================
// CONTADOR
// ==========================================
const ANIO = 2026;
const MES = 8; // agosto
const DIA = 5; 
const HORA = 0;
const MINUTO = 0;

const fechaInicio = new Date(
  ANIO,
  MES - 1, // Restamos 1 porque los meses en JavaScript van de 0 a 11 
  DIA,
  HORA,
  MINUTO,
  0
);

function actualizarContador() {
  const ahora = new Date();

  let diferencia = ahora - fechaInicio;
  if (diferencia < 0) diferencia = 0;

  const segundosTotales = Math.floor(diferencia / 1000);

  const dias = Math.floor(segundosTotales / 86400);
  const horas = Math.floor(segundosTotales / 3600) % 24;
  const minutos = Math.floor(segundosTotales / 60) % 60;
  const segundos = segundosTotales % 60;

  document.getElementById("days").textContent = dias;
  document.getElementById("hours").textContent =
    String(horas).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutos).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(segundos).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);


// ==========================================
// TEXTO
// ==========================================
const textos = [
  ["line1", "Para mi amor nala:"],
  ["line2", "Si pudiera elegir un lugar seguro, sería a tu lado."],
  ["line3", "Cuanto más tiempo estoy contigo más te amo."],
  ["line4", "Este texto es solo un ejemplo."],
  ["line5", "de demostracion y no refleja."],
  ["line6", "mis sentimientos reales hacia ti."],
  ["signature", "— Te amo mucho, Daghelen 💖"]
];

function escribirTexto(id, texto, velocidad = 42) {
  return new Promise((resolve) => {
    const elemento = document.getElementById(id);

    let posicion = 0;

    const intervalo = setInterval(() => {
      elemento.textContent += texto[posicion];
      posicion++;

      if (posicion >= texto.length) {
        clearInterval(intervalo);
        resolve();
      }
    }, velocidad);
  });
}

async function iniciarTexto() {
  await new Promise((resolve) => setTimeout(resolve, 1600));

  for (const [id, texto] of textos) {
    await escribirTexto(id, texto);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}


// ==========================================
// ÁRBOL
// ==========================================
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

let W = 560;
let H = 590;

let corazones = [];
let ramas = [];

let tiempoInicio = performance.now();


// Colores de los corazones
const colores = [
  "#ff1744",
  "#ff2f6d",
  "#ff4081",
  "#ff5c8a",
  "#ff789f",
  "#ff9fb8",
  "#ffb6c9",
  "#f50057"
];


// ==========================================
// REDIMENSIONAR CANVAS
// ==========================================
function redimensionarCanvas() {

  const rect = canvas.getBoundingClientRect();

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  W = rect.width;
  H = rect.height;

  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  crearArbol();
  crearCopaCorazon();
}

window.addEventListener(
  "resize",
  redimensionarCanvas
);


// ==========================================
// DIBUJAR UN CORAZÓN
// ==========================================
function dibujarCorazon(x, y, tamaño) {

  ctx.beginPath();

  ctx.moveTo(
    x,
    y + tamaño * 0.35
  );

  // lado izquierdo
  ctx.bezierCurveTo(
    x - tamaño * 0.80,
    y - tamaño * 0.15,

    x - tamaño * 0.70,
    y - tamaño * 0.80,

    x - tamaño * 0.20,
    y - tamaño * 0.68
  );

  // parte superior izquierda
  ctx.bezierCurveTo(
    x - tamaño * 0.05,
    y - tamaño * 0.64,

    x,
    y - tamaño * 0.45,

    x,
    y - tamaño * 0.30
  );

  // parte superior derecha
  ctx.bezierCurveTo(
    x,
    y - tamaño * 0.45,

    x + tamaño * 0.05,
    y - tamaño * 0.64,

    x + tamaño * 0.20,
    y - tamaño * 0.68
  );

  // lado derecho
  ctx.bezierCurveTo(
    x + tamaño * 0.70,
    y - tamaño * 0.80,

    x + tamaño * 0.80,
    y - tamaño * 0.15,

    x,
    y + tamaño * 0.35
  );

  ctx.closePath();
}


// ==========================================
// CREAR TRONCO Y RAMAS
// ==========================================
function crearArbol() {

  ramas = [];

  // IMPORTANTE:
  // Este mismo centro se utiliza para la copa.
  const centroX = W * 0.67;

  const baseY = H * 0.89;


  // Rama recursiva
  function crearRama(
    x,
    y,
    longitud,
    angulo,
    grosor,
    profundidad
  ) {

    if (
      profundidad <= 0 ||
      longitud < 8
    ) {
      return;
    }

    const finalX =
      x + Math.sin(angulo) * longitud;

    const finalY =
      y - Math.cos(angulo) * longitud;


    ramas.push({
      x1: x,
      y1: y,

      x2: finalX,
      y2: finalY,

      grosor,
      profundidad
    });


    // Ramas secundarias cortas.
    if (profundidad > 1) {

      crearRama(
        finalX,
        finalY,
        longitud * 0.60,
        angulo - 0.42,
        grosor * 0.68,
        profundidad - 1
      );

      crearRama(
        finalX,
        finalY,
        longitud * 0.60,
        angulo + 0.42,
        grosor * 0.68,
        profundidad - 1
      );
    }
  }


  // Tronco principal
  crearRama(
    centroX,
    baseY,
    H * 0.27,
    0,
    10,
    5
  );


  // ======================================
  // RAMAS PRINCIPALES
  // TERMINAN DENTRO DE LA COPA
  // ======================================

  crearRama(
    centroX,
    H * 0.70,
    H * 0.16,
    -0.65,
    6,
    3
  );

  crearRama(
    centroX,
    H * 0.70,
    H * 0.16,
    0.65,
    6,
    3
  );

  crearRama(
    centroX,
    H * 0.60,
    H * 0.12,
    -0.95,
    5,
    2
  );

  crearRama(
    centroX,
    H * 0.60,
    H * 0.12,
    0.95,
    5,
    2
  );
}


// ==========================================
// COPA DE CORAZÓN
//
// LOS CORAZONES SON LOS QUE FORMAN
// LA SILUETA DEL CORAZÓN GRANDE.
// ==========================================
function crearCopaCorazon() {

  corazones = [];


  // Mismo centro que el tronco.
  const centroX = W * 0.67;

  const centroY = H * 0.39;


  // Tamaño de la copa.
  const radioX =
    Math.min(W * 0.31, 175);

  const radioY =
    Math.min(H * 0.25, 145);


  // ======================================
  // ECUACIÓN DEL CORAZÓN
  //
  // La copa tiene:
  // - dos lóbulos arriba
  // - hendidura central
  // - punta abajo
  // ======================================
  function esDentroDelCorazon(x, y) {

    // Coordenadas normalizadas
    const X =
      (x - centroX) / radioX;

    const Y =
      (centroY - y) / radioY;


    /*
       Ecuación implícita de un corazón.

       La parte superior queda arriba
       y la punta queda abajo.
    */

    const ecuacion =
      Math.pow(
        X * X + Y * Y - 1,
        3
      )
      -
      X * X *
      Math.pow(Y, 3);


    return ecuacion <= 0;
  }


  // ======================================
  // GENERAR LOS CORAZONES
  // ======================================

  const cantidad = 520;


  for (let i = 0; i < cantidad; i++) {

    let x;
    let y;

    let encontrado = false;


    // Buscar un punto que esté dentro
    // de la silueta del corazón.
    for (
      let intento = 0;
      intento < 100;
      intento++
    ) {

      x =
        centroX +
        (Math.random() * 2 - 1) *
        radioX * 1.10;


      y =
        centroY +
        (Math.random() * 2 - 1) *
        radioY;


      if (
        esDentroDelCorazon(x, y)
      ) {

        // Evitar que haya corazones
        // demasiado abajo del árbol.
        if (
          y <
          centroY + radioY * 0.90
        ) {

          encontrado = true;
          break;
        }
      }
    }


    if (!encontrado) continue;


    corazones.push({

      x: x,
      y: y,

      tamaño:
        3 +
        Math.random() * 4.5,

      color:
        colores[
          Math.floor(
            Math.random() *
            colores.length
          )
        ],

      retraso:
        2400 +
        Math.random() * 3300,

      fase:
        Math.random() *
        Math.PI *
        2,

      movimiento:
        0.25 +
        Math.random() * 0.5,

      opacidad:
        0.85 +
        Math.random() * 0.15
    });
  }
}


// ==========================================
// DIBUJAR RAMAS
// ==========================================
function dibujarRamas(progreso) {

  ctx.save();

  ctx.lineCap = "round";


  for (const rama of ramas) {

    const avance =
      Math.max(
        0,
        Math.min(
          1,
          progreso * 1.3 -
          (1 - rama.profundidad) *
          0.10
        )
      );


    if (avance <= 0) continue;


    const x =
      rama.x1 +
      (rama.x2 - rama.x1) *
      avance;


    const y =
      rama.y1 +
      (rama.y2 - rama.y1) *
      avance;


    ctx.strokeStyle =
      rama.profundidad >= 4
        ? "#168b63"
        : "#15946a";


    ctx.lineWidth =
      rama.grosor;


    ctx.beginPath();

    ctx.moveTo(
      rama.x1,
      rama.y1
    );

    ctx.lineTo(
      x,
      y
    );

    ctx.stroke();
  }


  // ======================================
  // TRONCO PRINCIPAL
  // ======================================

  const centroX =
    W * 0.67;


  ctx.strokeStyle =
    "#108a62";

  ctx.lineWidth = 11;


  ctx.beginPath();

  ctx.moveTo(
    centroX,
    H * 0.89
  );

  ctx.quadraticCurveTo(
    centroX - 9,
    H * 0.68,

    centroX,
    H * 0.48
  );

  ctx.stroke();


  ctx.restore();
}


// ==========================================
// DIBUJAR CORAZONES
// ==========================================
function dibujarCorazonAnimado(
  corazon,
  ahora,
  visible
) {

  if (!visible) return;


  // Pequeño latido.
  const pulso =
    1 +
    Math.sin(
      ahora * 0.003 +
      corazon.fase
    ) *
    0.055;


  const x =
    corazon.x +
    Math.sin(
      ahora *
      0.001 *
      corazon.movimiento +
      corazon.fase
    ) *
    1.1;


  const y =
    corazon.y;


  ctx.save();


  ctx.globalAlpha =
    corazon.opacidad;


  ctx.fillStyle =
    corazon.color;


  dibujarCorazon(
    x,
    y,
    corazon.tamaño *
    pulso
  );


  ctx.fill();


  ctx.restore();
}


// ==========================================
// ANIMACIÓN
// ==========================================
function animar(ahora) {

  ctx.clearRect(
    0,
    0,
    W,
    H
  );


  const transcurrido =
    ahora -
    tiempoInicio;


  // El árbol crece una sola vez.
  const progresoArbol =
    Math.min(
      1,
      Math.max(
        0,
        (transcurrido - 300) /
        3200
      )
    );


  // Primero las ramas.
  dibujarRamas(
    progresoArbol
  );


  // Después la copa.
  for (
    const corazon
    of corazones
  ) {

    dibujarCorazonAnimado(
      corazon,
      ahora,
      transcurrido >=
      corazon.retraso
    );
  }


  requestAnimationFrame(
    animar
  );
}


// ==========================================
// INICIAR
// ==========================================
redimensionarCanvas();

requestAnimationFrame(
  animar
);

iniciarTexto();
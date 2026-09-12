// ==========================================
// CARTAS DISPONIBLES
// ==========================================

const cartas = [
    "chispi.png",
    "jeniffer.png",
    "pompuki.png",
    "squibblert.png"
];


// ==========================================
// ELEMENTOS
// ==========================================

const sobre = document.getElementById("sobre");
const carta = document.getElementById("carta");

const sobreContainer =
    document.getElementById("sobre-container");

const abrirBtn =
    document.getElementById("abrir-btn");

const otraBtn =
    document.getElementById("otra-btn");

const mensaje =
    document.getElementById("mensaje");

const titulo =
    document.getElementById("titulo");

const album =
    document.getElementById("album");

const contador =
    document.getElementById("contador");


// ==========================================
// COLECCIÓN
// ==========================================

let coleccion = JSON.parse(
    localStorage.getItem("coleccionPokemon")
) || [];


// ==========================================
// CONTROL DEL SOBRE DIARIO
// ==========================================

// Guardamos cuándo se abrió el último sobre
let ultimaApertura = localStorage.getItem(
    "ultimaAperturaSobre"
);

let abriendo = false;


// ==========================================
// COMPROBAR SI PUEDE ABRIR
// ==========================================

function puedeAbrirSobre() {

    if (!ultimaApertura) {
        return true;
    }

    const ahora = Date.now();

    const ultima =
        Number(ultimaApertura);

    const unDia =
        24 * 60 * 60 * 1000;

    return ahora - ultima >= unDia;
}


// ==========================================
// TIEMPO RESTANTE
// ==========================================

function tiempoRestante() {

    const ahora = Date.now();

    const ultima =
        Number(ultimaApertura);

    const unDia =
        24 * 60 * 60 * 1000;

    const restante =
        unDia - (ahora - ultima);


    if (restante <= 0) {
        return "";
    }


    const horas =
        Math.floor(
            restante / (60 * 60 * 1000)
        );

    const minutos =
        Math.floor(
            (restante % (60 * 60 * 1000))
            / (60 * 1000)
        );

    return horas + "h " + minutos + "min";
}


// ==========================================
// ESTADO INICIAL
// ==========================================

carta.style.display = "none";

otraBtn.style.display = "none";

actualizarEstadoSobre();


// ==========================================
// ACTUALIZAR ESTADO DEL SOBRE
// ==========================================

function actualizarEstadoSobre() {

    if (puedeAbrirSobre()) {

        abrirBtn.disabled = false;

        mensaje.textContent =
            "Haz clic en el sobre para abrirlo";

        return;
    }


    // Todavía no puede abrir
    abrirBtn.disabled = true;

    sobre.style.cursor = "not-allowed";

    mensaje.textContent =
        "Ya abriste tu sobre de hoy. " +
        "Podrás abrir otro en " +
        tiempoRestante() + ".";


    // Actualizar el tiempo cada minuto
    setTimeout(
        actualizarEstadoSobre,
        60000
    );
}


// ==========================================
// ABRIR SOBRE
// ==========================================

function abrirSobre() {

    // Evitar doble clic
    if (abriendo) {
        return;
    }


    // Comprobar límite diario
    if (!puedeAbrirSobre()) {

        mensaje.textContent =
            "Ya abriste tu sobre de hoy. " +
            "Podrás abrir otro en " +
            tiempoRestante() + ".";

        abrirBtn.disabled = true;

        return;
    }


    abriendo = true;

    abrirBtn.disabled = true;


    mensaje.textContent =
        "¡Abriendo sobre...!";


    // ======================================
    // GUARDAR HORA DE APERTURA
    // ======================================

    ultimaApertura = Date.now();

    localStorage.setItem(
        "ultimaAperturaSobre",
        ultimaApertura
    );


    // ======================================
    // ELEGIR CARTA ALEATORIA
    // ======================================

    const indice =
        Math.floor(
            Math.random() * cartas.length
        );

    const cartaElegida =
        cartas[indice];


    // ======================================
    // REINICIAR ANIMACIONES
    // ======================================

    sobre.classList.remove("abriendo");
    sobreContainer.classList.remove("abriendo");

    void sobre.offsetWidth;


    // ======================================
    // ANIMACIÓN
    // ======================================

    sobre.classList.add("abriendo");
    sobreContainer.classList.add("abriendo");


    // ======================================
    // ESPERAR ANIMACIÓN
    // ======================================

    setTimeout(() => {

        mostrarCarta(cartaElegida);

    }, 1000);
}


// ==========================================
// MOSTRAR CARTA
// ==========================================

function mostrarCarta(nombreArchivo) {

    // Ocultar sobre
    sobre.style.display = "none";


    // Quitar animación
    sobre.classList.remove("abriendo");
    sobreContainer.classList.remove("abriendo");


    // Poner carta
    carta.src =
        "img/" + nombreArchivo;

    carta.alt =
        "Carta Pokémon";


    // Mostrar carta
    carta.style.display = "block";
    carta.style.opacity = "1";


    // Reiniciar animación
    carta.style.animation = "none";

    void carta.offsetWidth;

    carta.style.animation =
        "cartaAparece 0.9s ease forwards";


    // ======================================
    // NOMBRE DE LA CARTA
    // ======================================

    let nombre =
        nombreArchivo
            .replace(".png", "")
            .replace(/[-_]/g, " ");


    nombre =
        nombre.charAt(0).toUpperCase()
        + nombre.slice(1);


    // ======================================
    // CAMBIAR TEXTOS
    // ======================================

    titulo.textContent =
        "¡Carta conseguida! 🎉";

    mensaje.textContent =
        "¡Has conseguido " +
        nombre +
        "!";


    // ======================================
    // BOTONES
    // ======================================

    abrirBtn.style.display =
        "none";

    otraBtn.style.display =
        "inline-block";


    // ======================================
    // GUARDAR CARTA
    // ======================================

    coleccion.push(nombreArchivo);

    localStorage.setItem(
        "coleccionPokemon",
        JSON.stringify(coleccion)
    );


    // Actualizar álbum
    actualizarAlbum();
}


// ==========================================
// VOLVER AL SOBRE
// ==========================================

function volverAlSobre() {

    // Ocultar carta
    carta.style.display = "none";


    // Mostrar sobre
    sobre.style.display = "block";

    sobre.style.opacity = "1";

    sobre.style.transform = "scale(1)";


    // Restaurar título
    titulo.textContent =
        "Sobre sorpresa";


    // ======================================
    // COMPROBAR SI PUEDE ABRIR
    // ======================================

    if (puedeAbrirSobre()) {

        mensaje.textContent =
            "Haz clic en el sobre para abrirlo";

        abrirBtn.disabled = false;

    } else {

        mensaje.textContent =
            "Ya abriste tu sobre de hoy. " +
            "Podrás abrir otro en " +
            tiempoRestante() + ".";

        abrirBtn.disabled = true;
    }


    // Restaurar botones
    otraBtn.style.display =
        "none";

    abrirBtn.style.display =
        "inline-block";


    // Permitir abrir nuevamente
    abriendo = false;
}


// ==========================================
// BOTONES
// ==========================================

abrirBtn.addEventListener(
    "click",
    abrirSobre
);


sobre.addEventListener(
    "click",
    abrirSobre
);


otraBtn.addEventListener(
    "click",
    volverAlSobre
);


// ==========================================
// ACTUALIZAR ÁLBUM
// ==========================================

function actualizarAlbum() {

    album.innerHTML = "";


    // Cartas diferentes
    const cartasUnicas =
        [...new Set(coleccion)];


    // Contador
    contador.textContent =
        cartasUnicas.length +
        "/" +
        cartas.length;


    // ======================================
    // ÁLBUM VACÍO
    // ======================================

    if (cartasUnicas.length === 0) {

        album.innerHTML = `
            <p class="vacia">
                Todavía no tienes cartas.
            </p>
        `;

        return;
    }


    // ======================================
    // CREAR CARTAS AGRUPADAS
    // ======================================

    cartasUnicas.forEach(
        (nombreArchivo) => {

            // Cantidad de esta carta
            const cantidad =
                coleccion.filter(
                    carta =>
                        carta === nombreArchivo
                ).length;


            // Contenedor
            const contenedor =
                document.createElement("div");

            contenedor.classList.add(
                "carta-album-container"
            );


            // Imagen
            const img =
                document.createElement("img");

            img.src =
                "img/" + nombreArchivo;

            img.classList.add(
                "carta-album"
            );

            img.alt =
                "Carta Pokémon";


            // Cantidad
            const cantidadTexto =
                document.createElement("div");

            cantidadTexto.classList.add(
                "cantidad-carta"
            );

            cantidadTexto.textContent =
                "x" + cantidad;


            // Añadir
            contenedor.appendChild(img);

            contenedor.appendChild(
                cantidadTexto
            );

            album.appendChild(
                contenedor
            );
        }
    );
}


// ==========================================
// CARGAR COLECCIÓN
// ==========================================

actualizarAlbum();

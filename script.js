class Personaje {
    constructor(nombre, salud, ataque_basico, super_ataque, habilidad_estelar = null) {
        this.nombre = nombre;
        this.salud = salud;
        this.salud_maxima = salud;
        this.ataque_basico = ataque_basico;
        this.super_ataque = super_ataque;
        this.super_ataque_cargado = false;
        this.ataques_para_cargar = 0;
        this.paralizado = false;
        this.habilidad_estelar = habilidad_estelar;
        this.dano_extra_super = 0;
        this.dano_extra_ataque = 0;
        this.trofeos = 0;
        this.rango = 1;
    }

    ataque(objetivo) {
        if (this.super_ataque_cargado) {
            return this.super_ataque;
        } else {
            return this.ataque_basico;
        }
    }

    recibir_ataque(cantidad) {
        if (!this.paralizado) {
            this.salud -= cantidad;
            if (this.salud < 0) {
                this.salud = 0;
            }
        }
    }

    cargar_super_ataque() {
        this.ataques_para_cargar += 1;
        if (this.ataques_para_cargar >= 3) {
            this.super_ataque_cargado = true;
            this.ataques_para_cargar = 0;
        }
    }

    usar_super_ataque(objetivo) {
        if (this.super_ataque_cargado) {
            if (this.nombre === "Frank") {
                objetivo.paralizado = true;
                this.super_ataque += this.dano_extra_super;
            } else if (this.nombre === "Poco") {
                this.super_ataque = 40;
                this.salud += 30;
            } else if (this.nombre === "Spike") {
                this.salud += 30;
            }
            objetivo.recibir_ataque(this.super_ataque);
            this.super_ataque_cargado = false;
            if (this.nombre === "Shelly") {
                this.dano_extra_ataque = this.ataque_basico;
            }
        } else {
            this.dano_extra_ataque = 0;
        }
    }

    aplicar_habilidad_estelar() {
        if (this.habilidad_estelar) {
            if (this.nombre === "Frank") {
                this.salud_maxima += 20;
                this.salud += 20;
                this.dano_extra_super = 15;
            }
        }
    }

    ganar_trofeos(cantidad) {
        this.trofeos += cantidad;
        if (this.trofeos >= this.rango * 25) {
            this.rango += 1;
            return 300; // Monedas ganadas por subir de rango
        }
        return 0;
    }

    toString() {
        return `${this.nombre} - Salud: ${this.salud}, Superataque Cargado: ${this.super_ataque_cargado}`;
    }
}

let trofeos = 0;
let monedas = 0;
let habilidades_compradas = {
    "Shelly": false,
    "Poco": false,
    "Spike": false,
    "Frank": false
};
let personajes = {
    "Shelly": new Personaje("Shelly", 100, 25, 35, habilidades_compradas["Shelly"]),
    "Poco": new Personaje("Poco", 125, 15, 45, habilidades_compradas["Poco"]),
    "Spike": new Personaje("Spike", 90, 30, 35, habilidades_compradas["Spike"]),
    "Frank": new Personaje("Frank", 200, 20, 20, habilidades_compradas["Frank"])
};

let estadoJuego = {
    menuActual: 'inicio',
    jugador: null,
    enemigo: null,
    accionEnCurso: null,
    ultimoPersonajeSeleccionado: null,
};

const outputElement = document.getElementById("game-output");
const inputElement = document.getElementById("game-input");
const submitButton = document.getElementById("submit-button");

function printToGameOutput(message) {
    outputElement.innerText += message + "\n";
    outputElement.scrollTop = outputElement.scrollHeight;
}

function limpiarGameOutput() {
    outputElement.innerText = "";
}

function menuInicio() {
    estadoJuego.menuActual = 'inicio';
    limpiarGameOutput();
    printToGameOutput("Brawl Stars");
    printToGameOutput(`Trofeos: ${trofeos}`);
    printToGameOutput(`Monedas: ${monedas}`);
    printToGameOutput("1. Jugar");
    printToGameOutput("2. Tienda");
    printToGameOutput("3. Personajes");
    printToGameOutput("4. Salir");
}

function menuTienda() {
    estadoJuego.menuActual = 'tienda';
    limpiarGameOutput();
    printToGameOutput("Bienvenido a la tienda");
    printToGameOutput(`Monedas disponibles: ${monedas}`);
    const personajes = ["Shelly", "Poco", "Spike", "Frank"];
    const habilidades = {
        "Shelly": "Doble daño en próximo ataque básico después de super ataque",
        "Poco": "Super ataque cura 30 puntos de vida y hace 40 puntos de daño",
        "Spike": "Super ataque cura 30 puntos de vida",
        "Frank": "Super ataque hace 15 puntos más de daño y +20 puntos de vida"
    };
    personajes.forEach((personaje, i) => {
        const estado = habilidades_compradas[personaje] ? "Comprada" : "Disponible";
        printToGameOutput(`${i + 1}. ${personaje} - ${habilidades[personaje]} (${estado}) - 2000 monedas`);
    });
    printToGameOutput("5. Volver al menú principal");
}

function menuPersonajes() {
    estadoJuego.menuActual = 'personajes';
    limpiarGameOutput();
    printToGameOutput("Tus personajes:");
    for (let personaje in personajes) {
        const estado_habilidad = habilidades_compradas[personaje] ? "Comprada" : "No comprada";
        printToGameOutput(`${personaje} - Rango: ${personajes[personaje].rango} - Habilidad Estelar: ${estado_habilidad}`);
    }
    printToGameOutput("1. Volver al menú principal");
}

function menuSeleccionPersonaje() {
    estadoJuego.menuActual = 'seleccion_personaje';
    limpiarGameOutput();
    printToGameOutput("Selecciona tu personaje:");
    printToGameOutput("1. Shelly (Desbloqueado)");
    if (trofeos >= 25) {
        printToGameOutput("2. Poco (Desbloqueado)");
    } else {
        printToGameOutput("2. Poco (Bloqueado - Desbloquea con 25 trofeos)");
    }
    if (trofeos >= 50) {
        printToGameOutput("3. Spike (Desbloqueado)");
    } else {
        printToGameOutput("3. Spike (Bloqueado - Desbloquea con 50 trofeos)");
    }
    if (trofeos >= 100) {
        printToGameOutput("4. Frank (Desbloqueado)");
    } else {
        printToGameOutput("4. Frank (Bloqueado - Desbloquea con 100 trofeos)");
    }
}

function turnoJugador() {
    limpiarGameOutput();
    printToGameOutput("Es tu turno.");
    printToGameOutput(`Tu salud: ${estadoJuego.jugador.salud}`);
    printToGameOutput(`Salud del enemigo: ${estadoJuego.enemigo.salud}`);
    if (estadoJuego.jugador.super_ataque_cargado) {
        printToGameOutput("Superataque Cargado: Sí");
    } else {
        printToGameOutput(`Ataques para cargar el super: ${3 - estadoJuego.jugador.ataques_para_cargar}`);
    }

    printToGameOutput("¿Qué deseas hacer?");
    printToGameOutput("1. Ataque básico");
    printToGameOutput("2. Curarse");
    if (estadoJuego.jugador.super_ataque_cargado) {
        printToGameOutput("3. Superataque");
    }

    estadoJuego.menuActual = 'turno_jugador';
}

function turnoEnemigo() {
    limpiarGameOutput();
    printToGameOutput("Turno del enemigo.");
    if (estadoJuego.enemigo.paralizado) {
        printToGameOutput(`${estadoJuego.enemigo.nombre} está paralizado y no puede atacar este turno.`);
        estadoJuego.enemigo.paralizado = false;
    } else {
        if (estadoJuego.enemigo.super_ataque_cargado) {
            estadoJuego.enemigo.usar_super_ataque(estadoJuego.jugador);
        } else {
            estadoJuego.jugador.recibir_ataque(estadoJuego.enemigo.ataque_basico);
            estadoJuego.enemigo.cargar_super_ataque();
        }
    }

    if (estadoJuego.jugador.salud <= 0) {
        printToGameOutput("¡Has sido derrotado!");
        miniMenu(false, -5, 20);
    } else {
        turnoJugador();
    }
}

function miniMenu(victoria, trofeos, monedas) {
    estadoJuego.menuActual = 'mini_menu';
    printToGameOutput("Fin del combate.");
    if (victoria) {
        printToGameOutput("¡Has ganado!");
    } else {
        printToGameOutput("¡Has perdido!");
    }
    printToGameOutput(`Trofeos ganados/perdidos: ${trofeos}`);
    printToGameOutput(`Monedas ganadas: ${monedas}`);
    printToGameOutput("1. Volver al menú principal");

    // Actualizar trofeos y monedas
    trofeos += trofeos;
    monedas += monedas;
}

function procesarEntrada(input) {
    const opcion = parseInt(input);

    if (estadoJuego.menuActual === 'inicio') {
        if (opcion === 1) {
            menuSeleccionPersonaje();
        } else if (opcion === 2) {
            menuTienda();
        } else if (opcion === 3) {
            menuPersonajes();
        } else if (opcion === 4) {
            printToGameOutput("Gracias por jugar. ¡Hasta la próxima!");
        } else {
            printToGameOutput("Opción no válida. Por favor, selecciona una opción válida.");
        }
    } else if (estadoJuego.menuActual === 'tienda') {
        if (opcion >= 1 && opcion <= 4) {
            const personajes = ["Shelly", "Poco", "Spike", "Frank"];
            const personaje = personajes[opcion - 1];
            if (!habilidades_compradas[personaje] && monedas >= 2000) {
                habilidades_compradas[personaje] = true;
                monedas -= 2000;
                personajes[personaje].aplicar_habilidad_estelar();
                printToGameOutput(`Habilidad estelar de ${personaje} comprada exitosamente.`);
            } else if (habilidades_compradas[personaje]) {
                printToGameOutput(`Ya tienes la habilidad estelar de ${personaje}.`);
            } else {
                printToGameOutput("No tienes suficientes monedas para comprar esta habilidad.");
            }
        } else if (opcion === 5) {
            menuInicio();
        } else {
            printToGameOutput("Opción no válida. Por favor, selecciona una opción válida.");
        }
    } else if (estadoJuego.menuActual === 'personajes') {
        if (opcion === 1) {
            menuInicio();
        } else {
            printToGameOutput("Opción no válida. Por favor, selecciona una opción válida.");
        }
    } else if (estadoJuego.menuActual === 'seleccion_personaje') {
        if (opcion === 1) {
            estadoJuego.jugador = personajes["Shelly"];
            estadoJuego.enemigo = new Personaje("Enemigo", 100, 15, 25);
            turnoJugador();
        } else if (opcion === 2 && trofeos >= 25) {
            estadoJuego.jugador = personajes["Poco"];
            estadoJuego.enemigo = new Personaje("Enemigo", 100, 15, 25);
            turnoJugador();
        } else if (opcion === 3 && trofeos >= 50) {
            estadoJuego.jugador = personajes["Spike"];
            estadoJuego.enemigo = new Personaje("Enemigo", 100, 15, 25);
            turnoJugador();
        } else if (opcion === 4 && trofeos >= 100) {
            estadoJuego.jugador = personajes["Frank"];
            estadoJuego.enemigo = new Personaje("Enemigo", 100, 15, 25);
            turnoJugador();
        } else {
            printToGameOutput("Personaje no disponible o no tienes suficientes trofeos para desbloquearlo.");
        }
    } else if (estadoJuego.menuActual === 'turno_jugador') {
        if (opcion === 1) {
            estadoJuego.enemigo.recibir_ataque(estadoJuego.jugador.ataque_basico);
            estadoJuego.jugador.cargar_super_ataque();
            if (estadoJuego.enemigo.salud <= 0) {
                printToGameOutput("¡Has derrotado al enemigo!");
                miniMenu(true, 5, 50);
            } else {
                turnoEnemigo();
            }
        } else if (opcion === 2) {
            estadoJuego.jugador.salud += 10;
            if (estadoJuego.jugador.salud > estadoJuego.jugador.salud_maxima) {
                estadoJuego.jugador.salud = estadoJuego.jugador.salud_maxima;
            }
            turnoEnemigo();
        } else if (opcion === 3 && estadoJuego.jugador.super_ataque_cargado) {
            estadoJuego.jugador.usar_super_ataque(estadoJuego.enemigo);
            if (estadoJuego.enemigo.salud <= 0) {
                printToGameOutput("¡Has derrotado al enemigo!");
                miniMenu(true, 5, 50);
            } else {
                turnoEnemigo();
            }
        } else {
            printToGameOutput("Opción no válida. Por favor, selecciona una opción válida.");
        }
    } else if (estadoJuego.menuActual === 'mini_menu') {
        if (opcion === 1) {
            menuInicio();
        } else {
            printToGameOutput("Opción no válida. Por favor, selecciona una opción válida.");
        }
    }
}

submitButton.addEventListener("click", () => {
    const input = inputElement.value.trim();
    if (input !== "") {
        procesarEntrada(input);
        inputElement.value = "";
    }
});

// Inicializa el juego mostrando el menú de inicio
menuInicio();

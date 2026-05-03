let pokedexComunes = []; // Lista para almacenar toda la info del JSON de la Pokédex de los bichos comunes
let pokedexLegendaria = []; // Lista para almacenar toda la info del JSON de la Pokédex de los legendarios
let evoMap = {}; // Diccionario para poder incluir o excluir evoluciones o bichos sobre nivel

// Función para limpiar nombres
function normalizarNombre(nombre) {
    return nombre.toLowerCase()
        .replace(/\(macho\)|\(hembra\)/g, '') // Borra los géneros
        .trim(); // Quita espacios extra al inicio y al final
}

//Función para convertir los rangos de textos de las pokédex regionales a rangos números
function generarDex(rangos) {
    let dex = new Set();
    rangos.forEach(r => {
        if (typeof r === 'number') { // Aquí si se encuentra un número real lo agrega al arreglo sin más
            dex.add(r);
        }
        else { // Si se encuentra un texto que tenga guión (-) toma los extremos que son los números y los rellena con un for
            let [inicio, fin] = r.split("-").map(Number);
            for (let i = inicio; i <= fin; i++) dex.add(i);
        }
    });
    return dex; // Regresa todos los números referentes a la dex de dicha región
}

/**
 * Diccionario con las Pokédex Regionales basadas en el número de la Pokédex Nacional.
 * NOTA: Importante decir que no se incluyen las Megas del juego Leyendas Z-A porque no están en NeoGenesis.
 */
const dexRegionales = {
    "Kanto": generarDex(["1-151", 172, 173, 174, 169, 182, 186, 196, 197, 208, 212, 233, 237, 238, 239, 240, 242, 439, 440, 446, 462, 463, 464, 465, 466, 467, 470, 471, 474, 700, 979]), // Incluye los pokémons de los juegos rojo, verde y amarillo + pre-evoluciones, evoluciones y evoluciones remificadas. Excluir las variantes Alola, Hisui y Galar.
    "Johto": generarDex(["1-251", 298, 360, 422, 429, 438, 439, 440, 446, 458, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 474, 700, 979, 981, 982]),  // Incluye los pokémons de los juegos oro, plata y cristal + pre, evoluciones y evoluciones ramificadas. Excluir las variantes Alola, Hisui y Galar.
    "Hoenn": generarDex(["252-386", 41, 42, 63, 64, 65, 74, 75, 76, 184, 183, 475, 174, 39, 122, 40, 478, 476, 477, 478]), // Incluye a los pokémons de los juegos ruby, safiro y esmeralda + pre evoluciones, evoluciones y evoluciones ramificadas. Excluir las variantes Alola, Hisui y Galar.
    "Sinnoh": generarDex(["387-493", 315, 190, 198, 185, 122, 113, 226, 108, 111, 112, 114, 125, 126, 239, 240, 133, 134, 135, 136, 215, 81, 82, 200, 193, 207, 137, 233, 280, 281, 282, 299, 355, 356, 361, 362]), // Incluye los pokémons de los juegos diamante, perla y platino + pre evoluciones, evoluciones y evoluciones ramificadas. Excluir las variantes Alola, Hisui y Galar.
    "Teselia": generarDex(["494-649"]), // Incluye los Pokémon de los juegos Blanco y Negro. Excluir las variantes Alola, Hisui y Galar.
    "Kalos": generarDex(["650-721", 133, 134, 135, 136, 196, 197, 470, 471,]), // Incluye los Pokémon de los Juegos XY. Excluir las variantes Alola, Hisui y Galar.
    "Alola": generarDex(["722-809", 19, 20, 25, 26, 172, 27, 28, 37, 38, 50, 51, 52, 53, 74, 75, 76, 88, 89, 102, 103, 104, 105]), // Incluye a los pokémons de los juegos de sol y luna. En el caso de los números sueltos se debe incluir solo aquellos que tienen Alola en el nombre.
    "Galar": generarDex(["810-898", 52, 77, 78, 79, 80, 83, 110, 109, 122, 144, 145, 146, 439]), // Incluye los pokémons de los juegos espada y escudo. Se incluyen los pokémon de Galar y a Koffing y Mime jr.
    "Hisui": generarDex(["25-26", "35-38", 41, 42, 46, 47, 54, 55, 58, 59, "63-68", "72-78", 81, 82, "92-95", 100, 101, 108, "111-114", 122, 123, 125, 126, 129, 130, 133, 134, 135, 136, 143, 155, 156, 157, 169, 172, 173, 175, 176, 185, 190, 193, "196-198", 200, 201, 207, 208, 211, 212, 214, 215, 216, 217, 220, 221, 223, 224, 226, 233, 234, 239, 240, 242, "265-269", 280, 281, 282, 299, 315, 339, 340, 355, 356, 358, "361-365", "387-493", "501-503", "548-550", 570, 571, 627, 628, 641, 642, 645, 700, "704-706", 712, 713, "722-724", "899-905"]),
    "Paldea": generarDex(["906-1025"]) // Incluye a los Pokémon de los juegos Escarlata, Purpura y sus DLCs.
};

// Naturalezas de NeoGenesis: +2/-2
const natures = [
    { name: "Fuerte", up: "ATK", down: "ATK" }, { name: "Osada", up: "DEF", down: "ATK" },
    { name: "Miedosa", up: "SPEED", down: "ATK" }, { name: "Modesta", up: "SPATK", down: "ATK" },
    { name: "Serena", up: "SPDEF", down: "ATK" }, { name: "Huraña", up: "ATK", down: "DEF" },
    { name: "Dócil", up: "DEF", down: "DEF" }, { name: "Activa", up: "SPEED", down: "DEF" },
    { name: "Afable", up: "SPATK", down: "DEF" }, { name: "Amable", up: "SPDEF", down: "DEF" },
    { name: "Audaz", up: "ATK", down: "SPEED" }, { name: "Plácida", up: "DEF", down: "SPEED" },
    { name: "Seria", up: "SPEED", down: "SPEED" }, { name: "Mansa", up: "SPATK", down: "SPEED" },
    { name: "Grosera", up: "SPDEF", down: "SPEED" }, { name: "Firme", up: "ATK", down: "SPATK" },
    { name: "Agitada", up: "DEF", down: "SPATK" }, { name: "Alegre", up: "SPEED", down: "SPATK" },
    { name: "Tímida", up: "SPATK", down: "SPATK" }, { name: "Cauta", up: "SPDEF", down: "SPATK" },
    { name: "Pícara", up: "ATK", down: "SPDEF" }, { name: "Floja", up: "DEF", down: "SPDEF" },
    { name: "Ingenua", up: "SPEED", down: "SPDEF" }, { name: "Alocada", up: "SPATK", down: "SPDEF" },
    { name: "Rara", up: "SPDEF", down: "SPDEF" }
];

async function init() {
    try { // Aquí se importan los archivos JSON de las Pokédex
        const regNormal = await fetch('json/pokedex_neogenesis.json'); // Pokédex de comunes
        pokedexComunes = await regNormal.json();

        const regLegendario = await fetch('json/pokedex_legendarios_neogenesis.json') // Pokédex legendarios
        pokedexLegendaria = await regLegendario.json();

        console.log("Se cargaron bien las Pokédexs");
        // Funcion que une las pokédex, si es necesario, y calcula si los bichos evolucionan y/o si habrán sobrenivel
        buildEvoMap([...pokedexComunes, ...pokedexLegendaria]);
    } catch (e) {
        console.error('Error al cargar los archivos de los JSON.', e);
        const modal = document.getElementById("myModal");
        if(modal) {
            const modalMessage = modal.querySelector("p");
            modalMessage.innerText = 'Error al cargar las bases de datos.' +
                'Asegúrese de que los archivos estén en la carpeta /json con los nombres' +
                'correctos y que se llamen pokedex_neogenesis.json y pokedex_legendarios_neogenesis.json.';
            modal.classList.add("show");
        } else {
            alert('Hubo un error al cargar los datos. Asegúrate de que los JSON estén en la carpeta correcta y revisa la consola.');
        }
    }
}

/**
 * Esta función une las Pokédexs utilizando el spread operator (...) y construye un diccionario de evoluciones oculto al usuario (el evoMap).
 * La función es la de calcular el nivel de evolución y aplicar dicho filtro para incluir o excluir evoluciones o limitar o permitir pokémon 
 * que esten por encima de su nivel evolutivo o obligarlos a evolucionar.
 */
function buildEvoMap(fullDex) {
    fullDex.forEach(p => {
        // Se valida si el bicho tiene una siguiente etapa evolutiva
        if (p.system && p.system.evolution && p.system.evolution.nextStage) {
            // Se extrae el texto que contiene el criteria
            let criteria = p.system.evolution.criteria || "";
            let match = criteria.match(/\d+/); // Limpiamos y dejamos solo el número

            // Si no encuentra un número en criteria, usa el evoLevel como respaldo
            let lvl = match ? parseInt(match[0]) : parseInt(p.system.evolution.evoLevel) || 0;

            if (lvl > 0) {
                // Separamos por comas las nextStage del bicho si es que las tiene
                let evoluciones = p.system.evolution.nextStage.split(',').map(s => normalizarNombre(s));

                // Le asignamos ese nivel mínimo a cada una de las evoluciones
                evoluciones.forEach(evoName => {
                    evoMap[evoName] = lvl;
                });

                // Le indicamos a la etapa actual cuál es su límite antes de evolucionar
                p.maxUnevolvedLevel = lvl - 1;
            }
        }
    });
    console.log("Mapa de evoluciones generado: ", evoMap);
}

/**
 * Se obtienen las opciones que fueron seleccionadas, se convierten en un
 * arreglo de elementos del select correspondiente.
 */
function getSelectedValues(id) {
    const select = document.getElementById(id);
    return Array.from(select.selectedOptions).map(opt => opt.value);
}

// Al hacer clic en el botón se realiza la generación de los pokémon
document.getElementById('btnGenerar').addEventListener('click', () => {
    let fullDex = [...pokedexComunes]; // Se carga la pokédex normal en el arreglo
    if (document.getElementById('chkLegendarios').checked) { // Si se le da check a la opción de Legendarios se concatena la pokédex legendarios
        fullDex = fullDex.concat(pokedexLegendaria);
    }
    if (!document.getElementById('chkMegaEvoluciones').checked) { // Si no se marca la opción de Mega evoluciones, estos se descartan de la elección de encuentros
        fullDex = fullDex.filter(p => !p.name.includes("Mega "));
    }

    // Se obtienen los valores de los diferentes controles
    const habitats = getSelectedValues('habitats');
    const tipos = getSelectedValues('tipos').map(t => t.toLowerCase());
    const regiones = getSelectedValues('regiones');
    const minLvl = parseInt(document.getElementById('nivelMin').value);
    const maxLvl = parseInt(document.getElementById('nivelMax').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const estricto = document.getElementById('chkEvolucionesEstrictas').checked;
    const forzar = document.getElementById('chkForzarEvolucion').checked;

    // Buscar los Pokémons con formas regionales y separarlos de su versión no regional
    const regionalForms = new Map();
    fullDex.forEach(p => {
        let imgMatch = p.img.match(/\/(\d+)\.png/);
        if (imgMatch) {
            let dexNum = parseInt(imgMatch[1]);
            ["Alola", "Galar", "Hisui", "Paldea"].forEach(tag => {
                if (p.name.includes(tag)) {
                    if (!regionalForms.has(dexNum)) regionalForms.set(dexNum, new Set());
                    regionalForms.get(dexNum).add(tag);
                }
            });
        }
    });

    let pool = fullDex.filter(p => {
        // Filtro por hábitat
        let sysHabitat = (p.system.habitats || "").toLowerCase();
        let hMatch = habitats.includes("Todos") || habitats.some(h => sysHabitat.includes(h.toLowerCase()));

        // Filtro por tipo
        let t1 = (p.system.type1 || "").toLowerCase();
        let t2 = (p.system.type2 || "").toLowerCase();
        let tMatch = tipos.includes("todos") || tipos.includes(t1) || tipos.includes(t2);

        // Filtro por región prorizando formas regionales
        let rMatch = regiones.includes("Todas");
        if (!rMatch) {
            let imgMatch = p.img.match(/\/(\d+)\.png/);
            let dexNum = imgMatch ? parseInt(imgMatch[1]) : 0;
            let name = p.name;

            const tags = ["Alola", "Galar", "Hisui", "Paldea"];
            let currentPTag = tags.find(tag => name.includes(tag));

            if (currentPTag) {
                // Si el Pokémon tiene una forma regional, se verifica si la región seleccionada coincide con su forma regional
                if (regiones.includes(currentPTag)) rMatch = true;
            }
            else {
                // Si el bicho no tiene una forma regional
                // 1. Debe de estar al menos en una región seleccionada
                let allowedInSelectedRegions = regiones.some(r => dexRegionales[r] && dexRegionales[r].has(dexNum));

                if (allowedInSelectedRegions) {
                    // 2. Si el Pokémon tiene formas regionales, descartamos la base. Si por ejemplo se elige Alola y sale un Raichu, se descarta el base y se queda la variante Alola.
                    let hasRegionalConlict = regiones.some(r =>
                        regionalForms.has(dexNum) &&
                        regionalForms.get(dexNum).has(r)
                    );

                    if (!hasRegionalConlict) {
                        rMatch = true;
                    }
                }
            }
        }

        return hMatch && tMatch && rMatch;
    });

    let resultados = [];
    let maxIntentos = 1500; // Para evitar loops infinitos en caso de filtros muy estrictos

    while (resultados.length < cantidad && pool.length > 0 && maxIntentos > 0) {
        maxIntentos--;
        let rndIndex = Math.floor(Math.random() * pool.length);
        let p = pool[rndIndex];
        let lvl = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;

        // Se limpian espacios y mayúsculas del nombre del pokémon actual
        let nombreLimpio = normalizarNombre(p.name);

        // Se busca el nivel en el diccionario
        let minReqLvl = evoMap[nombreLimpio] || 1;

        // Filtro para la parte de estrictos
        if (estricto && lvl < minReqLvl) continue; // Si el modo estricto está activo, se descartan los Pokémon que no cumplen el requisito de nivel para su evolución
        if (forzar && p.maxUnevolvedLevel && lvl > p.maxUnevolvedLevel) continue; // Si el modo forzar evolución está activo, se descartan los Pokémon que pueden evolucionar pero no cumplen el requisito de nivel para generar su forma evolucionada

        resultados.push(generarStats(p, lvl)); // Aquí se generan los stats del Pokémon seleccionado con el nivel y la naturaleza correspondiente
    }

    renderResultados(resultados); // Función para mostrar los resultados en el HTML, se encarga de crear las tarjetas con la info de cada Pokémon generado.
});

function generarStats(p, lvl) {
    let nature = natures[Math.floor(Math.random() * natures.length)];
    let base = {
        HP: p.system.stats.hp.base, ATK: p.system.stats.atk.base, DEF: p.system.stats.def.base,
        SPATK: p.system.stats.spatk.base, SPDEF: p.system.stats.spdef.base, SPEED: p.system.stats.spd.base
    };

    // Aplicar la naturaleza (+2/-2) a los stats base
    let baseNaturaleza = { ...base };
    if (nature.up !== nature.down) {
        baseNaturaleza[nature.up] += 2;
        baseNaturaleza[nature.down] = Math.max(1, baseNaturaleza[nature.down] - 2);
    }

    let puntosExtra = { HP: 0, ATK: 0, DEF: 0, SPATK: 0, SPDEF: 0, SPEED: 0 };
    let keys = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPEED"];

    // Añadiendo el sistema de los BSPs
    let statsBSP = keys.map(k => ({
        stat: k,
        valor: baseNaturaleza[k],
        azar: Math.random() // Para los empates lo saca aleatorio.
    }));

    // Ordenamos los stats por su valor base de mayor a menor y en caso de empate por el azar
    statsBSP.sort((a, b) => {
        if (b.valor === a.valor) {
            return b.azar - a.azar; // Si hay empate, el que tenga el azar más alto va primero
        }
        return b.valor - a.valor;
    });

    // Calculamos cuantas decenas tenemos en el nivel
    let multiplicadorBsp = Math.floor(lvl / 10);

    if (multiplicadorBsp > 0) {
        // Asignamos los bonos: Primario (+3), Secundario (+2) y Terciario (+1)
        puntosExtra[statsBSP[0].stat] += (3 * multiplicadorBsp); // El stat más alto recibe el bono primario
        puntosExtra[statsBSP[1].stat] += (2 * multiplicadorBsp); // El segundo stat más alto recibe el bono secundario
        puntosExtra[statsBSP[2].stat] += (1 * multiplicadorBsp); // El tercer stat más alto recibe el bono terciario 
    }

    // Distribución de puntos de nivel
    let puntos = lvl; // Puntos a distribuir equivalentes al nivel del Pokémon
    while (puntos > 0) {
        let k = keys[Math.floor(Math.random() * keys.length)];
        puntosExtra[k] += 1;
        puntos--;
    }

    // STATS ACTUALES: Suma de la Base (Naturaleza) + Los puntos extra (BSP y Nivel)
    let statsActuales = {
        HP: baseNaturaleza.HP + puntosExtra.HP,
        ATK: baseNaturaleza.ATK + puntosExtra.ATK,
        DEF: baseNaturaleza.DEF + puntosExtra.DEF,
        SPATK: baseNaturaleza.SPATK + puntosExtra.SPATK,
        SPDEF: baseNaturaleza.SPDEF + puntosExtra.SPDEF,
        SPEED: baseNaturaleza.SPEED + puntosExtra.SPEED
    };

    let maxHP = (statsActuales.HP * 3) + (statsActuales.DEF + statsActuales.SPDEF) + 10; // Formula para calcular los PVs

    let jsonVTT = {
        "CharType": 0, "nickname": "", "species": p.name, "type1": p.system.type1, "type2": p.system.type2 || "Ninguno", "Level": lvl, "EXP": 0, "EXP_max": 0, "HeldItem": "", "Gender": "", "Nature": `${nature.name} [+${nature.up} -${nature.down}]`, "Height": p.system.size, "WeightClass": p.system.weightClass, "base_HP": baseNaturaleza.HP, "base_ATK": baseNaturaleza.ATK, "base_DEF": baseNaturaleza.DEF, "base_SPATK": baseNaturaleza.SPATK, "base_SPDEF": baseNaturaleza.SPDEF, "base_SPEED": baseNaturaleza.SPEED, "HP": maxHP, "ATK": statsActuales.ATK, "DEF": statsActuales.DEF, "SPATK": statsActuales.SPATK, "SPDEF": statsActuales.SPDEF, "SPEED": statsActuales.SPEED, "Capabilities": p.system.capabilities, "Struggle_Type": "Ninguno", "Struggle_DType": "Físico", "Struggle_DB": 4, "Struggle_AC": 4, "Struggle_Range": "Melé, 1 Objetivo", "Ability1": { "Name": (p.system.lists.abilitiesBasic || "").split(",")[0], "Freq": "Pasivo", "Info": "" }, "sniper": 0, "snipern": 0, "twist": 0, "flashfire": 0, "weird": 0, "damp": 0, "aurastn": 0, "defeat": 0, "hustle": 0, "courage": 0, "lastctrue": 0
    };

    return { p, jsonVTT, statsActuales, baseNaturaleza, puntosExtra };
}

function renderResultados(resultados) {
    const div = document.getElementById('tabResultados');
    div.innerHTML = ""; // Limpiar resultados anteriores

    if (resultados.length === 0) {
        div.innerHTML = "<p class='text-warning mt-3'>No se encontraron Pokémon con esos criterios. Verifique el filtro.</p>";
        return;
    }

    resultados.forEach(res => {
        let card = document.createElement('div');
        card.className = "pokemon-card mb-4"; // Añadido un margen inferior para separar las tarjetas

        // 1. Aquí convertimos el JSON a una sola línea quitando el 'null, 2'
        let jsonUnilineal = JSON.stringify(res.jsonVTT);

        // 2. Armamos el HTML de la tarjeta, incluyendo el nuevo botón de copiar
        let tbl = `
            <table class="table table-dark table-bordered mt-2">
                <tr>
                    <th>Especie</th><th>Nivel</th><th>Tipos</th><th>Naturaleza</th><th>PVs (PS)</th>
                </tr>
                <tr>
                    <td>${res.jsonVTT.species}</td><td>${res.jsonVTT.Level}</td>
                    <td><span class="text-capitalize">${res.jsonVTT.type1}</span> / <span class="text-capitalize">${res.jsonVTT.type2}</span></td>
                    <td>${res.jsonVTT.Nature}</td><td>${res.jsonVTT.HP} (${res.statsActuales.HP})</td>
                </tr>
                <tr><th>ATK</th><th>Def</th><th>SATK</th><th>SDEF</th><th>SPD</th></tr>
                <tr>
                    <td>${res.statsActuales.ATK}</td><td>${res.statsActuales.DEF}</td>
                    <td><span>${res.statsActuales.SPATK}</span></td>
                    <td>${res.statsActuales.SPDEF}</td><td>${res.statsActuales.SPEED}</td>
                </tr>
            </table>
            
            <div class="d-flex align-items-center mt-3 mb-1">
                <strong class="text-light me-3">Datos para importar a VTT (JSON):</strong>
                <button class="btn btn-sm btn-outline-light btn-copy" type="button" title="Copiar JSON" style="width: 75px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard me-1" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                    Copiar
                </button>
            </div>
            <textarea class="json-output w-100 form-control bg-dark text-light" rows="3" readonly>${jsonUnilineal}</textarea>
        `;

        card.innerHTML = tbl;
        div.appendChild(card);

        // 3. Le agregamos el evento de clic al botón de esta tarjeta específica
        const btnCopy = card.querySelector('.btn-copy');
        const textArea = card.querySelector('.json-output');

        btnCopy.addEventListener('click', () => {
            // Copia el texto al portapapeles
            navigator.clipboard.writeText(textArea.value).then(() => {
                // Guarda el contenido original del botón
                const originalHTML = btnCopy.innerHTML;

                // Cambia el diseño temporalmente para dar feedback visual de éxito
                btnCopy.classList.replace('btn-outline-light', 'btn-success');
                btnCopy.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2 me-1" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    ¡Copiado!
                `;

                // Devuelve el botón a la normalidad después de 2 segundos
                setTimeout(() => {
                    btnCopy.classList.replace('btn-success', 'btn-outline-light');
                    btnCopy.innerHTML = originalHTML;
                }, 2000);
            }).catch(err => {
                console.error('Error al intentar copiar al portapapeles: ', err);
                alert("Hubo un error al copiar. Puedes seleccionarlo y presionar Ctrl+C.");
            });
        });
    });
}

init(); // Se llama a la función init para cargar las pokédexs al iniciar la página
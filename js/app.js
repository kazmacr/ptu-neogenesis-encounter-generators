let pokedexComunes = []; // Lista para almacenar toda la info del JSON de la Pokédex de los bichos comunes
let pokedexLegendaria = []; // Lista para almacenar toda la info del JSON de la Pokédex de los legendarios
let evoMap = {}; // Diccionario para poder incluir o excluir evoluciones o bichos sobre nivel

//Función para convertir los rangos de textos de las pokédex regionales a rangos números
function generarDex(rangos) {
    let dex = new Set();
    rangos.forEach(r => {
        if(typeof r === 'number'){ // Aquí si se encuentra un número real lo agrega al arreglo sin más
            dex.add(r);
        }
        else{ // Si se encuentra un texto que tenga guión (-) toma los extremos que son los números y los rellena con un for
            let [inicio, fin] = r.split("-").map(Number);
            for(let i = inicio; i <= fin ; i++) dex.add(i);
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
    "Kalos": generarDex(["650-721", 133, 134, 135, 136, 196, 197, 470, 471, ]), // Incluye los Pokémon de los Juegos XY. Excluir las variantes Alola, Hisui y Galar.
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
        // AQUÍ VA LA FUNCIÓN
    } catch (e) {
        console.error('Error al cargar los archivos de los JSON.', e);
        const modal = document.getElementById("myModal");
        const modalMessage = modal.querySelector("p");
        modalMessage.innerText = 'Error al cargar las bases de datos.' + 
        'Asegúrese de que los archivos estén en la carpeta /json con los nombres' + 
        'correctos y que se llamen pokedex_neogenesis.json y pokedex_legendarios_neogenesis.json.';
        modal.classList.add("show");
    }
}

/**
 * Esta función une las Pokédexs utilizando el spread operator (...) y construye un diccionario de evoluciones oculto al usuario (el evoMap).
 * La función es la de calcular el nivel de evolución y aplicar dicho filtro para incluir o excluir evoluciones o limitar o permitir pokémon 
 * que esten por encima de su nivel evolutivo o obligarlos a evolucionar.
 */
function buildEvoMap(fullDex){
    fullDex.forEach(p => {
        if(p.system.evolution && p.system.evolution.nextStage){
            let criteria = p.system.evolution.criteria || "";
            let match = criteria.match(/\d+/);
            if(match) {
                let lvl = parseInt(match[0]);
                evoMap[p.system.evolution.nextStage] = lvl; // Asigna el nivel mínimo para que haya evoluciones.
                p.maxUnevolvedLevel = lvl - 1; // Indica hasta que nivel debe generar un Pokémon de etapa anterior, si no cumple se descarta. 
            }
        }
    });
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
    if(document.getElementById('chkLegendarios').checked){ // Si se le da check a la opción de Legendarios se concatena la pokédex legendarios
        fullDex = fullDex.concat(pokedexLegendaria);
    }
    if(!document.getElementById('chkMegaEvoluciones').checked){ // Si no se marca la opción de Mega evoluciones, estos se descartan de la elección de encuentros
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
    const regionalForm = new Map();
    fullDex.forEach(p =>{
        let imgMatch = p.img.match(/\/(\d+)\.png/);
        if (imgMatch){
            let dexNum = parseInt(imgMatch[1]);
            ["Alola", "Galar", "Hisui", "Paldea"].forEach(tag =>{
                if (p.name.includes(tag)){
                    if (!regionalFormsAvailability.has(dexNum)) regionalFormsAvailability.set(dexNum, new Set());
                    regionalFormsAvailability.get(dexNum).add(tag);
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
        let tMatch = tipos.includes("Todos") || tipos.includes(t1) || tipos.includes(t2);

        // Filtro por región prorizando formas regionales
        let rMatch = regiones.includes("Todas");
        if(!rMatch){
            let imgMatch = p.img.match(/\/(\d+)\.png/);
            let dexNum = imgMatch ? parseInt(imgMatch[1]) : 0;
            let name = p.name;

            const tags = ["Alola", "Galar", "Hisui", "Paldea"];
            let currentPTag = tags.find(tag => name.includes(tags));

            if(currentPTag){
                // Si el Pokémon tiene una forma regional, se verifica si la región seleccionada coincide con su forma regional
                if(regiones.includes(currentPTag)) rMatch = true;
            }
            else{
                // Si el bicho no tiene una forma regional
                // 1. Debe de estar al menos en una región seleccionada
                let allowedInSelectedRegions = regiones.some(r => dexRegionales[r] && dexRegionales[r].has(dexNum));
                
                if(allowedInSelectedRegions){
                    // 2. Si el Pokémon tiene formas regionales, descartamos la base. Si por ejemplo se elige Alola y sale un Raichu, se descarta el base y se queda la variante Alola.
                    let hasRegionalConlict = regiones.some(r => 
                        regionalFormsAvailability.has(dexNum) &&
                        regionalFormsAvailability.get(dexNum).has(r)
                    );

                    if(!hasRegionalConlict){
                        rMatch = true;
                    }
                } 
            }
        }

        return hMatch && tMatch && rMatch;
    });

    let resultados = [];
    let maxIntentos = 1500; // Para evitar loops infinitos en caso de filtros muy estrictos

    while(resultados.length < cantidad && pool.length > 0 && maxIntentos > 0){
        maxIntentos--;
        let rndIndex = Math.floor(Math.random() * pool.length);
        let p = pool[rndIndex];
        let lvl = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;

        let minReqLvl = evoMap[p.name] || 1;
        if(estricto && lvl < minReqLvl) continue; // Si el modo estricto está activo, se descartan los Pokémon que no cumplen el requisito de nivel para su evolución
        if(forzar && p.maxUnevolvedLevel && lvl > p.maxUnevolvedLevel) continue; // Si el modo forzar evolución está activo, se descartan los Pokémon que pueden evolucionar pero no cumplen el requisito de nivel para generar su forma evolucionada

        resultados.push(generarStats(p, lvl)); // Aquí se generan los stats del Pokémon seleccionado con el nivel y la naturaleza correspondiente
    }

    renderResultados(resultados); // Función para mostrar los resultados en el HTML, se encarga de crear las tarjetas con la info de cada Pokémon generado.
});

function generarStats(p, lvl){
    let nature = natures[Math.floor(Math.random()*natures.length)];
    let base = {
        HP: p.system.stats.hp.base, ATK: p.system.stats.atk.base, DEF: p.system.stats.def.base,
        SPATK: p.system.stats.spatk.base, SPDEF: p.system.stats.spdef.base, SPEED: p.system.stats.spd.base
    };

    let baseNaturaleza = { ...base };
    if(nature.up !== nature.down){
        baseNaturaleza[nature.up] += 2;
        baseNaturaleza[nature.down] = Math.max(1, baseNaturaleza[nature.down] - 2);
    }

    let actual = { ...baseNaturaleza };
    let puntos = lvl;
    let keys = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPEED"];

    // Distribución aleatoria de puntos de nivel
    while(puntos > 0){
        let k = keys[Math.floor(Math.random()*keys.length)];
        actual[k] += 1;
        puntos--;
    }

    let maxHP = (lvl * 2) + (actual.HP * 3) +10; // Formula para calcular los PVs

    let jsonVTT = {
        "CharType": 0, "nickname": "", "species": p.name,
        "type1": p.system.type1, "type2": p.system.type2 || "Ninguno",
        "Level": lvl, "EXP": 0, "EXP_max": 0, "HeldItem": "", "Gender": "",
        "Nature": `${nature.name} [+${nature.up} -${nature.down}]`,
        "Height": p.system.size, "WeightClass": p.system.weightClass,
        "base_HP": baseNaturaleza.HP, "base_ATK": baseNaturaleza.ATK, "base_DEF": baseNaturaleza.DEF,
        "base_SPATK": baseNaturaleza.SPATK, "base_SPDEF": baseNaturaleza.SPDEF, "base_SPEED": baseNaturaleza.SPEED,
        "HP": maxHP, "ATK": actual.ATK, "DEF": actual.DEF, "SPATK": actual.SPATK,
        "SPDEF": actual.SPDEF, "SPEED": actual.SPEED,
        "Capabilities": p.system.capabilities,
        "Struggle_Type": "Ninguno", "Struggle_DType": "Físico", "Struggle_DB": 4, "Struggle_AC": 4, "Struggle_Range": "Melé, 1 Objetivo",
        "Ability1": { "Name": (p.system.lists.abilitiesBasic || "").split(",")[0], "Freq": "Pasivo", "Info": "" },
        "sniper": 0, "snipern": 0, "twist": 0, "flashfire": 0, "weird": 0, "damp": 0, "aurastn": 0, "defeat": 0, "hustle": 0, "courage": 0, "lastctrue": 0
    };

    return { p, jsonVTT };
}

function renderResultados(resultados){
    const div = document.getElementById('tabResultados');
    div.innerHTML = ""; // Limpiar resultados anteriores

    if(resultados.length === 0){
        div.innerHTML = "<p class='text-warning mt-3'>No se encontraron Pokémon con esos criterios. Verifique el filtro.</p>";
        return;
    }

    resultados.forEach(res => {
        let card = document.createElement('div');
        card.className = "pokemon-card";
        let tbl = `
            <table class="table table-dark table-bordered mt-2">
                <tr>
                    <th>Especie</th><th>Nivel</th><th>Tipos</th><th>Naturaleza</th><th>Vida Máx.</th>
                </tr>
                <tr>
                    <td>${res.jsonVTT.species}</td><td>${res.jsonVTT.Level}</td>
                    <td><span class="text-capitalize">${res.jsonVTT.type1}</span> / <span class="text-capitalize">${res.jsonVTT.type2}</span></td>
                    <td>${res.jsonVTT.Nature}</td><td>${res.jsonVTT.HP}</td>
                </tr>
            </table>
            <strong class="text-light">Datos para importar a VTT (JSON):</strong><br>
            <textarea class="json-output mt-2" readonly>${JSON.stringify(res.jsonVTT, null, 2)}</textarea>
            `;
            card.innerHTML = tbl;
            div.appendChild(card);
    });
}

init(); // Se llama a la función init para cargar las pokédexs al iniciar la página
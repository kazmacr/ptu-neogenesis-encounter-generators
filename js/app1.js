let pokedexComunes = []; 
let pokedexLegendaria = []; 
let evoMap = {}; 
let dbComplementos = { movimientos: {}, habilidades: {}, pokerasgos: [] }; // Nueva BD

// Función para limpiar nombres
function normalizarNombre(nombre) {
    return nombre.toLowerCase()
        .replace(/\(macho\)|\(hembra\)/g, '') 
        .trim(); 
}

function generarDex(rangos) {
    let dex = new Set();
    rangos.forEach(r => {
        if (typeof r === 'number') dex.add(r);
        else { 
            let [inicio, fin] = r.split("-").map(Number);
            for (let i = inicio; i <= fin; i++) dex.add(i);
        }
    });
    return dex;
}

const dexRegionales = {
    "Kanto": generarDex(["1-151", 172, 173, 174, 169, 182, 186, 196, 197, 208, 212, 233, 237, 238, 239, 240, 242, 439, 440, 446, 462, 463, 464, 465, 466, 467, 470, 471, 474, 700, 979]), 
    "Johto": generarDex(["1-251", 298, 360, 422, 429, 438, 439, 440, 446, 458, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 474, 700, 979, 981, 982]),  
    "Hoenn": generarDex(["252-386", 41, 42, 63, 64, 65, 74, 75, 76, 184, 183, 475, 174, 39, 122, 40, 478, 476, 477, 478]), 
    "Sinnoh": generarDex(["387-493", 315, 190, 198, 185, 122, 113, 226, 108, 111, 112, 114, 125, 126, 239, 240, 133, 134, 135, 136, 215, 81, 82, 200, 193, 207, 137, 233, 280, 281, 282, 299, 355, 356, 361, 362]), 
    "Teselia": generarDex(["494-649"]), 
    "Kalos": generarDex(["650-721", 133, 134, 135, 136, 196, 197, 470, 471,]), 
    "Alola": generarDex(["722-809", 19, 20, 25, 26, 172, 27, 28, 37, 38, 50, 51, 52, 53, 74, 75, 76, 88, 89, 102, 103, 104, 105]), 
    "Galar": generarDex(["810-898", 52, 77, 78, 79, 80, 83, 110, 109, 122, 144, 145, 146, 439]), 
    "Hisui": generarDex(["25-26", "35-38", 41, 42, 46, 47, 54, 55, 58, 59, "63-68", "72-78", 81, 82, "92-95", 100, 101, 108, "111-114", 122, 123, 125, 126, 129, 130, 133, 134, 135, 136, 143, 155, 156, 157, 169, 172, 173, 175, 176, 185, 190, 193, "196-198", 200, 201, 207, 208, 211, 212, 214, 215, 216, 217, 220, 221, 223, 224, 226, 233, 234, 239, 240, 242, "265-269", 280, 281, 282, 299, 315, 339, 340, 355, 356, 358, "361-365", "387-493", "501-503", "548-550", 570, 571, 627, 628, 641, 642, 645, 700, "704-706", 712, 713, "722-724", "899-905"]),
    "Paldea": generarDex(["906-1025"]) 
};

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
    try { 
        const regNormal = await fetch('json/pokedex_neogenesis.json');
        pokedexComunes = await regNormal.json();

        const regLegendario = await fetch('json/pokedex_legendarios_neogenesis.json');
        pokedexLegendaria = await regLegendario.json();
        
        // Cargar Base de Datos de Complementos (Movimientos, Habilidades, Pokerasgos)
        try {
            const reqComp = await fetch('json/pokemon_core.json');
            const dataComp = await reqComp.json();
            if(dataComp.movimientos) dataComp.movimientos.forEach(m => dbComplementos.movimientos[normalizarNombre(m.Name)] = m);
            if(dataComp.habilidades) dataComp.habilidades.forEach(h => dbComplementos.habilidades[normalizarNombre(h.Name)] = h);
            if(dataComp.pokerasgos) dbComplementos.pokerasgos = dataComp.pokerasgos;
        } catch(e) {
            console.warn("No se pudo cargar db_complementos.json. Se utilizarán datos por defecto para movimientos.");
        }

        buildEvoMap([...pokedexComunes, ...pokedexLegendaria]);
        console.log("Sistema cargado y listo.");
    } catch (e) {
        console.error('Error crítico al cargar las bases de datos.', e);
    }
}

function buildEvoMap(fullDex) {
    fullDex.forEach(p => {
        if (p.system && p.system.evolution && p.system.evolution.nextStage) {
            let criteria = p.system.evolution.criteria || "";
            let match = criteria.match(/\d+/); 
            let lvl = match ? parseInt(match[0]) : parseInt(p.system.evolution.evoLevel) || 0;

            if (lvl > 0) {
                let evoluciones = p.system.evolution.nextStage.split(',').map(s => normalizarNombre(s));
                evoluciones.forEach(evoName => { evoMap[evoName] = lvl; });
                p.maxUnevolvedLevel = lvl - 1;
            }
        }
    });
}

function getSelectedValues(id) {
    const select = document.getElementById(id);
    return Array.from(select.selectedOptions).map(opt => opt.value);
}

document.getElementById('btnGenerar').addEventListener('click', () => {
    let fullDex = [...pokedexComunes]; 
    if (document.getElementById('chkLegendarios').checked) fullDex = fullDex.concat(pokedexLegendaria);
    if (!document.getElementById('chkMegaEvoluciones').checked) fullDex = fullDex.filter(p => !p.name.includes("Mega "));

    const habitats = getSelectedValues('habitats');
    const tipos = getSelectedValues('tipos').map(t => t.toLowerCase());
    const regiones = getSelectedValues('regiones');
    const minLvl = parseInt(document.getElementById('nivelMin').value);
    const maxLvl = parseInt(document.getElementById('nivelMax').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const estricto = document.getElementById('chkEvolucionesEstrictas').checked;
    const forzar = document.getElementById('chkForzarEvolucion').checked;

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
        let sysHabitat = (p.system.habitats || "").toLowerCase();
        let hMatch = habitats.includes("Todos") || habitats.some(h => sysHabitat.includes(h.toLowerCase()));

        let t1 = (p.system.type1 || "").toLowerCase();
        let t2 = (p.system.type2 || "").toLowerCase();
        let tMatch = tipos.includes("todos") || tipos.includes(t1) || tipos.includes(t2);

        let rMatch = regiones.includes("Todas");
        if (!rMatch) {
            let imgMatch = p.img.match(/\/(\d+)\.png/);
            let dexNum = imgMatch ? parseInt(imgMatch[1]) : 0;
            let currentPTag = ["Alola", "Galar", "Hisui", "Paldea"].find(tag => p.name.includes(tag));

            if (currentPTag) {
                if (regiones.includes(currentPTag)) rMatch = true;
            } else {
                let allowedInSelectedRegions = regiones.some(r => dexRegionales[r] && dexRegionales[r].has(dexNum));
                if (allowedInSelectedRegions) {
                    let hasRegionalConlict = regiones.some(r => regionalForms.has(dexNum) && regionalForms.get(dexNum).has(r));
                    if (!hasRegionalConlict) rMatch = true;
                }
            }
        }
        return hMatch && tMatch && rMatch;
    });

    let resultados = [];
    let maxIntentos = 1500; 

    while (resultados.length < cantidad && pool.length > 0 && maxIntentos > 0) {
        maxIntentos--;
        let p = pool[Math.floor(Math.random() * pool.length)];
        let lvl = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;
        let nombreLimpio = normalizarNombre(p.name);
        let minReqLvl = evoMap[nombreLimpio] || 1;

        if (estricto && lvl < minReqLvl) continue; 
        if (forzar && p.maxUnevolvedLevel && lvl > p.maxUnevolvedLevel) continue; 

        resultados.push(generarStats(p, lvl)); 
    }
    renderResultados(resultados); 
});

// ========== LÓGICA DE HABILIDADES ==========
function asignarHabilidades(p, lvl) {
    let b = (p.system.lists.abilitiesBasic || "").split(",").map(s=>s.trim()).filter(s=>s);
    let a = (p.system.lists.abilitiesAdvanced || "").split(",").map(s=>s.trim()).filter(s=>s);
    let s = (p.system.lists.abilitiesHigh || "").split(",").map(s=>s.trim()).filter(s=>s);

    let pattern = ['B']; 
    if (lvl >= 40) {
        let opciones = [];
        if (b.length >= 1 && a.length >= 1 && s.length >= 1) opciones.push(['B','A','S']);
        if (b.length >= 2 && a.length >= 1) opciones.push(['B','B','A']);
        if (b.length >= 1 && a.length >= 2) opciones.push(['B','A','A']);
        if (opciones.length > 0) pattern = opciones[Math.floor(Math.random() * opciones.length)];
    } else if (lvl >= 20) {
        let opciones = [];
        if (b.length >= 2) opciones.push(['B','B']);
        if (b.length >= 1 && a.length >= 1) opciones.push(['B','A']);
        if (opciones.length > 0) pattern = opciones[Math.floor(Math.random() * opciones.length)];
    }

    let elegidas = [];
    pattern.forEach(type => {
        if (type === 'B' && b.length > 0) elegidas.push(b.splice(Math.floor(Math.random()*b.length), 1)[0]);
        else if (type === 'A' && a.length > 0) elegidas.push(a.splice(Math.floor(Math.random()*a.length), 1)[0]);
        else if (type === 'S' && s.length > 0) elegidas.push(s.splice(Math.floor(Math.random()*s.length), 1)[0]);
    });

    let output = {};
    elegidas.forEach((hab, i) => {
        let data = dbComplementos.habilidades[normalizarNombre(hab)] || { Freq: "Pasivo", Info: "" };
        output[`Ability${i+1}`] = { Name: hab, Freq: data.Freq, Info: data.Info };
    });
    return output;
}

// ========== LÓGICA DE MOVIMIENTOS ==========
function aplicarSTAB(mov, t1, t2) {
    if (mov.Type.toLowerCase() === t1 || mov.Type.toLowerCase() === t2) {
        let dbNum = parseInt(mov.DB);
        if (!isNaN(dbNum) && dbNum > 0) mov.DB = dbNum + 2;
    }
    return mov;
}

function asignarMovimientos(p, lvl, stats) {
    let rawLevelMoves = p.system.lists.movesLevelUp || "";
    let validNames = [];
    rawLevelMoves.split(",").forEach(part => {
        let match = part.trim().match(/^(Evo|§?\d+)\s+(.+)$/i);
        if (match) {
            let reqLvl = match[1].toLowerCase() === 'evo' ? 0 : parseInt(match[1].replace('§', ''));
            if (reqLvl <= lvl) validNames.push(match[2].trim());
        }
    });

    // Probabilidad de Tutor (2%)
    if (Math.random() < 0.02 && p.system.lists.movesTutor) {
        let tutorStr = p.system.lists.movesTutor;
        let t1 = tutorStr.match(/Tier 1:\s*([^Tier]*)/i);
        let t2 = tutorStr.match(/Tier 2:\s*([^Tier]*)/i);
        let t3 = tutorStr.match(/Tier 3:\s*(.*)/i);
        
        let tutoresPermitidos = [];
        if (lvl >= 1 && t1) tutoresPermitidos.push(...t1[1].split(",").map(s => s.replace(/\(N\)/g, '').trim()));
        if (lvl >= 20 && t2) tutoresPermitidos.push(...t2[1].split(",").map(s => s.replace(/\(N\)/g, '').trim()));
        if (lvl >= 30 && t3) tutoresPermitidos.push(...t3[1].split(",").map(s => s.replace(/\(N\)/g, '').trim()));
        
        tutoresPermitidos = tutoresPermitidos.filter(s => s).sort(() => 0.5 - Math.random()).slice(0, 3);
        validNames.push(...tutoresPermitidos);
    }

    validNames = [...new Set(validNames)]; // Quitar duplicados
    
    let movePool = validNames.map(name => {
        let data = dbComplementos.movimientos[normalizarNombre(name)];
        return data ? { Name: name, ...data } : { Name: name, Type: "Normal", DType: "Físico", DB: 0, Freq: "", AC: 0, Range: "", Effects: "" };
    });

    let finales = [];
    let t1 = (p.system.type1 || "").toLowerCase();
    let t2 = (p.system.type2 || "").toLowerCase();
    let catOfensiva = stats.ATK >= stats.SPATK ? "físico" : "especial";

    // 1. Garantizar STAB (+2 DB)
    let idxStab = movePool.findIndex(m => m.Type.toLowerCase() === t1 || m.Type.toLowerCase() === t2);
    if (idxStab !== -1) finales.push(aplicarSTAB(movePool.splice(idxStab, 1)[0], t1, t2));

    // 2. Garantizar Categoría Ofensiva
    let idxCat = movePool.findIndex(m => m.DType.toLowerCase() === catOfensiva);
    if (idxCat !== -1) finales.push(aplicarSTAB(movePool.splice(idxCat, 1)[0], t1, t2));

    // 3. Rellenar hasta 6 al azar (Aplicando STAB a los que coincidan)
    movePool = movePool.sort(() => 0.5 - Math.random());
    while (finales.length < 6 && movePool.length > 0) {
        finales.push(aplicarSTAB(movePool.pop(), t1, t2));
    }

    let output = {};
    for (let i = 0; i < 6; i++) {
        output[`Move${i+1}`] = finales[i] || { Name: "", Type: "", DType: "", DB: "", Freq: "", AC: "", Range: "", Effects: "" };
    }
    return output;
}

// ========== LÓGICA DE POKÉRASGOS ==========
function asignarPokerasgos(lvl, stats) {
    if (!dbComplementos.pokerasgos || dbComplementos.pokerasgos.length === 0) return {};
    
    let cant = Math.floor(Math.random() * 3); // 0, 1 o 2
    if (cant === 0) return {};

    // Filtro básico de prerrequisitos (Nivel y Stats)
    let validos = dbComplementos.pokerasgos.filter(r => {
        let req = (r.Prerequisitos || "").toLowerCase();
        let mNivel = req.match(/nivel\s*(\d+)/);
        if (mNivel && lvl < parseInt(mNivel[1])) return false;
        
        let mStat = req.match(/(hp|atk|def|spatk|spdef|spd|velocidad|ataque|defensa|ps)\s*(\d+)/);
        if (mStat) {
            let sName = mStat[1], val = parseInt(mStat[2]), valAct = 0;
            if (['atk','ataque'].includes(sName)) valAct = stats.ATK;
            if (['def','defensa'].includes(sName)) valAct = stats.DEF;
            if (['spatk'].includes(sName)) valAct = stats.SPATK;
            if (['spdef'].includes(sName)) valAct = stats.SPDEF;
            if (['spd','velocidad'].includes(sName)) valAct = stats.SPEED;
            if (['hp','ps'].includes(sName)) valAct = stats.HP;
            if (valAct < val) return false;
        }
        return true;
    });

    validos = validos.sort(() => 0.5 - Math.random()).slice(0, cant);
    let output = {};
    validos.forEach((r, i) => {
        output[`Edge${i+1}`] = { Name: r.Name || "", Info: r.Info || "" };
    });
    return output;
}

// Función Principal de Stats
function generarStats(p, lvl) {
    let nature = natures[Math.floor(Math.random() * natures.length)];
    let base = {
        HP: p.system.stats.hp.base, ATK: p.system.stats.atk.base, DEF: p.system.stats.def.base,
        SPATK: p.system.stats.spatk.base, SPDEF: p.system.stats.spdef.base, SPEED: p.system.stats.spd.base
    };

    let baseNaturaleza = { ...base };
    if (nature.up !== nature.down) {
        baseNaturaleza[nature.up] += 2;
        baseNaturaleza[nature.down] = Math.max(1, baseNaturaleza[nature.down] - 2);
    }

    let puntosExtra = { HP: 0, ATK: 0, DEF: 0, SPATK: 0, SPDEF: 0, SPEED: 0 };
    let keys = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPEED"];

    let statsBSP = keys.map(k => ({ stat: k, valor: baseNaturaleza[k], azar: Math.random() }))
                       .sort((a, b) => b.valor === a.valor ? b.azar - a.azar : b.valor - a.valor);

    let mult = Math.floor(lvl / 10);
    if (mult > 0) {
        puntosExtra[statsBSP[0].stat] += (3 * mult); 
        puntosExtra[statsBSP[1].stat] += (2 * mult); 
        puntosExtra[statsBSP[2].stat] += (1 * mult);  
    }

    let puntos = lvl;
    while (puntos > 0) {
        puntosExtra[keys[Math.floor(Math.random() * keys.length)]] += 1;
        puntos--;
    }

    let statsActuales = {
        HP: baseNaturaleza.HP + puntosExtra.HP, ATK: baseNaturaleza.ATK + puntosExtra.ATK,
        DEF: baseNaturaleza.DEF + puntosExtra.DEF, SPATK: baseNaturaleza.SPATK + puntosExtra.SPATK,
        SPDEF: baseNaturaleza.SPDEF + puntosExtra.SPDEF, SPEED: baseNaturaleza.SPEED + puntosExtra.SPEED
    };

    let maxHP = (statsActuales.HP * 3) + (statsActuales.DEF + statsActuales.SPDEF) + 10; 

    // Extraer Capabilities
    let capObj = {
        "Suelo": p.system.capabilities.overland, "Nado": p.system.capabilities.swim,
        "Salto Alto": Math.max(0, p.system.capabilities.jump - 1), "Salto Largo": p.system.capabilities.jump,
        "Fuerza": p.system.capabilities.power
    };
    if (p.system.capabilities.sky > 0) capObj["Vuelo"] = p.system.capabilities.sky;
    if (p.system.capabilities.burrow > 0) capObj["Excavar"] = p.system.capabilities.burrow;
    (p.system.lists.specialCapabilities || "").split(",").forEach(c => { if(c.trim()) capObj[c.trim()] = true; });

    // Extraer Skills
    let skillObj = {};
    const parseSkill = (str) => {
        let match = str.match(/(\d+)d6\+?(-?\d+)?/);
        return match ? { d: parseInt(match[1]), b: match[2] ? parseInt(match[2]) : 0 } : { d: 2, b: 0 };
    };
    const sMap = { "Acrobatics": "acrobatics", "Athletics": "athletics", "Combat": "combat", "Stealth": "stealth", "Perception": "perception", "Focus": "focus" };
    for (let k in sMap) {
        let res = parseSkill(p.system.skills[sMap[k]] || "2d6+0");
        skillObj[k] = res.d; skillObj[`${k}_bonus`] = res.b;
    }
    ["Intimidate", "Survival", "GeneralEducation", "MedicineEducation", "OccultEducation", "PokemonEducation", "TechnologyEducation", "Guile", "Charm", "Command", "Intuition"].forEach(sk => {
        skillObj[sk] = 2; skillObj[`${sk}_bonus`] = 0;
    });

    let habs = asignarHabilidades(p, lvl);
    let movs = asignarMovimientos(p, lvl, statsActuales);
    let edges = asignarPokerasgos(lvl, statsActuales);

    let jsonVTT = {
        "CharType": 0, "nickname": "", "species": p.name, 
        "type1": p.system.type1, "type2": p.system.type2 || "Ninguno", 
        "Level": lvl, "EXP": 0, "EXP_max": 0, "HeldItem": "", "Gender": "", 
        "Nature": `${nature.name} [+${nature.up} -${nature.down}]`, 
        "Height": p.system.size, "WeightClass": p.system.weightClass, 
        "base_HP": baseNaturaleza.HP, "base_ATK": baseNaturaleza.ATK, "base_DEF": baseNaturaleza.DEF, 
        "base_SPATK": baseNaturaleza.SPATK, "base_SPDEF": baseNaturaleza.SPDEF, "base_SPEED": baseNaturaleza.SPEED, 
        "HP": maxHP, "ATK": statsActuales.ATK, "DEF": statsActuales.DEF, "SPATK": statsActuales.SPATK, 
        "SPDEF": statsActuales.SPDEF, "SPEED": statsActuales.SPEED, 
        "Capabilities": capObj,
        ...skillObj,
        ...movs,
        "Struggle_Type": "Ninguno", "Struggle_DType": "Físico", "Struggle_DB": 4, "Struggle_AC": 4, "Struggle_Range": "Melé, 1 Objetivo", 
        ...habs,
        ...edges,
        "sniper": 0, "snipern": 0, "twist": 0, "flashfire": 0, "weird": 0, "damp": 0, "aurastn": 0, "defeat": 0, "hustle": 0, "courage": 0, "lastctrue": 0
    };

    return { p, jsonVTT, statsActuales };
}

function renderResultados(resultados) {
    const div = document.getElementById('tabResultados');
    div.innerHTML = ""; 

    if (resultados.length === 0) {
        div.innerHTML = "<p class='text-warning mt-3'>No se encontraron Pokémon con esos criterios. Verifique el filtro.</p>";
        return;
    }

    resultados.forEach(res => {
        let card = document.createElement('div');
        card.className = "pokemon-card mb-4"; 
        let jsonUnilineal = JSON.stringify(res.jsonVTT);

        let tbl = `
            <table class="table table-dark table-bordered mt-2">
                <tr><th>Especie</th><th>Nivel</th><th>Tipos</th><th>Naturaleza</th><th>PVs (PS)</th></tr>
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
                    </svg> Copiar
                </button>
            </div>
            <textarea class="json-output w-100 form-control bg-dark text-light" rows="3" readonly>${jsonUnilineal}</textarea>
        `;
        card.innerHTML = tbl;
        div.appendChild(card);

        const btnCopy = card.querySelector('.btn-copy');
        const textArea = card.querySelector('.json-output');

        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(textArea.value).then(() => {
                const originalHTML = btnCopy.innerHTML;
                btnCopy.classList.replace('btn-outline-light', 'btn-success');
                btnCopy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2 me-1" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg> ¡Copiado!`;
                setTimeout(() => {
                    btnCopy.classList.replace('btn-success', 'btn-outline-light');
                    btnCopy.innerHTML = originalHTML;
                }, 2000);
            }).catch(err => alert("Hubo un error al copiar."));
        });
    });
}
init();
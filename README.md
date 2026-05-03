# Generador de Encuentros Aleatorios - PTU NeoGénesis

Herramienta web ligera y automatizada diseñada para los Directores de Juego (DJs) del sistema de rol de mesa **Pokémon Tabletop United (PTU): NeoGénesis**. 

Este proyecto permite generar encuentros salvajes de manera rápida y precisa, respetando todas las mecánicas en cuanto a la distribución de Stats, movimientos por lista de movimientos y movimientos de tutor por Tier, habilidades, Pokérasgos; como también evolución y formas regionales.

---

## Características Principales
El generador filtra la base de datos completa de Pokémon según las necesidades específicas del encuentro que el DJ quiera realizar siguiendo los siguientes parámetros de filtrado:

*   **Hábitat:** Filtra por entornos específicos (Bosque, Cueva, Océano, Ultra-Espacio, etc.).
*   **Tipo:** Selecciona uno o varios tipos elementales (Fuego, Dragón, Hada, etc.).
*   **Región:** Permite elegir Pokémon pertenecientes a regiones específicas (Kanto, Johto, Alola, Paldea, etc.). El sistema es capaz de priorizar las formas regionales correctas (ej. generar un Rattata de Alola en lugar del normal si se elige dicha región).
*   **Nivel y Cantidad:** Establece un rango numérico (ej. del nivel 10 al 15) y define cuántos Pokémon aparecerán en la escena.
*   **Reglas de Evolución y Especies:**
    *   *Incluir Legendarios:* Opción para permitir la aparición de Pokémons incluidos en la Pokédex Legendaria.
    *   *Evoluciones Estrictas:* Evita que aparezcan Pokémons evolucionados a niveles inferiores a los que dicta la regla (ej. no aparecerá un Charizard nivel 10).
    *   *Forzar Evolución:* Evita que aparezcan etapas base si su nivel ya supera el necesario para evolucionar (ej. no aparecerá un Caterpie nivel 20).
    *   *Mega Evoluciones:* Opción para incluir o excluir estas formas temporales. *(Incluida pero no funcional por el momento)*.

---

## Manual de Usuario y Mecánicas de Generación
El verdadero potencial de esta herramienta reside en su algoritmo de generación. Al crear un Pokémon salvaje, el sistema no solo escupe un nombre y un nivel, sino que construye una ficha mecánica legal y lista para ser exportada a un VTT compatible con el sistema de PTU: NeoGénesis como roll20, la cual ya va estar lista para combatir:

### 1. Cálculo de Estadísticas (Stats) y Puntos de Vida
*   **Naturaleza:** Se asigna una naturaleza al azar que aplica un modificador de `+2` a un Stat y `-2` a otro (con un mínimo de 1).
*   **Bono de Stats Principales (BSP):** El sistema lee los Stats Base (tras la naturaleza), identifica los 3 más altos y aplica el BSP retroactivamente según el nivel del Pokémon (Primario +3, Secundario +2, Terciario +1 por cada 10 niveles). *Nota: En caso de empate en los Stats Base, el sistema decide el orden al azar simulando la decisión del entrenador.*
*   **Puntos de Nivel:** Los puntos restantes correspondientes al nivel actual se distribuyen de manera completamente aleatoria entre los 6 Stats.
*   **Puntos de Vida (PVs):** Calcula la vida máxima automáticamente utilizando la fórmula oficial de NeoGénesis: `(PS x 3) + Stats defensivos + 10`.

### 2. Generador Inteligente de Movimientos
Los Pokémon generados reciben una lista de hasta 6 Movimientos + *Forcejeo* totalmente legal para su nivel:
*   **Ataque por STAB:** Garantiza al menos un movimiento ofensivo que coincida con uno de los Tipos del Pokémon. A este movimiento se le aplica automáticamente un **+2 a su Base de Daño (DB)**.
*   **Sinergia Ofensiva:** Analiza si el Pokémon tiene un mayor valor en ATK o SATK en ese momento y garantiza que reciba al menos un movimiento de esa misma categoría (Físico o Especial).
*   **Tutores (2% de probabilidad):** Existe una pequeña probabilidad de que un Pokémon salvaje conozca movimientos de Tutor. Si ocurre, el sistema verifica el Nivel del Pokémon para otorgarle hasta 3 movimientos respetando los Tiers: 
    *   Nivel 1-19: Solo Tier 1.
    *   Nivel 20-29: Tier 1 y 2.
    *   Nivel 30+: Tiers 1, 2 y 3.

### 3. Asignación de Habilidades y Pokérasgos
*   **Habilidades:** Analiza la "Lista de Habilidades" de la especie en la Pokédex y otorga entre 1 y 3 habilidades dependiendo de si el Pokémon es nivel bajo, medio (Nvl 20+) o alto (Nvl 40+), mezclando aleatoriamente entre Básicas, Avanzadas y Supremas.
*   **Pokérasgos:** El Pokémon tiene la posibilidad de generar 0, 1 o 2 Pokérasgos al azar. El sistema lee el campo de prerrequisitos y valida estrictamente que el Pokémon cumpla con el Nivel y/o el Stat mínimo (Ej: *ATK 15*) exigido por el rasgo antes de asignárselo.

---

## Interfaz y Exportación a VTT
Al hacer clic en "Generar Encuentro", los resultados se muestran de manera clara e interactiva:

1.  **Tarjetas Visuales (UI):** Cada Pokémon se despliega en una tarjeta oscura con una tabla limpia de sus Stats. Incluye listas estilizadas con "Badges" (etiquetas de color) para identificar rápidamente la categoría de sus Movimientos (Físico/Especial/Estatus) y Habilidades (Básica/Avanzada/Suprema).
2.  **Código JSON Unilineal:** Al pie de cada tarjeta se genera un bloque de texto en formato JSON minificado con absolutamente todos los datos procesados.
3.  **Botón de Copiado Rápido:** Con un solo clic en el botón "Copiar", el JSON se enviará al portapapeles (con *feedback* visual de éxito), dejándolo listo para ser importado en la hoja de personaje de Roll20, Foundry VTT u otro tablero virtual compatible con el sistema de PTU: NeoGénesis.

---
## Uso Online
1. Abrir el enlace de Github Pages: [PTU: NeoGenesis - Encounters Generator](https://kazmacr.github.io/ptu-neogenesis-encounter-generators/)

## Instalación y Uso Offline
1.  Descarga el repositorio en tu computadora.
2.  Asegúrate de que la carpeta `json` exista y contenga los siguientes 3 archivos fundamentales:
    *   `pokedex_neogenesis.json` (Pokédex Base)
    *   `pokedex_legendarios_neogenesis.json` (Pokédex de Legendarios)
    *   `pokemon_core.json` (Base de datos de Movimientos, Habilidades y Pokérasgos)
3.  Abre el archivo `index.html` en cualquier navegador web moderno. (Es un aplicativo *Client-Side*; no requiere instalaciones por consola, servidores ni conexión constante a internet).
4.  Selecciona tus filtros y genera el encuentro.

---

## Créditos
Desarrollado y conceptualizado por **King Kazma** (Discord: kazmacrc) para la comunidad de PTU NeoGénesis. Cualquier bug, recomendación o sugerencia contactarme por Discord al servidor de PTU Neogenesis o por md.
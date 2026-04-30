# Generador de Encuentros Aleatorios - PTU NeoGénesis

Herramienta web ligera y automatizada diseñada para los Game Masters (Directores de Juego) del sistema de rol de mesa **Pokémon Tabletop United (PTU): NeoGénesis**. 

Este proyecto permite generar encuentros salvajes de manera rápida y precisa, respetando todas las mecánicas en cuanto a la distribución de Stats, movimientos, habilidades, Pokérasgos; como también evolución y formas regionales.

## Características Principales
El generador filtra la base de datos completa de Pokémon según las necesidades específicas del encuentro en tu campaña. Cuenta con los siguientes filtros:

*   **Hábitat:** Filtra por entornos específicos (Bosque, Cueva, Océano, Ultra-Espacio, etc.).
*   **Tipo:** Selecciona uno o varios tipos elementales (Fuego, Dragón, Hada, etc.).
*   **Región:** Permite elegir Pokémon pertenecientes a generaciones o regiones específicas (Kanto, Johto, Alola, Paldea, etc.). El sistema es capaz de priorizar las formas regionales correctas (ej. generar un Rattata de Alola en lugar del normal si se elige dicha región).
*   **Nivel y Cantidad:** Establece un rango de nivel (ej. del nivel 10 al 15) y define cuántos Pokémon aparecerán en el encuentro.
*   **Reglas de Evolución y Especies:**
    *   *Incluir Legendarios:* Opción para permitir la aparición de Pokémons incluidos en la Pokédex Legendaria de PTU NeoGenesis.
    *   *Evoluciones Estrictas:* Evita que aparezcan Pokémons evolucionados a niveles inferiores a los que dicta la regla (ej. no aparecerá un Charizard nivel 10).
    *   *Forzar Evolución:* Evita que aparezcan etapas base si su nivel ya supera el necesario para evolucionar (ej. no aparecerá un Caterpie nivel 20).
    *   *Mega Evoluciones:* Opción para incluir o excluir estas formas temporales. _(Incluída pero no funcional, de momento)_

## Visualización de Datos
Al hacer clic en "Generar Encuentro", la herramienta procesa los filtros y muestra los resultados de dos formas simultáneas:

1.  **Tabla Resumen para el Master:** Muestra visualmente la Especie, Nivel, Tipos, Naturaleza y los Puntos de Vida (PVs) máximos calculados, permitiendo una lectura rápida para narrar el encuentro.
2.  **Código JSON para VTT:** Genera un bloque de texto en formato JSON estructurado con la repartición de estadísticas, habilidades y naturalezas exactas, listo para ser copiado y pegado directamente en la hoja de personaje de Roll20 y a futuro Foundry y cualquier otro Virtual Tabletop (VTT) compatible.

## Cómo Utilizarlo
1.  Descarga el repositorio en tu computadora.
2.  Asegúrate de que la carpeta `json` contenga los archivos de la base de datos (`pokedex_neogenesis.json` y `pokedex_legendarios_neogenesis.json`).
3.  Abre el archivo `index.html` en cualquier navegador web moderno. (No requiere instalación adicional ni bases de datos en servidor).
4.  Selecciona tus filtros (mantén presionada la tecla `Ctrl` para selección múltiple) y genera el encuentro.

## Créditos
Desarrollado y conceptualizado por **King Kazma**.
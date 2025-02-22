// Constantes definidas fuera de las funciones para evitar recrearlas en cada llamada
const GENRE_PELISPLUS = new Set([
    "accion", "animacion", "aventura", "belica", "ciencia-ficcion", "comedia", "crimen",
    "documental","dorama", "drama", "fantasia", "familia", "guerra", "historia", "romance",
    "suspense", "terror", "western", "misterio"
]);

const TYPE_PELISPLUS = {
    'movie': 'pelicula',
    'serie': 'serie',
    'tv': 'serie',
    'anime': 'anime'
};

/**
 * @param {string} genero 
 * @returns {string|undefined} El género si es válido, de lo contrario undefined
 */
export const isValidGenre = genero => GENRE_PELISPLUS.has(genero) ? genero : undefined;

/**
 * @param {string} type 
 * @returns {string} El tipo de Anime si es válido, de lo contrario 'peliculas'
 */
export const isValidType = (type) => TYPE_PELISPLUS[type] || 'pelicula';
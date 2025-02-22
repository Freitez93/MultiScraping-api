// Constantes definidas fuera de las funciones para evitar recrearlas en cada llamada
const GENRE_ANIMEFLV = new Set([
    "accion", "artes-marciales", "aventuras", "carreras", "ciencia-ficcion", "comedia", "demencia",
    "demonios", "deportes", "drama", "ecchi", "escolares", "espacial", "fantasía", "harem", "histórico",
    "infantil", "josei", "juegos", "magia", "mecha", "militar", "misterio", "música", "parodia", "policía",
    "psicológico", "recuentos-de-la-vida", "romance", "samurai", "seinen", "shoujo", "shounen",
    "sobrenatural", "superpoderes", "suspenso", "terror", "vampiros", "yaoi", "yuri"
]);

const TYPE_ANIMEFLV = new Set(["tv", "movie", "special", "ova"]);

const STATUS_ANIMEFLV = {
    "ongoing": 1,
    "finished": 2,
    "upcoming": 3
};

const ORDER_ANIMEFLV = new Set(["default", "updated", "added", "title", "rating"]);

/**
 * @param {string} genero 
 * @returns {string|undefined} El género si es válido, de lo contrario undefined
 */
export const isValidGenre = genero => GENRE_ANIMEFLV.has(genero) ? genero : undefined;

/**
 * @param {string} type 
 * @returns {string|undefined} El tipo de Anime si es válido, de lo contrario undefined
 */
export const isValidType = type => TYPE_ANIMEFLV.has(type) ? type : undefined;

/**
 * @param {string} status 
 * @returns {number|undefined} El valor numérico del Status (ongoing: 1 | finished: 2 | upcoming: 3)
 */
export const isValidStatus = status => STATUS_ANIMEFLV[status] || undefined;

/**
 * @param {string} order 
 * @returns {string} El orden válido o "default" si no es válido
 */
export const isValidOrder = order => ORDER_ANIMEFLV.has(order) ? order : "default";
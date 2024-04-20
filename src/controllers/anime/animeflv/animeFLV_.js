import _ from "../../../utils/index.js"


/**
 * 
 * @param {*} genero 
 * @returns El genero si es valido de lo contrario undefined
 */
export const isValidGenre = genero => {
    const GenreAnimeFlv = [
        "accion", "artes-marciales", "aventuras", "carreras", "ciencia-ficcion", "comedia", "demencia",
        "demonios", "deportes", "drama", "ecchi", "escolares", "espacial", "fantasía", "harem", "histórico",
        "infantil", "josei", "juegos", "magia", "mecha", "militar", "misterio", "música", "parodia", "policía",
        "psicológico", "recuentos-de-la-vida", "romance", "samurai", "seinen", "shoujo", "shounen",
        "sobrenatural", "superpoderes", "suspenso", "terror", "vampiros", "yaoi", "yuri"
    ]

    return Object.values(GenreAnimeFlv).includes(genero) ? genero : undefined
}

/**
 * 
 * @param {*} type 
 * @returns El tipo de Anime si es valido de lo contrario undefined
 */
export const isValidType = type => {
    const TypeAnimeflv = [
        "tv",
        "movie",
        "special",
        "ova"
    ];
    return Object.values(TypeAnimeflv).includes(type) ? type : undefined;
}

/**
 * 
 * @param {*} status 
 * @returns El valor numerico del Status ongoing: 1 | finished: 2 | uppcoming: 3
 */
export const isValidStatus = status => {
    const StatusAnimeflv = {
        "ongoing": 1,
        "finished": 2,
        "upcoming": 3
    };

    return StatusAnimeflv[status] || undefined;
}

export const isValidOrder = (value) => {
    const OrderAnimeflv = [
        "default",
        "updated",
        "added",
        "title",
        "rating"
    ];

    return Object.values(OrderAnimeflv).includes(value) ? value : "default";
}
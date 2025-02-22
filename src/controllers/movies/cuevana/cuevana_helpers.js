
/**
 * Estandariza el tipo de contenido proporcionado.
 *
 * @param {string} type - El tipo de contenido ingresado.
 * @returns {string|boolean} - El tipo estandarizado o false si no se reconoce.
 */
export const type = (type) => {
    const mapping = {
        movie: 'pelicula',
        movies: 'pelicula',
        tv: 'serie',
        serie: 'serie',
        series: 'serie'
    };

    if (mapping[type]) {
        return mapping[type];
    }

    return ['pelicula', 'serie'].includes(type) ? type : false;
};

/**
 * Traduce los tipos de orden de inglés a español.
 * 
 * @param {string} order - El tipo de orden ("popular" o "latest").
 * @returns {string|boolean} El término correspondiente en español, o false si la entrada no es reconocida.
 */
export const order = (order) => {
    const translations = {
        popular: 'tendencias',
        latest: 'estrenos',
    };

    return translations[order] ?? false;
};

export const server = server => {
    switch (server) {
        case 'streamwish':
            return 'StreamWish'
        case 'filemoon':
            return 'FileMoon'
        case 'vidhide':
            return 'VidHide'
        case 'voesx':
            return 'Voe'
        case 'netu':
            return 'Netu'
        default:
            return 'Unknown'
    }
}

export const lang = language => {
    switch (language) {
        case 'latino':
            return 'Latino';
        case 'spanish':
            return 'Castellano';
        case 'english':
        case 'japanese':
            return 'Subtitulado';
        default:
            return 'Unknown';
    }
}

const getValid = {
    type,
    order,
    server,
    lang
}

export default getValid;

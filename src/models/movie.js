import tools from "../tools/index.js";

export class MovieSearch {
    constructor() {
        /** Número de página donde se encuentra actualmente 
         * @type {number}
        */
        this.currentPage = 1;

        /** Indica si hay una página siguiente disponible
         * @type {boolean}
        */
        this.hasNextPage = false;

        /** Resultados de la busqueda de animes
         * @type {any[]}
        */
        this.results = [];
    }

    /** Agrega resultados de la búsqueda de animes
     * @param {Object} movie
     */
    addResults(movie) {
        if (!movie || !movie.id || !movie.title || !movie.url || !movie.image) {
            throw new Error("Invalid movie object");
        }
        this.results.push({
            id: movie.id,
            title: movie.title,
            url: movie.url,
            image: movie.image,
            type: tools.isEmpty(movie.type) ? undefined : movie.type
        });
    }
}

export class MovieInfo {
    constructor() {
        /** Titulo de la Pelicula/Serie actual.
         * @type {string}
        */
        this.title = "";

        /** Titulos alternativos para la Pelicula/Serie
         * @type {string[]}
         */
        this.otherTitle = [];

        /** URL de la imagen de portada o cover
         * @type {string}
         */
        this.image = "";

        /** Direccion url del sitio web original
         * @type {string}
         */
        this.url = "";

        /** Tipo de anime eg. TV, Movie, OVA, ONA, Special
         * @type {string}
         */
        this.type = "";

        /** Estado actual de la Pelicula/Serie
         * @type {string}
         */
        this.status = "";

        /** Fecha en la que inicio la Pelicula/Serie
         * @type {string}
         */
        this.releaseDate = "";

        /** Generos de la Pelicula/Serie
         * @type {string[]}
         */
        this.genres = [];

        /** Descripcion de la Pelicula/Serie
         * @type {string}
         */
        this.description = "";

        /** Total de episodios de la Pelicula/Serie
         * @type {number}
         */
        this.totalEpisodes = 1;

        /** Lista de episodios de la Pelicula/Serie
         * @type {any[]}
         */
        this.episodes = [];
    }

    /** Agrega una película
     * @param {Object} movie
     */
    addMovie(movie) {
        if (!movie) {
            throw new Error("Invalid movie object");
        }
        this.episodes.push(movie);
    }

    /** Agrega una temporada
     * @param {Object} season
     */
    addSeason(season) {
        if (!season) {
            throw new Error("Invalid season object");
        }
        this.episodes.push(season);
    }
}

export class MovieSources {
    constructor() {
        /** Titulo del episodio o anime actual.
         * @type {string}
         */
        this.title = "";

        /** Direccion url del sitio web original 
         * @type {string}
         */
        this.url = "";

        /** Numero del Episodio o anime actual.
         * @type {number}
         */
        this.number = 0;

        /** Lista de los servidores o link directo al episodio o anime.
         * @type {any[]}
         */
        this.sources = [];
    }

    /** Agrega un servidor
     * @param {Object} object
     */
    addServer(object) {
        if (!object || !object.server || !object.url) {
            throw new Error("Invalid server object");
        }
        const subOrDub = tools.isLangValid(object?.type) || undefined;
        this.sources.push({
            server: object.server,
            type: subOrDub,
            url: object.url
        });
    }
}
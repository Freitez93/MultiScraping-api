import _ from "../utils/index.js"

export class MovieSearch {
    /** Número de página donde se encuentra actualmente 
     * @param Number 
    */
    currentPage = 1

    /** Indica si hay una página siguiente disponible
     * @param Boolean
    */
    hasNextPage = false

    /** Número de páginas disponibles para buscar
     * @param Number
    */
    totalPages = undefined

    /**
     * Resultados de la busqueda de animes
     * @param {Object} 
     * @type {any[]}
     */
    results = []

    /** Resultados de la busqueda de animes ingresados en un array
     * { id, title, url, image, type }
     * @param {String} id: ID unica de la Pelicula/Serie en el sitio web o Tmdb
     * @param {String} title: Titulo de la Pelicula/Serie
     * @param {String} url: Direccion url del sitio web original
     * @param {String} image: Direccion url de la imagen de portada o cover
     * @param {String} type: Tipo de la Pelicula/Serie eg. TV, Movie, Anime, Dorama etc..
    */
    addResults(movie) {
        this.results = this.results.concat({
            id: movie.id,
            title: movie.title,
            url: movie.url,
            image: movie.image,
            type: _.isEmpty(movie.type) ? undefined : movie.type
        });
    }
}

export class MovieInfo {
    /** Titulo de la Pelicula/Serie actual.
     * @param title
    */
    title = undefined

    /** Titulos alternativos para la Pelicula/Serie
     * @param otherTitle
     */
    otherTitle = []

    /** image: URL de la imagen de portada o cover
     * @param image
     */
    image = undefined

    /** url: Direccion url del sitio web original
     * @param url
     */
    url = undefined

    /** type: Tipo de anime eg. TV, Movie, OVA, ONA, Special
     * @param type
     */
    type = undefined

    /** status: Estado actual de la Pelicula/Serie
     * @param status
     */
    status = undefined

    /** releaseDate: Fecha en la que inicio la Pelicula/Serie
     * @param releaseDate
     */
    releaseDate = undefined

    /** genres: generos de la Pelicula/Serie
     * @param genres
     */
    genres = []

    /** description: Descripcion de la Pelicula/Serie
     * @param description
     */
    description = undefined

    /** totalEpisodes: Total de episodios de la Pelicula/Serie
     * @param totalEpisodes
     */
    totalEpisodes = 1

    /** episodes: Lista de episodios de la Pelicula/Serie
     * @param episodes
     */
    movie = undefined

    /** episodes: Lista de episodios de la Pelicula/Serie
     * @param seasons
     */
    seasons = undefined

    addMovie(movie){
        if (!this.movie) this.movie = [];
        this.movie.push(movie);
    }

    addSeason(season){
        if (!this.seasons) this.seasons = [];
        this.seasons.push(season);
    }
}

export class MovieSources {
    /** Titulo del episodio o anime actual.
     * @param {String} title
     */
    title = undefined

    /** Direccion url del sitio web original 
     * @param {String} url
     */
    url = undefined

    /** Numero del Episodio o anime actual.
     * @param {Number} number
     */
    number = undefined

    /** Lista de los servidores o link directo al episodio o anime.
     * @param {Object} sources
     */
    sources = undefined

    addServer(object) {
        if (!this.sources) this.sources = [];
        const subOrDub = _.isLangValid(object?.type) || undefined
        this.sources.push({
            server: object?.server,
            type: subOrDub,
            url: object.url
        })
    }
}
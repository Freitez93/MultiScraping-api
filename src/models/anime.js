import _ from "../utils/index.js"

export class AnimeSearch {
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
    totalPages = 100

    /**
     * Resultados de la busqueda de animes
     * @param {Object} 
     * @type {any[]}
     */
    results = []

    /** Resultados de la busqueda de animes ingresados en un array
     * { id, title, url, image, type }
     * @param {String} id: ID unica del anime en el sitio web
     * @param {String} title: Titulo del Anime
     * @param {String} url: Direccion url del sitio web original
     * @param {String} image: Direccion url de la imagen de portada o cover
     * @param {String} type: Tipo de anime eg. TV, Movie, OVA, ONA, Special
    */
    addResults(anime) {
        const fixType = anime?.type !== "" ? anime.type : undefined
        this.results = this.results.concat({
            id: anime?.id,
            title: anime?.title,
            url: anime?.url,
            image: anime?.image,
            type: fixType
        });
    }
}

export class AnimeInfo {
    /** Titulo del anime actual.
     * @param title
    */
    title = undefined

    /** Titulos alternativos para el anime
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

    /** status: Estado actual del anime
     * @param status
     */
    status = undefined

    /** season: Temporada del anime
     * @param season: "Summer" | "Autumn" | "Winter" | "Spring"
    */
    season = undefined

    /**releaseDate: Fecha en la que inicio el anime
     * @param releaseDate
     */
    releaseDate = undefined

    /** genres: generos del anime
     * @param genres
     */
    genres = []

    /** description: Descripcion del anime
     * @param description
     */
    description = undefined

    /** chronology: Cronologia del anime
     * @param chronology
     */
    chronology = []

    /** totalEpisodes: Total de episodios del anime
     * @param totalEpisodes
     */
    totalEpisodes = 0

    /** episodes: Lista de episodios del anime
     * @param episodes
     */
    episodes = []

    constructor() {

    }
}

export class AnimeSources {
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
    sources = []

    addServer(object) {
        const subOrDub = _.isLangValid(object?.type) || undefined
        this.sources.push({
            server: object?.server,
            type: subOrDub,
            url: object.url
        })
    }
}
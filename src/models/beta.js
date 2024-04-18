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

    /** Resultados de la busqueda de animes
     * @param Object
     * 
    */
    results = []

    constructor() {
        //
    }

    /** 
     * @param currentPage Número de página donde se encuentra actualmente
     * @param hasNextPage Indica si hay una página siguiente disponible
     * @param totalPages Número de páginas disponibles para buscar
    */
    addNavigate(pageNav) {
        this.currentPage = pageNav?.currentPage;
        this.hasNextPage = pageNav?.hasNextPage;
        this.totalPages = pageNav?.totalPages;
    }


    /** Resultados de la busqueda de animes ingresados en un array
     * { id, title, url, image, type }
     * @param id id: Identificador unico en la pagina web
     * @param title title: Titulo del Anime
     * @param url url: Direccion url del sitio web original
     * @param image image: URL de la imagen de portada o cover
     * @param type type: Tipo de anime eg. TV, Movie, OVA, ONA, Special
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

    constructor(){

    }
}
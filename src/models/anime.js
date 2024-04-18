import _ from "../utils/index.js"

//export type TypeAnimeflv = "all" | 1 | 2 | 3 | 4;
//export type OrderAnimeflv = "all" | 1 | 2 | 3 | 4 | 5;

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
    */
    results = [
        //
    ]

    constructor(){
        console.log(this)
    }
}

export class PageNavigate extends AnimeSearch  {

    constructor(elemente){
        super(this)
    }
}
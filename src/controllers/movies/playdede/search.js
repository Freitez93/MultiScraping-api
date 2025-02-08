import axios from "axios";
import { load } from "cheerio";
import { MovieSearch } from "../../../models/movie.js";
import _ from "../../../utils/index.js"

export const GetMovieBySearch = async (req, res) => {
	const baseUrl = "https://www1.playdede.ws/";
	const validTypes = { 'movie': 'peliculas', 'tv': 'seriesa', 'serie': 'seriesa', 'anime': 'animacion' }
	const validOrder = { 'populares': 'populares', 'estrenos': 'cartelera', 'valoracion': 'rate' }
	const type = validTypes[req.query.type] || 'peliculas'

	const link = `${baseUrl + type}/page/${req.query.page || 1}`
	try {
		const { data } = await axios.get(link, {
			params: {
				tipo: validOrder[req.query.order]
			}
		});
		const $ = load(data);

		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = req.query.page || 1;
		moviesSearch.hasNextPage = $('body').text().includes('Pagina Siguiente');
		moviesSearch.results = [];

		// Seleccionar todos los artículos de películas
		$('article.item').each((index, element) => {
			const anchor = $(element).find('a');
			const movie = {
				id: '',
				title: '',
				url: '',
				image: ''
			};


			// Extraer nombre
			const titleElement = anchor.find('div.data h3');
			movie.title = titleElement.text().trim();

			// Extraer URL
			movie.url = anchor.attr('href').slice(0, -1);


			// Extraer ID
			movie.id = movie.url.slice(25)

			// Extraer imagen
			const img = anchor.find('img');
			movie.image = img.attr('data-lazyload').startsWith('//')

				? `https:${img.attr('data-lazyload')}`
				: img.attr('data-lazyload');


			moviesSearch.results.push(movie);
		});
		return res.status(200).json(moviesSearch);
	} catch (error) {
		return res.status(500).json("Error " + error.message);
	}
}
import axios from "axios";
import { load } from "cheerio";
import { MovieInfo, MovieSearch } from "../../../models/movie.js";
import getValid from "./cuevana_helpers.js"

const DOMAIN = "https://cuevana.biz";

/**
 * Busca películas/series según los criterios especificados
 */
export const GetMovieBySearch = async (query, type, order, page = 1) => {
	const _Type = getValid.type(type)
	const _Order = getValid.order(order)

	let BASE_PATHNAME = `/inicio`;
	if (query) {
		BASE_PATHNAME = `/search?q=${query}`;
	} else if (_Type && _Order) {
		BASE_PATHNAME = `/${_Type}s/${_Order}/semana/page/${page}`;
	} else if (_Type) {
		BASE_PATHNAME = `/${_Type}s/page/${page}`;
	}

	const completeUrl = new URL(BASE_PATHNAME, DOMAIN).href;
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		const __NEXT_DATA__ = $('#__NEXT_DATA__').text()
		const DATA = JSON.parse(__NEXT_DATA__)?.props.pageProps;
		const DATA_Movies = DATA.movies || DATA.tabLastMovies

		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = page || 1;
		moviesSearch.hasNextPage = $('a.next') ? true : false;
		moviesSearch.results = [];

		DATA_Movies.map((item, index) => {
			const slug = item.url.slug.split('/')
			const slugType = getValid.type(slug[0])
			const encrypted = `${slug[1]}|${slugType}|${slug[2]}`

			moviesSearch.results.push({
				id: `/info?id=${encrypted}`,
				title: item.titles.name,
				url: new URL(`/${slugType}/${slug[1]}/${slug[2]}`, DOMAIN).href,
				image: item.images.poster
			});
		});

		return moviesSearch;
	} catch (error) {
		throw new Error("GetMovieBySearch: " + error.message);
	}
};

/**
 * Obtiene información detallada de una película o serie
 */
export const GetMovieInfo = async (TMDb_ID, TYPE, SLUG) => {
	const BASE_PATHNAME = `/${TYPE}/${TMDb_ID}/${SLUG}/`;
	const type = TYPE === 'serie' ? 'Serie' : 'Movie'

	const completeUrl = new URL(BASE_PATHNAME, DOMAIN).href;

	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		const __NEXT_DATA__ = $('#__NEXT_DATA__').text()
		const DATA_JSON = JSON.parse(__NEXT_DATA__).props.pageProps;
		const DATA_INFO = type === 'Movie' ? DATA_JSON.thisMovie : DATA_JSON.thisSerie;

		const movieInfo = new MovieInfo();
		movieInfo.title = DATA_INFO.titles.name;
		movieInfo.otherTitle = DATA_INFO.titles.original;
		movieInfo.image = DATA_INFO.images.poster;
		movieInfo.url = completeUrl;
		movieInfo.description = DATA_INFO.overview;
		movieInfo.type = type;
		movieInfo.status = type == 'Movie' ? 'Finished' : 'Unknown'
		movieInfo.releaseDate = DATA_INFO.releaseDate;

		// Géneros
		movieInfo.genres = DATA_INFO.genres.map((genre) => genre.name);

		const endPointID = `${TMDb_ID}|${SLUG}`
		if (type === 'Movie') {
			const backdrop = DATA_INFO.images.backdrop.replace('original', 'w300');

			movieInfo.addMovie({
				id: `/watch?id=${endPointID}`,
				name: movieInfo.title,
				image: backdrop
			});
		} else {
			DATA_INFO.seasons.map(season => {
				const SEASON = `Temporada ${season.number}`;
				const SEASON_NUM = season.number
				const episodes = [];

				if (!season.episodes.length) return;
				season.episodes.map(episode => {
					episodes.push({
						id: `/watch?id=${endPointID}|${SEASON_NUM}x${episode.number}`,
						name: episode.title,
						image: episode.image,
						releaseDate: episode.releaseDate
					})
				})

				movieInfo.addSeason({
					title: SEASON,
					number: SEASON_NUM,
					episodes: episodes
				})
			})
		}

		return movieInfo;
	} catch (error) {
		throw new Error("GetMovieInfo: " + error.message);
	}
};

/**
 * Obtiene los servidores disponibles para un episodio
 */
export const GetEpisodeServers = async (TMDb_ID, SLUG, SEASON, EPISODE) => {

	const BASE_PATHNAME = SEASON && EPISODE
		? `/serie/${TMDb_ID}/${SLUG}/temporada/${SEASON}/episodio/${EPISODE}`
		: `/pelicula/${TMDb_ID}/${SLUG}`;

	const completeUrl = new URL(BASE_PATHNAME, DOMAIN).href
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		const __NEXT_DATA__ = $('#__NEXT_DATA__').text()
		const DATA_JSON = JSON.parse(__NEXT_DATA__).props.pageProps;
		const DATA_INFO = SEASON ? DATA_JSON.episode : DATA_JSON.thisMovie;

		// Inicializar un objeto para almacenar los datos
		const videoData = {};
		videoData.title = DATA_INFO.title || DATA_INFO.titles.name;
		videoData.url = completeUrl;
		videoData.number = DATA_INFO.number;
		videoData.source = [];

		// Iteramos sobre cada idioma en el objeto original
		for (const [idioma, entries] of Object.entries(DATA_INFO.videos)) {
			// Filtramos solo los arrays que tengan contenido
			if (entries.length > 0) {
				for (const entry of entries) {
					const locker = await getUrl(entry.result);
					videoData.source.push({
						server: getValid.server(entry.cyberlocker),
						url: locker,
						language: getValid.lang(idioma),
						quality: entry.quality
					});
				}
			}
		}

		return videoData;
	} catch (error) {
		throw new Error("GetEpisodeServers: " + error.message);
	}
};

async function getUrl(code) {
	try {
		const { data } = await axios.get(code)
		const $ = load(data);
		const script = $('script:contains(var url = )').text();
		const url = script.match(/var url = '(.+)';/)[1];
		return url
	} catch (error) {
		throw new Error("getUrl: " + error.message);
	}
}
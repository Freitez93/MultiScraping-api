import { load } from "cheerio";
import { MovieInfo, MovieSearch } from "../../../models/movie.js";
import { httpRequest, assembleFilter, getValidType } from "./sololatino_helpers.js";
import { embedExtractor } from "../pelisplus/pelisplus_extractor.js";
import tools from "../../../tools/index.js";

const BASE_DOMAIN = "https://sololatino.net/";

/**
 * Busca películas/series según los criterios especificados
 */
export const GetMovieBySearch = async (query, type, genre, sort, network, page = 1) => {
	const BASE_PATHNAME = assembleFilter(query, type, genre, sort, network, page);
	const searchLink = new URL(BASE_PATHNAME, BASE_DOMAIN).href

	try {
		const { data } = await httpRequest(searchLink, 'GET');
		const $ = load(data);

		// Array para almacenar los resultados
		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = page;
		moviesSearch.hasNextPage = $('.pagMovidy:last-Child').text().includes('siguiente');
		moviesSearch.results = [];

		// Seleccionar los elementos de las películas y series
		$('article').each((index, element) => {
			const title = $(element).find('a').attr('alt');
			const _link = $(element).find('a').attr('href');
			const image = $(element).find('img').attr('data-srcset');
			const slug = _link.replaceAll('-123', '').split('/');
			const format = {
				peliculas: 'movie',
				series: 'series',
				animes: 'anime'
			}[slug[3]];

			// Agregar los datos al array de resultados
			moviesSearch.results.push({
				id: `/info?id=${format}|${slug[4]}`,
				title: title,
				url: _link,
				image: image.replace('w200', 'original'),
				type: tools.toTitleCase(format)
			});
		});

		return moviesSearch;
	} catch (error) {
		throw new Error("GetMovieBySearch: " + error);
	}
};

/**
 * Obtiene información detallada de una película o serie
 */
export const GetMovieInfo = async (slug, type) => {
	const isValidType = getValidType(type);
	const BASE_PATHNAME = `/${isValidType}/${slug}/`;
	slug = slug.replace('-latino', '')

	const completeUrl = new URL(BASE_PATHNAME, BASE_DOMAIN).href;
	try {
		const { data } = await httpRequest(completeUrl, 'GET');
		const $ = load(data);

		// Extracting data from the page
		const movieInfo = new MovieInfo();
		movieInfo.title = $('img[itemprop="image"]').attr('alt')
		movieInfo.otherTitle = undefined;
		movieInfo.image = $('img[itemprop="image"]').attr('src');
		movieInfo.url = completeUrl;
		movieInfo.description = $('div[itemprop="description"] > p').text().trim();
		movieInfo.releaseDate = $('.date[itemprop="dateCreated"]').text().trim();
		movieInfo.status = type === 'movie' ? 'Finished' : 'Unknown';
		movieInfo.type = tools.toTitleCase(type);

		// Extract genres from the links in the genres section
		$('a[rel="tag"]').each((i, elem) => {
			movieInfo.genres.push($(elem).text().trim());
		});

		if (movieInfo.type === 'Movie') {
			movieInfo.addMovie({
				id: `/watch?id=${type}|${slug}`,
				name: movieInfo.title,
				url: completeUrl
			});
		} else {
			// Objeto para almacenar las temporadas
			const seasons = [];
			let totalEpisodes = 0

			$('div.se-c').map((index, seasonElem) => {
				const seasonTitle = `Temporada ${index + 1}`
				const seasonNumber = index + 1
				const arrEpisodes = []

				const dataSeason = $(seasonElem).find('div.se-a li')
				$(dataSeason).map((index, epElem) => {
					const episodeTitle = $(epElem).find('.epst').text().trim()
					const episodeImage = $(epElem).find('img').attr('src')
					const episodeDate = $(epElem).find('.date').text().trim()

					totalEpisodes++;
					arrEpisodes.push({
						id: `/watch?id=${type}|${slug}|${seasonNumber}x${index + 1}`,
						name: episodeTitle || `Episodio ${index + 1}`,
						number: index + 1,
						image: episodeImage,
						date: episodeDate
					});
				})

				seasons.push({
					title: seasonTitle,
					number: seasonNumber,
					episodes: arrEpisodes
				})
			})

			movieInfo.totalEpisodes = totalEpisodes;
			movieInfo.episodes = seasons;
		}
		return movieInfo;
	} catch (error) {
		throw ("GetMovieInfo: " + error.message || error);
	}
};

/**
 * Obtiene los servidores disponibles para un episodio
 */
export const GetEpisodeServers = async (slug, type, season, episode) => {
	const BASE_PATHNAME = !(season && episode)
		? `/peliculas/${slug}`
		: `/episodios/${slug}-${season}x${episode}/`;

	const completeUrl = new URL(BASE_PATHNAME, BASE_DOMAIN).href;
	try {
		const { data } = await httpRequest(completeUrl, 'GET');
		const $ = load(data);

		// Inicializar un objeto para almacenar los datos
		const videoData = {};
		videoData.title = $('#info h1').text() || $('img[itemprop="image"]').attr('alt');
		videoData.url = completeUrl;
		videoData.number = season ? episode : undefined;
		videoData.source = [];

		const iframeEmbed = []
		$('.navEP2 > li[class]').map((index, elem) => {
			iframeEmbed.push({
				post: $(elem).attr('data-post'),
				type: $(elem).attr('data-type'),
				nume: $(elem).attr('data-nume')
			});
		})
		
		const BASE_AJAX = 'https://sololatino.net/wp-admin/admin-ajax.php'
		const params = {
			action: 'doo_player_ajax',
			post: iframeEmbed[0].post,
			nume: iframeEmbed[1]?.nume || iframeEmbed[0].nume,
			type: iframeEmbed[0].type
		}

		const { data: ajaxResponse } = await httpRequest(BASE_AJAX, 'POST', params, 'https://sololatino.net/');
		const matchUrl = ajaxResponse.match(/https?:\/\/[^\s'"]+/g)[0];

		// Extraer la información de los servidores
		if (matchUrl.includes('/tt')) {
			const Multi_Embed = await embedExtractor(matchUrl);
			videoData.source = Multi_Embed.sources;
		} else {
			videoData.source = []
		}

		return videoData;
	} catch (error) {
		console.trace(error)
		throw Error("GetEpisodeServers: " + error.message);
	}
};
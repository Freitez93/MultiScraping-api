import axios from "axios";
import { load } from "cheerio";
import { MovieInfo, MovieSearch } from "../../../models/movie.js";
import tools from "../../../tools/index.js";

const BASE_URL = "https://www1.playdede.ws/";

/**
 * Busca películas/series según los criterios especificados
 */
export const GetMovieBySearch = async (query, type = 'movie', order, page = 1) => {
	const validTypes = {
		'movie': 'peliculas',
		'tv': 'seriesa',
		'serie': 'seriesa',
		'anime': 'animacion'
	};
	const validOrder = {
		'popular': 'populares',
		'latest': 'cartelera',
		'rate': 'rate'
	};

	let BASE_PATHNAME = `/peliculas/page/${page}}/`;
	if (query) {
		BASE_PATHNAME = `/peliculas/page/${page}?s=${query}`;
	} else if (type && order) {
		BASE_PATHNAME = `/${validTypes[type]}/page/${page}?tipo=${validOrder[order]}`;
	} else if (validTypes[type]) {
		BASE_PATHNAME = `/${validTypes[type]}/page/${page}`;
	}

	const completeUrl = new URL(BASE_PATHNAME, BASE_URL).href;
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = page || 1;
		moviesSearch.hasNextPage = $('body').text().includes('Pagina Siguiente');
		moviesSearch.results = [];

		$('article.item').each((_, element) => {
			const anchor = $(element).find('a');
			const img = anchor.find('img').attr('data-lazyload');
			const slug = anchor.attr('href').slice(25, -1).split('/');

			moviesSearch.results.push({
				id: `/info?id=${slug[0]}|${slug[1]}`,
				title: anchor.find('div.data h3').text().trim(),
				url: anchor.attr('href').slice(0, -1),
				image: new URL(img, 'https://image.tmdb.org/').href
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
export const GetMovieInfo = async (slug, type) => {
	const _type = ['movie', 'serie', 'anime'].includes(type) ? type : 'movie';

	const BASE_PATHNAME = `/${_type}/${slug}`;
	const completeUrl = new URL(BASE_PATHNAME, BASE_URL).href;
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		const cover = $('img[itemprop="image"]').attr('src');

		const movieInfo = new MovieInfo();
		movieInfo.title = $('img[itemprop="image"]').attr('alt');
		movieInfo.otherTitle = undefined;
		movieInfo.image = `https://image.tmdb.org/t/p/w300/${cover.split('/').pop()}`;
		movieInfo.url = completeUrl;
		movieInfo.description = $('meta[name="description"]').attr('content');
		movieInfo.type = tools.toTitleCase(_type);
		movieInfo.status = $('.sgeneros .date').last().text().replace('Estado:', '').trim();
		movieInfo.releaseDate = $('.sgeneros .date').first().text().trim();

		// Géneros
		$('.sgeneros a[rel="tag"]').each((_, elem) => {
			const tag = $(elem).text()
				.replace('Series de ', '')
				.replace('Peléculas de ', '')
				.trim();
			movieInfo.genres.push(tag);
		});

		if (_type === 'movie') {
			const cover = $('.wallpaper').attr('style');
			movieInfo.addMovie({
				id: `/watch?id=${slug}`,
				name: movieInfo.title,
				image: `https:${tools.substringBetween(cover, 'url(', ');').replace('w780', 'w300')}`,
				duration: $('.runtime').last().text().replace('Duración:', '').trim(),
			});
		} else {
			const sources = [];
			let episodesCount = 0;

			// Iterate through each season
			$('#seasons .se-c').each(function () {
				const seasonNum = $(this).data('season');
				const seasonTitle = `Temporada ${seasonNum}`;
				const episodes = [];

				// Iterate through each episode in the season
				$(this).find('.episodios li').each(function () {
					const episodeNum = $(this).find('.numerando').text().split(' - ')[1]; // Get episode number
					const title = $(this).find('.epst').text(); // Get episode title
					const image = $(this).find('img').attr('src'); // Get episode image
					const releaseDate = $(this).find('.date').text(); // Get release date

					// Create episode object
					const episode = {
						id: `/watch?id=${slug}|${seasonNum}x${episodeNum}`,
						name: title,
						image: image || undefined,
						releaseDate: releaseDate || undefined
					};

					episodes.push(episode);
				});

				// Create season object
				const season = {}
				season.title = seasonTitle;
				season.number = parseInt(seasonNum);
				season.episodes = episodes;

				episodesCount += season.episodes.length;
				sources.push(season);
			});

			movieInfo.totalEpisodes = episodesCount
			movieInfo.episodes = sources;
		}

		return movieInfo;
	} catch (error) {
		throw new Error("GetMovieInfo: " + error.message);
	}
};

/**
 * Obtiene los servidores disponibles para un episodio
 */
export const GetEpisodeServers = async (slug, season, episode) => {

	const BASE_PATHNAME = season
		? `/episode/${slug}-${season}x${episode}`
		: `/movie/${slug}`;

	const completeUrl = new URL(BASE_PATHNAME, BASE_URL).href
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		// Inicializar un objeto para almacenar los datos
		const videoData = {};
		videoData.title = $('#info h1').text() || $('img[itemprop="image"]').attr('alt');
		videoData.url = completeUrl;
		videoData.number = season ? videoData.title.split(' ').pop() : undefined;
		videoData.source = [];

		// Mapeo de códigos de idioma
		const languageMap = {
			'1559': 'Castellano',
			'29': 'Latino',
			'31': 'Subtitulado'
		};

		// Buscar todos los elementos que contienen información de los videos
		$('.playerItem').each((index, element) => {
			const link = $(element).attr('data-loadplayer');
			const serverName = $(element).find('h3').text().trim();
			const quality = $(element).find('p').text().trim().split(': ')[1];

			// Obtener y traducir el código de idioma
			const languageCode = $(element).attr('data-lang');
			const language = languageMap[languageCode] || languageCode;

			// Saltar enlaces de cuevana.ac
			if (link && link.includes('cuevana.ac')) {
				return;
			}

			videoData.source.push({
				server: serverName,
				url: link,
				lang: language,
				quality: quality
			});
		});

		return videoData;
	} catch (error) {
		throw new Error("GetEpisodeServers: " + error.message);
	}
};
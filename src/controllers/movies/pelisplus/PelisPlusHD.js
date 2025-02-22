import axios from "axios";
import { load } from "cheerio";
import { MovieInfo, MovieSearch } from "../../../models/movie.js";
import { isValidType, isValidGenre } from "./pelisplus_helpers.js";
import { embedExtractor } from "./pelisplus_extractor.js";
import tools from "../../../tools/index.js";

const BASE_ORIGIN = "https://pelisplushd.bz/";

/**
 * Busca películas/series según los criterios especificados
 */
export const GetMovieBySearch = async (query, type, genre, year, page) => {

	const _type = isValidType(type);
	const _genre = isValidGenre(genre);
	const _year = Number(year) ? year : false

	const BASE_PATHNAME = query
		? `search?s=${query}`
		: _type && _genre ? `generos/${_genre}/${_type}s`
		: _type && _year ? `year/${_year}/${_type}`
		: _genre ? `generos/${_genre}`
		: _year ? `year/${_year}`
		: _type ? `${_type}s`
		: '';

	const searchLink = new URL(BASE_PATHNAME, BASE_ORIGIN).href
	try {
		const { data } = await axios.get(searchLink, {
			params: {
				page: page || 1
			}
		});
		const $ = load(data);

		// Array para almacenar los resultados
		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = page || 1;
		moviesSearch.hasNextPage = $('.page-link[rel="next"]').length > 0;
		moviesSearch.results = [];

		// Seleccionar los elementos de las películas y series
		$('.Posters-link').each((index, element) => {
			const title = $(element).find('.listing-content p').text().trim();
			const link = $(element).attr('href');
			const image = $(element).find('.Posters-img').attr('src');
			const slug = link.split('/');
			const format = {
				pelicula: 'movie',
				anime: 'anime'
			}[slug[3]] || 'serie';

			// Agregar los datos al array de resultados
			moviesSearch.results.push({
				id: `/info?id=${format}|${slug[4]}`,
				title: title.replace(/ (\(\d+\)|\(\))/, ''),
				url: link,
				image: image.replace('w154', 'w300'),
				type: tools.toTitleCase(format)
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
	const completeUrl = new URL(`${isValidType(type)}/${slug}`, BASE_ORIGIN).href;

	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		// Extracting data from the page
		const movieInfo = new MovieInfo();
		movieInfo.title = $('.card-body img').attr('alt');
		movieInfo.otherTitle = undefined;
		movieInfo.image = $('meta[property="og:image"]').attr('content');;
		movieInfo.url = completeUrl;
		movieInfo.description = $('div.text-large').first().text().trim();
		movieInfo.releaseDate = $('.sectionDetail').last().text()
			.split('estreno:')[1].trim()
			|| 'Unknown';
		movieInfo.status = type === 'movie'
			? 'Finished'
			: 'Unknown';
		movieInfo.type = tools.toTitleCase(type);

		// Extract genres from the links in the genres section
		$('a[title^="Películas del Genero"]').each((i, elem) => {
			movieInfo.genres.push($(elem).text().trim());
		});

		if (movieInfo.type === 'Movie') {
			movieInfo.addMovie({
				id: `/watch?id=${type}|${slug}`,
				name: movieInfo.title,
				url: completeUrl
			});
		} else {
			const seasons = {};
			const arrayEpisodes = $('.tab-content .btn');

			// Seleccionamos todos los enlaces de los episodios
			arrayEpisodes.each((index, element) => {
				const episodeUrl = $(element).attr('href'); // URL del episodio
				const parts = episodeUrl.split('/');

				// Nombre del episodio en formato T1 - E1: Episode 1
				const seasonNumber = parts[6]; // Número de la temporada
				const episodeNumber = parts[8]; // Número del episodio
				const episodeName = `T${seasonNumber} - E${episodeNumber}: Episode ${episodeNumber}`;

				// Extraemos la información de la temporada y episodio desde el texto del enlace
				if (seasonNumber && episodeNumber) {
					// Creamos el id en el formato requerido
					const endpoint = `/watch?id=${type}|${slug}|${seasonNumber}x${episodeNumber}`;
					const episode = {  // Creamos el episodio
						id: endpoint,
						name: episodeName,
						url: episodeUrl
					};

					// Inicializamos la temporada si no existe y agregamos el episodio
					seasons[seasonNumber] = seasons[seasonNumber] || {
						title: `Temporada ${seasonNumber}`,
						number: parseInt(seasonNumber),
						episodes: []
					};
					seasons[seasonNumber].episodes.push(episode);
				}
			});

			// Agregamos las temporadas al objeto de la serie
			movieInfo.totalEpisodes = arrayEpisodes.length;
			movieInfo.addSeason(Object.values(seasons));
		}

		return movieInfo;
	} catch (error) {
		throw new Error("GetMovieInfo: " + error.message);
	}
};

/**
 * Obtiene los servidores disponibles para un episodio
 */
export const GetEpisodeServers = async (slug, type, season, episode) => {
	const BASE_PATHNAME = type === 'movie'
		? `pelicula/${slug}`
		: `${type}/${slug}/temporada/${season}/capitulo/${episode}`;

	if (!['movie', 'serie', 'anime'].includes(type)) {
		throw new Error('El parametro de type no es válido');
	}

	const completeUrl = new URL(BASE_PATHNAME, BASE_ORIGIN).href;
	try {
		const { data } = await axios.get(completeUrl);
		const $ = load(data);

		// Inicializar un objeto para almacenar los datos
		const videoData = {};
		videoData.title = $('.card-body img').attr('alt');
		videoData.url = completeUrl;
		videoData.number = type !== 'serie' ? episode : undefined;
		videoData.source = [];

		const script = $('script:contains("var video = [];")').html();
		if (!script) {
			throw new Error('No se encontraron servidores para el video')
		}

		// Extraer la información de los servidores
		const serverNames = script.match(/https?:\/\/[^\s'"]+/g);
		for (const server of serverNames) {
			if (server.includes('/tt')) {
				const Multi_Embed = await embedExtractor(server);
				videoData.source = Multi_Embed[0].sources; // Asumiendo que Multi_Embed siempre tiene al menos un elemento
			} else {
				const name = server.includes('waaw') ? 'Netu' : 'UqLoad';
				videoData.source.push({
					server: name,
					link: server,
					language: 'Unknown',
					type: 'video/mp4'
				});
			}
		}

		return videoData;
	} catch (error) {
		throw new Error("GetEpisodeServers: " + error.message);
	}
};
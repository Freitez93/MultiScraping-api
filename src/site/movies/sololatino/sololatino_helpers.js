import axios from "axios";

// Definición de valores válidos (podrían moverse a un archivo de configuración)
var VALID_GENRES = [
	'accion', 'accion-ficcion', 'animacion-123-123', 'anime',
	'aventura-123-123-123-123', 'belica', 'ciencia-ficcion',
	'comedia', 'crimen', 'documental', 'drama', 'familia',
	'fantasia', 'historia', 'misterio', 'musica',
	'pelicula-de-tv', 'peliculas-animadas', 'peliculas-de-miedo',
	'peliculas-familiares', 'retro', 'romance',
	'suspense', 'suspenso', 'terror', 'western',
	// Géneros de series
	'action-adventure', 'kids', 'reality',
	'sci-fi-fantasy', 'soap', 'talk',
	// Géneros de anime
	'fantasia'
];

const VALID_ORDER = ['ratings', 'trending'];
const VALID_NETWORKS = ['amazon', 'apple-tv', 'disney', 'hbo', 'hbo-max', 'hulu', 'netflix'];
const VALID_TYPES = [
	{ aliases: 'movie', value: 'genero' },
	{ aliases: 'serie', value: 'genre_series' },
	{ aliases: 'anime', value: 'genre_animes' }
];


//--------------------------------------- Ensamblador de la URL de búsqueda ---------------------------------------
export const assembleFilter = (query, type, genre, sort, network, page = 1) => {
	const isValidType = getValidValue(type, VALID_TYPES, false);
	const isValidGenre = VALID_GENRES.includes(genre);
	const isValidOrder = VALID_ORDER.includes(sort);
	const isValidNetwork = VALID_NETWORKS.includes(network);

	if (type && !isValidType)
		throw TypeError('Type no válido. Las opciones válidas son: movie, serie, anime.');
	if (genre && !isValidGenre)
		throw TypeError('Genre inválido. Consulta SoloLatino.net para consultar los permitidos.');
	if (sort && !isValidOrder)
		throw TypeError('Sort no reconocido. Las opciones válidas son: ratings y trending.');


	let BASE_PATH = `/trending/page/${page}/`

	// Prioridad 1: Búsquedas por texto
	if (query) {
		return `/page/${page}/?s=${encodeURIComponent(query)}`;
	}

	// Prioridad 2: Filtros por red
	if (isValidNetwork) {
		return `/network/${network}/page/${page}/`;
	}

	// Prioridad 3: Filtros por Orden
	if (isValidOrder) {
		return `/${sort}/page/${page}/`;
	}

	if (isValidType) {
		const nType = type === 'movie'
			? 'peliculas'
			: type === 'serie'
			? 'series'
			: 'animes';

		BASE_PATH = isValidGenre
			? `/${isValidType}/${genre}/page/${page}/`
			: `/${nType}/page/${page}/`;
	}

	return BASE_PATH
};

export const getValidType = (input, defaultValue) => {
	const typeMap = {
		movie: 'peliculas',
		serie: 'series',
		anime: 'animes'
	};
	return typeMap[input] || defaultValue;
};

//-------------------------------------------------- httpRequest --------------------------------------------------
export const httpRequest = async (url, method, params = null, referer = null) => {
	const config = {
		method: method.toLowerCase(),
		url: url,
		headers: {
			'User-Agent': 'Mozilla/5.0',
		},
	};

	// Agregar referer si existe
	if (referer) {
		config.headers.Referer = referer;
	}

	// Manejar parámetros según el método
	if (method.toUpperCase() === 'GET' && params) {
		config.params = params;
	} else if (method.toUpperCase() === 'POST' && params) {
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		config.data = new URLSearchParams(params).toString();
	}

	try {
		console.log(config.url)
		return await axios(config);
	} catch (error) {
		throw error.message;
	}
}

const getValidValue = (input, validEntries, defaultValue = false) => {
	if (!input) return defaultValue;

	const entry = validEntries.find(({ aliases }) => aliases.includes(input.toLowerCase()));

	return entry ? entry.value : defaultValue;
};
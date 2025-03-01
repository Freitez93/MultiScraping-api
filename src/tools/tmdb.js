import axios from "axios";

// Regístrate en https://www.themoviedb.org para obtener una clave
const TMDB_API_KEY = getRandomKey();
const headers = {
	"accept": "application/json",
	"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3OTE1MzQ5ZWQ2OGI2OWFmMTEwMDJmNWVhMzhhYThjNiIsInN1YiI6IjYzZjFhMWJjYTI0YzUwMDBkNGUzOWNjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t3SAOPr_XGTTpe2d4gBMyxs9_3WDSVVXBJP9t_q7YJk"
}

export const getInfoFromID = async (TMDb_ID, TYPE = 'movie', LANGUAGE = 'es-419') => {
	try {
		// Validar tipo
		if (!['movie', 'tv', 'serie'].includes(TYPE)) {
			throw new Error('Tipo inválido. Usar "movie" o "tv"');
		} else {
			TYPE = (TYPE === 'serie') ? 'tv' : TYPE;
		}

		// Construir URL de la API
		const url = `https://api.themoviedb.org/3/${TYPE}/${TMDb_ID}`;

		// Hacer la solicitud
		const response = await axios.get(url, {
			params: {
				api_key: TMDB_API_KEY,
				language: LANGUAGE
			}
		});

		// Devolver datos estructurados
		return {
			success: true,
			data: response.data
		};

	} catch (error) {
		// Manejar errores
		return {
			success: false,
			error: error.response?.data?.status_message || error.message
		};
	}
}

export const getIMDbID = async (TMDb_ID, TYPE = 'movie') => {
	try {
		// Hacer la solicitud
		const response = await GetInfoFromTMDB(TMDb_ID, TYPE);

		if (!response.success) throw new Error("Error al obtener datos de TMDb");

		return response.data.imdb_id; // Retorna el IMDb ID (ej: "tt1234567")
	} catch (error) {
		console.error("Error:", error.message);
		return null;
	}
}

export const getTMDbID = async(IMDb_ID, apiKey) => {
	try {
		const baseURL = `https://api.themoviedb.org/3/find/${IMDb_ID}?external_source=imdb_id`
		const response = await axios.get(baseURL, {
			params: {
				api_key: apiKey || TMDB_API_KEY,
				language: 'es-419'
			}
		})

		if (!response.status === 200) throw new Error("Error al buscar en TMDb");
		const data = response.data;

		// Retorna el primer resultado de película (si existe)
		return data.movie_results[0]?.id || null;
	} catch (error) {
		console.error("Error:", error.message);
		return null;
	}
}

// funcion que retorna un valor al asar de un array con varios elementos
function getRandomKey() {
	const tmdb_keys = [
		'fb7bb23f03b6994dafc674c074d01761',
		'e55425032d3d0f371fc776f302e7c09b',
		'8301a21598f8b45668d5711a814f01f6',
		'8cf43ad9c085135b9479ad5cf6bbcbda',
		'da63548086e399ffc910fbc08526df05'
	];

	const randomIndex = Math.floor(Math.random() * tmdb_keys.length);
	return tmdb_keys[randomIndex];
}

const TMDb = {
	getInfoFromID,
	getIMDbID,
	getTMDbID
}

export default TMDb;
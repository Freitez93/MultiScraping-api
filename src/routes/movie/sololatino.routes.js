import express from "express";
import { getCachedData } from "../../config/node_cache.js";
import { GetMovieBySearch, GetMovieInfo, GetEpisodeServers } from '../../controllers/movies/sololatino/SoloLatino.js'
const router = express.Router();

router.get("/", (_req, res) => {
	res.send({
		intro: 'Welcome to the SoloLatino.net provider.',
		routes: ['/search', '/info', '/watch'],
		documentation: 'https://github.com/Freitez93/MultiScraping-api',
	});
});

// Rutas para la búsqueda y navegación de Peliculas y Series
router.get("/search", async (req, res, next) => {
	const { query, type, genre, year, sort, network, page } = req.query;
	const key = req.url;

	try {
		const movieResponse = await getCachedData(key, () =>
			GetMovieBySearch(query, type, genre, year, sort, network, page)
		);

		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});


// Ruta para obtener información detallada de un Pelicula/Serie
router.get("/info", async (req, res, next) => {
	const { id } = req.query;
	const [TYPE, ID] = id.split('|')
	const key = req.url;

	try {
		if (!TYPE) throw new Error('ID invalido o mal formateado');
		const movieResponse = await getCachedData(key, () =>
			GetMovieInfo(ID, TYPE)
		);

		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});

// Ruta para obtener los servidores de un episodio
router.get("/watch", async (req, res, next) => {
	const { id } = req.query;
	const [TYPE, ID, SERIE] = id.split('|');
	const [SEASON, EPISODE] = SERIE ? SERIE.split('x') : [false, false];
	const key = req.url;

	try {
		if (SERIE && (!SEASON || !EPISODE)) {
			throw new Error('Formato de serie inválido. Debe ser TEMPORADA x EPISODIO (ej: Type|IDSerie|2x5)')
		}

		const movieResponse = await getCachedData(key, () => 
			GetEpisodeServers(ID, TYPE, SEASON, EPISODE)
		);

		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});

export default router;
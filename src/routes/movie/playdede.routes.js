import express from "express";
import { GetMovieBySearch, GetMovieInfo, GetEpisodeServers } from '../../site/movies/playdede/PlayDede.js';

const router = express.Router();

router.get("/", (_req, res) => {
	res.send({
		intro: 'Welcome to the PlayDeDe.ws provider.',
		routes: ['/search', '/info', '/watch'],
		documentation: 'https://github.com/Freitez93/MultiScraping-api',
	});
});

//router.get("/search", GetMovieBySearch);
router.get("/search", async (req, res, next) => {
	const { query, type, order, page } = req.query;

	try {
		const movieResponse = await GetMovieBySearch(query, type, order, page);

		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});

//router.get("/info", GetMovieInfo);
router.get("/info", async (req, res, next) => {
	const { id } = req.query;
	const [TYPE, ID] = id.split('|')

	try {
		if (!TYPE) {
			throw new Error('ID invalido o mal formateado')
		}

		const movieResponse = await GetMovieInfo(ID, TYPE);
		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});

//router.get("/watch", GetEpisodeServers);
router.get("/watch", async (req, res, next) => {
	const { id } = req.query;
	const [ID, SERIE] = id.split('|');
	const [SEASON, EPISODE] = SERIE ? SERIE.split('x') : [false, false];

	try {
		if (SERIE && (!SEASON || !EPISODE)) {
			throw new Error('Formato de serie inválido. Debe ser TEMPORADA x EPISODIO (ej: IDSerie|2x5)')
		}

		const movieResponse = await GetEpisodeServers(ID, SEASON, EPISODE);
		res.status(200).json(movieResponse);
	} catch (error) {
		next(error);
	}
});

export default router;
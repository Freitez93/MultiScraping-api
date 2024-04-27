import express from "express";

import { GetMovieBySearch } from "../../../controllers/movies/oceanplay/search.js";
import { GetMovieInfo } from "../../../controllers/movies/oceanplay/info.js";
import { GetEpisodeServers } from "../../../controllers/movies/oceanplay/watch.js";


const router = express.Router();

router.get("/", (_req, res) => {
	res.send(`
		<center>
			<h1>API para OceanPlay.me 🎬🎉🎉</h1>
			<a href="https://github.com/Freitez93/MultiScraping-api">Documentacion - Aun no xD</span>
		</center>
	`);
});

router.get("/search", GetMovieBySearch);
router.get("/info/:tmdbID", GetMovieInfo);
router.get("/watch/:episodeID", GetEpisodeServers);

export default router;
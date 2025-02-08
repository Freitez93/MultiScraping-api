import express from "express";

import { GetMovieBySearch } from "../../../controllers/movies/playdede/search.js";
import { GetMovieInfo } from "../../../controllers/movies/playdede/info.js";
import { GetEpisodeServers } from "../../../controllers/movies/playdede/watch.js";


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
router.get("/info", GetMovieInfo);
router.get("/watch", GetEpisodeServers);

export default router;
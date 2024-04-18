import express from "express";

import { GetAnimeByFilter } from "../../../controllers/anime/animeflv/filter.js";
import { GetAnimeInfo } from "../../../controllers/anime/animeflv/info.js";
import { GetEpisodeServers } from "../../../controllers/anime/animeflv/watch.js";


const router = express.Router();

router.get("/", (_req, res) => {
	res.send(`
		<center>
			<h1>API para AnimeFLV.net 🎬🎉🎉</h1>
			<a href="https://github.com/Freitez93/MultiScraping-api">Documentacion - Aun no xD</span>
		</center>
	`);
});

router.get("/filter", GetAnimeByFilter);
router.get("/info/:nameID", GetAnimeInfo);
router.get("/watch/:episodeID", GetEpisodeServers);

export default router;

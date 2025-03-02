import { Router } from "express";
import { getCachedData } from "../../config/node_cache.js";
import { GetAnimeBySearch, GetAnimeInfo, GetEpisodeServers } from "../../site/anime/animeflv/AnimeFLV.js";

const router = Router();

// Landing page with API details
router.get("/", (_req, res) => {
	res.send(`
    <center>
      <h1>API para AnimeFLV.net 🎬🎉</h1>
      <div style="max-width: 800px; margin: 20px auto; text-align: left; padding: 20px;">
        <h2>Endpoints Disponibles:</h2>
        <h3>📺 Búsqueda y Navegación</h3>
        <ul>
          <li><code>GET /search</code> - Buscar anime por nombre</li>
          <li><code>GET /info/:nameID</code> - Obtener información detallada de un anime</li>
          <li><code>GET /watch/:episodeID</code> - Obtener servidores de un episodio</li>
        </ul>
        <h3>🔝 Listados Especiales</h3>
        <ul>
          <li><code>GET /popular</code> - Obtener lista de animes populares</li>
          <li><code>GET /latest</code> - Obtener los últimos animes añadidos</li>
        </ul>
        <div style="margin-top: 30px;">
          <h3>🔗 Enlaces Útiles:</h3>
          <a href="https://github.com/Freitez93/MultiScraping-api" style="text-decoration: none; color: #0366d6;">
            📚 Documentación Completa
          </a>
        </div>
      </div>
    </center>
  `);
});

// Rutas para la búsqueda y navegación de animes
router.get("/search", async (req, res, next) => {
	const { query, genre, status, type, order, page } = req.query;
		const key = req.originalUrl;

	try {
		const animeResponse = await getCachedData(key, () =>
			GetAnimeBySearch(query, genre, status, type, order, page)
		);
		res.status(200).json(animeResponse);
	} catch (error) {
		next(error);
	}
});

// Ruta para obtener información detallada de un anime
router.get("/info", async (req, res, next) => {
	const { id } = req.query;
	const key = id;

	try {
		const animeResponse = await getCachedData(key, () =>
			GetAnimeInfo(id)
		);
		res.status(200).json(animeResponse);
	} catch (error) {
		next(error);
	}
});

// Ruta para obtener los servidores de un episodio
router.get("/watch", async (req, res, next) => {
	const { id } = req.query;
	const key = id;

	try {
		const animeResponse = await getCachedData(key, () => GetEpisodeServers(id));
		res.status(200).json(animeResponse);
	} catch (error) {
		next(error);
	}
});

// Rutas especiales para obtener animes populares
router.get("/popular", async (req, res, next) => {
	const page = req.query.page || 1;
		const key = req.originalUrl;

	try {
		const animeResponse = await getCachedData(key, () =>
			GetAnimeBySearch(false, false, false, false, "rating", page)
		);
		res.status(200).json(animeResponse);
	} catch (error) {
		next(error);
	}
});

// Rutas especiales para obtener los últimos animes añadidos
router.get("/latest", async (req, res, next) => {
	const page = req.query.page || 1;
		const key = req.originalUrl;

	try {
		const animeResponse = await getCachedData(key, () =>
			GetAnimeBySearch(false, false, false, false, "added", page)
		);
		res.status(200).json(animeResponse);
	} catch (error) {
		next(error);
	}
});

export default router;
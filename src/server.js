import express from "express";
import helmet from "helmet";
import cors from "cors";
import limiter_request from "./config/rateLimit.js";
import errorHandler from "./config/errorHandler.js";
import { config } from "dotenv";


// Importacion de las rutas para los mangas
import readmRouter from "./routes/manga/readm.routes.js";
import mangafreakRouter from "./routes/manga/mangafreak.routes.js";
import mangamonksRouter from "./routes/manga/mangamonks.routes.js";

// Importacion de las rutas para los animes
import animeflvRouter from "./routes/anime/animeflv.routes.js";

// Importacion de las rutas para las Series/Peliculas
import playdedeRouter from "./routes/movie/playdede.routes.js";
import pelisplusRouter from "./routes/movie/pelisplus.routes.js";
import cuevanaRouter from "./routes/movie/cuevana_biz.routes.js";
import sololatinoRouter from "./routes/movie/sololatino.routes.js";

// Test
import { test } from './test.js'

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Activamos protección
app.use(helmet());
app.use(limiter_request);

// Informacion en consola de cada request
app.use((req, res, next) => {
	console.log(`[ ${new Date().toLocaleString()} ] ${req.method} ${req.url}`);
	next();
});

// Ruta raíz para la API
app.get("/", (_req, res) => {
	res.send({
		message: "MultiScraping-api está en funcionamiento 🎬🎉🎉",
		status: "success",
		code: 200,
		additional_info: {
			server: "https://MultiScraping-Api.vercel.app/",
			github: "https://github.com/Freitez93/MultiScraping-api",
		},
	});
});

// Agrupar las importaciones por categoría usando objetos
const animeRoutes = {
	animeflv: animeflvRouter
};

const movieRoutes = {
	cuevana: cuevanaRouter,
	pelisplus: pelisplusRouter,
	playdede: playdedeRouter,
	sololatino: sololatinoRouter
};

const mangaRoutes = {
	readm: readmRouter,
	mangafreak: mangafreakRouter,
	mangamonks: mangamonksRouter
};

// Función para registrar rutas dinámicamente
const registerRoutes = (basePath, routes) => {
	Object.entries(routes).forEach(([path, router]) => {
		app.use(`${basePath}/${path}`, router);
	});
};

// Registrar rutas de manera más limpia
registerRoutes('/manga', mangaRoutes);
registerRoutes('/anime', animeRoutes);
registerRoutes('/movie', movieRoutes);

// Ruta de test
app.get('/test', async (req, res) => {
	try {
		const result = await test();
		res.send(result);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
});

// Middleware para manejar errores
app.use(errorHandler);

/**
 * Starts the server and listens on the specified port.
 * @param {number} PORT - The port on which to listen for incoming requests.
 */
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto http://localhost:${PORT} listo para trabajar :)`));

import express from "express";
import cors from "cors";
import { config } from "dotenv";

//
import { videoExtractor } from "./extractors/index.js";


// Importacion de las runas para los mangas
import readmRouter from "./routes/manga/readm/index.js"
import mangafreakRouter from "./routes/manga/mangafreak/index.js"
import mangamonksRouter from "./routes/manga/mangamonks/index.js"

// Importacion de las runas para los animes
import animeflvRouter from "./routes/anime/animeflv/index.js"
import tioanimeRouter from "./routes/anime/tioanime/index.js"
import zoroRouter from "./routes/anime/zoro/index.js"

// Importacion de las runas para los movies
import movieRouter from "./routes/movie/playdede/index.js"

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

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

// Rutas para manga
app.use("/manga/readm", readmRouter);
app.use("/manga/mangafreak", mangafreakRouter);
app.use("/manga/mangamonks", mangamonksRouter);

// Rutas para anime
app.use("/anime/animeflv", animeflvRouter)
app.use("/anime/zoro", zoroRouter)
app.use("/anime/tioanime", tioanimeRouter)

// Rutas Para Movies
app.use("/movie/playdede", movieRouter)

// Ruta de Extractor
app.use("/extractor", async (_req, res) => {
	const link = _req.query.link
	console.log(link)
	try {
		const data = await videoExtractor(link)
		if (data){
			res.send(data)
		}
	} catch (error){
		console.error(error)
		res.send({
			message: error.message,
			status: error.status,
			code: error.code,
			additional_info: {
				available_servers: "DoodStream, FileMoon, StreamTape, StreamWish, MegaCloud, Okru",
			},
		});
	}
})

/**
 * Starts the server and listens on the specified port.
 * @param {number} PORT - The port on which to listen for incoming requests.
 */
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto http://localhost:${PORT} listo para trabajar :)`));

import axios from "axios";
import { MovieInfo } from "../../../models/movie.js";
import { GetInfoFromTMDB } from "../../../utils/tmdb.js";

export const GetMovieInfo = async (req, res) => {
	const baseUrl = "https://es.oceanplay.me"
	const baseApi = "https://oceanplay.me/oapi"

	try {
		const { tmdbID } = req.params;
		const { type } = req.query;

		// Obtener informacion de la Pelicula/Serie
		const { data } = await GetInfoFromTMDB(tmdbID, type)
		const title = data.title || data.name
		const otherTitle = data.original_title || data.original_name
		const releaseDate = data.release_date || data.first_air_date

		// Ingresamos la informacion a enviar.
		const movieInfo = new MovieInfo()
		movieInfo.title = title
		movieInfo.otherTitle = otherTitle
		movieInfo.image = `https://image.tmdb.org/t/p/w300${data.poster_path}`
		movieInfo.url = undefined
		movieInfo.description = data.overview
		movieInfo.type = type === 'movie' ? 'Pelicula' : 'Serie'
		movieInfo.status = data.status
		movieInfo.releaseDate = releaseDate

		// obtenemos los generos
		data.genres.map(item => {
			movieInfo.genres.push(item.name);
		});

		// obtenemos los episodios
		const episodes = await getEpisodeLink(title, type, releaseDate)
		if (type === 'movie') {
			movieInfo.addMovie({
				name: title,
				url: episodes.embed_url_tmdb,
				id: `/movie/oceanplay/watch/${tmdbID}`
			})
		} else {
			for (var index in episodes) {
				if (episodes[index].episodes){
					const seasonNumber = parseInt(index)+1
					const season = {
						season_title: data.seasons[seasonNumber].name,
						season_number: seasonNumber,
						season_overview: data.seasons[seasonNumber].overview,
						episodes: []
					}
					episodes[index].episodes.map(item => {
						const embeds = item.embed_url_tmdb || item.embed_url_anime
						const baseID = embeds.split('/embeds/')[1].split("/")

						// actualizamos el total de episodios
						movieInfo.totalEpisodes++

						season.episodes.push({
							name: item.episode_title,
							url: embeds,
							id: `/movie/oceanplay/watch/${baseID[0]}?season=${baseID[1]}&episode=${baseID[2]}`
						})
					})
					movieInfo.addSeason(season)
				}
			}
		}
		return res.status(200).json(movieInfo);
	} catch (error) {
		console.error(error)
		return res.status(500).json("Error " + error.message);
	}
};

const getEpisodeLink = async (title, type, year) => {
	const typeSlug = type === 'movie' ? 'pelicula' : 'serie';
	const yearSlug = year ? year.split("-")[0] : '';
	const titleSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

	let oapiSlug = `https://oceanplay.me/oapi/`
	if (typeSlug === 'serie') {
		oapiSlug += `${typeSlug}/${titleSlug}`
	} else {
		oapiSlug += `${typeSlug}/${titleSlug}-${yearSlug}`
	}

	const  { data } = await axios.get(oapiSlug)
	return data
}
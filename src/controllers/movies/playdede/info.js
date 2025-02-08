import axios from "axios";
import { load } from "cheerio";
import { MovieInfo } from "../../../models/movie.js";

export const GetMovieInfo = async (req, res) => {
	const baseUrl = "https://www1.playdede.ws/";
	const completeUrl = new URL(req.query.id, baseUrl).href

	try {
		const { data } = await axios.get(completeUrl)
		const $ = load(data);

		const type = completeUrl.includes('serie') ? 'Serie' : 'Movie'
		const cover = $('img[itemprop="image"]').attr('src')

		// Obtener informacion de la Pelicula/Serie
		const movieInfo = new MovieInfo()
		movieInfo.title = $('meta[property="og:image:alt"]').attr('content')
		movieInfo.image = `https://image.tmdb.org/t/p/w300/${cover.split('/').pop()}`
		movieInfo.url = undefined
		movieInfo.description = $('meta[name="description"]').attr('content')
		movieInfo.type = type
		movieInfo.status = $('.sgeneros .date').last().text().replace('Estado:', '').trim();
		movieInfo.releaseDate = $('.sgeneros .date').first().text().trim();

		// obtenemos los generos
		$('.sgeneros a[rel="tag"]').each((i, elem) => {
			movieInfo.genres.push($(elem).text().trim());
		});

		// Extraer episodios si es una serie
		if (type === 'Serie') {
			movieInfo.totalEpisodes = 0
			$('.sidebar_serie #seasons .se-c').each((i, el) => {
				const seasonNum = $(el).attr('data-season')
				const seasonEpisodes = [];
				$(el).find('.episodios li').each((j, ep) => {
					const episodeImage = $(ep).find('img').attr('src');
					seasonEpisodes.push({
						episodeNumber: $(ep).find('.numerando').text().trim(),
						episodeUrl: $(ep).find('a').attr('href'),
						episodeImage: `https://image.tmdb.org/t/p/w185/${episodeImage.split('/').pop()}`,
						episodeDate: $(ep).find('.date').text().trim()
					});
				});
				movieInfo.addSeason({
					seasonTitle: 'Temporada ' + seasonNum,
					seasonNumber: seasonNum,
					episodes: seasonEpisodes
				});
			});
		} else {
			movieInfo.addMovie({
				name: 'Movie',
				url: completeUrl,
				id: req.query.id
			})
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

	const { data } = await axios.get(oapiSlug)
	return data
}
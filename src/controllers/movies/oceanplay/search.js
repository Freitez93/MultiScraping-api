import axios from "axios";
import { load } from "cheerio";
import { MovieSearch } from "../../../models/movie.js";
import _ from "../../../utils/index.js"

export const GetMovieBySearch = async (req, res) => {
	const baseUrl = "https://es.oceanplay.me";
	const oapiUrl = "https://oceanplay.me"
	const newLink = `${oapiUrl}/${createParams(req)}`;

	try {
		const { data } = await axios.get(newLink);
		const $ = load(data);

		const pageActual = $('ul.pagination > li').last().text()
		const moviesSearch = new MovieSearch();
		moviesSearch.currentPage = req.query.page || 1;
		moviesSearch.hasNextPage = _.isTextEqual(pageActual, "Siguiente");

		$("tbody > tr").each((_i_, ele) => {
			const tmdbUrl = $(ele).find("a[target]").first().attr("href")
			const getID = tmdbUrl.replace("https://tmdb.org", "").split("/").pop()
			const type = $(ele).first().text().split("\n")[1] === "Película" ? "movie" : "tv"

			moviesSearch.addResults({
				id: `${getID}?type=${type}`,
				title: $(ele).find(".title").text(),
				url: `${baseUrl}/embeds/${getID}`,
				image: $(ele).find("a").first().attr("href"),
				type: $(ele).first().text().split("\n")[1]
			})
		})
		return res.status(200).json(moviesSearch);
	} catch (error){
		return res.status(500).json("Error " + error.message);
	}
}

const createParams = req => {
	const title = req.query.title;
	const sort = req.query.sort;
	const page = req.query.page || 1;

	if (title){
		return `explorar/buscar/${title}?page=${page}`
	} else if (sort){
		return `explorar/${sortFix(sort)}?page=${page}`
	} else {
		return `explorar?page=${page}`
	}
}

const sortFix = sort => {
	const sorting = {
		"movie": "peliculas",
		"tv": "series",
		"anime": "anime",
		"doramas": "doramas",
		"updates": "estrenos"
	}
	for (const key of Object.keys(sorting)) {
		const hasTrue = sort.includes(key);
		if (hasTrue) {
			return sorting[key];
		}
	}
}
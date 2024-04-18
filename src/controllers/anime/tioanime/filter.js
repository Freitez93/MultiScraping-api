import axios from "axios";
import { load } from "cheerio";

import { AnimeSearch } from "../../../models/anime.js";

export const GetAnimeByFilter = async (req, res) => {
	const baseUrl = "https://tioanime.com"

	try {
		const { q, type, genero, status, sort, page } = req.query;
		const response = await axios.get(`${baseUrl}/directorio`, {
			params: {
				q: q,
				type: type,
				genero: genero,
				status: status,
				sort: sort || "recent",
				page: page || 1
			}
		});
		const $ = load(response.data);

		const animeFilter = new AnimeSearch()
		const lastPage = $('ul.pagination > li > a[rel!="next"]').last().text()
		animeFilter.addNavigate({
			currentPage: parseInt(page || 1),
            hasNextPage: parseInt(page || 1) < parseInt(lastPage),
            totalPages: parseInt(lastPage)
		})

		//Obtenemos los animes
		$("ul.animes > li").each((_i, ele) => {
			const animeApi = $(ele).find("a").attr("href").replace("/anime/", "/anime/tioanime/info/")
			animeFilter.addResults({
				id: animeApi,
                title: $(ele).find("h3.title").text().trim(),
                url: `${baseUrl + $(ele).find("a").attr("href")}`,
                image: `${baseUrl + $(ele).find("img").attr("src")}`,
                type: $(ele).find("span.Type").first().text(),
			})
		});

		const retro = new AnimeSearch()
		console.log(retro)
		return res.status(200).json(animeFilter);
	} catch (error) {
		console.log(error)
		return res.status(500).json("Error " + error.message);
	}
};

import axios from "axios";
import { load } from "cheerio";

import { AnimeInfo } from "../../../models/anime.js";
export const GetAnimeInfo = async (req, res) => {
	const baseUrl = "https://hianime.to";
	try {
		const { nameID } = req.params;
		const response = await axios.get(`${baseUrl}/${nameID}`);
		const $ = load(response.data);

		// obtenemos informacion adicional
		const aniscInfo = await _aniscInfo(response.data);

		// Obtener informacion del anime
		const animeInfo = new AnimeInfo();
		animeInfo.title = $("h2.film-name").text().trim();
		animeInfo.image = $("img.film-poster-img").attr("src");
		animeInfo.type = $(".tick span.item").first().text();
		animeInfo.description = $("div.film-description div.text").text().trim();
		animeInfo.season = aniscInfo.Premiered?.split(" ")[0];
		animeInfo.releaseDate = aniscInfo.Aired;
		animeInfo.url = response.config.url;
		animeInfo.status = aniscInfo.Status;
		animeInfo.otherTitle = aniscInfo.Japanese;

		// obtenemos los generos del anime
		$("div.item.item-list a").each((_i_, e) => {
			animeInfo.genres.push($(e).attr("title"));
		});

		// obtenemos cronologia si es que hay
		$("div.os-list a").each((_i_, e) => {
			animeInfo.chronology.push({
				id: $(e).attr("href"),
				title: $(e).attr("title"),
				isActive: $(e).attr("href").includes(nameID),
			});
		});

		// obtenemos la lista de episodios
		const { data } = await axios.get(
			`${baseUrl}/ajax/v2/episode/list/${nameID.split("-").pop()}`
		);
		const $$ = load(data.html);
		$$("a.ssl-item.ep-item").each((_i_, e) => {
			animeInfo.episodes.push({
				id: $$(e).attr("href").replace("/watch/", "/anime/zoro/watch/"),
				title: $$(e).attr("title"),
				number: parseInt(_i_) + 1,
				url: `${baseUrl + $$(e).attr("href")}`,
			});
		});

		// actualizamos tl total de episodios del anime
		animeInfo.totalEpisodes = animeInfo.episodes.length;

		return res.status(200).json(animeInfo);
	} catch (error) {
		console.log(error);
		return res.status(500).json("Error " + error.message);
	}
};

async function _aniscInfo(element) {
	const $ = load(element);
	const result = [];
	$("div.item.item-title").each((_i, e) => {
		const key = $(e).find("span.item-head").text();
		switch (key) {
			case "Japanese:":
				result.Japanese = $(e).find("span.name").text();
				break;
			case "Aired:":
				result.Aired = $(e).find("span.name").text();
				break;
			case "Premiered:":
				result.Premiered = $(e).find("span.name").text();
				break;
			case "Duration:":
				result.Duration = $(e).find("span.name").text();
				break;
			case "Status:":
				result.Status = $(e).find("span.name").text();
				break;
			case "Studios:":
				result.Studios = $(e).find("a").text();
				break;
			case "Producers:":
				result.Producers = [];
				$(e).find("span.name")
					.each((_, el) => {
						result.Producers.push($(el).text().trim());
					});
				break;
			default:
		}
	});
	return result;
}

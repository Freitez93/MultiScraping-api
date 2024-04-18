import axios from "axios";
import { load } from "cheerio";

import { AnimeInfo } from "../../../models/anime.js";
import _ from "../../../utils/index.js"

export const GetAnimeInfo = async (req, res) => {
	const baseUrl = "https://tioanime.com"

    try {
        const { nameID } = req.params;
        const response = await axios.get(`${baseUrl}/anime/${nameID}`);
        const $ = load(response.data);

        // Obtener informacion del anime
        const animeDate = new AnimeInfo()
        animeDate.title = _.unEscape($("h1.title").text())
        animeDate.image = `${baseUrl + $("div.thumb img").attr("src")}`
        animeDate.url = response.config.url
        animeDate.description = _.unEscape($("p.sinopsis").text().trim())
        animeDate.type = $("span.anime-type-peli").first().text()
        animeDate.status = $("a.status").text()
        animeDate.releaseDate = $("span.year").first().text()

        // obtenemos los nombres alternativos
        $("p.original-title").each((_i_, element) =>{
            animeDate.otherName.push($(element).text().trim());
        })

        // obtenemos la cronologia
        $("article.anime").each((_i, e) => {
            animeDate.chronology.push({
                name: _.unEscape($(e).find("img").attr("alt")),
                url: `${baseUrl + $(e).find("a").attr("href")}`,
                id: $(e).find("a").attr("href").replace("/anime/", "/anime/tioanime/info/"),
            })
        });

        // obtenemos los generos
        $("p.genres span").each((_i, e) => {
            const gen = $(e).text();
            animeDate.genres.push(gen.trim());
        });

        // obtenemos los episodios
        const countEpisodes = JSON.parse(response.data.match(/var episodes = (\[.+\]);/)?.[1])
        const datesEpisodes = JSON.parse(response.data.match(/var episodes_details = (\[.+\]);/)?.[1])
        animeDate.totalEpisodes = countEpisodes.length
        countEpisodes.map(_i_ => {
            const watchID = `${nameID}-${_i_}`;
            animeDate.episodes.push({
                name: `Episodio ${_i_}`,
                url: `${baseUrl}/ver/${watchID}`,
                id: `/anime/tioanime/watch/${watchID}`,
                date: datesEpisodes ? datesEpisodes[_i_] : undefined
            })
        });
        return res.status(200).json(animeDate);
    } catch (error) {
        return res.status(500).json("Error " + error.message);
    }
};

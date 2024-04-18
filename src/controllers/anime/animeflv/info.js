import axios from "axios";
import { load } from "cheerio";

import { AnimeInfo } from "../../../models/anime.js";
import _ from "../../../utils/index.js"

export const GetAnimeInfo = async (req, res) => {
    const baseUrl = "https://animeflv.net"
    try {
        const { nameID } = req.params;
        const response = await axios.get(`${baseUrl}/anime/${nameID}`);
        const $ = load(response.data);

        // Obtener informacion del anime
        const countEpisodes = JSON.parse(response.data.match(/var episodes = (\[.+\]);/)?.[1])
        const animeInfo = new AnimeInfo()
        animeInfo.title = _.unEscape($("h1.Title").text())
        animeInfo.image = `${baseUrl + $("div.AnimeCover img").attr("src")}`
        animeInfo.url = response.config.url
        animeInfo.description = _.unEscape($("div.Description").text().trim())
        animeInfo.type = $("span.Type").text()
        animeInfo.status = $("p.AnmStts span").text().trim()

        // obtenemos los nombres alternativos
        $("span.TxtAlt").each((_i, e) => {
            animeInfo.otherTitle.push($(e).text().trim());
        });

        // obtenemos la cronologia
        $("ul.ListAnmRel li a").each((_i, e) => {
            animeInfo.chronology.push({
                name: $(e).text().trim(),
                url: `${baseUrl + $(e).attr("href")}`,
                id: $(e).attr("href").split("/").pop(),
            })
        });

        // obtenemos los generos
        $("nav.Nvgnrs a").each((_i, e) => {
            const gen = $(e).text();
            animeInfo.genres.push(gen.trim());
        });

        // obtenemos los episodios
        animeInfo.totalEpisodes = countEpisodes.length
        countEpisodes.map(_i_ => {
            const watchID = `${nameID}-${_i_[0]}`;
            animeInfo.episodes.push({
                name: `Episodio ${_i_[0]}`,
                url: `${baseUrl}/ver/${watchID}`,
                id: `/anime/flv/watch/${watchID}`,
            })
        });
        return res.status(200).json(animeInfo);
    } catch (error) {
        return res.status(500).json("Error " + error.message);
    }
};

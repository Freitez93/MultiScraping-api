import axios from "axios";
import { load } from "cheerio";

import { AnimeSearch } from "../../../models/anime.js";
import { isValidGenre, isValidStatus, isValidType, isValidOrder } from "./animeFLV_.js";

export const GetAnimeByFilter = async (req, res) => {
    const baseUrl = "https://animeflv.net"
    try {
        const { title, genre, status, type, order, page } = req.query;
        const response = await axios.get(`${baseUrl}/browse`, {
            params: {
                q: title,
                genre: await isValidGenre(genre),
                status: await isValidStatus(status),
                type: await isValidType(type),
                order: await isValidOrder(order),
                page: page
            }
        });
        const $ = load(response.data);

        const lasPage = $( "ul.pagination > li > a[rel!='Next']").last().text()
        const animeFLV = new AnimeSearch()

        animeFLV.currentPage = parseInt(page||1)
        animeFLV.hasNextPage = parseInt(page||1) < parseInt(lasPage)
        animeFLV.totalPages = parseInt(lasPage) || 0

        //Obtenemos los animes
        $("ul.ListAnimes li").each((_i, e) => {
            animeFLV.results.push({
                id: $(e).find("a").attr("href").split("/").pop(),
                title: $(e).find("h3").text().trim(),
                url: `${baseUrl + $(e).find("a").attr("href")}`,
                image: $(e).find("img").attr("src"),
                type: $(e).find("span.Type").first().text().trim(),
            })
        });
        return res.status(200).json(animeFLV);
    } catch (error) {
        return res.status(500).json("Error " + error.message);
    }
};

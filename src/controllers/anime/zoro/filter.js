import axios from "axios";
import { load } from "cheerio";

export const GetAnimeByFilter = async (req, res) => {
    const baseUrl = "https://HiAnime.to"
    try {
        const { 
            type, status, rated, score, season, language, sort, genres, page
        } = req.query;

        const response = await axios.get(`${baseUrl}/filter`, {
            searchParams: {
                type: type,
                status: status,
                rated: rated,
                score: score,
                season: season,
                language: language,
                sort: sort || "default",
                genres: genres,
                page: page || 1
            },
        })
        const $ = load(response.data);

        const lastPage = $(".page-item a").last().attr("href")?.split("=").pop()
        const data = {
            currentPage: page || 1,
            hasNextPage: parseInt(lastPage) ? true : false,
            totalPages: parseInt(lastPage) || 0,
            results: [],
        };

        //Obtenemos los animes
        $("div.film_list-wrap > div").each((_i, e) => {
            const animeID = $(e).find("a").attr("href").split("/").pop()
            data.results.push({
                id: animeID,
                title: $(e).find("a.dynamic-name").text(),
                url: `${baseUrl}/${animeID}?ref=search`,
                image: $(e).find("img").attr("data-src"),
                type: $(e).find("span.fdi-item").first().text()
            })
        });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json("Error " + error.message);
    }
}
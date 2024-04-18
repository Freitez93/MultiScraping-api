import axios from "axios";
import { load } from "cheerio";

export const GetAnimeInfo = async (req, res) => {
    const baseUrl = "https://hianime.to"
    try {
        const { nameID } = req.params;
        const response = await axios.get(`${baseUrl}/${nameID}`)
        const $ = load(response.data);

        // obtenemos informacion adicional
        const aniscInfo = await _aniscInfo(response.data)

        // Obtener informacion del anime
        const data = {
            id: nameID,
            title: $("h2.film-name").text().trim(),
            image: $("img.film-poster-img").attr("src"),
            description: $("div.film-description div.text").text().trim(),
            type: $(".tick span.item").first().text(),
            url: response.requestUrl.href,
            status: aniscInfo.Status,
            releaseDate: `${aniscInfo.Premiered?.split(" ")[0]} - ${aniscInfo.Aired?.split(" to ")[0]}`,
            otherName: aniscInfo.Japanese,
            genres: aniscInfo.Genres,
            chronology: [],
            totalEpisodes: 0,
            episodes: [],
        };

        // obtenemos cronologia si es que hay
        $("div.os-list a").each((_i_, e) => {
            data.chronology.push({
                id: $(e).attr("href"),
                title: $(e).attr("title"),
                isActive: $(e).attr("href").includes(nameID)
            })
        })

        // obtenemos la lista de episodios
        const newResponse = await axios.get(`${baseUrl}/ajax/v2/episode/list/${nameID.split("-").pop()}`)
        const $$ = load(JSON.parse(newResponse.data).html)
        $$("a.ssl-item.ep-item").each((_i_, e) => {
            data.episodes.push({
                id: $$(e).attr("href").replace("/watch/", "/anime/zoro/watch/"),
                title: $$(e).attr("title"),
                number: parseInt(_i_) + 1,
                url: `${baseUrl + $$(e).attr("href")}`
            })
        });

        // actualizamos tl total de episodios del anime
        data.totalEpisodes = data.episodes.length;

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json("Error " + error.message);
    }
}

async function _aniscInfo(element){
    const $ = load(element)
    const result = []
    $("div.item.item-title").each((_i, e) => {
        const key = $(e).find("span.item-head").text()
        switch(key){
            case "Japanese:":
                result.Japanese = $(e).find("span.name").text()
                break;
            case "Aired:":
                result.Aired = $(e).find("span.name").text()
                break;
            case "Premiered:":
                result.Premiered = $(e).find("span.name").text()
                break;
            case "Duration:":
                result.Duration = $(e).find("span.name").text()
                break;
            case "Status:":
                result.Status = $(e).find("span.name").text()
                break;
            case "Genres:":
                result.Genres = []
                $(e).find("span.name").each((_, el) => {
                    result.Genres.push($(el).text().trim())
                })
                break;
            case "Studios:":
                result.Studios = $(e).find("a").text()
                break;
            case "Producers:":
                result.Producers = []
                $(e).find("span.name").each((_, el) => {
                    result.Producers.push($(el).text().trim())
                })
                break;
            default:
        }
    });
    return result
}
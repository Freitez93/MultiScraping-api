import axios from "axios";
import { load } from "cheerio";

import { rabbitStream, streamTape } from "../../../extractors/index.js";

export const GetEpisodeServers = async (req, res) => {
    const baseUrl = "https://HiAnime.to"
    const nameServer = ["hd-1", "hd-2", "streamtape"].filter(name => req.query.server === name)?.pop() || false
    const langServer = ["sub", "dub"].filter(name => req.query.type === name)?.pop() || "sub"
    const { nameID } = req.params;
    const episodeID = req.query.ep

    try {
        const response = await axios.get(`${baseUrl}/ajax/v2/episode/servers?episodeId=${episodeID}`);
        const document = JSON.parse(response.data).html
        const $ = load(document);
        const title = nameID.split('-').slice(0, -1).map(palabra => {
            return palabra[0].toUpperCase() + palabra.slice(1);
        }).join(" ")

        const data = {
            name: `${title}`,
            url: `/anime/zoro/watch/${nameID}?ep=${episodeID}`,
            number: parseInt(document.match(/watching <b>(.+?)</)?.[1].split(" ").pop()),
            sources: []
        }

        // obtenemos los id de servidores
        $("div.ps__-list div.item").each(async (_i, e) => {
            data.sources.push({
                server: $(e).find("a").text(),
                type: $(e).attr("data-type"),
                url: $(e).attr("data-id")
            })
        })

        if (nameServer) {
            const selectOne = data.sources.filter(name => isEqual(name.server, nameServer))
            const selectTwo = selectOne.filter(name => isEqual(name.type, langServer))
            const winner = selectTwo[0] ? selectTwo[0] : selectOne[0]
            let link, _extract;

            switch (winner.server) {
                case "HD-1":
                case "HD-2":
                    link = await extractVideoLink(winner.url)
                    _extract = await rabbitStream(link)
                    data.url = link
                    data.sources = _extract.sources
                    data.subtitles = _extract.subtitles
                    break;
                case "StreamTape":
                    link = await extractVideoLink(winner.url)
                    _extract = await streamTape(link)
                    data.url = link
                    data.sources = _extract.sources
                    break;
                default:
                    data.sources = winner
            }
        } else {
            console.log(data)
        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Error " + error.message);
    }
};

const extractVideoLink = async (id) => {
    const response = await axios.get(`https://HiAnime.to/ajax/v2/episode/sources?id=${id}`);
    const link = JSON.parse(response.data).link;
    return link
}

function isEqual(one = String, two = String){
    return one.toLocaleLowerCase() === two.toLocaleLowerCase()
}
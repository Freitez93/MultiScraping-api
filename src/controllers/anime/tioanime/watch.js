import axios from "axios";
import { load } from "cheerio";

import { okru, streamTape } from "../../../extractors/index.js";
import _ from "../../../utils/index.js"


//const nameServer = ["Mega", "YourUpload", "StreamSB", "Amus", "Okru", "Mepu", "Netu"]
export const GetEpisodeServers = async (req, res) => {
    const baseUrl = "https://tioanime.com"
    const { episodeID } = req.params;
    const nameServer = req.query.server || false
    const langServer = ["sub", "lat"].filter(name => req.query.type === name).pop() || "sub"

    try {
        const response = await axios.get(`${baseUrl}/ver/${episodeID}`);
        const $ = load(response.data);

        const getLinks = JSON.parse(response.data.match(/var videos = (\[.+?\]);/)?.[1]);
        const data = {
            name: _.unEscape($("h1.anime-title").text()),
            url: `/anime/tioanime/watch/${episodeID}`,
            number: parseInt(episodeID.split("-").pop()),
            sources: []
        };

        // obtenemos los links del video
        for (const index of getLinks) {
            data.sources.push({
                server: index[0],
                url: index[1]
            })
        }

        if (nameServer) {
            const hasServer = data.sources.filter(item => _.isTextEqual(item.server, nameServer))
            const winner = hasServer.pop() || data.sources.pop()

            switch (true) {
                case _.isTextEqual(winner.server, "okru"):
                    const extractor = await okru(winner.url)
                    data.url = winner.url
                    data.sources = extractor.sources
                    break;
                default:
                    data.sources = winner
            }
        } else {

        }
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Error " + error.message);
    }
};
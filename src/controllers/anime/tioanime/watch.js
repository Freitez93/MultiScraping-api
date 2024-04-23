import axios from "axios";
import { load } from "cheerio";

import _ from "../../../utils/index.js"
import { videoExtractor } from "../../../extractors/index.js";
import { AnimeSources } from "../../../models/anime.js";


//const nameServer = ["Mega", "YourUpload", "StreamSB", "Amus", "Okru", "Mepu", "Netu"]
export const GetEpisodeServers = async (req, res) => {
    const baseUrl = "https://tioanime.com"
    const { episodeID } = req.params;
    const nameServer = req.query.server || false

    try {
        const response = await axios.get(`${baseUrl}/ver/${episodeID}`);
        const $ = load(response.data);

        const getLinks = JSON.parse(response.data.match(/var videos = (\[.+?\]);/)?.[1]);
        const animeWatch = new AnimeSources();
        animeWatch.title = $("h1.anime-title").text();
        animeWatch.url = response.config.url;
        animeWatch.number = parseInt(episodeID.split("-").pop());

        // obtenemos los links del video
        for (const index of getLinks) {
            animeWatch.addServer({
                server: index[0],
                type: index[3] === 0 ? "sub" : "lat",
                url: index[1]
            })
        }

        if (nameServer) {
            const hasServer = animeWatch.sources.filter(item => _.isTextEqual(item.server, nameServer))
            const winner = hasServer.pop() || animeWatch.sources.pop()
            const extractor = await videoExtractor(winner.url)
            if (extractor){
                animeWatch.url = winner.url
                animeWatch.sources = extractor.sources
                animeWatch.subtitle = extractor.subtitles.length > 0 ? extractor.subtitles : undefined
            }
        } else {

        }
        return res.status(200).json(animeWatch);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Error " + error.message);
    }
};
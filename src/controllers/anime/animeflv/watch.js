import axios from "axios";
import { load } from "cheerio";
import { videoExtractor } from "../../../extractors/index.js";
import { AnimeSources } from "../../../models/anime.js";
import _ from "../../../utils/index.js"

//const nameServer = ["mega", "sw", "yourupload", "okru", "maru", "fembed", "netu", "stape"]
export const GetEpisodeServers = async (req, res) => {
    const baseUrl = "https://animeflv.net"

    const { episodeID } = req.params;
    const nameServer = req.query.server || false
    const langServer = _.isLangValid(req.query?.type || "sub")

    try {
        const response = await axios.get(`${baseUrl}/ver/${episodeID}`);
        const $ = load(response.data);

        const getLinks = JSON.parse(response.data.match(/var videos = ({.+?);/)?.[1]);
        const animeWatch = new AnimeSources();
        animeWatch.title = $(".CapiTop").children("h1").text().trim();
        animeWatch.url = response.config.url;
        animeWatch.number = parseInt(episodeID.split("-").pop());

        // obtenemos los links del video
        for (const index in getLinks){
            getLinks[index].map(item => {
                animeWatch.addServer({
                    server: item.title,
                    type: index,
                    url: item.code
                })
            })
        }

        if (nameServer) {
            const subOrDub = animeWatch.sources.filter(item => _.isTextEqual(item.type, langServer))
            const hasServer = subOrDub.filter(item => _.isTextEqual(item.server, nameServer))
            const winner = hasServer.pop() || subOrDub.pop()
            const isExtrac = await videoExtractor(winner.url)
            animeWatch.url = winner.url
            animeWatch.sources = isExtrac.sources
        } else {

        }
        return res.status(200).json(animeWatch);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Error " + error.message);
    }
};
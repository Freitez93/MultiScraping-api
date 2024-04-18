import axios from "axios";
import { load } from "cheerio";
import { okru } from "../../../extractors/index.js";


//const nameServer = ["mega", "sw", "yourupload", "okru", "maru", "fembed", "netu", "stape"]
export const GetEpisodeServers = async (req, res) => {
    const baseUrl = "https://animeflv.net"

    const { episodeID } = req.params;
    const nameServer = req.query.server || false
    const langServer = ["sub", "lat"].filter(name => req.query.type === name).pop() || "sub"

    try {
        const response = await axios.get(`${baseUrl}/ver/${episodeID}`);
        const $ = load(response.data);

        const getLinks = JSON.parse(response.body.match(/var videos = ({.+?);/)?.[1]);
        const data = {
			name: $(".CapiTop").children("h1").text().trim(),
			url: `/anime/flv/watch/${episodeID}`,
			number: parseInt(episodeID.split("-").pop()),
			sources: []
        };

        // obtenemos los links del video
        for (const index in getLinks){
            getLinks[index].map(item => {
                data.sources.push({
                    server: item.title,
                    type: index,
                    url: item.code
                })
            })
        }

        if (nameServer) {
            const subOrDub = data.sources.filter(item => isEqual(item.type, langServer))
            const hasServer = subOrDub.filter(item => isEqual(item.server, nameServer))
            const winner = hasServer.pop() || subOrDub.pop()

            switch (true){
                case isEqual(winner.server, "okru"):
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


function isEqual(one = String, two = String){
    return one.toLocaleLowerCase() === two.toLocaleLowerCase()
}
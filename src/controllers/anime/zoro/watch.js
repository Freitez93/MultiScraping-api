import axios from "axios";
import { load } from "cheerio";

import _ from "../../../utils/index.js"
import { AnimeSources } from "../../../models/anime.js";
import { videoExtractor } from "../../../extractors/index.js";

export const GetEpisodeServers = async (req, res) => {
	const baseUrl = "https://HiAnime.to"
	const nameServer = ["hd-1", "hd-2", "streamtape"].find(name => req.query.server === name) || "HD-1"
	const langServer = ["sub", "dub"].filter(name => req.query.type === name)?.pop() || "sub"
	const { nameID } = req.params;
	const episodeID = req.query.ep

	try {
		const response = await axios.get(`${baseUrl}/ajax/v2/episode/servers?episodeId=${episodeID}`);
		const $ = load(response.data.html);

		const animeWatch = new AnimeSources();
		animeWatch.title = _.toTitleCase(nameID)
		animeWatch.url = `${baseUrl}/watch/${nameID}?ep=${episodeID}`;
		animeWatch.number = parseInt(response.data.html.match(/watching <b>(.+?)</)?.[1].split(" ").pop());

		// obtenemos los id de servidores
		$("div.ps__-list div.item").each(async (_i, e) => {
			animeWatch.addServer({
				server: $(e).find("a").text(),
				type: $(e).attr("data-type"),
				url: $(e).attr("data-id")
			})
		})

		if (nameServer) {
			const selectOne = animeWatch.sources.filter(name => _.isTextEqual(name.server, nameServer))
			const selectTwo = selectOne.filter(name => _.isTextEqual(name.type, langServer))
			const winner = selectTwo[0] ? selectTwo[0] : selectOne[0]
			const link = await extractVideoLink(winner.url)

			await videoExtractor(link).then(
				extract => {
					animeWatch.url = link
					animeWatch.sources = extract.sources
					animeWatch.subtitles = extract.subtitles ?? undefined
				}, 
				error => {
					console.log(error)
				})
		} else {
			console.log(animeWatch)
		}
		return res.status(200).json(animeWatch);
	} catch (error) {
		console.log(error)
		return res.status(500).json("Error " + error.message);
	}
};

const extractVideoLink = async (id) => {
	const { data } = await axios.get(`https://HiAnime.to/ajax/v2/episode/sources?id=${id}`);
	return data.link
}

function isEqual(one = String, two = String) {
	return one.toLocaleLowerCase() === two.toLocaleLowerCase()
}
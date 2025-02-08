import axios from "axios"
import util from "../utils/index.js"
import { load } from "cheerio"

class StreamsitoResolver {
	baseUrl = "https://streamsito.com/video/";
	streamsitoResponse = {
		server: "Streamsito",
		url: "",
		sources: [],
		subtitles: undefined
	}

	async extract(id) {
		this.streamsitoResponse.url = `${this.baseUrl}${id}`;

		const { data } = await axios.get(this.streamsitoResponse.url);
		const $ = load(data);

		const options = {
			'Latino': $('.OD_1 > li[data-lang="0"]'),
			'Español': $('.OD_1 > li[data-lang="1"]'),
			'Subtitulado': $('.OD_1 > li[data-lang="2"]')
		};

		for (const [language, elements] of Object.entries(options)) {
			if (elements.length <= 1) continue;

			elements.each((_index, element) => {
				const onclick = $(element).attr('onclick');
				const videoUrl = util.substringBetween(onclick, "go_to_playerVast('", "',");

				if (videoUrl.includes("embedsito.net")) return;

				const server = new URL(videoUrl).host.split(".")[0];
				this.streamsitoResponse.sources.push({
					server: util.toTitleCase(server),
					link: videoUrl,
					language,
					type: 'Video'
				});
			});
		}

		return this.streamsitoResponse;
	}
}

export default StreamsitoResolver;
import axios from "axios"
import { load } from "cheerio"
import util from "../utils/index.js"

class StreamsitoResolver {
	baseUrl = "https://streamsito.com/video"

	async extract(link) {
		const SSLink = link.startsWith("tt") ? `${this.baseUrl}/${link}` : link
		const response = await axios.get(SSLink);
		const $ = load(response.data);

		const options = {
			lat: $('.OD_1 > li[data-lang="0"]'),
			esp: $('.OD_1 > li[data-lang="1"]'),
			sub: $('.OD_1 > li[data-lang="2"]')
		};

		const selectOptionUrl = [];
		for (const [lang, option] of Object.entries(options)) {
			if (option.length > 1) {
				const optionLang = util.isLangValid(lang);
				option.each((_index, element) => {
					const onclick = $(element).attr('onclick');
					const atrrUrl = util.substringBetween(onclick, "go_to_playerVast('", "',");
					if (!atrrUrl.includes("embedsito.net")) {
						const server = new URL(atrrUrl).host.split(".")[0];
						selectOptionUrl.push({
							server: util.toTitleCase(server),
							lang: optionLang,
							url: atrrUrl
						});
					}
				});
			}
		}

		return selectOptionUrl;
	}
}

export default StreamsitoResolver;
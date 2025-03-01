import axios from "axios"
import tools from "../tools/index.js"
import { load } from "cheerio"

class StreamsitoResolver {
	constructor() {
		this.DOMAIN = 'https://streamsito.com'; // URL base para la API de Embed69
		this.IMDb_ID = ''
		this.embedResponse = {
			server: 'Streamsito',
			status: 'success',
			url: '',
			sources: [],
			subtitles: undefined
		};
		this.languageFix = {
			'LAT': 'Latino',
			'ESP': 'Español',
			'SUB': 'Subtitulado'
		};
	}


	async getSources(ID, season, episode) {
		if (ID.startsWith('tt')) {
			this.IMDb_ID = season && episode
				? `${ID}-${season}x${Number(episode) < 10 ? `0${Number(episode)}` : episode}`
				: ID;
		} else {
			throw new Error("No se pudo obtener el ID de IMDb");
		}

		this.embedResponse.url = `${this.DOMAIN}/video/${this.IMDb_ID}`;
		try {
			const { data } = await axios.get(this.embedResponse.url);
			const $ = load(data);

			// virifica si la pagina tiene un error
			const pageError = $('#ErrorWin div[role="texterror"]')?.text().includes("error");

			if (pageError) {
				this.embedResponse.status = "error";
				return this.embedResponse;
			}

			const options = {
				'Latino': $('.OD_1 > li[data-lang="0"]'),
				'Español': $('.OD_1 > li[data-lang="1"]'),
				'Subtitulado': $('.OD_1 > li[data-lang="2"]')
			};

			for (const [language, elements] of Object.entries(options)) {
				if (elements.length === 0) continue;

				elements.each((_index, element) => {
					const onclick = $(element).attr('onclick');
					const videoUrl = tools.substringBetween(onclick, "go_to_playerVast('", "',");

					if (videoUrl.includes("embedsito.net")) return;

					const server = new URL(videoUrl).host.split(".")[0];
					this.embedResponse.sources.push({
						server: tools.toTitleCase(server),
						link: videoUrl,
						language,
						type: 'Video'
					});
				});
			}

			return this.embedResponse;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default StreamsitoResolver;
import axios from "axios";
import { load } from "cheerio";
import { decryptAESLink } from "../tools/index.js";

class embed69Resolver {

	constructor() {
		this.DOMAIN = 'https://embed69.org'; // URL base para la API de Embed69
		this.IMDb_ID = ''
		this.DECRYPT_KEY = 'Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE'; // Clave de descifrado para los enlaces
		this.embedResponse = {
			server: 'Embed69',
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

		this.embedResponse.url = `${this.DOMAIN}/f/${this.IMDb_ID}`;
		try {
			const { data } = await axios.get(this.embedResponse.url);
			const $ = load(data);

			const script = $("script:contains('function decryptLink')").html();
			if (!script) {
				this.embedResponse.status = "error";
				return this.embedResponse;
			}
			// Extraer la parte del texto que contiene el array
			const dataLinkString = script.match(/const dataLink = (\[.*?\];)/s)[1];

			// Eliminar el punto y coma final y convertir a objeto
			const dataLink = JSON.parse(dataLinkString.slice(0, -1));

			dataLink.map((link) => {
				const language = link['video_language'];
				const sortVideos = link['sortedEmbeds'];
				const sources = sortVideos.map((video) => {
					return {
						server: video['servername'],
						link: decryptAESLink(video['link'], this.DECRYPT_KEY),
						language: this.languageFix[language] || 'Unknown',
						type: video['type']
					};
				});
				this.embedResponse.sources.push(...sources);
			});

			return this.embedResponse;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}

export default embed69Resolver;
import axios from "axios";
import { load } from "cheerio";

class OkruExtractor {
	baseUrl = "https://ok.ru";
	okruResponse = {
		server: "Okru",
		url: "",
		sources: [],
	}
	qualityMap = {
		ultra: "2160p", quad: "1440p", full: "1080p", hd: "720p", sd: "480p",
		low: "360p", lowest: "240p", mobile: "144p",
	}
	async extract(link) {
		this.baseUrl = new URL(link);
		this.okruResponse.url = this.baseUrl.href;

		try {
			const { data } = await axios.get(this.baseUrl.href);
			const $ = load(data);

			const dataOptions = $("div[data-options]").attr("data-options")
			if (!dataOptions)
				throw new Error("Eliminado de la plataforma");

			const metadata = JSON.parse(dataOptions).flashvars.metadata;
			const objects = JSON.parse(JSON.stringify(JSON.parse(metadata)))

			for (const element of objects.videos) {
				this.okruResponse.sources.push({
					quality: this.qualityMap[element.name] || element.name,
					url: element.url,
					isM3U8: true,
				})
			}

			this.okruResponse.sources.push({
				quality: 'default',
				url: objects.hlsManifestUrl,
				isM3U8: objects.hlsManifestUrl.includes('.m3u8')
			})
			return this.okruResponse
		} catch (error) {
			console.error(error)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default OkruExtractor
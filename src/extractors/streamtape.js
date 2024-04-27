import axios from "axios";
import { load } from "cheerio";

class StreamTape {
	baseUrl = "https://streamtape.com";
	tapeResponse = {
		server: "StreamTape",
		url: "",
		sources: [],
		subtitles: undefined
	}
	async extract(link) {
		this.baseUrl = new URL(link);
		this.tapeResponse.url = link.replace("/e/", "/v/");

		try {
			const { data } = await axios.get(this.baseUrl.href);
			const $ = load(data);
			const [fh, sh] = $.html()
				.match(/robotlink'\).innerHTML = (.*)'/)[1]
				.split("+ ('")
				.map(str => str.trim());
			const url = `https:${fh.replace(/\'/g, '')}${sh.substring(3)}`;
			this.tapeResponse.sources.push({
				quality: "default",
				url: url,
				isM3U8: url.includes(".m3u8"),
			});
			return this.tapeResponse;
		} catch (error) {
			console.error(error.message)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default StreamTape
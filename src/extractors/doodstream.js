import axios from "axios";
import { load } from "cheerio";

import _ from "../utils/index.js"

class DoodStreamExtractor {
	baseUrl = "https://doodstream.com/e/";
	doodResponse = {
		server: "DoodStream",
		url: "",
		sources: [],
		subtitles: undefined
	}
	async extract(link) {
		this.doodResponse.url = `https://doodstream.com/d/${link.split("/").pop()}`;

		try {
			const videoUrl = new URL(link.replace("/d/", "/e/"));
			const { data } = await axios.get(videoUrl.href);
			const $ = load(data);

			const script = $("script:contains('makePlay()')").html();
			const hasSub = eval(`[ ${script.match(/;dsplayer.+({src.+?),!0/)?.[1]} ]`);
			const passMD5 = script.match(/pass_md5\/(.+?)',/)?.[1];
			const token = passMD5.split("/")?.[0];
			const code = videoUrl.href.split("/e/")[0];

			const response = await axios.get(`${code}/pass_md5/${passMD5}`, {
				headers: {
					Referer: videoUrl.href
				}
			});

			const m3u8 = this.makePlay(token, response.data);
			this.doodResponse.sources.push({
				quality: "default",
				url: m3u8,
				isM3U8: m3u8.includes(".m3u8")
			})
			if (hasSub[0] !== undefined) {
				this.doodResponse.subtitles = hasSub.map(({ src, label, kind }) => ({
					url: `https:${src}`,
					lang: label,
					kind
				}));
			}
			return this.doodResponse;
		} catch (error) {
			console.error(error)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}

	makePlay(token, start) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < 10; i++) {
			const randomIndex = Math.floor(Math.random() * charactersLength);
			result += characters[randomIndex];
		}
		return `${start}${result}?token=${token}&expiry=${Date.now()}`;
	}
}

export default DoodStreamExtractor
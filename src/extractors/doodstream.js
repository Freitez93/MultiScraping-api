import axios from "axios";
import { load } from "cheerio";

import _ from "../utils/index.js"

/** Recupera las fuentes de video del enlace proporcionado.
 * @param {string} link - Enlace al video.
 * @return {Array} Un array con los videos.
*/
export const doodStream = async (link) => {
	const fixUrl = link.replace("/d/", "/e/")

	try {
		const videoUrl = new URL(fixUrl);
		const { data } = await axios.get(videoUrl.href);
		const $ = load(data);

		const script = $("script:contains('makePlay()')").html();
		const hasSub = eval(`[ ${script.match(/;dsplayer.+({src.+?),!0/)?.[1]} ]`);
		const passMD5 = script.match(/pass_md5\/(.+?)',/)?.[1];
		const token = passMD5.split("/")?.[0];
		const code = videoUrl.href.split("/e/")[0];

		const response = await axios.get(`${code}/pass_md5/${passMD5}`, {
			headers: {
				Referer: link
			}
		});

		const m3u8 = makePlay(token, response.data);
		const returnData = {
			sources: [{
				quality: "default",
				url: m3u8,
				isM3U8: m3u8.includes(".m3u8")
			}],
			subtitles: (hasSub.length > 0) ? hasSub.map(item => ({
				url: `https:${item.src}`,
				lang: item.label,
				kind: item.kind
			})) : undefined
		}
		return returnData;
	} catch (err) {
		throw new Error(`Failed to retrieve video: ${err.message}`);
	}
};

function makePlay(token, start) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;

	for (let i = 0; i < 10; i++) {
		const randomIndex = Math.floor(Math.random() * charactersLength);
		result += characters[randomIndex];
	}
	return `${start}${result}?token=${token}&expiry=${Date.now()}`;
}

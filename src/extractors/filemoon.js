import axios from "axios";

/** Recupera las fuentes de video del enlace proporcionado.
 * @param {string} link - El enlace al video.
 * @return {Array} Un array con los videos.
*/
class FileMoonExtractor {
	baseUrl = "https://filemoon.com/";
	moonResponse = {
		server: "FileMoon",
		url: "",
		sources: [],
		subtitles: undefined
	}
	async extract(link) {
		this.moonResponse.url = link;

		try {
			const videoUrl = new URL(link);
			const { data } = await axios.get(videoUrl.href);

			const _evalMatch = data.match(/\(function.+setup.+\)/)?.[0];
			const _m3u8Match = _evalMatch
				? eval(_evalMatch).match(/file:"(https:.+?)"/)?.[1]
				: data.match(/file:"(https:.+?)"/)?.[1];

			this.moonResponse.sources.push({
				quality: "default",
				url: _m3u8Match,
				isM3U8: _m3u8Match.includes(".m3u8")
			});
			return this.moonResponse;
		} catch (error) {
			console.error(error)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default FileMoonExtractor
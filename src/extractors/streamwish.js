import axios from "axios";
import { load } from "cheerio";

class StreamWishExtractor {
	baseUrl = "https://streamwish.com";
	wishResponse = {
		server: "StreamWish",
		url: "",
		sources: [],
		subtitles: undefined
	}
	async extract(link) {
		this.wishResponse.url = link.replace("/e/", "/d/");
		this.baseUrl = new URL(link);

		try {
			const { data } = await axios.get(this.baseUrl.href);

			const _evalMatch = data.match(/\(function.+setup.+\)/)?.[0];
			const _m3u8Match = _evalMatch
				? eval(_evalMatch).match(/file:"(https:.+?)"/)?.[1]
				: data.match(/file:"(https:.+?)"/)?.[1];

			this.wishResponse.sources.push({
				quality: 'default',
				url: _m3u8Match,
				isM3U8: _m3u8Match.includes('.m3u8'),
			});

			const m3u8Content = await axios.get(_m3u8Match, {
				headers: {
					Referer: this.baseUrl.href,
				}
			});

			if (m3u8Content.data.includes('EXTM3U')) {
				const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
				for (const video of videoList ?? []) {
					if (!video.includes('m3u8')) continue;

					const url = _m3u8Match.split('master.m3u8')[0] + video.split('\n')[1];
					const quality = video.split('RESOLUTION=')[1].split(',')[0].split('x')[1];

					this.wishResponse.sources.push({
						url: url,
						quality: `${quality}p`,
						isM3U8: url.includes('.m3u8'),
					});
				}
			}

			return this.wishResponse
		} catch (error) {
			console.error(error)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default StreamWishExtractor;
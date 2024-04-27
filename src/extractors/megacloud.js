import axios from "axios";
import CryptoJS from "crypto-js";

class RabbitStreamExtractor {
	baseUrl = "https://megacloud.tv";
	cloudResponse = {
		server: "MegaCloud",
		url: "",
		sources: [],
		subtitles: undefined
	}

	// Depende del servidor se selecciona un source y player
	select = 0
	source = ["/embed-2/ajax/e-1/getSources?id=", "/ajax/embed-6-v2/getSources?id="]
	player = ["/js/player/a/prod/e1-player.min.js?v=1699711377", "/js/player/prod/e6-player-v2.min.js",]

	async extract(link, quality = false) {
		this.baseUrl = new URL(link);
		this.select = link.includes("megacloud") ? 0 : 1;
		this.cloudResponse.url = this.baseUrl.href;
		this.cloudResponse.server = this.select === 0 ? "MegaCloud" : "Rapid-Cloud";
		this.source = `${this.baseUrl.origin}${this.source[this.select]}`;
		this.player = `${this.baseUrl.origin}${this.player[this.select]}`;
		const codeEmbed = this.baseUrl.pathname.split("/").pop();

		try {
			const { data } = await axios.get(`${this.source + codeEmbed}`, {
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					Referer: this.baseUrl.href,
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
				},
			})

			// agregamos los subtitulos al cloudResponse
			this.cloudResponse.subtitles = data.tracks;

			// Verificamos si el sources esta encriptado en tal caso lo descripcionamos.
			const isEncrypted = data.encrypted;
			const keys = isEncrypted ? await this.getKey(data.sources) : null;
			const base = keys ? CryptoJS.AES.decrypt(keys[1], keys[0]).toString(CryptoJS.enc.Utf8) : null;
			const m3u8 = JSON.parse(base)[0].file || data.sources[0];

			if (m3u8.includes(".m3u8") && quality) {
				const { data } = await axios.get(m3u8);
				const parse = data.match(/#EXT-X-STREAM.+\n.+m3u8/g);
				for (const element of parse) {
					this.cloudResponse.sources.push({
						quality: element.match(/RESOLUTION=(.+?),/)[1].split("x")[1],
						url: m3u8.replace("master.m3u8", "") + element.match(/index-.+?m3u8/)[0],
						isM3U8: true
					});
				}
			}

			this.cloudResponse.sources.push({
				quality: "default",
				url: m3u8,
				isM3U8: m3u8.includes(".m3u8")
			});
			return this.cloudResponse;
		} catch (error) {
			console.error(error)
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}

	async getKey(cipher) {
		const res = (await axios.get(this.player)).data.toString();
		const filt = res.match(/case 0x\d{1,2}:\w{1,2}=\w{1,2},\w{1,2}=\w{1,2}/g).map((element) => {
			return element.match(/=(\w{1,2})/g).map((element) => {
				return element.substring(1);
			});
		});
		const filt_area = res.match(/\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},\w{1,2}=0x\w{1,2},.+?;/)[0];
		const objectFromVars = filt_area.split(",").reduce((acc, pair) => {
			const [key, value] = pair.split("=");
			acc[key] = parseInt(value);
			return acc;
		}, {});
		const P = filt.length;
		let C = cipher;
		let I = "",
			C9 = C,
			CC = 0x0;

		for (let CW = 0x0; CW < P; CW++) {
			let CR, CJ;
			switch (CW) {
				case 0x0:
					CR = objectFromVars[filt[0][0]];
					CJ = objectFromVars[filt[0][1]];
					break;
				case 0x1:
					CR = objectFromVars[filt[1][0]];
					CJ = objectFromVars[filt[1][1]];
					break;
				case 0x2:
					CR = objectFromVars[filt[2][0]];
					CJ = objectFromVars[filt[2][1]];
					break;
				case 0x3:
					CR = objectFromVars[filt[3][0]];
					CJ = objectFromVars[filt[3][1]];
					break;
				case 0x4:
					CR = objectFromVars[filt[4][0]];
					CJ = objectFromVars[filt[4][1]];
					break;
				case 0x5:
					CR = objectFromVars[filt[5][0]];
					CJ = objectFromVars[filt[5][1]];
					break;
				case 0x6:
					CR = objectFromVars[filt[6][0]];
					CJ = objectFromVars[filt[6][1]];
					break;
				case 0x7:
					CR = objectFromVars[filt[7][0]];
					CJ = objectFromVars[filt[7][1]];
					break;
				case 0x8:
					CR = objectFromVars[filt[8][0]];
					CJ = objectFromVars[filt[8][1]];
			}
			var CI = CR + CC,
				CN = CI + CJ;
			I += C.slice(CI, CN);
			C9 = C9.replace(C.substring(CI, CN), "");
			CC += CJ;
		}
		return [I, C9];
	}
}

export default RabbitStreamExtractor;
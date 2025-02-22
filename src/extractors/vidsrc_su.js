import axios from "axios";

class vidSrcSuResolver {
	constructor() {
		this.DOMAIN = 'https://vidsrc.su'; // URL base para la API de Embed69
		this.PATHNAME = ''
		this.embedResponse = {
			server: 'VidSrc.su',
			status: 'success',
			url: '',
			sources: [],
			subtitles: []
		};
	}

	async getSources(ID, season, episode) {
		if (ID) {
			this.PATHNAME = season && episode
				? `tv/{${ID}}/${season}/${episode}`
				: `movie/${ID}`;
		} else {
			throw new Error("No se pudo obtener el ID de TMDB");
		}

		this.embedResponse.url = `${this.DOMAIN}/embed/${this.PATHNAME}`;
		try {
			// Realizar la solicitud GET
			const response = await axios.get(this.embedResponse.url);

			// Verificar si la respuesta es exitosa
			if (response.status === 200) {
				this.embedResponse.status = 'success';

				// Extraer fuentes del código fuente
				const htmlContent = response.data;

				// Utilizar expresiones regulares para extraer los datos de las fuentes
				const sourcesRegex = /{ label: '(.*?)', url: '(.*?)' },/g;
				for (const match of htmlContent.matchAll(sourcesRegex)) {
					const [, label, url] = match;
					if (url !== '') {
						this.embedResponse.sources.push({
							server: label || 'VidSrc.su',	// Nombre del servidor
							link: decodeURIComponent(url),	// URL que contenga el .m3u8
							language: 'English',			// Idioma por defecto
							type: 'hls'						// Tipo por defecto
						});
					}
				}

				// Extraer subtítulos del código fuente
				const subtitlesRegex = /{"id":.*?"url":"(.*?)".*?"display":"(.*?)"/g;
				for (const match of htmlContent.matchAll(subtitlesRegex)) {
					const [, url, display] = match;
					this.embedResponse.subtitles.push({
						file: url,			// Archivo srt
						label: display,		// Nombre completo del idioma
						kind: 'captions'	// Tipo
					});
				}
			}

			return this.embedResponse;
		} catch (error) {
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
}

export default vidSrcSuResolver;
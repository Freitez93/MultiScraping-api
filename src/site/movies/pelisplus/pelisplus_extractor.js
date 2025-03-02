import Embed69 from '../../../extractors/embed69.js';
import Streamsito from '../../../extractors/streamsito.js';

export const embedExtractor = async serverUrl => {
	const { IMDb_ID, SEASON, EPISODE } = splitLink(serverUrl);

	if (IMDb_ID) {
		const embed69 = new Embed69();
		const streamsito = new Streamsito();

		try {
			let data = ''
			if (serverUrl.indexOf('embed69') !== -1) {
				data = await embed69.getSources(IMDb_ID, SEASON, EPISODE);
			} else {
				data = await streamsito.getSources(IMDb_ID, SEASON, EPISODE);
			}

			return data;
		} catch (error) {
			console.trace(error);
			throw (`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
};

function splitLink(serverUrl) {
	// Eliminar la barra final si existe
	serverUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;

	if (!serverUrl.includes('/tt')) {
		throw ("No se pudo obtener el ID de IMDb");
	}

	const splited = serverUrl.split('/').pop().split('-');
	const IMDb_ID = splited[0];
	const [season, episode] = (splited[1] || '').split('x');

	return {
		IMDb_ID,
		SEASON: season ?? false,
		EPISODE: episode ?? false
	};
}
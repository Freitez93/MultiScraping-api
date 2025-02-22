import Embed69 from '../../../extractors/embed69.js';
import Streamsito from '../../../extractors/streamsito.js';

export const embedExtractor = async serverUrl => {
	let IMDb_ID, SEASON, EPISODE;

	try {
		({ IMDb_ID, SEASON, EPISODE } = splitLink(serverUrl));
	} catch (error) {
		console.error(error.message);
		throw new Error("No se pudo obtener el ID de IMDb");
	}

	if (IMDb_ID) {
		const embed69 = new Embed69();
		const streamsito = new Streamsito();

		try {
			// Extrae los datos de los servidores
			const data = await Promise.all([
				embed69.getSources(IMDb_ID, SEASON, EPISODE),
				streamsito.getSources(IMDb_ID, SEASON, EPISODE)
			]);

			return data.filter(array => array.status !== "error");
		} catch (error) {
			console.error(error);
			throw new Error(`No se pudo recuperar el vídeo: ${error.message}`);
		}
	}
};

function splitLink(serverUrl) {
	// Eliminar la barra final si existe
	serverUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;

	if (!serverUrl.includes('/tt')) {
		throw new Error("No se pudo obtener el ID de IMDb");
	}

	const splited = serverUrl.split('/').pop().split('-');
	const IMDb_ID = splited[0];
	const [season, episode] = (splited[1] || '').split('x').map(Number);

	return {
		IMDb_ID,
		SEASON: isNaN(season) ? false : season,
		EPISODE: isNaN(episode) ? false : episode
	};
}
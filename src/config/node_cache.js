import NodeCache from "node-cache";

const myCache = new NodeCache({
	stdTTL: 300, // Tiempo de vida por defecto en segundos (300s = 5 min)
	checkperiod: 360, // Intervalo para auto-eliminar entradas expiradas (360s = 6 min)
});

/**
 * Utility function to handle caching.
 * @param {string} key - The cache key.
 * @param {Function} fetchCallback - The async function to fetch data if not cached.
 * @returns {Promise<any>} - The data from cache or fetched by callback.
 */

export const getCachedData = async (key, fetchCallback) => {
	const isCache = myCache.has(key);

	if (isCache) {
		console.log( `[ ${new Date().toLocaleString()} ] Cache found for key: ${key}` )
		return myCache.get(key);
	} else {
		const data = await fetchCallback();
		myCache.set(key, data);
		return data;
	}
};

myCache.on( "expired", function( key, value ){
	console.log( `[ ${new Date().toLocaleString()} ] Cache expired for key: ${key}` )
});
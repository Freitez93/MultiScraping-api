import axios from "axios"


export const test = async (input) => {
	const test = await axios.get("https://vidcdn.co/movies/iframe/d04xdksxRG5GTXZpRTRpM2lmQmxHTi9OY0FyWTFVTTUrOFpBaTkvQmhwb1RXRnh1enYvWVpzeEpDS289", {
		headers: {
			'Referer': 'https://flixhq.ws/',
			'Origin': 'https://flixhq.ws/',
		}
	}).then(function (response) {
		console.log(response.config)
		return response.data
		//document.getElementById('nav-episode-select').innerHTML = response.data;
	}).catch(function (error) {
		console.error("Error:", error);
	});
	return test.data
}
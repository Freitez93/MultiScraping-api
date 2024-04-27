import axios from "axios";

export const GetInfoFromTMDB = async (tmdbID, type="movie") => {
	const apiKey = "fb7bb23f03b6994dafc674c074d01761";
	const options = {
		method: 'GET',
		url: `https://api.themoviedb.org/3/${type}/${tmdbID}`,
		params: {
			language: 'es-419'
		},
		headers: {
		  accept: 'application/json',
		  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NmE1MTBmMzA1MTYxY2RjYzVhZDMxNzhlZDkyY2QwNiIsInN1YiI6IjY1YWJlOWRmMWYzZTYwMDBhNGZlYjYwZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ou38fZMw0pGioWnXiIZjq6tA2jKBlahN977JzTotgyw'
		}
	  };

	try {
		const response = await axios.request(options)
		return response
	} catch (error) {
		throw new Error("Error al realizar la solicitud a la API de TMDB: ", error);
	}
}
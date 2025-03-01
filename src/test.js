import axios from 'axios';

const httpRequest = async (url, method, params = null, referer = null) => {
	const config = {
		method: method.toLowerCase(),
		url: url,
		headers: {
			'User-Agent': 'Mozilla/5.0',
		},
	};

	// Agregar referer si existe
	if (referer) {
		config.headers.Referer = referer;
	}

	// Manejar parámetros según el método
	if (method.toUpperCase() === 'GET' && params) {
		config.params = params;
	} else if (method.toUpperCase() === 'POST' && params) {
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		config.data = new URLSearchParams(params).toString();
	}

	try {
		const response = await axios(config);
		console.log(response.data)
		return response.data;
	} catch (error) {
		throw error;
	}
}


export const test = async () => {
	const url = 'https://sololatino.net/wp-admin/admin-ajax.php';
	const method = 'POST';
	const params = { 
		action: 'doo_player_ajax',
		post: '13370',
		nume: '2',
		type: 'tv'
	};
	const referer = 'https://sololatino.net/';

	const data = await httpRequest(url, method, params, referer);
	return data;
}
import { detect, unpack } from "unpacker";


//Spanish Providers - TypeScript version
export default {
	//================== API functions ==================

	//===================================================
	/**
	 * Compara 2 cadenas de texto para verificar si son iguales
	 * @param one TEXTO
	 * @param two texto
	 * @returns Boolean si son iguales tanto mayusculas y minisculas
	 */
	isTextEqual: (one, two) => {
		//console.log(`[isTextEqual] Comparando: ${one} con ${two}`)
		return one.toLowerCase() === two.toLowerCase()
	},

	/**
	 * Devuelve una subcadena del texto dado después de la primera aparición de la palabra especificada.
	 * @param {string} cadena - La cadena de entrada.
	 * @param {string} palabra - La palabra a buscar.
	 * @return {string} La subcadena después de la primera aparición de la palabra, o una cadena vacía si la palabra no se encuentra.
	 */
	substringAfter: (str, start) => {
		const indicePalabra = str.indexOf(start);
		if (indicePalabra !== -1) {
			return str.substring(indicePalabra + start.length);
		} else {
			return "";
		}
	},

	/**
	 * Devuelve una subcadena del texto dado hasta la primera aparición de la palabra especificada.
	 *
	 * @param {string} cadena - La cadena de entrada.
	 * @param {string} palabra - La palabra a buscar.
	 * @return {string} La subcadena antes de la primera aparición de la palabra, o una cadena vacía si no se encuentra la palabra.
	 */
	substringBefore: (str, end) => {
		const indicePalabra = str.indexOf(end);
		if (indicePalabra !== -1) {
			return str.substring(0, indicePalabra);
		} else {
			return "";
		}
	},

	substringBetween: (str, start, end) => {
		if (typeof str !== "string"){
			throw Error('La cadena de entrada debe ser de tipo string');
		} else if (typeof start !== "string" && typeof end !== "string"){
			throw Error('La cadena de start y end deben ser de tipo string');
		};

		const startIndex = str.indexOf(start) + start.length;
		const endIndex = str.indexOf(end, startIndex);
		return str.substring(startIndex, endIndex);
	},

	isEmpty: value => {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else if (typeof value === 'object' && value !== null) {
			return Object.keys(value).length === 0;
		} else if (typeof value === 'string' || typeof value === 'number') {
			return value === '';
		} else {
			return !value;
		}
	},

	/**
	 * Arregla los nombres de titulos
	 * @param texto nombre-de-titulo
	 * @returns Nombre De Titulo
	 */
	toTitleCase: texto => {
		const returnText = texto.replace(/-[\d]+$/, "").replace(/-/g, " ")
		return returnText.replace(/\w\S*/g, (frase) => {
			return frase.charAt(0).toUpperCase() + frase.substr(1).toLowerCase();
		});
	},

	isLangValid: lang => {
		if (typeof lang === "string") {
			const isLang = {
				"sub": "Subtitulado",
				"lat": "Latino",
				"esp": "Español",
				"dub": "English"
			};
			for (const key of Object.keys(isLang)) {
				const hasTrue = lang.toLowerCase().includes(key);
				if (hasTrue) {
					return isLang[key];
				}
			}
		} else {
			throw new Error("El idioma debe ser de tipo string");
		}
		return lang; // devolvera el mismo valor si no se encuentra en la array
	},

	/**
	 * Arregla los textos con errores de Html
	 * @param texto Gintama&#39 ;
	 * @returns Gintama'
	 */
	unEscape: (texto) => {
		const entities = {
			'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
			'&#39;': "'", '&#039;': "'", '&ntilde;': "ñ", '&Ntilde;': "Ñ",
			'&aacute;': "á", '&eacute;': "é", '&iacute;': "í", '&oacute;': "ó",
			'&uacute;': "ú", '&Aacute;': "Á", '&Eacute;': "É", '&Iacute;': "Í",
			'&Oacute;': "Ó", '&Uacute;': "Ú", '&euro;': "€"
		}

		for (const [key, value] of Object.entries(entities)) {
			texto = texto.replace(new RegExp(key, 'g'), value);
		}
		return texto;
	},

	/**
	 *
	 * @param packedString in Base64
	 *
	 */

	UnPacked: (packedString) => {
		let valuePacked;

		if (typeof atob === "undefined") {
			valuePacked = Buffer.from(packedString, "base64").toString("binary");
		} else {
			valuePacked = atob(packedString);
		}
		console.log(unpack(valuePacked));
		return unpack(valuePacked);
	},

	getRandomString: (length = 10) => {
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var string = '';
		for (var i = 0; i < length; i++) {
			string += characters[Math.floor(Math.random() * characters.length)];
		}
		return string;
	}
};

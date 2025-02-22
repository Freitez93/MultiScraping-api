import { detect, unpack } from "unpacker";
import CryptoJS from "crypto-js";
import { config } from "dotenv";

config()

const encryptedKey = process.env.ENCRYPT_AES_KEY;

/**
 * Compara dos textos ignorando mayúsculas y minúsculas
 * @param {string} one - Primer texto
 * @param {string} two - Segundo texto
 * @returns {boolean} true si los textos son iguales
 */
export const isTextEqual = (one, two) => {
	return (one?.toLowerCase() ?? '') === (two?.toLowerCase() ?? '');
};

/**
 * Extrae el texto después de la primera aparición de una palabra
 * @param {string} str - Texto original
 * @param {string} start - Palabra a buscar
 * @returns {string} Texto extraído o cadena vacía si no se encuentra
 */
export const substringAfter = (str, start) => {
	const indicePalabra = str.indexOf(start);
	if (indicePalabra !== -1) {
		return str.substring(indicePalabra + start.length);
	} else {
		return "";
	}
};

/**
 * Extrae el texto antes de la primera aparición de una palabra
 * @param {string} str - Texto original
 * @param {string} end - Palabra a buscar
 * @returns {string} Texto extraído o cadena vacía si no se encuentra
 */
export const substringBefore = (str, end) => {
	const indicePalabra = str.indexOf(end);
	if (indicePalabra !== -1) {
		return str.substring(0, indicePalabra);
	} else {
		return "";
	}
};

/**
 * Extrae el texto entre dos palabras
 * @param {string} str - Texto original
 * @param {string} start - Palabra inicial
 * @param {string} end - Palabra final
 * @returns {string} Texto extraído o cadena vacía si no se encuentra
 */
export const substringBetween = (str, start, end) => {
	if (typeof str !== "string" || typeof start !== "string" || typeof end !== "string") {
		throw new Error('Todos los argumentos deben ser de tipo string');
	}

	const startIndex = str.indexOf(start);
	if (startIndex === -1) return '';

	const fromStart = startIndex + start.length;
	const endIndex = str.indexOf(end, fromStart);
	return endIndex === -1 ? '' : str.substring(fromStart, endIndex);
};

/**
 * Verifica si un valor está vacío
 * @param {*} value - Valor a verificar
 * @returns {boolean} true si el valor está vacío
 */
export const isEmpty = value => {
	if (value == null) return true;
	if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
	if (typeof value === 'object') return Object.keys(value).length === 0;
	return !value;
};

/**
 * Convierte un texto con guiones a formato título
 * @param {string} texto - Texto a convertir (ej: "nombre-de-titulo")
 * @returns {string} Texto en formato título (ej: "Nombre De Titulo")
 */
export const toTitleCase = texto => {
	const returnText = texto.replace(/-[\d]+$/, "").replace(/-/g, " ")
	return returnText.replace(/\w\S*/g, (frase) => {
		return frase.charAt(0).toUpperCase() + frase.substr(1).toLowerCase();
	});
};

/**
 * Valida y normaliza códigos de idioma
 */
export const isLangValid = (() => {
	const langMap = new Map([
		['sub', 'Subtitulado'],
		['lat', 'Latino'],
		['esp', 'Español'],
		['dub', 'English']
	]);

	return (lang) => {
		if (typeof lang !== "string") {
			throw new Error("El idioma debe ser de tipo string");
		}
		const langLower = lang.toLowerCase();
		for (const [key, value] of langMap) {
			if (langLower.includes(key)) return value;
		}
		return lang;
	};
})();

/**
 * unEscape: Reemplaza entidades HTML por sus caracteres correspondientes.
 * Recorre un conjunto de entidades usando expresiones regulares en caché y
 * devuelve la cadena modificada, eliminando espacios en blanco innecesarios.
 */
export const unEscape = (() => {
	const entities = {
		'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
		'&#39;': "'", '&#039;': "'", '&ntilde;': 'ñ', '&Ntilde;': 'Ñ',
		'&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó',
		'&uacute;': 'ú', '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í',
		'&Oacute;': 'Ó', '&Uacute;': 'Ú', '&euro;': '€'
	};

	const regexCache = {};

	return (texto) => {
		for (const [key, value] of Object.entries(entities)) {
			if (!regexCache[key]) {
				regexCache[key] = new RegExp(key, 'g');
			}
			texto = texto.replace(regexCache[key], value);
		}
		return texto.trim();
	};
})();

/**
 * Desempaqueta una cadena en Base64
 * @param {string} packedString - Cadena empaquetada en Base64
 * @returns {string} Cadena desempaquetada
 */
export const UnPacked = (packedString) => {
	let valuePacked;
	if (typeof atob === "undefined") {
		valuePacked = Buffer.from(packedString, "base64").toString("binary");
	} else {
		valuePacked = atob(packedString);
	}
	return unpack(valuePacked);
};

/**
 * Desencripta un enlace usando AES
 * @param {string} encryptedLink - Enlace encriptado
 * @param {string} key - Clave de desencriptación
 * @returns {string} Enlace desencriptado
 */
export const decryptAESLink = (encryptedLink, key=encryptedKey) => {
	const bytes = CryptoJS.AES.decrypt(encryptedLink, key);
	const decryptedLink = bytes.toString(CryptoJS.enc.Utf8);
	return decryptedLink;
};

/**
 * Encrypts a given link using AES encryption and encodes the result in Base64 format.
 *
 * @param {string} encryptedLink - The link to be encrypted.
 * @param {string} key - The secret key used for encryption.
 * @returns {string} The AES encrypted and Base64 encoded link.
 */
export const encryptAESLink = (decryptedLink, key=encryptedKey) => {
	const encryptedLink = CryptoJS.AES.encrypt(decryptedLink, key);
	return encryptedLink;
};

/**
 * Genera una cadena aleatoria segura
 * @param {number} length - Longitud de la cadena (default: 10)
 * @returns {string} Cadena aleatoria
 */
export const getRandomString = (length = 10) => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from(crypto.getRandomValues(new Uint32Array(length)))
		.map(x => characters[x % characters.length])
		.join('');
};

// Exportar todas las funciones como parte del objeto utils
const utils = {
	isTextEqual,
	substringAfter,
	substringBefore,
	substringBetween,
	isEmpty,
	toTitleCase,
	isLangValid,
	unEscape,
	UnPacked,
	decryptAESLink,
	getRandomString
};

export default utils;

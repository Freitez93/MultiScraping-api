import { detect, unpack } from "unpacker";

const provider = texto => {
    const hosts = {
        "Animeflv": "flv",
        "Tioanime": "tioanime",
        "Hianime": "zoro"
    }
    for (const [key, value] of Object.entries(hosts)) {
        if (texto.includes(key)) {
            return hosts[value]
        }
    }
    return false;
}

//Spanish Providers - TypeScript version
export default {
    //================== API functions ==================
    /**
     * Replaces the original URL with the API URL
     *
     * @param info
     * @param url
     * @returns
     */
    getEpisodeURL(url) {
        const baseUrl = new URL(url)
        return url.replace(`https://${baseUrl.hostname}/ver/`, `/anime/${provider(baseUrl.hostname)}/watch/`);
    },
    /**
     * Replaces the original URL with the API URL
     * @param info
     * @param url
     * @returns
     */
    getAnimeURL(url) {
        const baseUrl = new URL(url)
        return url.replace(
            `https://${baseUrl.hostname}/ver/`,
            `/anime/${provider(baseUrl.hostname)}/info/`,
        );
    },
    //===================================================
    /**
     * Compara 2 cadenas de texto para verificar si son iguales
     * @param one TEXTO
     * @param two texto
     * @returns Boolean si son iguales tanto mayusculas y minisculas
     */
    isTextEqual(one, two) {
        return one.toLowerCase() === two.toLowerCase()
    },

    /**
     * Returns true if argument is different from null and undefined
     * @param object
     * @returns
     */
    isUsableValue: function (value) {
        return value != null && value != undefined;
    },

    /**
     * Arregla los nombres de titulos
     * @param texto nombre-de-titulo
     * @returns Nombre De Titulo
     */
    toTitleCase: (texto) => {
        texto.replace("-", " ")
        return texto.replace(/\w\S*/g, (frase) => {
            return frase.charAt(0).toUpperCase() + frase.substr(1).toLowerCase();
        });
    },

    isLangValid: (lang) => {
        if (typeof lang === "string") {
            const isLang = {
                "sub": "Subtitulado",
                "lat": "Latino",
                "es": "Español",
                "dub": "English"
            };
            for (const key of Object.keys(isLang)) {
                const hasTrue = lang.toLowerCase().includes(key);
                if (hasTrue) {
                    return isLang[key];
                }
            }
        }
        return null; // devolvera el mismo valor si no se encuentra en la array
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
    }
};

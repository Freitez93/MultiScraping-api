import axios from "axios";
import CryptoJS from "crypto-js";
import { load } from "cheerio";

import _ from "../utils/index.js"

class embed69Resolver {
  // Ejemplo de URL: https://embed69.org/f/tt28093628-1x01
  baseUrl = "https://embed69.org/f/"; // URL base para la API de Embed69
  embedResponse = {
    server: "Embed69",
    url: undefined,
    sources: [],
    subtitles: undefined
  }
  async extract(id) {
    this.embedResponse.url = `${this.baseUrl}${id}`;
    this.languageFix = {
      'LAT': 'Latino',
      'ESP': 'Español',
      'SUB': 'Subtitulado'
    }

    try {
      const { data } = await axios.get(this.embedResponse.url);
      const $ = load(data);

      const script = $("script:contains('function decryptLink(encryptedLink)')").html();
      if (!script) {
        this.embedResponse.url = `Error: ${data.error}`;
        return this.embedResponse;
      }
      // Extraer la parte del texto que contiene el array
      const dataLinkString = script.match(/const dataLink = (\[.*?\];)/s)[1];

      // Eliminar el punto y coma final y convertir a objeto
      const dataLink = JSON.parse(dataLinkString.slice(0, -1));

      dataLink.map((link) => {
        const language = link['video_language'];
        const sortVideos = link['sortedEmbeds'];
        const sources = sortVideos.map((video) => {
          return {
            server: video['servername'],
            link: decryptLink(video['link']),
            language: this.languageFix[language] || 'Unknown',
            type: video['type']
          };
        });
        this.embedResponse.sources.push(...sources);
      });

      return this.embedResponse;
    } catch (error) {
      throw new Error(error.message);
    }

    function decryptLink(encryptedLink) {
      const bytes = CryptoJS.AES.decrypt(encryptedLink, 'Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE');
      const decryptedLink = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedLink;
    }
  }
}

export default embed69Resolver;
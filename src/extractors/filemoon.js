import axios from "axios";
import { load } from "cheerio";

/** Recupera las fuentes de video del enlace proporcionado.
 * @param {string} link - El enlace al video.
 * @return {Array} Un array con los videos.
*/
export const fileMoon = async (link) => {
    try {
        const videoUrl = new URL(link);
        const { data } = await axios.get(videoUrl.href);
        const $ = load(data);

        const _evalMatch = data.match(/\(function.+setup.+\)/)?.[0];
        const _m3u8Match = _evalMatch
            ? eval(_evalMatch).match(/file:"(https:.+?)"/)?.[1]
            : data.match(/file:"(https:.+?)"/)?.[1];

        const sources = []
        sources.push({
            quality: "default",
            url: _m3u8Match,
            isM3U8: _m3u8Match.includes(".m3u8")
        });
        return sources;
    } catch (err) {
        throw new Error(`Failed to retrieve video: ${err.message}`);
    }
};
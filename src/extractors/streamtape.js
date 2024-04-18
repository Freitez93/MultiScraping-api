import axios from "axios";
import { load } from "cheerio";

export const streamTape = async (link) => {
    const videoUrl = new URL(link);
    try {
        const { data } = await axios.get(videoUrl.href);
        const $ = load(data);
        const [fh, sh] = $
            .html()
            .match(/robotlink'\).innerHTML = (.*)'/)[1]
            .split("+ ('")
            .map(str => str.trim());
        const url = `https:${fh.replace(/\'/g,'')}${sh.substring(3)}`;
        const result = { sources: [] };
        result.sources.push({
            quality: "default",
            url: url,
            isM3U8: url.includes(".m3u8"),
        });
        return result;
    } catch (err) {
        throw new Error(`Failed to retrieve video: ${err.message}`);
    }
};
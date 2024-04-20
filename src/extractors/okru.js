import axios from "axios";
import { load } from "cheerio";

export const okru = async link => {
    try {
        const { data } = await axios.get(link);
        const $ = load(data);
    
        const dataOptions = $("div[data-options]").attr("data-options")
        const metadata = JSON.parse(dataOptions).flashvars.metadata;
        const objects = JSON.parse(JSON.stringify(JSON.parse(metadata)))
    
        const qualityMap = {
            ultra: '2160', quad: '1440', full: '1080',
            hd: '720', sd: '480', low: '360', lowest: '240', mobile: '144'
        };
    
        const result = { sources: [], subtitles: [] }
        for (const element of objects.videos) {
            result.sources.push({
                quality: qualityMap[element.name] || element.name,
                url: element.url,
                isM3U8: true,
            })
        }
    
        result.sources.push({
            quality: 'auto',
            url: objects.hlsManifestUrl,
            isM3U8: objects.hlsManifestUrl.includes('.m3u8')
        })
        return result
    } catch(error){
        console.log(error)
        throw new Error("Video no econtrado o eliminado de Okru");
    }
}
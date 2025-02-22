import axios from "axios";
import { load } from "cheerio";


const baseUrl = "https://flixhq.ws/";
const getSource = async (id) => {
    try {
        const { data } = await axios.get(baseUrl + id);
        const $ = load(data);

        const subUrl = data.match(/const\s*url\s*=\s*['"](.*?)['"]/)[1];
        const plUrl = data.match(/const\s*pl_url\s*=\s*['"](.*?)['"]/)[1];

        const [captions, providers] = await Promise.all([
            axios.get(subUrl).then(res => res.data),
            axios.get(plUrl, { responseType: 'text' }).then(res => res.data)
        ]);

        const _provider = providers.match(/https?:\/\/[^\s'"]+/g)[1];
        const url = await axios.get(_provider, {
            headers: {
                Referer: baseUrl
            }
        }).then(res => {
            return res.data.match(/['"](http.*m3u8.*?)['"]/g)[0]
        });

        return {
            url,
            headers: { referer: _provider },
            captions: captions
        };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

// getSource("movie/deadpool-wolverine-06597/");
//getSource("series/the-lord-of-the-rings-the-rings-of-power-11963/2-1/");
//! [Done] exited with code=0 in 4.151 seconds WTH
export default getSource;
//getSource("912649");
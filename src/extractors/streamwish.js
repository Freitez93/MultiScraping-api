import axios from "axios";

export const streamWish = async (link) => {
    try {
        const baseUrl = new URL(link);
        const { data } = await axios.get(baseUrl.href);

        const _evalMatch = data.match(/\(function.+setup.+\)/)?.[0];
        const unPackagedData = _evalMatch ? eval(data.match(/(eval)(\(f.*?)(\n<\/script>)/)?.[2]) : data;
        const links = unPackagedData.match(/file:\s*"([^"]+)"/);

        const sources = [];
        const subtitles = [];
        sources.push({
            quality: 'default',
            url: links[1],
            isM3U8: links[1].includes('.m3u8'),
        });

        const m3u8Content = await axios.get(links[1], {
            headers: {
                Referer: baseUrl.href,
            }
        });

        if (m3u8Content.data.includes('EXTM3U')) {
            const videoList = m3u8Content.data.split('#EXT-X-STREAM-INF:');
            for (const video of videoList ?? []) {
                if (!video.includes('m3u8')) continue;

                const url = links[1].split('master.m3u8')[0] + video.split('\n')[1];
                const quality = video.split('RESOLUTION=')[1].split(',')[0].split('x')[1];

                sources.push({
                    url: url,
                    quality: `${quality}`,
                    isM3U8: url.includes('.m3u8'),
                });
            }
        }

        return {sources, subtitles};
    } catch (err) {
        throw new Error(`Failed to retrieve video: ${err.message}`);
    }
};
import axios from "axios";
import { load } from "cheerio";

export const readmHome = async (_, res) => {
  try {
    const data = {
      hotMangaUpdates: [],
      popularManga: [],
      recentlyAdded: [],
      adminsChoice: [],
    };

    const response = await axios.get(`${process.env.READM_BASE_URL}`);
    const $ = load(response.data);

    $("#manga-hot-updates .item").each((_, el) => {
      data.hotMangaUpdates.push({
        id: $(el).find("a").attr("href").split("manga")[1].replace("/", ""),
        img: `${process.env.READM_BASE_URL}/${$(el).find("img").attr("src")}`,
        title: $(el).find("a:nth-child(2) strong").text(),
        bookmarks: $(el).find(".subscribe-count").text().trim(),
        favorites: $(el).find(".favorite-count").text().trim(),
      });
    });

    $("#latest_trailers li").each((_, el) => {
      data.popularManga.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el)
          .find("a:nth-child(1) img")
          .attr("data-src")}`,
        title: $(el).find("a:nth-child(1) h6").text(),
        chap: $(el).find("a:nth-child(2) small").text(),
      });
    });

    $("#router-view .dark-segment div:nth-child(8) ul li").each((_, el) => {
      data.recentlyAdded.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el)
          .find("img")
          .attr("data-src")}`,
        title: $(el).find("div:nth-child(2) h2").text(),
        ratings: $(el).find(".item.rating").text().trim() || null,
        favorites: $(el).find(".item.year").text().trim() || null,
      });
    });

    $("#router-view .dark-segment div:nth-child(9) ul li").each((_, el) => {
      data.adminsChoice.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el)
          .find("img")
          .attr("data-src")}`,
        title: $(el).find("div:nth-child(2) h2").text(),
        ratings: $(el).find(".item.rating").text().trim() || null,
        favorites: $(el).find(".item.year").text().trim() || null,
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

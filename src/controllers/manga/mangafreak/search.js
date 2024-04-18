import axios from "axios";
import { load } from "cheerio";

export const mangafreakSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { page } = req.query;

    const data = {
      totalPages: 5,
      currentPage: parseInt(page) || 1,
      mangaManhwaResults: [],
      authorResults: [],
    };

    const response = await gotScraping.get(
      `${process.env.MANGAFREAK_BASE_URL}/Find/${keyword}?page=${page || 1}`
    );
    const $ = load(response.data);

    $(".search_result .manga_result .manga_search_item").each((_, el) => {
      const genres = [];
      $(el)
        .find("div:nth-child(4) a")
        .each((_, el) => genres.push($(el).attr("href").split("/")[2]));
      data.mangaManhwaResults.push({
        id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
        img: $(el).find("img").attr("src"),
        title: $(el).find("span:nth-child(3) h3").text().trim(),
        published: $(el).find("div:nth-child(2)").text().trim(),
        genres,
      });
    });

    $(".search_result .mangaka_result .mangaka_search_item").each((_, el) => {
      const author = [];
      $(el)
        .find(".mangaka_manga_item")
        .each((_, el) => {
          const genres = [];
          $(el)
            .find(".mangaka_manga_info div:nth-child(2) a")
            .each((_, el) => {
              genres.push($(el).attr("href").split("/")[2]);
            });
          author.push({
            id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
            img: $(el).find("img").attr("src"),
            title: $(el).find("h5").text().trim(),
            genres,
          });
        });

      data.authorResults.push({ author });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

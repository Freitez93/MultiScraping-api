import axios from "axios";
import { load } from "cheerio";

export const mangafreakGenre = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 150,
      currentPage: parseInt(page) || 1,
      genreList: [],
      genre: [],
    };

    const response = await axios.get(
      `${process.env.MANGAFREAK_BASE_URL}/Genre/All/${page || 1}`
    );
    const $ = load(response.data);

    $(".ranking_series .ranking_list .ranking_item").each((_, el) => {
      data.genre.push({
        id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
        img: $(el).find("img").attr("src"),
        title: $(el).find(".ranking_item_info a").text(),
        author: $(el).find(".ranking_item_info div:nth-child(2)").text(),
        published: $(el).find(".ranking_item_info div:nth-child(3)").text(),
      });
    });

    $(".genre_section .genre_list a").each((_, el) => {
      data.genreList.push($(el).text());
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

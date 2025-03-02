import axios from "axios";
import { load } from "cheerio";

export const readmPopularManga = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 1077,
      currentPage: parseInt(page) || 1,
      popular: [],
    };

    const response = await axios.get(
      `${process.env.READM_BASE_URL}/popular-manga/${page || 1}`
    );
    const $ = load(response.data);

    $("#discover-response ul li").each((_, el) => {
      const genres = [];
      $(el)
        .find(
          ".poster-with-subject .subject .subject-title .poster-meta .genres a"
        )
        .each((_, el) => {
          genres.push({
            id: $(el).attr("href").split("/")[2],
            genre: $(el).text(),
          });
        });
      data.popular.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el).find("img").attr("src")}`,
        title: $(el)
          .find(".poster-with-subject .subject .subject-title a h2")
          .text(),
        description: $(el).find(".mobile-only").text().trim(),
        otherInfo: {
          rank:
            $(el).find(".media-meta td:nth-child(1) div:nth-child(2)").text() ||
            null,
          type:
            $(el).find(".media-meta td:nth-child(2) div:nth-child(2)").text() ||
            null,
          subscribers:
            $(el).find(".media-meta td:nth-child(3) div:nth-child(2)").text() ||
            null,
          rating:
            $(el).find(".media-meta td:nth-child(4) div:nth-child(2)").text() ||
            null,
          views:
            $(el).find(".media-meta td:nth-child(5) div:nth-child(2)").text() ||
            null,
        },
        genres,
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error" + error.message);
  }
};

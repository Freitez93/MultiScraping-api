import axios from "axios";
import { load } from "cheerio";

export const readmCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page } = req.query;

    const data = {
      totalPages: 9,
      currentPage: parseInt(page) || 1,
      category: [],
    };

    const response = await axios.get(
      `${process.env.READM_BASE_URL}/category/${categoryId}/${page}`
    );
    const $ = load(response.data);

    $("#discover-response ul li").each((_, el) => {
      const genres = [];
      $(el)
        .find(
          ".poster-with-subject .subject .subject-title div p.poster-meta .genres a"
        )
        .each((_, el) => {
          genres.push({
            id: $(el).attr("href").split("/")[2],
            genre: $(el).text(),
          });
        });
      data.category.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el)
          .find("img")
          .attr("data-src")}`,
        title: $(el)
          .find(
            ".poster-with-subject .subject .subject-title div > a:nth-child(1)"
          )
          .text()
          .trim(),
        description: $(el)
          .find(".poster-with-subject .subject .desktop-only")
          .text()
          .trim(),
        otherInfo: {
          type: $(el)
            .find(".media-meta td:nth-child(1) div:nth-child(2)")
            .text(),
          subscribers: $(el)
            .find(".media-meta td:nth-child(2) div:nth-child(2)")
            .text(),
          rating: $(el)
            .find(".media-meta td:nth-child(3) div:nth-child(2)")
            .text(),
        },
        genres,
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

import axios from "axios";
import { load } from "cheerio";

export const mangamonksGenre = async (req, res) => {
  try {
    const { page } = req.query;
    const { genre } = req.params;

    const data = {
      totalPages: 0,
      currentPage: parseInt(page) || 1,
      genre: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/genre/${genre}/${page || 1}`
    );
    const $ = load(response.data);

    const totalPagesSelector = $(
      ".main-wrapper .container .row .main-slide .pagination nav ul ul li:nth-child(6) a"
    );

    data.totalPages =
      totalPagesSelector.text() === "Last"
        ? parseInt(
            totalPagesSelector.attr("href").split("/")[5].replace("?", "")
          ) || 1
        : parseInt(totalPagesSelector.text()) || 1;

    $(".main-wrapper .container .row .main-slide div .item figure").each(
      function () {
        data.genre.push({
          id: $(this).find("a").attr("href").split("/")[2],
          img: $(this).find("img").attr("data-src"),
          title: $(this).find("figcaption a").text().trim(),
        });
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

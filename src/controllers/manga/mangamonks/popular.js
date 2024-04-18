import axios from "axios";
import { load } from "cheerio";

export const mangamonksPopular = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 22,
      currentPage: parseInt(page) || 1,
      popular: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/popular-manga/${page || "1"}`
    );
    const $ = load(response.data);

    $(
      ".main-wrapper .container .row .col-12.completed-area div:nth-child(1) div figure"
    ).each(function () {
      data.popular.push({
        id: $(this).find("a").attr("href").split("/")[2],
        img: $(this).find("img").attr("data-src"),
        title: $(this).find("figcaption a").text().trim(),
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

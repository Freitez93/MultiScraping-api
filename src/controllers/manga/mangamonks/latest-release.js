import axios from "axios";
import { load } from "cheerio";

export const mangamonksLatestRelease = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 12,
      currentPage: parseInt(page) || 1,
      latestRelease: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/latest-releases/${page || 1}`
    );
    const $ = load(response.data);

    $("[aria-labelledby='all-tab'] .row div figure").each(function () {
      data.latestRelease.push({
        id: $(this).find("a").attr("href").split("/")[2],
        img: $(this).find("img").attr("data-src"),
        title: $(this).find("figcaption > a:nth-child(1)").text().trim(),
        chapter: $(this)
          .find("figcaption div.chapters a span:nth-child(1)")
          .text()
          .trim(),
        uploaded: $(this)
          .find("figcaption div.chapters a span:nth-child(2)")
          .text()
          .trim(),
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

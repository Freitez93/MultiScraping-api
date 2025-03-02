import axios from "axios";
import { load } from "cheerio";

export const mangamonksChapters = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const data = [];

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/manga/${chapterId}`
    );
    const $ = load(response.data);

    $(
      ".main-wrapper .container .row .info-detail > div.manga-info-tab div:nth-child(2) > div:nth-child(1) div:nth-child(2) div:nth-child(2) div.tab-pane"
    ).each(function () {
      $(this)
        .find(".chapter-list li")
        .each(function () {
          data.push({
            id: $(this)
              .find("a")
              .attr("href")
              .split("manga")[1]
              .replace("/", ""),
            chap: $(this).find("span.chapter-number").text().trim(),
            uploaded: $(this).find("span.time").text().trim(),
          });
        });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

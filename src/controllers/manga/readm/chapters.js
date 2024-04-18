import axios from "axios";
import { load } from "cheerio";

export const readmChapters = async (req, res) => {
  try {
    const { infoId } = req.params;

    const data = [];

    const response = await axios.get(
      `${process.env.READM_BASE_URL}/manga/${infoId}`
    );
    const $ = load(response.data);

    $(
      "#router-view .ui.tab.tab-segment .common-lists section.episodes-box .ui.grid div:nth-child(2)"
    ).each((_, el) => {
      $(el)
        .find(".tabular-content .episodes-list .ui.list div.item.season_start")
        .each((_, el) => {
          data.push({
            id: $(el).find("a").attr("href").split("manga")[1].replace("/", ""),
            title: $(el).find("a").text().trim(),
            date: $(el).find(".episode-date").text(),
          });
        });
    });

    const sortData = data.sort((a, b) => {
      return parseInt(a.title.split(" ")[1]) - parseInt(b.title.split(" ")[1]);
    });

    return res.status(200).json(sortData);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

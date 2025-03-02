import axios from "axios";
import { load } from "cheerio";

export const readmSearch = async (req, res) => {
  try {
    const { keyword } = req.query;

    const data = [];

    const response = await axios.get(
      `${process.env.READM_BASE_URL}/searchController/index?search=${keyword}`
    );
    const $ = load(response.data);

    $("#router-view .dark-segment .clearfix li .poster.poster-xs").each(
      (_, el) => {
        data.push({
          id: $(el).find("a").attr("href").split("/")[2],
          img: `${process.env.READM_BASE_URL}${$(el)
            .find("img")
            .attr("data-src")}`,
          title: $(el).find(".poster-subject .truncate").text(),
          status: $(el).find(".poster-subject .episode-no").text() || null,
        });
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error" + error.message);
  }
};

import axios from "axios";
import { load } from "cheerio";

export const mangamonksRead = async (req, res) => {
  try {
    const { infoId, chapter } = req.params;

    const data = [];

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/manga/${infoId}/${chapter}/all-pages`
    );
    const $ = load(response.data);

    $("#zoomContainer div").each(function () {
      data.push({
        img: `${process.env.MANGAMONKS_BASE_URL}${$(this)
          .find("img")
          .attr("src")}`,
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

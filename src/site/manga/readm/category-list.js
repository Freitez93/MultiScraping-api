import axios from "axios";
import { load } from "cheerio";

export const readmCategoryList = async (req, res) => {
  try {
    const data = [];

    const response = await axios.get(`${process.env.READM_BASE_URL}`);
    const $ = load(response.data);

    $("#sidebar-inner .trending-thisweek.categories li").each((_, el) => {
      data.push({
        id: $(el).find("a").attr("href").split("/")[2],
        name: $(el).find("a").text().trim(),
      });
    });

    const removeHentai = data.filter((i) => i.name !== "Hentai");

    return res.status(200).json(removeHentai);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

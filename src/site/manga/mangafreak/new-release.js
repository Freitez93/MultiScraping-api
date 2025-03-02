import axios from "axios";
import { load } from "cheerio";

export const mangafreakNewRelease = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 20,
      currentPage: parseInt(page) || 1,
      newRelease: [],
    };

    const response = await axios.get(
      `${process.env.MANGAFREAK_BASE_URL}/Latest_Releases/${page || 1}`
    );
    const $ = load(response.data);

    $(".latest_releases .latest_releases_list .latest_releases_item").each(
      (_, el) => {
        data.newRelease.push({
          id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
          img: $(el).find("img").attr("src"),
          title: $(el).find(".latest_releases_info > a").text(),
          otherTitle: $(el).find(".latest_releases_info div a").text(),
          uploaded: $(el).find(".latest_releases_time").text().trim(),
          status:
            $(el)
              .find(".latest_releases_info .hot_manga_pic")
              .append("HOT")
              .text() || null,
        });
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

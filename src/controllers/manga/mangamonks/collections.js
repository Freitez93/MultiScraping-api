import axios from "axios";
import { load } from "cheerio";

export const mangamonksCollections = async (req, res) => {
  try {
    const { page } = req.query;

    const data = {
      totalPages: 91,
      currentPage: parseInt(page) || 1,
      collections: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/collections/${page || 1}`
    );
    const $ = load(response.data);

    $(".main-wrapper .container .row div:nth-child(2) ul li.table-row").each(
      function () {
        data.collections.push({
          id: $(this).attr("onclick").split("'")[1].split("/")[2],
          no: $(this).find("[data-label='Collection Id']").text(),
          details: $(this)
            .find("[data-label='Details']")
            .text()
            .trim()
            .replace(/\s+/g, " "),
          views: $(this).find("[data-label='Views']").text().trim(),
          createdBy: $(this).find("[data-label='Created By']").text().trim(),
        });
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

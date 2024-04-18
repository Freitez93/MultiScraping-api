import axios from "axios";
import { load } from "cheerio";

export const mangamonksCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    const data = {
      title: null,
      collection: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/collection/${collectionId}`
    );
    const $ = load(response.data);

    data.title = $(".page-title").text().trim();

    $(".row.weekly-block div figure").each(function () {
      data.collection.push({
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

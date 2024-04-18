import axios from "axios";
import { load } from "cheerio";

export const mangafreakRead = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const data = {
      chapters: [],
      img: [],
    };

    const response = await axios.get(
      `${process.env.MANGAFREAK_BASE_URL}/${chapterId}`
    );
    const $ = load(response.data);

    $(".middle_section .read_main_content .read_image img").each((_, el) => {
      data.img.push({
        img: $(el).attr("src"),
      });
    });

    $("#go .chapter_list select option").each((_, el) => {
      data.chapters.push({
        id: $(el).attr("value").replace("/", ""),
        title: $(el).text(),
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

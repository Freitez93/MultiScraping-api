import axios from "axios";
import { load } from "cheerio";

export const mangafreakHome = async (_, res) => {
  try {
    const data = {
      hotManga: [],
      todaysManga: [],
      yesterdaysManga: [],
      olderManga: [],
      popularManga: [],
      favorites: [],
    };

    const response = await axios.get(
      `${process.env.MANGAFREAK_BASE_URL}`
    );
    const $ = load(response.data);

    $(".slide_box li a").each((_, el) => {
      data.hotManga.push({
        id: `Read1_${$(el).attr("href").split("/")[2]}_1`,
        img: `${process.env.MANGAFREAK_BASE_URL}${$(el)
          .find("img")
          .attr("src")}`,
        title: $(el).find(".SliderName").text(),
      });
    });

    $(".main_section_content .right div:nth-child(4) .latest_item").each(
      (_, el) => {
        const chapters = [];
        $(el)
          .find(".chapter_box a")
          .each((_, el) => {
            chapters.push({
              id: $(el).attr("href").replace("/", ""),
              chap: $(el).text(),
            });
          });
        data.todaysManga.push({
          id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
          img: $(el).find("img").attr("src"),
          title: $(el).find("a.name").text(),
          chapters,
        });
      }
    );

    $(".main_section_content .right div:nth-child(6) .latest_item").each(
      (_, el) => {
        const chapters = [];
        $(el)
          .find(".chapter_box a")
          .each((_, el) => {
            chapters.push({
              id: $(el).attr("href").replace("/", ""),
              chap: $(el).text(),
            });
          });
        data.yesterdaysManga.push({
          id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
          img: $(el).find("img").attr("src"),
          title: $(el).find("a.name").text(),
          chapters,
        });
      }
    );

    $(".main_section_content .right div:nth-child(8) .latest_item").each(
      (_, el) => {
        const chapters = [];
        $(el)
          .find(".chapter_box a")
          .each((_, el) => {
            chapters.push({
              id: $(el).attr("href").replace("/", ""),
              chap: $(el).text(),
            });
          });
        data.olderManga.push({
          id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
          img: $(el).find("img").attr("src"),
          title: $(el).find("a.name").text(),
          chapters,
        });
      }
    );

    $(
      ".main .main_section .main_section_content .left div:nth-child(2) .featured_item"
    ).each((_, el) => {
      data.popularManga.push({
        id: `Read1_${$(el).find("a").attr("href").split("/")[2]}_1`,
        img: $(el).find("img").attr("src"),
        title: $(el).find(".featured_item_info > a").text(),
        author: $(el)
          .find(".featured_item_info div:nth-child(2)")
          .text()
          .trim(),
        status: $(el).find(".featured_item_info p").text(),
        chapter: $(el)
          .find(".featured_item_info div:nth-child(4) a")
          .text()
          .trim(),
      });
    });

    $(".sidebar_description div:nth-child(3) a").each((_, el) => {
      data.favorites.push({
        id: `Read1_${$(el).attr("href").split("/")[2]}_1`,
        img: $(el).find("img").attr("src"),
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

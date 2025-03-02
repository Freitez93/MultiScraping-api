import axios from "axios";
import { load } from "cheerio";

export const mangamonksInfo = async (req, res) => {
  try {
    const { infoId } = req.params;

    const data = {
      info: {
        id: infoId,
        img: null,
        title: null,
        alternativesTitle: null,
        status: null,
        synopsis: null,
        hashtag: null,
        author: null,
        genres: null,
        otherInfo: {
          rating: 0,
          views: 0,
          chapterCount: 0,
          stars: 0,
        },
      },
      similar: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}/manga/${infoId}`
    );
    const $ = load(response.data);

    const selector = $(".main-wrapper .container .row");

    data.info.img = $(selector)
      .find(".link-holder .img-holder img")
      .attr("data-src");
    data.info.title = $(selector)
      .find(".info-detail div:nth-child(1) > h3.info-title")
      .text()
      .trim();
    data.info.alternativesTitle = $(selector)
      .find(".info-detail span:nth-child(3)")
      .text()
      .trim();
    data.info.status = $(selector)
      .find(".info-detail > span:nth-child(2).source")
      .text()
      .trim();
    const genres = [];
    $(selector)
      .find(".info-detail div.tags a")
      .each(function () {
        genres.push({
          id: $(this).attr("href").split("/")[2],
          genre: $(this).text().trim(),
        });
      });
    data.info.genres = genres.filter((item) => item.genre !== "More");
    const author = [];
    $(selector)
      .find(".info-detail div:nth-child(5).publisher a")
      .each(function () {
        author.push({
          id: $(this).attr("href").split("/")[2],
          name: $(this).text().trim(),
        });
      });
    data.info.author = author;
    data.info.synopsis = $(selector)
      .find(".info-desc p")
      .text()
      .trim()
      .replaceAll("\n", " ");
    const hashtag = [];
    $(selector)
      .find("div:nth-child(7).publisher a")
      .each(function () {
        hashtag.push({
          id: $(this).attr("href").split("/")[2],
          hashtag: $(this).text().trim(),
        });
      });
    data.info.hashtag = hashtag.filter((item) => item.hashtag !== "More");
    data.info.otherInfo.rating = parseFloat(
      $(selector)
        .find(".link-holder .statistic-left button:nth-child(1)")
        .text()
        .trim()
    );
    data.info.otherInfo.views = parseFloat(
      $(selector)
        .find(".link-holder .statistic-left button:nth-child(2)")
        .text()
        .trim()
    );
    data.info.otherInfo.chapterCount = parseFloat(
      $(selector)
        .find(".link-holder .statistic-left button:nth-child(3)")
        .text()
        .trim()
    );
    data.info.otherInfo.stars = parseFloat(
      $(selector)
        .find(".link-holder .statistic-left button:nth-child(4)")
        .text()
        .trim()
    );

    $(selector)
      .find(".link-holder .similar-area a")
      .each(function () {
        data.similar.push({
          id: $(this).attr("href").split("/")[2],
          img: $(this).find("img").attr("data-src"),
          title: $(this).find(".detail h3").text().trim(),
          status: $(this).find(".detail span").text().trim(),
        });
      });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

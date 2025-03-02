import axios from "axios";
import { load } from "cheerio";

export const readmInfo = async (req, res) => {
  try {
    const { infoId } = req.params;

    const data = {
      info: {
        id: infoId,
        img: null,
        title: null,
        status: null,
        otherTitle: null,
        description: null,
        genres: null,
        author: null,
        otherInfo: {
          type: null,
          chapters: null,
          subscribers: null,
          rating: null,
          views: null,
        },
      },
      relatedManga: [],
    };

    const response = await axios.get(
      `${process.env.READM_BASE_URL}/manga/${infoId}`
    );
    const $ = load(response.data);

    const selector = $("#router-view .bg-cover-faker");

    data.info.img = `${process.env.READM_BASE_URL}${$(selector)
      .find("#series-profile-image-wrapper img")
      .attr("src")}`;
    data.info.title = $(selector).find(".ui.grid h1").text();
    data.info.status = $(selector).find(".series-genres span").text().trim();
    data.info.otherTitle = $(selector).find(".ui.grid .sub-title").text();
    data.info.description = $(selector)
      .find(
        "#series-profile-content-wrapper .series-summary-wrapper p:nth-child(3) span"
      )
      .text();
    const genres = [];
    $(selector)
      .find(
        "#series-profile-content-wrapper .series-summary-wrapper div.ui.list .item a"
      )
      .each((_, el) => {
        genres.push({
          id: $(el).attr("href").split("/")[2],
          genre: $(el).text(),
        });
      });
    data.info.genres = genres;
    data.info.author = {
      id: $(selector).find("#first_episode a").attr("href").split("/")[2],
      name: $(selector).find("#first_episode a").text(),
    };
    data.info.otherInfo.type = $(
      "#series-profile-content-wrapper .media-meta td:nth-child(1) div:nth-child(2)"
    ).text();
    data.info.otherInfo.chapters = $(
      "#series-profile-content-wrapper .media-meta td:nth-child(2) div:nth-child(2)"
    ).text();
    data.info.otherInfo.subscribers = $(
      "#series-profile-content-wrapper .media-meta td:nth-child(3) div:nth-child(2)"
    ).text();
    data.info.otherInfo.rating = $(
      "#series-profile-content-wrapper .media-meta td:nth-child(4) div:nth-child(2)"
    ).text();
    data.info.otherInfo.views = $(
      "#series-profile-content-wrapper .media-meta td:nth-child(5) div:nth-child(2)"
    ).text();

    $("#related_manga .clearfix li").each((_, el) => {
      data.relatedManga.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: `${process.env.READM_BASE_URL}${$(el)
          .find("img")
          .attr("data-src")}`,
        title: $(el).find(".poster-subject a h2").text(),
      });
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

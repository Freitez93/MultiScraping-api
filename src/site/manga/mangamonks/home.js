import axios from "axios";
import { load } from "cheerio";

export const mangamonksHome = async (req, res) => {
  try {
    const data = {
      hotMangaUpdates: [],
      mostViewed: [],
      latestRelease: [],
      featuredByDate: {
        daily: [],
        weekly: [],
        monthly: [],
      },
      newArivals: [],
      adminsChoices: [],
      completedManga: [],
    };

    const response = await axios.get(
      `${process.env.MANGAMONKS_BASE_URL}`
    );
    const $ = load(response.data);

    $(
      ".main-wrapper .main-headline .container .row div:nth-child(2) .swiper-wrapper .swiper-slide"
    ).each((_, el) => {
      data.hotMangaUpdates.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: $(el).find("img").attr("data-src"),
        title: $(el).find("figcaption.detail").text().trim(),
        chap: $(el).find("div.chapter-type").text().trim(),
      });
    });

    $(".most-readed-area .container div:nth-child(2) .swiper-slide").each(
      (_, el) => {
        data.mostViewed.push({
          id: $(el).find("a").attr("href").split("/")[2],
          img: $(el).find("img").attr("data-src"),
          title: $(el).find("figcaption.detail a").text().trim(),
          rank: $(el).find("span.number").text(),
        });
      }
    );

    $(
      ".news-releases-area .container div:nth-child(2) .col-12 div:nth-child(2) .row .col-12"
    ).each((_, el) => {
      const chapters = [];
      $(el)
        .find("figcaption .chapters a")
        .each((_, el) => {
          chapters.push({
            id: $(el).attr("href").split("/")[2],
            chapter: $(el).find("span:nth-child(1)").text(),
            uploaded: $(el).find("span:nth-child(2)").text(),
          });
        });
      data.latestRelease.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: $(el).find("img").attr("data-src"),
        title: $(el).find("figcaption > a").text().trim(),
        chapters,
      });
    });

    const dailySelector = $(
      ".weekly-featured-area [aria-labelledby='daily-tab'] .row div .main-featured figure"
    );
    const weeklySelector = $(
      ".weekly-featured-area [aria-labelledby='weekly-tab'] .row div .main-featured figure"
    );
    const monthlySelector = $(
      ".weekly-featured-area [aria-labelledby='monthly-tab'] .row div .main-featured figure"
    );

    data.featuredByDate.daily.push({
      id: $(dailySelector).find("a").attr("href").split("/")[2],
      img: $(dailySelector).find("img").attr("data-src"),
      title: $(dailySelector).find("figcaption > a").text().trim(),
      genres: {
        id: $(dailySelector)
          .find("figcaption div.book-type a")
          .attr("href")
          .split("/")[2],
        genre: $(dailySelector)
          .find("figcaption div.book-type a")
          .text()
          .trim(),
      },
      description: $(dailySelector)
        .find("figcaption div.book-desc p")
        .text()
        .trim()
        .replaceAll("\n", " "),
    });

    data.featuredByDate.weekly.push({
      id: $(weeklySelector).find("a").attr("href").split("/")[2],
      img: $(weeklySelector).find("img").attr("data-src"),
      title: $(weeklySelector).find("figcaption > a").text().trim(),
      genres: {
        id: $(weeklySelector)
          .find("figcaption div.book-type a")
          .attr("href")
          .split("/")[2],
        genre: $(weeklySelector)
          .find("figcaption div.book-type a")
          .text()
          .trim(),
      },
      description: $(weeklySelector)
        .find("figcaption div.book-desc p")
        .text()
        .trim()
        .replaceAll("\n", " "),
    });

    data.featuredByDate.monthly.push({
      id: $(monthlySelector).find("a").attr("href").split("/")[2],
      img: $(monthlySelector).find("img").attr("data-src"),
      title: $(monthlySelector).find("figcaption > a").text().trim(),
      genres: {
        id: $(monthlySelector)
          .find("figcaption div.book-type a")
          .attr("href")
          .split("/")[2],
        genre: $(monthlySelector)
          .find("figcaption div.book-type a")
          .text()
          .trim(),
      },
      description: $(monthlySelector)
        .find("figcaption div.book-desc p")
        .text()
        .trim()
        .replaceAll("\n", " "),
    });

    $(".weekly-featured-area [aria-labelledby='daily-tab'] .row div").each(
      (_, el) => {
        $(el)
          .find(".row .col-12")
          .each((_, el) => {
            data.featuredByDate.daily.push({
              id: $(el).find("a").attr("href").split("/")[2],
              img: $(el).find("img").attr("data-src"),
              title: $(el).find("figcaption a:nth-child(1)").text().trim(),
              genres: {
                id: $(el)
                  .find("figcaption a:nth-child(2)")
                  .attr("href")
                  .split("/")[2],
                genre: $(el).find("figcaption a:nth-child(2)").text().trim(),
              },
            });
          });
      }
    );

    $(".weekly-featured-area [aria-labelledby='weekly-tab'] .row div").each(
      (_, el) => {
        $(el)
          .find(".row .col-12")
          .each((_, el) => {
            data.featuredByDate.weekly.push({
              id: $(el).find("a").attr("href").split("/")[2],
              img: $(el).find("img").attr("data-src"),
              title: $(el).find("figcaption a:nth-child(1)").text().trim(),
              genres: {
                id: $(el)
                  .find("figcaption a:nth-child(2)")
                  .attr("href")
                  .split("/")[2],
                genre: $(el).find("figcaption a:nth-child(2)").text().trim(),
              },
            });
          });
      }
    );

    $(".weekly-featured-area [aria-labelledby='monthly-tab'] .row div").each(
      (_, el) => {
        $(el)
          .find(".row .col-12")
          .each((_, el) => {
            data.featuredByDate.monthly.push({
              id: $(el).find("a").attr("href").split("/")[2],
              img: $(el).find("img").attr("data-src"),
              title: $(el).find("figcaption a:nth-child(1)").text().trim(),
              genres: {
                id: $(el)
                  .find("figcaption a:nth-child(2)")
                  .attr("href")
                  .split("/")[2],
                genre: $(el).find("figcaption a:nth-child(2)").text().trim(),
              },
            });
          });
      }
    );

    $(
      ".arrivals-area .container .row div:nth-child(1) div:nth-child(2) .tab-content .tab-pane"
    ).each((_, el) => {
      data.newArivals.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: $(el).find("img").attr("data-src"),
        title: $(el).find("figcaption a:nth-child(1)").text().trim(),
        description: $(el).find("figcaption a:nth-child(2)").text().trim(),
      });
    });

    $(
      ".arrivals-area .container .row div:nth-child(2) .row .col-12.col-auto"
    ).each((_, el) => {
      data.adminsChoices.push({
        id: $(el).find("a").attr("href").split("/")[2],
        img: $(el).find("img").attr("data-src"),
        title: $(el).find("figcaption a:nth-child(1)").text().trim(),
        type: $(el).find("figcaption a:nth-child(2)").text().trim(),
      });
    });

    $(".completed-area .container .row.weekly-block div.col-12").each(
      function () {
        data.completedManga.push({
          id: $(this).find("a").attr("href").split("/")[2],
          img: $(this).find("img").attr("data-src"),
          title: $(this).find("figcaption a:nth-child(1)").text().trim(),
          isAdult: $(this).find("figcaption a:nth-child(2)").text().trim(),
        });
      }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Error " + error.message);
  }
};

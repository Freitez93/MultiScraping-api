import axios from "axios";
import { load } from "cheerio";
import {
	AnimeSearch, AnimeInfo, AnimeSources
} from "../../../models/anime.js";
import {
	isValidGenre, isValidStatus, isValidType, isValidOrder
} from "./animeflv_helper.js";

const BASE_URL = "https://animeflv.net";
export const GetAnimeBySearch = async (query, genre, status, type, order, page) => {

	try {
		const response = await axios.get(`${BASE_URL}/browse`, {
			params: {
				q: query ? query : undefined,
				genre: isValidGenre(genre),
				status: isValidStatus(status),
				type: isValidType(type),
				order: isValidOrder(order),
				page: page
			}
		});
		const $ = load(response.data);

		// Initialize an array to hold the anime data
		const animeFLV = new AnimeSearch()
		animeFLV.currentPage = Number(page) || 1;
		animeFLV.hasNextPage = animeFLV.currentPage < 150;

		// Select each anime article and extract the required data
		$('.ListAnimes .Anime').each((index, element) => {
			const href = $(element).find('a').attr('href'); // Get the href attribute
			const title = $(element).find('.Title strong').text(); // Get the title
			const cover = $(element).find('figure img').attr('src'); // Get the cover image
			const type = $(element).find('span.Type').first().text(); // Get the type

			// Extract the ID from the href (last part after the last '/')
			const id = href.split('/').pop();

			// Push the extracted data into the animes array
			animeFLV.results.push({
				id: `/info?id=${id}`,
				title: title,
				url: new URL(href, BASE_URL).href,
				image: cover,
				type: type
			});
		});

		return animeFLV;
	} catch (error) {
		throw new Error("GetAnimeBySearch: " + error.message);
	}
};

export const GetAnimeInfo = async (nameID) => {
	try {
		const response = await axios.get(`${BASE_URL}/anime/${nameID}`);
		const $ = load(response.data);

		const countEpisodes = JSON.parse(response.data.match(/var episodes = (\[.+\]);/)?.[1])
		const animeInfo = new AnimeInfo()
		animeInfo.title = $("h1.Title").text()
		animeInfo.image = $('meta[property="og:image"]').attr("content")
		animeInfo.url = $('meta[property="og:url"]').attr("content")
		animeInfo.description = $('meta[name="description"]').attr("content")
		animeInfo.type = $("span.Type").text()
		animeInfo.status = $("p.AnmStts span").text().trim()

		$("span.TxtAlt").each((_i, e) => {
			animeInfo.otherTitle.push($(e).text().trim());
		});

		$("ul.ListAnmRel li").each((_i, e) => {
			const chronologyAnime = $(e).find("a");
			const chronologyHref = chronologyAnime.attr("href");

			animeInfo.chronology.push({
				id: chronologyAnime.attr("href").split("/").pop(),
				name: $(e).text(),
				url: new URL(chronologyHref, BASE_URL).href
			})
		});

		$("nav.Nvgnrs a").each((_i, e) => {
			const gen = $(e).text();
			animeInfo.genres.push(gen.trim());
		});

		animeInfo.totalEpisodes = countEpisodes.length
		countEpisodes.map(_i_ => {
			const watchID = `${nameID}-${_i_[0]}`;
			animeInfo.episodes.push({
				name: `Episodio ${_i_[0]}`,
				url: `${BASE_URL}/ver/${watchID}`,
				id: `/watch?id=${watchID}`,
			})
		});
		return animeInfo;
	} catch (error) {
		throw new Error("GetAnimeInfo: " + error.message);
	}
};

export const GetEpisodeServers = async (episodeID) => {
    const serverNameMap = {
        'MEGA': 'Mega',
        'SW': 'StreamWish',
        'Stape': 'StreamTape'
    }

	try {
		const response = await axios.get(`${BASE_URL}/ver/${episodeID}`);
		const $ = load(response.data);

		const getLinks = JSON.parse(response.data.match(/var videos = ({.+?});/)?.[1]);
		const animeWatch = new AnimeSources();
		animeWatch.title = $(".CapiTop").children("h1").text().trim();
		animeWatch.url = response.config.url;
		animeWatch.number = parseInt(episodeID.split("-").pop());

		for (const index in getLinks) {
			getLinks[index].map(item => {
				animeWatch.addServer({
					server: serverNameMap[item.title] || item.title,
					type: index,
					url: item.code
				})
			})
		}

		return animeWatch;
	} catch (error) {
        throw new Error("GetEpisodeServers: " + error.message);
	}
}; 
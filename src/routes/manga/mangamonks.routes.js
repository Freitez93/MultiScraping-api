import express from "express";
import { mangamonksHome } from "../../site/manga/mangamonks/home.js";
import { mangamonksInfo } from "../../site/manga/mangamonks/info.js";
import { mangamonksRead } from "../../site/manga/mangamonks/read.js";
import { mangamonksChapters } from "../../site/manga/mangamonks/chapters.js";
import { mangamonksLatestRelease } from "../../site/manga/mangamonks/latest-release.js";
import { mangamonksPopular } from "../../site/manga/mangamonks/popular.js";
import { mangamonksGenre } from "../../site/manga/mangamonks/genre.js";
import { mangamonksCollections } from "../../site/manga/mangamonks/collections.js";
import { mangamonksCollection } from "../../site/manga/mangamonks/collection.js";

const router = express.Router();

router.get("/home", mangamonksHome);

router.get("/latest-release", mangamonksLatestRelease);

router.get("/popular", mangamonksPopular);

router.get("/collections", mangamonksCollections);

router.get("/collection/:collectionId", mangamonksCollection);

router.get("/genre/:genre", mangamonksGenre);

router.get("/info/:infoId", mangamonksInfo);

router.get("/chapters/:chapterId", mangamonksChapters);

router.get("/read/:infoId/:chapter", mangamonksRead);

export default router;

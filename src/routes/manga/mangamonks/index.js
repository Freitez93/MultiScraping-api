import express from "express";
import { mangamonksHome } from "../../../controllers/manga/mangamonks/home.js";
import { mangamonksInfo } from "../../../controllers/manga/mangamonks/info.js";
import { mangamonksRead } from "../../../controllers/manga/mangamonks/read.js";
import { mangamonksChapters } from "../../../controllers/manga/mangamonks/chapters.js";
import { mangamonksLatestRelease } from "../../../controllers/manga/mangamonks/latest-release.js";
import { mangamonksPopular } from "../../../controllers/manga/mangamonks/popular.js";
import { mangamonksGenre } from "../../../controllers/manga/mangamonks/genre.js";
import { mangamonksCollections } from "../../../controllers/manga/mangamonks/collections.js";
import { mangamonksCollection } from "../../../controllers/manga/mangamonks/collection.js";

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

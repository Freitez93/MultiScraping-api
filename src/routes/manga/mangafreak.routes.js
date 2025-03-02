import express from "express";
import { mangafreakHome } from "../../site/manga/mangafreak/home.js";
import { mangafreakRead } from "../../site/manga/mangafreak/read.js";
import { mangafreakNewRelease } from "../../site/manga/mangafreak/new-release.js";
import { mangafreakGenre } from "../../site/manga/mangafreak/genre.js";
import { mangafreakSearch } from "../../site/manga/mangafreak/search.js";

const router = express.Router();

router.get("/home", mangafreakHome);

router.get("/new-release", mangafreakNewRelease);

router.get("/genre", mangafreakGenre);

router.get("/search", mangafreakSearch);

router.get("/read/:chapterId", mangafreakRead);

export default router;
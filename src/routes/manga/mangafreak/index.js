import express from "express";
import { mangafreakHome } from "../../../controllers/manga/mangafreak/home.js";
import { mangafreakRead } from "../../../controllers/manga/mangafreak/read.js";
import { mangafreakNewRelease } from "../../../controllers/manga/mangafreak/new-release.js";
import { mangafreakGenre } from "../../../controllers/manga/mangafreak/genre.js";
import { mangafreakSearch } from "../../../controllers/manga/mangafreak/search.js";

const router = express.Router();

router.get("/home", mangafreakHome);

router.get("/new-release", mangafreakNewRelease);

router.get("/genre", mangafreakGenre);

router.get("/search", mangafreakSearch);

router.get("/read/:chapterId", mangafreakRead);

export default router;

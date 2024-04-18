import express from "express";
import { readmHome } from "../../../controllers/manga/readm/home.js";
import { readmInfo } from "../../../controllers/manga/readm/info.js";
import { readmChapters } from "../../../controllers/manga/readm/chapters.js";
import { readmRead } from "../../../controllers/manga/readm/image.js";
import { readmPopularManga } from "../../../controllers/manga/readm/popular-manga.js";
import { readmLatestUpdates } from "../../../controllers/manga/readm/latest-updates.js";
import { readmNewManga } from "../../../controllers/manga/readm/new-manga.js";
import { readmCategoryList } from "../../../controllers/manga/readm/category-list.js";
import { readmCategory } from "../../../controllers/manga/readm/category.js";
import { readmSearch } from "../../../controllers/manga/readm/search.js";

const router = express.Router();

router.get("/home", readmHome);

router.get("/popular-manga", readmPopularManga);

router.get("/latest-updates", readmLatestUpdates);

router.get("/new-manga", readmNewManga);

router.get("/category-list", readmCategoryList);

router.get("/search", readmSearch);

router.get("/category/:categoryId", readmCategory);

router.get("/info/:infoId", readmInfo);

router.get("/chapters/:infoId", readmChapters);

router.get("/read/:infoId/:chapter", readmRead);

export default router;

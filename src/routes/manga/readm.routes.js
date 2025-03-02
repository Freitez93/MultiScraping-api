import express from "express";
import { readmHome } from "../../site/manga/readm/home.js";
import { readmInfo } from "../../site/manga/readm/info.js";
import { readmChapters } from "../../site/manga/readm/chapters.js";
import { readmRead } from "../../site/manga/readm/image.js";
import { readmPopularManga } from "../../site/manga/readm/popular-manga.js";
import { readmLatestUpdates } from "../../site/manga/readm/latest-updates.js";
import { readmNewManga } from "../../site/manga/readm/new-manga.js";
import { readmCategoryList } from "../../site/manga/readm/category-list.js";
import { readmCategory } from "../../site/manga/readm/category.js";
import { readmSearch } from "../../site/manga/readm/search.js";

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

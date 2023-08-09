import { Request, Response, Router } from "express";
const router = Router();
import { getCoin, getAllCoinsFromAirtable } from "../controllers/controllers";


// get all coins information from airtable
router.get("/", getAllCoinsFromAirtable);

// get coin price from cache else from airtable
router.get("/price/:coinId", getCoin);

export default router;

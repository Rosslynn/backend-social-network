import { Router } from "express";
import { newUser } from "../controllers/user.mjs";

const router = Router();

router.post('/', newUser)

export default router;
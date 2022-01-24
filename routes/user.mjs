import { Router } from "express";
import { check, body } from "express-validator";
import { newUser } from "../controllers/user.mjs";

const router = Router();

router.post('/', newUser)

export default router;
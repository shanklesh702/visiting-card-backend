import express from "express";
import { body } from "express-validator";
import { createCard, getAllCards, updateCardProfile } from "../controllers/cards.js";
import auth from "../middlewares/auth.js";

const router = express.Router();


router.post('/:userId',auth,createCard);
router.get('/:userId', auth, getAllCards);
router.put('/:cardId',auth, updateCardProfile);

export default router;
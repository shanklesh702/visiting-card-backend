import express from "express";
import { body } from "express-validator";
import { createCard, getAllCards, updateCardProfile ,getCardById} from "../controllers/cards.js";
import auth from "../middlewares/auth.js";

const router = express.Router();


router.post('/:userId',auth,createCard);
router.put('/:cardId',auth, updateCardProfile);
router.get('/:cardId',getCardById)
export default router;
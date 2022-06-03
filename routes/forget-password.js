import express from "express";
import auth from '../middlewares/auth.js';

import { sendMailToUpdatePassword, resetPassword,changePassword } from "../controllers/forget-password.js";

const router = express.Router();


router.put('/forget',sendMailToUpdatePassword)
router.post('/forget/update',resetPassword)
router.put('/change',auth,changePassword)
export default router;
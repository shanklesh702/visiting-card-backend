import express from "express";

import { sendMailToUpdatePassword, resetPassword } from "../controllers/forget-password.js";

const router = express.Router();


router.put('/',sendMailToUpdatePassword)
router.post('/update',resetPassword)

export default router;
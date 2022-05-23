import  express  from 'express';
import { body } from 'express-validator';
import { uploadImage } from '../controllers/upload.js';
import upload from '../middlewares/upload.js';
import auth from '../middlewares/auth.js';


const router = express.Router();


router.post('/image',auth,upload,uploadImage);


export default router;
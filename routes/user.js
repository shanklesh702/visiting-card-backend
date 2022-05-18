import  express  from 'express';
import { body } from 'express-validator';
import { verifyEmail,register, login, uploadProfileImage, updateProfile, fetchDataById, fetchAllUsers } from '../controllers/userController.js';
import upload from '../middlewares/upload.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register',
        [body('email').isEmail(),
        body('password').isLength({min:5}),
        body('fullName').isLength({min:1})],register);

router.post('/login',[body('email').isEmail(),
        body('password').isLength({min:1})],login);

router.post('/upload-profile',auth,
        uploadProfileImage);

router.put('/update-profile', auth,[
        body('id').isLength({min:5}),
        body('email').isEmail(),
        body('fullName').isLength({min:1})
],updateProfile);

router.post('/fetchDataById',auth,fetchDataById);
router.get('/',auth, fetchAllUsers)
router.post('/verify',verifyEmail)
export default router;


import  express  from 'express';
import { body } from 'express-validator';
import { verifyEmail,register, login, uploadProfileImage, updateProfile, fetchDataById, fetchAllUsers } from '../controllers/userController.js';
import upload from '../middlewares/upload.js';
import auth from '../middlewares/auth.js';
import { getAllCards } from '../controllers/cards.js';

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

router.get('/:userId',auth,fetchDataById);
router.get('/',auth, fetchAllUsers)
router.post('/verify',verifyEmail)
router.get('/cards/:userId',getAllCards)

export default router;


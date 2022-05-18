import multer, { diskStorage } from 'multer';
var storage = diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage }).single('image')
export default upload;

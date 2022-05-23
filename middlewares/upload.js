import multer, { diskStorage } from 'multer';
var storage = diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
    }
})
var upload = multer({ storage: storage }).single('image')
export default upload;

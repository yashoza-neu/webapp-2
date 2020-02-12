var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      var filetypes = /jpeg|jpg|png|pdf/;
      var mimetype = filetypes.test(file.mimetype);
      if (mimetype) {
        objId = file.originalname + '_' + Date.now().toString();
        cb(null, objId);
      } else {
        cb("Error: File upload only supports the following filetypes - " + filetypes);
      }
    }
});
var upload = multer({storage: storage});

module.exports = {
    upload
}
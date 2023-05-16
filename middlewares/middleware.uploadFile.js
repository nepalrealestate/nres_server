// image upload

const multer = require("multer");


function UploadImage(folderPath,maxImageSize) {
  let path = `${folderPath}`;

  console.log(path);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });

  this.upload = multer({
    storage: storage,
    limits: { fileSize: maxImageSize },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return  cb(new Error("Only .jpeg, .jpg, .png files are allowed"));
      }
    },
  });


  

 

}

module.exports = { UploadImage };

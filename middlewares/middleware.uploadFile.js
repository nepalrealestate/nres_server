// image upload

const multer = require("multer");
const fs = require('fs');



function UploadImage(folderPath, maxImageSize) {
  let path = `${folderPath}`;

  console.log(path);

  const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
      }
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
        return cb(new Error("Only .jpeg, .jpg, .png files are allowed"));
      }
    },
  });

}



// UploadImage.prototype.deleteImage = function (imageLink){

//   imageLink.forEach(function(link){
//     fs.unlink(link),function(err){
//       if(err){
//         console.log("Error while Deleting image",err);
//       }
//       console.log(link," image deleted")
//     }
//   })



// }


// delete from file link or file upload from client 

function extractPathsFromObjects(fileObjects) {
  return fileObjects.map(fileObject => fileObject.path);
}

function deleteFiles(input) {
  // Determine if the input is an array of file objects
  if (input.length > 0 && typeof input[0] === 'object' && input[0].path) {
      input = extractPathsFromObjects(input);
  }

  // At this point, input should be an array of file paths
  input.forEach(path => {
      fs.unlink(path, function(err) {
          if (err) {
              console.log("Error while Deleting image", err);
          } else {
              console.log(path, " image deleted");
          }
      });
  });
}





module.exports = { UploadImage, deleteFiles };

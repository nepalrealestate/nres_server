// image upload

const multer = require("multer");
const fs = require('fs');
const path = require("path");



// Helper function to generate a new name in case of duplicate filenames
function generateUniqueFilename(directory, originalName) {
  let baseName = path.basename(originalName, path.extname(originalName));
  let extension = path.extname(originalName);
  let newName = originalName;  // start with the original name including its extension
  let count = 1;

  while (fs.existsSync(path.join(directory, newName))) {
    newName = `${baseName}_${count}${extension}`;
    count++;
  }

  return newName;
}


function UploadImage(folderPath, maxImageSize) {
  let filePath = `${folderPath}`;

  console.log(filePath);

  const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }
      cb(null, filePath);
    },

    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      // cb(null, file.fieldname + "-" + uniqueSuffix);
      const sanitizedFileName = path.basename(file.originalname); // This will include the file's extension
      const uniqueFileName = generateUniqueFilename(filePath, sanitizedFileName); 

      cb(null,uniqueFileName);
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

  // if we have in json format - most likely fetched from db;
  if(typeof input ==='object'){
    let images = Object.values(input);
    console.log(images)
    images.forEach((path)=>{
      fs.unlink(path, function(err) {
        if (err) {
            console.log("Error while Deleting image", err);
        } else {
            console.log(path, " image deleted");
        }
    });
    })
  }else{
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

  
}





module.exports = { UploadImage, deleteFiles };

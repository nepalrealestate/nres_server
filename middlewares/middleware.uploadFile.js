// image upload

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/errorLogging/logger");
const sizeOf = require('image-size');
const util = require('util');
const { type } = require("os");




function UploadImage(folderPath, maxImageSize) {
  let filePath = `${folderPath}`;

  console.log(filePath);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      cb(null, filePath);
    },

    filename: function (req, file, cb) {
      const sanitizedFileName = path.basename(file.originalname); // This will include the file's extension
      const timestamp = Date.now(); // Add a timestamp to ensure uniqueness
      const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    
      cb(null, uniqueFileName);
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
  return fileObjects.map((fileObject) => fileObject.path);
}

// function deleteFiles(input) {
//   console.log("this is Input",input) 
//   const firstStringError = util.inspect(input);
//   logger.log({
//     level: "error",
//     message: firstStringError
//   })
//   let inputFile = null;
//   // Determine if the input is an array of file objects
//   // most likely insert from user and need to deleted 
//   if (typeof input[0] === "object" && input[0].path && input.length > 0 ) {
//     inputFile = extractPathsFromObjects(input);
//   }else{
//     inputFile = input;
//   }
  
//   if (Array.isArray(inputFile)) {
//     // At this point, input should be an array of file paths
//     inputFile.forEach((path) => {
//       fs.unlink(path, function (err) {
//         if (err) {
//           console.log("Error while Deleting image", err);
//           logger.log({
//             level: 'error',
//             message: `Error While Image Delet`
//            })
//         } else {
//           console.log(path, " image deleted");
//           logger.log({
//             level: 'info',
//             message: `Image Deleted`
//            })
//         }
//       });
//     });

//   } else if (typeof inputFile === "object") {
//     // 
//     let images = Object.values(input);
//     console.log(images);
//     images.forEach((path) => {
//       fs.unlink(path, function (err) {
//         if (err) {
//           console.log("Error while Deleting image", err);
//           logger.log({
//             level: 'error',
//             message: `Error While Image Delet`
//            })
//         } else {
//           console.log(path, " image deleted");
//           logger.log({
//             level: 'info',
//             message: `Image Deleted`
//            })
//         }
//       });
//     });
//   } else {
//     logger.log({
//       level: 'error',
//       message: `Invalid Image Input`
//      })
//   }
// }


function deleteSingleImage(path) {
  fs.unlink(path, function (err) {
    if (err) {
      console.log("Error while Deleting image", err);
      logger.error("Error while Deleting image", err);
    } else {
      console.log(path, " image deleted");
      logger.info(path, " image deleted");
    }
  });
}

function deleteMultipleImages(paths) {
  console.log("this is Input",paths)
  logger.error("this is Input for image delete",paths)
  if (!Array.isArray(paths)) {
    return;
  }

  // Use a for...of loop to allow the use of async/await
  for (const link of paths) {

    fs.unlink(link, function (err) {
      if (err) {
        console.log("Error while Deleting image", err);
        //logger.error("Error while Deleting image", err);
      } else {
        console.log(link, " image deleted");
        logger.info(link, " image deleted");
      }
    });
  }
}

async function chatImageUpload(base64Image, uploadPath, uploadSize) {
  try {
    const imageBuffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Check image size (2MB in bytes is 2 * 1024 * 1024)
    if (imageBuffer.length > 2 * 1024 * 1024) {
      throw new Error("Image size is greater than 2MB");
    }

    // Check image type
    const dimensions = sizeOf(imageBuffer);
    if (
      !["jpg", "png", "gif", "bmp", "tif", "webp"].includes(dimensions.type)
    ) {
      throw new Error("Invalid image type");
    }

    const tempFileName = Date.now() + ".png";
    const directoryPath = "uploads/chat/user";
    const tempFilePath = path.join(directoryPath, tempFileName);

    // Ensure the directory exists, if not create it
    try {
      await fs.access(directoryPath);
    } catch (error) {
      await fs.mkdir(directoryPath, { recursive: true });
    }

    // Save the image
    await fs.writeFile(tempFilePath, imageBuffer);

    return tempFilePath;
  } catch (error) {
    throw error;
  }
}

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("Error while Deleting image", err);
      logger.error("Error while Deleting image", err);
    }else{
      console.log(filePath, " image deleted");
      //logger.info(filePath, " image deleted");
    }
  });
}

const deleteFiles = (filePaths) => {
  let filePathArray;
  if(typeof filePaths==='object' && filePaths[0] && filePaths[0]?.path){
    filePathArray = extractPathsFromObjects(filePaths);
  }else if(typeof filePaths==='object'){
    filePathArray = Object.values(filePaths);
  }else if(Array.isArray(filePaths)){
    filePathArray = filePaths;
  }else{
    console.log("Invalid file paths");
    logger.error("Invalid file paths");
    return ;
  }
  filePathArray.forEach((filePath) => {
    deleteFile(filePath);
  });
}

module.exports = {
  UploadImage,
  deleteFiles,
  deleteSingleImage,
  chatImageUpload,
  deleteMultipleImages
};

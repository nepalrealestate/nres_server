
// image upload 

const multer = require('multer');



function UploadImage(folderPath){


    let path = `${folderPath}`;

    console.log(path);
    console.log("Path outside function ",path);

    const storage = multer.diskStorage({
        destination:function (req,file,cb){
            console.log("Path inside call back function ",path);
            cb(null,path);
        },
    
        filename:function (req,file,cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    
    })

    this.upload = multer({storage:storage});

}





// const storage = multer.diskStorage({
//     destination:function (req,file,cb){
//         cb(null,'../../uploads/property/apartment/images');
//     },

//     filename:function (req,file,cb){
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }

// })

// const upload = multer({storage:storage});

module.exports = {UploadImage};
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const logger = require('./errorLogging/logger');


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async(localFilePath,foderPath)=>{
    try{
        if(!localFilePath){
            return null;
        }
        console.log("Calling Upload on Cloudinary")
        const uploadedResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
            folder:foderPath
        });
        fs.unlinkSync(localFilePath);
        return uploadedResponse;
    }catch(error){
        if(localFilePath){
            fs.unlinkSync(localFilePath);
        }
        
        return null
    }
}

// const uploadMultipleOnCloudinary = async(localFilePathsArray,folderName)=>{
//     // @param {sting[]} localFilePathsArray
//     // @return {string{}} uploadedResponseURL - object
//     if(!localFilePathsArray || !Array.isArray(localFilePathsArray)){
//         return null;
//     }
//     try{
//         console.log("Calling Upload on Cloudinary")
//         let uploadedResponseURL = {};
//         let countImageUpload = 0;
//         for(let localPath of localFilePathsArray){
//             console.log("Uploading",localPath)
//             const uploadResponse = await cloudinary.uploader.upload(localPath,{
//                 resource_type:"auto",
//                 folder:folderName
//             });
//             uploadedResponseURL[countImageUpload] = uploadResponse.secure_url;
//             countImageUpload++;
//             //uploadedResponseURL.push(uploadResponse.secure_url);
//             console.log("Uploaded",uploadedResponseURL)
//             fs.unlinkSync(localPath);
//         }
//         return uploadedResponseURL;
//     }catch(error){
//         console.log(error);
//         if(localFilePathsArray){
//             for(let localPath of localFilePathsArray){
//                 fs.unlinkSync(localPath);
//             }
//         }
        
//         return null
//     }
// }

function extractPublicIdFromURL(url){
    return publicId = url.match(/\/v\d+\/(.+)\.[a-zA-Z]+$/)[1];
}

const uploadMultipleOnCloudinary = async (localFilePathsArray, folderName) => {
    if (!localFilePathsArray || !Array.isArray(localFilePathsArray)) {
        return null;
    }

    try {
        console.log("Calling Upload on Cloudinary");
        let uploadedResponseURL = {};
        let promises = [];

        localFilePathsArray.forEach((localPath, index) => {
            //console.log("Uploading", localPath);
            const uploadPromise = cloudinary.uploader.upload(localPath, {
                resource_type: "auto",
                folder: folderName,
                quality: "auto",
            }).then(uploadResponse => {
                uploadedResponseURL[Number(index)] = uploadResponse.secure_url;
               // console.log("Uploaded", uploadedResponseURL);
                fs.unlinkSync(localPath);
            });

            promises.push(uploadPromise);
        });
    

        // Wait for all uploads to complete
        await Promise.all(promises);

        return uploadedResponseURL;
    } catch (error) {
        console.error("Error uploading files:", error);

        // Handle errors appropriately
        if (localFilePathsArray) {
            localFilePathsArray.forEach(localPath => {
                fs.unlinkSync(localPath);
            });
        }

        return null;
    }
};


const deleteFromCloudinary = async(link)=>{
    if(!link){
        return null;
    }
    try {
        const publicId = extractPublicIdFromURL(link);
        const deleteResponse = await cloudinary.uploader.destroy(publicId);
        return deleteResponse;
    } catch (error) {
        console.log(error);
        return null;
    }

}


const deleteMultipleFromCloudinary = async (linkArray) => {
    if (!linkArray || !Array.isArray(linkArray)) {
        return null;
    }
    console.log("THis is link array",linkArray)
    try {
        console.log("Deleting from Cloudinary");
        let deleteResponseArray = [];
        let deletePromises = [];

        linkArray.forEach(link => {
                console.log("This is link",link);
                const splittedLink = link.split("/");
               // console.log("This is splitted link",splittedLink)
                const publicId = extractPublicIdFromURL(link)
                console.log("This is public id",publicId)
    
                const deletePromise = cloudinary.uploader.destroy(publicId)
                    .then(deleteResponse => {
                        deleteResponseArray.push(deleteResponse);
                    });
    
                deletePromises.push(deletePromise);
            
    
        });
        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        console.log("These are deleted", deleteResponseArray);
        return deleteResponseArray;
    } catch (error) {
        console.error("Error deleting files:", error);
        return null;
    }
};




module.exports = {
    uploadOnCloudinary,
    uploadMultipleOnCloudinary,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary
}



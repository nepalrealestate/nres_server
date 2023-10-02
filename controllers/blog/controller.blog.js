
const {UploadImage, deleteFiles, deleteSingleImage} = require("../../middlewares/middleware.uploadFile");
const { insertBlog, getBlog, getBlogById, deleteBlog } = require("../../models/services/blog/service.blog");
const {utility, handleErrorResponse, handleLimitOffset} = require("../controller.utils");
const upload = new UploadImage("uploads/blog/",2*1024*1024).upload.single("image");
const utils = utility();


const handleInsertBlog = async (req, res) => {
    upload(req,res,async function(err){
        utils.handleMulterError(req,res,err,postBlog,true);
    })
   
    async function postBlog(){
        
        const {title,body} = JSON.parse(req.body.blog);
        console.log(req.body.blog)

        let image = null;
        
        if(req.file){
            image = (req.file.path);
        }

        try {
            const blog = await insertBlog({title,body,image});
            return res.status(200).json({message:"Blog Posted"});
        } catch (error) {
            handleErrorResponse(res,error);            
        }
    }
}

const handleGetBlog = async(req,res)=>{
    const [limit,offset] = handleLimitOffset(req.query);
    const condition = {};
    try {
        const blog = await getBlog(condition,limit,offset);
        return res.status(200).json(blog);
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleGetBlogById = async(req,res)=>{
    const id = req.params.id;
    try {
        const blog = await getBlogById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found"});
        }
        return res.status(200).json(blog);
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

const handleDeleteBlog = async(req,res)=>{
    const id = req.params.id;
    try {
        const blog = await getBlogById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found"});
        }
        console.log(blog)
        if(blog.dataValues.image){
            deleteSingleImage(blog.dataValues.image);
        }
        
        const deleteResponse = await deleteBlog(id);
        if(deleteResponse == 0){
            return res.status(404).json({message:"blog not found"});
        }
        return res.status(200).json({message:"blog deleted"});
    } catch (error) {
        handleErrorResponse(res,error);
    }
}

module.exports = {handleInsertBlog,handleGetBlog,handleGetBlogById,handleDeleteBlog}
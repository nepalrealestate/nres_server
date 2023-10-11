const db = require('../../model.index');

const Blog = db.BlogModel.Blog;


async function insertBlog(blog){
    return await Blog.create(blog);
}

async function getBlog(condition,limit,offset){
    return await Blog.findAll({
        where:condition,
        limit:limit,
        offset:offset
    });
}

async function getBlogById(id){
    return await Blog.findByPk(id);
}

async function deleteBlog(id){
    return await Blog.destroy({
        where:{
            blog_id:id
        }
    })
}

module.exports = {insertBlog,getBlog,getBlogById,deleteBlog}
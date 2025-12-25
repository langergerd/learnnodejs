const mongoose = require('mongoose')
const Schema = mongoose.Schema  
/* Define the BlogPost schema */
const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})
/* Create the BlogPost model */
    const BlogPost = mongoose.model('BlogPost', blogPostSchema)
/* Export the model */
module.exports = BlogPost   
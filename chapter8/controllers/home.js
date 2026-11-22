const BlogPost = require('../models/BlogPost')

const index = async (req, res) => {
    try {
        const blogposts = await BlogPost.find({})
        console.log('Fetched blog posts:', blogposts)
        res.render('index', { blogposts })
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        res.render('index', { blogposts: [] })
    }
}

module.exports = { index }

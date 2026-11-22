const BlogPost = require('../models/BlogPost')

const show = async (req, res) => {
    try {
        const blogpost = await BlogPost.findById(req.params.id)
        if (!blogpost) {
            return res.status(404).send('Blog post not found')
        }
        res.render('post', { blogpost })
    } catch (error) {
        console.error('Error fetching blog post:', error)
        res.status(500).send('Server error')
    }
}

module.exports = { show }

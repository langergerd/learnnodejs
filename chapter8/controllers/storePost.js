const fs = require('fs/promises')
const path = require('path')
const { randomUUID } = require('crypto')
const BlogPost = require('../models/BlogPost')

const store = async (req, res) => {
    let uploadedFilePath
    try {
        const postData = {
            title: req.body.title,
            content: req.body.body
        }
        const image = req.files?.image

        if (image) {
            const extensionsByMimeType = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp'
            }
            const extension = extensionsByMimeType[image.mimetype]

            if (!extension) {
                return res.status(400).send('Please upload a JPEG, PNG, GIF, or WebP image')
            }

            const filename = `${randomUUID()}${extension}`
            const uploadDirectory = path.join(__dirname, '..', 'public', 'uploads')
            uploadedFilePath = path.join(uploadDirectory, filename)
            await fs.mkdir(uploadDirectory, { recursive: true })
            await image.mv(uploadedFilePath)
            postData.image = `/uploads/${filename}`
        }

        await BlogPost.create(postData)
        console.log('Blog post created successfully', req.body)
        res.redirect('/')
    } catch (error) {
        if (uploadedFilePath) {
            try {
                await fs.rm(uploadedFilePath, { force: true })
            } catch (cleanupError) {
                console.error('Error removing uploaded image after post creation failed:', cleanupError)
            }
        }
        console.error('Error creating blog post:', error)
        res.status(500).send('Error creating blog post')
    }
}

module.exports = { store }

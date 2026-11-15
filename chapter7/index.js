const express = require('express')
const path = require('path')
const fs = require('fs/promises')
const { randomUUID } = require('crypto')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')
const fileUpload = require('express-fileupload')

app.use(fileUpload())

/* Set EJS as the templating engine */
app.set('view engine','ejs')

/* Serving static files */
app.use(express.static(path.join(__dirname, 'public')))

/* Parse form bodies (application/x-www-form-urlencoded) */
app.use(express.json())     

/* Parse form bodies (application/x-www-form-urlencoded) */
app.use(express.urlencoded({ extended: true }))

/* Page Routing for the App = Controller*/

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.get('/', async (req, res) => {
    try {
        const blogposts = await BlogPost.find({});
        console.log('Fetched blog posts:', blogposts);
        res.render('index', { blogposts });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.render('index', { blogposts: [] });
    }
});

app.get('/about',(req,res)=>{
    res.render('about');
})
app.get('/contact',(req,res)=>{
    res.render('contact');
})
app.get('/post/:id', async (req, res) => {
    try {
        const blogpost = await BlogPost.findById(req.params.id);
        if (!blogpost) {
            return res.status(404).send('Blog post not found');
        }
        res.render('post', { blogpost });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).send('Server error');
    }
});

app.get('/create',(req,res)=>{
    res.render('create');
})

const validatePost = (req, res, next) => {
    const { title, body } = req.body ?? {}

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof body !== 'string' || !body.trim()
    ) {
        return res.redirect('/create')
    }

    next()
}

app.post('/posts/store', validatePost, async (req,res)=>{
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
            const uploadDirectory = path.join(__dirname, 'public', 'uploads')
            uploadedFilePath = path.join(uploadDirectory, filename)
            await fs.mkdir(uploadDirectory, { recursive: true })
            await image.mv(uploadedFilePath)
            postData.image = `/uploads/${filename}`
        }

        await BlogPost.create(postData)
        console.log('Blog post created successfully', req.body);
        res.redirect('/');
    } catch (error) {
        if (uploadedFilePath) {
            try {
                await fs.rm(uploadedFilePath, { force: true })
            } catch (cleanupError) {
                console.error('Error removing uploaded image after post creation failed:', cleanupError)
            }
        }
        console.error('Error creating blog post:', error);
        res.status(500).send('Error creating blog post');
    }
});

/* Connect to MongoDB and start server after routes are defined */
/* Server nur starten wenn DB-Connection hergestellt werden kann, Betriebssicherheit */
mongoose.connect('mongodb://127.0.0.1:27017/my_database').then(() => {
    console.log('Connected to MongoDB');

    app.listen(4000, () => {
        console.log('App listening on port 4000')
    })
}).catch(err => {
    console.error('MongoDB connection error:', err);
})
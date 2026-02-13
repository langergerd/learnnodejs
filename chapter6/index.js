const express = require('express')
const path = require('path')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')


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
app.post('/posts/store',(req,res)=>{
    // Logic to handle form submission and create a new blog post
    BlogPost.create({
        title: req.body.title,
        content: req.body.body
    }).then(() => {
        console.log('Blog post created successfully', req.body);
        res.redirect('/');
    }).catch((error) => {
        console.error('Error creating blog post:', error);
        res.status(500).send('Error creating blog post');
    });
})

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
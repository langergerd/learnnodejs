const express = require('express')
const path = require('path')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const getPostController = require('./controllers/getPost')
const homeController = require('./controllers/home')
const newPostController = require('./controllers/newPostController')
const storePostController = require('./controllers/storePost')
const validateMiddleware = require('./middleware/validateMiddleware')

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

app.get('/', homeController.index)
app.get('/post/:id', getPostController.show)
app.get('/posts/new', newPostController.show)
app.post('/posts/store', validateMiddleware, storePostController.store)

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
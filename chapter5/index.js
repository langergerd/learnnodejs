const express = require('express')
const path = require('path')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')


/* Set EJS as the templating engine */
app.set('view engine','ejs')

/* Serving static files */
app.use(express.static(path.join(__dirname, 'public')))

/* Page Routing for the App = Controller*/
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/about',(req,res)=>{
    res.render('about');
})
app.get('/contact',(req,res)=>{
    res.render('contact');
})
app.get('/post',(req,res)=>{
    res.render('post');
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
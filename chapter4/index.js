const express = require('express')
const path = require('path')
const app = express()
const ejs = require('ejs')

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
/* Start the server */
app.listen(4000, () => {
    console.log('App listening on port 4000')
})
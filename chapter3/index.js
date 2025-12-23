const express = require('express')
const path = require('path')
const app = express()

/* Serving static files */
app.use(express.static(path.join(__dirname, 'public')))

/* Page Routing for the App = Controller*/
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages', 'index.html'))
})
app.get('/about',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages', 'about.html'))
})
app.get('/contact',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages', 'contact.html'))
})
app.get('/post',(req,res)=>{
    res.sendFile(path.join(__dirname, 'pages', 'post.html'))
})
/* Start the server */
app.listen(4000, () => {
    console.log('App listening on port 4000')
})
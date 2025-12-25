const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://127.0.0.1:27017/my_database').then(() => {
    console.log('Connected to MongoDB');

    // Create and save a new blog post using Model.create()
    BlogPost.create({
        title: 'My First Blog Post 3',
        content: 'This is the content of my first blog post 3.'
    }).then(blogpost => {
        console.log('Blog post saved successfully', blogpost);
        return mongoose.connection.close();
    }).catch(error => {
        console.error('Error saving blog post:', error);
        return mongoose.connection.close();
    });

}).catch(error => {
    console.error('MongoDB connection error:', error);
});
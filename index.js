const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');


// Set up the Express app and define the port:
const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://hangoutwithani:abcd1234@blog.4q58zis.mongodb.net/?retryWrites=true&w=majority';


// Connect to the MongoDB database:
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));


  // Create a Mongoose schema for the blog post:
  const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String, // File name or path to the local file system
  });
  
  const Blog = mongoose.model('Blog', blogSchema);


//   Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/'); // Directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


  

//   Define the API endpoints:

app.post('/blogs', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const { filename } = req.file;

  const blog = new Blog({ title, content, image: filename });
  blog.save()
    .then(() => {
      res.status(201).json(blog);
    })
    .catch(err => {
      console.error('Failed to save blog:', err);
      res.status(500).json({ error: 'Failed to save blog' });
    });
});

app.get('/blogs', (req, res) => {
  Blog.find()
    .then(blogs => {
      res.json(blogs);
    })
    .catch(err => {
      console.error('Failed to fetch blogs:', err);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    });
});


  
//   Start the server:
app.listen(port, () => {
    console.log(`Server is running on port ${3000}`);
  });  

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const port = 3001
require('dotenv').config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Serve static files
app.use(express.static(path.join(__dirname, 'public')))
// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);
// Define routes
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/users', (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ message: err.message }));
});
app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).json({ message: err.message }));
});
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId, updateData, { new: true })
        .then(updateUser => {
            if (!updateUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updateUser);
        })
        .catch(err => res.status(400).json({ message: err.message }));
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
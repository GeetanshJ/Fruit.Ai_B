const express = require('express');
const connectDB = require('./db');
const Faq = require('./schema');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));
require('dotenv').config();


connectDB();
app.use(express.json());
app.use(cors());
app.get("/", (req,res) => {
    res.status(201);
})

app.get('/faqs', async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.post('/faqs', upload.single('image'), async (req, res) => {
    const { question, answer } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const newFaq = new Faq({ question, answer, image });
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/faqs/:id', async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/faqs/:id', async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

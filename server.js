const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const Faq = require('./schema');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors({
    origin: "https://fruit-ai-1cw1.vercel.app",
}));

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });
app.get("/",(req,res) => {
    res.send("Hi!! Welcome to Backend of Fruit.Ai")
})
app.get("/faqs", async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch FAQs' });
    }
});

app.post("/faqs", upload.single('image'), async (req, res) => {
    try {
        const { question, answer } = req.body;
        const image = req.file ? req.file.path : null;
        const newFaq = new Faq({ question, answer, image });
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create FAQ' });
    }
});

app.put("/faqs/:id", upload.single('image'), async (req, res) => {
    try {
        const { question, answer } = req.body;
        const image = req.file ? req.file.path : null;
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, { question, answer, image }, { new: true });
        res.json(updatedFaq);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update FAQ' });
    }
});

app.delete("/faqs/:id", async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete FAQ' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

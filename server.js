const express = require("express");
const connectDB = require("./db");
const Faq = require("./schema");
const cors = require("cors");
const { createRouteHandler } = require("uploadthing/express");
const uploadRouter = require("./uploadthing");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:3000", "https://fruit-ai-1cw1.vercel.app"],
}));

app.use(
    "/api/uploadthing",
    createRouteHandler({
        router: uploadRouter,
        config: {},
    })
);

app.get("/", (req, res) => {
    res.send("API WORKING")
});

app.get("/faqs", async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/faqs", async (req, res) => {
    try {
        const { image, question, answer } = req.body;
        let imageUrl = null;

        if (image) {
            const uploadResponse = await uploadRouter.imageUploader.upload({ file: image });
            imageUrl = uploadResponse.url;
        }

        const newFaq = new Faq({ question, answer, image: imageUrl });
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/faqs/:id", async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updatedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/faqs/:id", async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: "FAQ deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use((req, res, next) => {
    res.send("Wrong Route Buddy!!!!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Uploaded images ko public karne ke liye folder link karna
app.use('/amin_backend', express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas Successfully! 🚀"))
  .catch((err) => console.log("Database Connection Error: ", err));

// Multer Setup (Laptop se image save karne ke liye)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // amin_backend ke andar uploads folder ban jayega
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Watch Schema & Model
const watchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }
});

const Watch = mongoose.model('Watch', watchSchema);

// 1. Nayi watch add karne ka Route (Image file ke sath)
app.post('/api/watches', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const newWatch = new Watch({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: imagePath
    });
    await newWatch.save();
    res.status(201).json({ message: "Watch added successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Watches get karne ka Route
app.get('/api/watches', async (req, res) => {
  try {
    const category = req.query.category;
    let query = category ? { category } : {};
    const watches = await Watch.find(query);
    res.json(watches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Watch delete karne ka Route
app.delete('/api/watches/:id', async (req, res) => {
  try {
    await Watch.findByIdAndDelete(req.params.id);
    res.json({ message: "Watch deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
import express from "express";
import multer from "multer";
import MedicalBlog from "../Models/MedicalBlog.js";
import path from "path";

const router = express.Router();

// ---------------- MULTER STORAGE CONFIG ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/medicalBlogs");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ---------------- CREATE MEDICAL BLOG ----------------
router.post(
  "/add-blog",
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { title, shortDescription, mainCategory, subCategory } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Featured image is required" });
      }

      const newBlog = new MedicalBlog({
        title,
        shortDescription,
        mainCategory,
        subCategory,
        featuredImage: req.file.filename,
        createdBy: req.user?._id || null, // If authentication set
      });

      await newBlog.save();

      res.status(201).json({
        message: "Blog uploaded successfully",
        blog: newBlog,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ---------------- GET ALL BLOGS ----------------
router.get("/all", async (req, res) => {
  try {
    const blogs = await MedicalBlog.find().sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      return res.status(200).json({ success: true, blogs: [] });
    }

    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

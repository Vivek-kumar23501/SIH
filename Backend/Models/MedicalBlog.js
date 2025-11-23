import mongoose from "mongoose";

const medicalBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      default: "",
      trim: true,
    },
    featuredImage: {
      type: String, // Will store image URL / filename
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Linked with Medical Expert / Author
      required: false,
    },
  },
  { timestamps: true }
);

const MedicalBlog = mongoose.model("MedicalBlog", medicalBlogSchema);

export default MedicalBlog;

import mongoose from "mongoose";

const PatientQuerySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: false,  // Multiple queries can be done from same email
    },

    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },

    age: {
      type: Number,
      required: true,
      min: 1
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"]
    },

    symptomsDuration: {
      type: Number,
      required: true,
    },

    symptoms: {
      type: String,
      required: true,
      trim: true
    },

    medicalHistory: {
      type: String,
      required: true,
    },

    medicalReport: {
      type: String, // File URL will be stored (PDF/JPG/PNG)
      default: null
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PatientQuery", PatientQuerySchema);

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Optional for notification

const MedicalBlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    mainCategory: "",
    subCategory: "",
    featuredImage: null
  });

  // Handle Text Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, featuredImage: e.target.files[0] });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.featuredImage) {
      return toast.error("Featured Image is required!");
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("mainCategory", formData.mainCategory);
    data.append("subCategory", formData.subCategory);
    data.append("featuredImage", formData.featuredImage);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/medical/add-blog",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      toast.success("Blog uploaded successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        title: "",
        shortDescription: "",
        mainCategory: "",
        subCategory: "",
        featuredImage: null
      });

      document.getElementById("blogImageInput").value = "";

    } catch (error) {
      console.log(error);
      toast.error("Failed to upload. Try Again!");
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex justify-center items-start md:items-center py-10 mt-[10vh] md:mt-0">

      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 border-t-4 border-[#00796b]">

        <h2 className="text-2xl font-bold text-[#00796b] uppercase text-center mb-6">
          Medical Blog Details
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

          {/* Blog Title */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Title of Blog *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Short Description / Summary *
            </label>
            <textarea
              name="shortDescription"
              required
              rows={3}
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Write a short preview for users"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]"
            ></textarea>
          </div>

          {/* Main Category */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Main Category *
            </label>
            <select
              name="mainCategory"
              required
              value={formData.mainCategory}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-[#00acc1]"
            >
              <option value="">Select category</option>
              <option>General Health</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Dermatology</option>
              <option>Pediatrics</option>
              <option>Respiratory</option>
            </select>
          </div>

          {/* Sub Category */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Sub Category (Optional)
            </label>
            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="Eg: Heart Attack / Migraine etc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]"
            />
          </div>

          {/* Featured Image */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Featured Image (Thumbnail) *
            </label>
            <input
              type="file"
              id="blogImageInput"
              required
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-[#00acc1]"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white px-10 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-md"
            >
              Save & Continue
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default MedicalBlogForm;

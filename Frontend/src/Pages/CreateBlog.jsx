import React, { useState } from "react";

function CreateBlog() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    image: null,
    documents: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Blog Submitted:", formData);
    alert("Blog Published Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-36 flex justify-center px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-center mb-6 font-bold text-3xl text-blue-900">
          Create New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
            />
          </div>

          {/* AUTHOR */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Author Name *
            </label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter author name"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Category *
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Health Tips">Health Tips</option>
              <option value="Patient Care">Patient Care</option>
              <option value="Medicines">Medicines</option>
              <option value="Diseases">Diseases</option>
              <option value="Mental Health">Mental Health</option>
            </select>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Thumbnail Image *
            </label>
            <input
              type="file"
              name="image"
              required
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full p-3 border rounded-md cursor-pointer bg-gray-50"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Blog Content *
            </label>
            <textarea
              name="content"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 border rounded-md h-40 resize-y outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your blog content here..."
            />
          </div>

          {/* DOCUMENT UPLOAD */}
          <div>
            <label className="font-semibold text-blue-900 block mb-1 text-sm">
              Upload Supporting Document (Optional)
            </label>
            <input
              type="file"
              name="documents"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="w-full p-3 border rounded-md cursor-pointer bg-gray-50"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition font-medium shadow-md hover:shadow-lg"
          >
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;

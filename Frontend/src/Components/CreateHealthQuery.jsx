import React, { useState } from "react";

function CreateHealthQuery() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    title: "",
    category: "",
    details: "",
    document: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Query Submitted:", formData);
    alert("Your Health Query has been submitted!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8ff",
        paddingTop: "135px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "55%",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontWeight: "600",
            fontSize: "24px",
            color: "#003366",
          }}
        >
          Submit Your Health Query
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Patient Name */}
          <label style={labelStyle}>Your Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your full name"
          />

          {/* Age */}
          <label style={labelStyle}>Age *</label>
          <input
            type="number"
            name="age"
            required
            value={formData.age}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Enter your age"
          />

          {/* Title */}
          <label style={labelStyle}>Query Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Short summary of your problem"
          />

          {/* Category */}
          <label style={labelStyle}>Category *</label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select Category</option>
            <option value="General Health">General Health</option>
            <option value="Fever">Fever</option>
            <option value="Skin Problem">Skin Problem</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Heart Issue">Heart Issue</option>
            <option value="Pain / Body Ache">Pain / Body Ache</option>
          </select>

          {/* Details */}
          <label style={labelStyle}>Explain Your Problem *</label>
          <textarea
            name="details"
            required
            value={formData.details}
            onChange={handleChange}
            style={{
              ...inputStyle,
              height: "150px",
              resize: "vertical",
            }}
            placeholder="Explain your health issue clearly so doctors can understand"
          />

          {/* Document Upload */}
          <label style={labelStyle}>Upload Report / Image (Optional)</label>
          <input
            type="file"
            name="document"
            onChange={handleFile}
            accept="image/*,.pdf,.docx"
            style={inputStyle}
          />

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#0056b3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
              fontSize: "16px",
            }}
          >
            Submit Query
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const labelStyle = {
  fontWeight: "600",
  color: "#003366",
  marginBottom: "5px",
  display: "block",
};

export default CreateHealthQuery;

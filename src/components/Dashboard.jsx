import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [complaints, setComplaints] = useState([]);

  const [aiResult, setAiResult] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const navigate = useNavigate();

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // Save complaint
      await API.post("/complaints", form);

      // AI Analysis
      const aiRes = await API.post("/ai/analyze", {
        description: form.description,
        category: form.category
      });

      setAiResult(aiRes.data);

      alert("Complaint Submitted");

      setForm({
        name: "",
        email: "",
        title: "",
        description: "",
        category: "",
        location: ""
      });

      fetchComplaints();

    } catch (error) {
      console.log(error);
    }
  };

  // Update status
  const updateStatus = async (id) => {
    try {

      await API.put(`/complaints/${id}`, {
        status: "Resolved"
      });

      fetchComplaints();

    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      <h2>Complaint Dashboard</h2>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Complaint Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <button type="submit">
          Submit Complaint
        </button>

      </form>

      {/* AI Result */}

      {aiResult && (
        <div className="ai-box">

          <h3>AI Analysis Result</h3>

          <p>
            <b>Priority:</b> {aiResult.priority}
          </p>

          <p>
            <b>Department:</b> {aiResult.department}
          </p>

          <p>
            <b>Summary:</b> {aiResult.summary}
          </p>

          <p>
            <b>Response:</b> {aiResult.responseMessage}
          </p>

        </div>
      )}

      <h3>All Complaints</h3>

      {complaints.map((c) => (
        <div className="card" key={c._id}>

          <p><b>{c.title}</b></p>

          <p>{c.description}</p>

          <p>{c.category}</p>

          <p>{c.location}</p>

          <p>Status: {c.status}</p>

          <button
            onClick={() => updateStatus(c._id)}
          >
            Mark Resolved
          </button>

        </div>
      ))}

    </div>
  );
}

export default Dashboard;
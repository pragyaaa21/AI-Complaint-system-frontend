import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid Credentials");
      console.log(error);
    }
  };

  return  (
  <div className="container">
    <h2>Login</h2>

    <form onSubmit={handleSubmit}>

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button type="submit">
        Login
      </button>

    </form>

    <p className="switch-text">
      Not registered?
      <span onClick={() => navigate("/register")}>
        Register here
      </span>
    </p>

  </div>
); 
}

export default Login;
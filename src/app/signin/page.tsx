"use client";
import axios from '../utils/axiosConfig'

import React, {useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginStyles from "@/components/home/LoginStyle";

const stats = [
  { value: "94%", label: "Completion Rate", color: "#16a34a" },
  { value: "12", label: "Active Interns", color: "#ca8a04" },
  { value: "8/12", label: "On Track", color: "#2563eb" },
];



const pills = ["Task Tracking", "Progress Reports", "Deadline Alerts", "Activity Feed"];

export default function Page() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: ""
  })

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e)=>{
    setLoading(true);
     e.preventDefault();
    const res = await axios.post("/auth", {
      username: formData.username,
      password: formData.password,
      role: formData.role
    })

    if(res.status === 200){
      localStorage.setItem("role", JSON.stringify(res.data.role));
      localStorage.setItem("username", JSON.stringify(res.data.username));
      localStorage.setItem("userId", JSON.stringify(res.data.userId));

      setLoading(false);
      
      if(res.data.role === "Admin"){
        router.push("/overview")
      }
      else if(res.data.role === "Intern"){
        router.push("/personal")
      }
    }

    setFormData({
      username: "",
      password: "",
      role: ""
    })
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoginStyles />

      <div className="root">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />

        <form className={`card ${visible ? "visible" : ""}`} onSubmit={handleLogin}>
          <div className="flex items-center justify-center" style={{ marginBottom: "40px" }}>
            <img
              style={{ width: "150px", height: "150px" }}
              src="/TaskTrail-Logo.png"
              alt="Task Trail Logo"
            />
          </div>

          <h1 className="heading">
            Welcome
          </h1>

          <div className="parent-input">
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="select select-bordered w-full "
              required
            >
              <option value="">Select Role</option>
              <option value="Intern">Intern</option>
              <option value="Admin">Admin</option>
            </select>
            <input type="text" value={formData.username} onChange={(e)=> setFormData({...formData, username: e.target.value})} placeholder="Enter username" />

            <input type="password" value={formData.password} onChange={(e)=> setFormData({...formData, password: e.target.value})} placeholder="Enter password" />
          </div>

          <div className="divider" />

          <div className="actions">
            <button className="btn-primary " type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>

          </div>


        </form>
      </div>
    </>
  );
}
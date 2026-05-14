"use client";
import axios from '../utils/axiosConfig';
import { isAxiosError } from 'axios';

import React, { useEffect, useState } from "react";
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth", {
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
      });

      localStorage.setItem("role", JSON.stringify(res.data.role));
      localStorage.setItem("username", JSON.stringify(res.data.username));
      // Save full name when available; fall back to username
      localStorage.setItem("name", JSON.stringify(res.data.name || res.data.username));
      localStorage.setItem("userId", JSON.stringify(res.data.userId));

      if (res.data.role === "Admin") {
        router.push("/overview");
      } else if (res.data.role === "Intern" || res.data.role === "Employee") {
        router.push("/personal");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed. Please check your username and password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }

    setFormData({ username: "", password: "" });
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

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

          <h1 className="heading">Welcome</h1>

          <div className="parent-input">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>

          <div
            className={`mt-4 min-h-[52px] rounded-lg border px-4 py-3 text-sm font-semibold text-center shadow-sm transition-all duration-500 ${
              error
                ? "border-red-300 bg-red-50 text-red-700 opacity-100"
                : "border-transparent bg-transparent text-transparent opacity-0"
            }`}
            role="alert"
            aria-live="assertive"
          >
            {error || "."}
          </div>

          <div className="divider" />

          <div className="actions">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
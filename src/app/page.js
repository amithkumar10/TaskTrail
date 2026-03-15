"use client";

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
  const [visible, setVisible] = useState(false);

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

        <div className={`card ${visible ? "visible" : ""}`}>
          <div className="flex items-center justify-center" style={{ marginBottom: "40px" }}>
            <img
              style={{ width: "150px", height: "150px" }}
              src="/TaskTrail-Logo.png"
              alt="Task Trail Logo"
            />
          </div>

          <h1 className="heading">
            Keep your interns<br />
            <em>on track,</em> always.
          </h1>

          <p className="subtext">
            TaskTrail helps you monitor what your interns are working on, spot blockers early, and make smarter team decisions — all in one place.
          </p>


          <div className="divider" />

          <div className="actions">
            <button className="btn-primary " onClick={() => router.push("/signin")}>
              <span className="btn-title">Get Started →</span>
              <span className="btn-hint">All intern activity</span>
            </button>
          
          </div>


        </div>
      </div>
    </>
  );
}
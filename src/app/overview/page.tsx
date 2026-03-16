"use client";

import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { useRouter } from "next/navigation";

const companyDomain = "tasktrail.com";

const OverviewPage = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [project, setProject] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [manager, setManager] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const checkAuthorization = () => {
    const role = localStorage.getItem("role") ? JSON.parse(localStorage.getItem("role")) : null;
    if (role !== "Admin") {
      window.location.href = "/unauthorized";
    }
  };


  const [mailStatus, setMailStatus] = useState("idle");

  useEffect(() => {
    checkAuthorization();
    const fetchInterns = async () => {
      try {
        const res = await api.get("/users");
        const internsOnly = (res.data || []).filter(
          (user) => user.role === "Intern"
        );
        setInterns(internsOnly);
      } catch (err) {
        setError("Failed to load interns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [interns.length]);

  const generatePassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const sendCredentialsMail = async ({ name, email, username, password }) => {
    setMailStatus("sending");
    try {
      const res = await fetch("/api/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      });

      if (!res.ok) throw new Error("Mail API responded with an error.");
      setMailStatus("sent");
    } catch (err) {
      console.error("Failed to send credentials email:", err);
      setMailStatus("failed");
    }
  };

  const handleAddIntern = async (e) => {
    e.preventDefault();
    setError("");
    setMailStatus("idle");

    const trimmedName = firstName.trim();
    const trimmedProject = project.trim();
    const trimmedManager = manager.trim();
    const trimmedPosition = position.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("First name is required.");
      return;
    }

    const username = `${trimmedName.toLowerCase()}@${companyDomain}`;
    const password = generatePassword();

    setSubmitting(true);

    try {
      await api.post("/users", {
        name: trimmedName,
        username: username,
        project: trimmedProject || "Not assigned",
        manager: trimmedManager || "Not assigned",
        role: "Intern",
        password: password,
        position: trimmedPosition || "Not assigned",
        email: trimmedEmail,
      });

      setInterns((prev) => [
        ...prev,
        {
          name: trimmedName,
          username: username,
          project: trimmedProject || "Not assigned",
          manager: trimmedManager || "Not assigned",
          position: trimmedPosition || "Not assigned",
          password: password,
          role: "Intern",
          email: trimmedEmail,
        },
      ]);

      setGeneratedUsername(username);
      setGeneratedPassword(password);

      setFirstName("");
      setProject("");
      setManager("");
      setPosition("");
      setEmail("");

      // ✉️ Send credentials email right after account is created
      if (trimmedEmail) {
        await sendCredentialsMail({
          name: trimmedName,
          email: trimmedEmail,
          username,
          password,
        });
      } else {
        setMailStatus("idle"); // no email provided, skip silently
      }
    } catch (err) {
      setError("Failed to add intern. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 px-10 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex bg-black text-white justify-between gap-2 border-b border-border px-10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="p-5">
            <span className="font-bold text-xl tracking-tight">
              Welcome, Admin
            </span>
            <p className="text-sm text-muted-foreground">
              View all interns and create new intern accounts.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg mr-10 p-4 shadow-sm">
            <span className="text-muted-foreground">Total interns</span>
            <span className="text-lg font-semibold">{interns.length}</span>
          </div>
        </header>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-x-10">
          <section className="mb-5 w-full border border-border bg-card p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 ml-12 text-base font-semibold tracking-tight sm:text-lg">
              Intern list
            </h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading interns…</p>
            ) : interns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No interns found yet. Add a new intern on the right.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg mx-10 border border-border/80 bg-background">
                <div className="flex justify-between p-4 bg-black text-white text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid-cols-[1.2fr_1.2fr_auto]">
                  <span>Name</span>
                  <span className="hidden sm:block">Username</span>
                  <span className="text-right">Position</span>
                </div>
                <ul className="divide-y divide-border/80">
                  {interns.map((intern, index) => (
                    <li
                    onClick={() => (intern._id && router.push(`/overview/dashboard/${intern._id}`))}
                      key={intern._id || `${intern.username}-${index}`}
                      className="flex justify-between p-4 border border-border/80 cursor-pointer hover:bg-gray-300 items-center px-4 py-2 text-sm sm:grid-cols-[1.2fr_1.2fr_auto]"
                    >
                      <div className="font-medium text-foreground">
                        {intern.name || "Unnamed intern"}
                      </div>
                      <div className="hidden truncate text-xs text-muted-foreground sm:block">
                        {intern.username}
                      </div>
                      <div className="text-right text-xs font-medium text-muted-foreground">
                        {intern.position || "Intern"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4 border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="bg-black text-white mx-10 p-3 rounded-tl-lg rounded-tr-lg rounded-br-none">
              <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                Add new intern
              </h2>
            </div>

            <form className="p-4 mx-10" onSubmit={handleAddIntern}>
              <div className="">
                <label className="text-xs font-medium text-muted-foreground sm:text-sm">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Alzaahid"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground sm:text-sm">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alzaahid@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground sm:text-sm">
                  Project
                </label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Internal Dashboard"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground sm:text-sm">
                  Manager
                </label>
                <input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Elton Dias"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground sm:text-sm">
                  Position
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. UI/UX Intern"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex cursor-pointer w-40 mt-4 items-center justify-center rounded-md bg-black text-white p-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creating intern…" : "Create intern"}
              </button>
            </form>

            {(generatedUsername || generatedPassword) && (
              <div className="mt-2 space-y-2 rounded-lg border border-border bg-muted/60 px-3 py-3 text-xs sm:text-sm mx-10">
                <p className="font-medium text-foreground">Generated credentials</p>
                {generatedUsername && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Username: </span>
                    {generatedUsername}
                  </p>
                )}
                {generatedPassword && (
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Password: </span>
                    {generatedPassword}
                  </p>
                )}

                {/* ✉️ Mail status indicator */}
                {mailStatus === "sending" && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    📨 Sending credentials to intern's email…
                  </p>
                )}
                {mailStatus === "sent" && (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Credentials emailed to the intern successfully.
                  </p>
                )}
                {mailStatus === "failed" && (
                  <p className="text-xs text-red-500 font-medium">
                    ⚠️ Failed to send email. Please share credentials manually.
                  </p>
                )}

                <p className="mt-1 text-[11px] text-muted-foreground">
                  Share these credentials securely with the intern. The password
                  is only shown once here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
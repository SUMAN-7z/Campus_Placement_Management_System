import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  CheckCircle,
  Upload,
} from "lucide-react";

const GithubIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const StudentProfile = () => {
  const { user, updateProfileStatus } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    gender: "Male",
    dob: "",
    address: "",
    department: "MCA",
    branch: "Computer Applications",
    cgpa: "",
    passingYear: "",
    skills: "",
    projects: "",
    certifications: "",
    internships: "",
    linkedin: "",
    github: "",
    resumePath: "",
    isVerified: false,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);

const fetchProfile = async () => {
  console.log("fetchProfile called");

  try {
    const res = await API.get(`/api/student/profile/${user.userId}`);
    const data = res.data;

    setProfile({
      name: data.name ?? "",
      phone: data.phone ?? "",
      gender: data.gender ?? "Male",
      dob: data.dob ?? "",
      address: data.address ?? "",
      department: data.department ?? "",
      branch: data.branch ?? "",
      cgpa: data.cgpa ?? "",
      passingYear: data.passingYear ?? "",
      skills: data.skills ?? "",
      projects: data.projects ?? "",
      certifications: data.certifications ?? "",
      internships: data.internships ?? "",
      linkedin: data.linkedin ?? "",
      github: data.github ?? "",
      resumePath: data.resumePath ?? "",
      isVerified: data.isVerified ?? false,
    });

    // TEMPORARILY COMMENT THIS
    // updateProfileStatus(!!data.cgpa, data.isVerified);

  } catch (err) {
    console.error("Failed to fetch profile", err);
  } finally {
    setLoading(false);
  }
};

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setProfile((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(name, value);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await API.put(`/api/student/profile/${user.userId}`, {
        ...profile,
        cgpa: profile.cgpa === "" ? 0 : Number(profile.cgpa),
        passingYear:
          profile.passingYear === "" ? 0 : Number(profile.passingYear),
      });
      const data = res.data;
      setProfile({
        ...data,
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        department: data.department || "",
        branch: data.branch || "",
        dob: data.dob || "",
        cgpa: data.cgpa || "",
        passingYear: data.passingYear || "",
        skills: data.skills || "",
        projects: data.projects || "",
        certifications: data.certifications || "",
        internships: data.internships || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
      });
      setMessage({
        text: "Academic profile updated successfully!",
        type: "success",
      });
      // Sync auth state
      // updateProfileStatus(!!data.cgpa, data.isVerified);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Profile update failed.",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await API.post(
        `/api/student/profile/${user.userId}/resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setProfile((prev) => ({ ...prev, resumePath: res.data.resumePath }));
      setMessage({ text: "Resume uploaded successfully!", type: "success" });
      updateProfileStatus(true, res.data.isVerified);
      setResumeFile(null);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Resume upload failed.",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header card */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center font-extrabold text-primary-400 text-2xl">
            {profile.name ? profile.name[0].toUpperCase() : "S"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-200">
              {profile.name || "Set Student Name"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {profile.department} • {profile.branch || "Branch"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile.isVerified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
              >
                {profile.isVerified ? "VERIFIED PROFILE" : "UNVERIFIED PROFILE"}
              </span>
            </div>
          </div>
        </div>

        {/* Short resume status */}
        <div className="text-right">
          {profile.resumePath ? (
            <a
              href={`http://localhost:8080${profile.resumePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 font-semibold border border-primary-500/20 px-3.5 py-2 rounded-xl bg-primary-500/5 hover:bg-primary-500/10 transition-all"
            >
              <FileText className="h-4 w-4" /> View Loaded Resume
            </a>
          ) : (
            <span className="text-xs text-slate-500 font-medium italic">
              No resume loaded
            </span>
          )}
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Resume Upload & Socials */}
        <div className="space-y-6">
          {/* Resume Upload Panel */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200">
              Manage Resume PDF
            </h3>

            <form onSubmit={handleResumeUpload} className="space-y-3">
              <div className="border-2 border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-8 w-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400 font-semibold mt-2">
                  {resumeFile ? resumeFile.name : "Select Resume PDF"}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Accepts PDF format only (max 10MB)
                </p>
              </div>

              {resumeFile && (
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full text-center bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2 rounded-lg text-xs transition-all glow-btn"
                >
                  {uploading ? "Uploading..." : "Confirm Upload"}
                </button>
              )}
            </form>
          </div>

          {/* Social Links Form */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-200">
              Professional Handles
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  LinkedIn URL
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                    <LinkedinIcon className="h-4 w-4" />
                  </div>
                  <input
                    name="linkedin"
                    type="url"
                    value={profile.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  GitHub URL
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                    <GithubIcon className="h-4 w-4" />
                  </div>
                  <input
                    name="github"
                    type="url"
                    value={profile.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form Details */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="font-bold text-sm text-slate-200 mb-5 border-b border-slate-800 pb-3">
            Academic & Profile Details
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={profile.name}
                  onChange={handleChange}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  name="phone"
                  type="text"
                  required
                  value={profile.phone}
                  onChange={handleChange}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Row 2: DOB & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  type="date"
                  value={profile.dob}
                  onChange={handleChange}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender ?? "Male"}
                  onChange={handleChange}
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 3: Department & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Department
                </label>
                <input
                  name="department"
                  type="text"
                  required
                  value={profile.department}
                  onChange={handleChange}
                  placeholder="e.g. MCA, B.Tech"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Branch
                </label>
                <input
                  name="branch"
                  type="text"
                  required
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Row 4: CGPA & passing year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Current CGPA
                </label>
                <input
                  name="cgpa"
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="10.00"
                  required
                  value={profile.cgpa ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Year of Passing
                </label>
                <input
                  name="passingYear"
                  type="number"
                  required
                  value={profile.passingYear ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. 2026"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Permanent Address
              </label>
              <textarea
                name="address"
                rows="2"
                value={profile.address}
                onChange={handleChange}
                className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Skills & Projects */}
            <div className="space-y-4 pt-3 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                Skills & Experience
              </h4>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Key Skills
                </label>
                <input
                  name="skills"
                  type="text"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, React, SQL (comma separated)"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Academic Projects
                </label>
                <textarea
                  name="projects"
                  rows="2"
                  value={profile.projects}
                  onChange={handleChange}
                  placeholder="Project Title - Tech Stack - Key functionality"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Certifications
                </label>
                <input
                  name="certifications"
                  type="text"
                  value={profile.certifications}
                  onChange={handleChange}
                  placeholder="AWS Solutions Architect, Azure Associate"
                  className="mt-1.5 block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                disabled={updating}
                className="bg-primary-600 hover:bg-primary-500 text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition-all shadow-lg shadow-primary-500/20 glow-btn"
              >
                {updating ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

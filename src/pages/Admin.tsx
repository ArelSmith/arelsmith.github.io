import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Lock,
  User as UserIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Project {
  id?: number;
  title: string;
  slug: string;
  preview: string;
  body: string;
  image_url: string;
  link: string | null;
  github: string;
  tech: string[];
  year?: number | string;
}

interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
}

const Admin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "messages" | "settings">(
    "projects",
  );

  interface Settings {
    cv_url: string;
    phone_number: string;
    email: string;
  }

  const [settings, setSettings] = useState<Settings>({
    cv_url: "https://drive.google.com/file/d/1N8tszeV8zBmDDT6NFS0xzJQ3dQjO13lp/view?usp=sharing",
    phone_number: "6288294102558",
    email: "arelarel576@gmail.com",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    title: "",
    slug: "",
    preview: "",
    body: "",
    image_url: "",
    link: "",
    github: "",
    tech: [],
    year: "",
  });
  const [techInput, setTechInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchMessages();
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!error && data) {
      setSettings({
        cv_url: data.cv_url || "",
        phone_number: data.phone_number || "",
        email: data.email || "",
      });
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    const { error } = await supabase
      .from("settings")
      .upsert({
        id: 1,
        cv_url: settings.cv_url,
        phone_number: settings.phone_number,
        email: settings.email,
      });
    if (error) {
      alert(error.message);
    } else {
      alert("Settings updated successfully!");
    }
    setSavingSettings(false);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Error fetching projects:", error);
    } else if (data) {
      setProjects(data);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("id", { ascending: false });
    if (error) {
      console.error("Error fetching messages:", error);
    } else if (data) {
      setMessages(data);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddTech = () => {
    if (techInput.trim() && !projectForm.tech.includes(techInput.trim())) {
      setProjectForm({
        ...projectForm,
        tech: [...projectForm.tech, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (index: number) => {
    setProjectForm({
      ...projectForm,
      tech: projectForm.tech.filter((_, i) => i !== index),
    });
  };

  const generateUniqueSlug = (title: string, currentId?: number) => {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special chars
      .replace(/[\s_]+/g, "-") // replace spaces with hyphens
      .replace(/^-+|-+$/g, ""); // trim hyphens

    let slug = baseSlug;
    let counter = 2;

    while (projects.some((p) => p.slug === slug && p.id !== currentId)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    const generated = generateUniqueSlug(titleVal, editingProject?.id);
    setProjectForm((prev) => ({
      ...prev,
      title: titleVal,
      slug: generated,
    }));
  };

  const convertToWebP = (file: File, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          const webpDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const webpBase64 = await convertToWebP(file);

      const originalName = file.name;
      const dotIndex = originalName.lastIndexOf(".");
      const nameWithoutExt =
        dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
      const webpFilename = `${Date.now()}-${nameWithoutExt}.webp`;

      const resBlob = await fetch(webpBase64);
      const blob = await resBlob.blob();

      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(webpFilename, blob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("projects")
        .getPublicUrl(webpFilename);

      setProjectForm((prev) => ({
        ...prev,
        image_url: data.publicUrl,
      }));
    } catch (err) {
      const error = err as Error;
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...projectForm,
      link: projectForm.link || null,
      github: projectForm.github || null,
      year: projectForm.year ? parseInt(projectForm.year.toString(), 10) || null : null,
    };

    if (editingProject?.id) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingProject.id);

      if (error) alert(error.message);
      else {
        setIsProjectModalOpen(false);
        setEditingProject(null);
        fetchProjects();
      }
    } else {
      // Insert
      const { error } = await supabase.from("projects").insert([payload]);

      if (error) alert(error.message);
      else {
        setIsProjectModalOpen(false);
        fetchProjects();
      }
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      preview: project.preview,
      body: project.body,
      image_url: project.image_url,
      link: project.link || "",
      github: project.github,
      tech: project.tech,
      year: project.year || "",
    });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchProjects();
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchMessages();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-jost">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-800 font-semibold text-lg">
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center font-jost p-6">
        <Helmet>
          <title>Admin Login | Arel Smith</title>
        </Helmet>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl">
          <div className="bg-primary p-8 text-center text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            <h1 className="text-3xl font-bold tracking-wide">ArelSmith.</h1>
            <p className="text-white/70 text-sm mt-1">
              Portal Administrator Portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <UserIcon size={16} /> Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-tertiary text-white rounded-xl font-bold text-lg hover:bg-[#5f2f1c] active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-bg font-jost flex flex-col">
      <Helmet>
        <title>Admin Dashboard | Arel Smith</title>
      </Helmet>

      {/* TOP HEADER */}
      <header className="bg-primary text-white py-4 px-6 shadow-md z-10 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-wide">
              <Link to="/">ArelSmith.</Link>
            </span>
            <span className="bg-tertiary text-white text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80 hidden md:inline">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 active:scale-95 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-grow flex flex-col md:flex-row gap-6">
        {/* SIDEBAR TABS */}
        <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 rounded-2xl font-bold text-base transition-all ${
              activeTab === "projects"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <FolderKanban size={20} /> Projects
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 rounded-2xl font-bold text-base transition-all ${
              activeTab === "messages"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <Mail size={20} /> Messages
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-5 py-3.5 rounded-2xl font-bold text-base transition-all ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <SettingsIcon size={20} /> Settings
          </button>
        </aside>

        {/* CONTENT AREA */}
        <section className="flex-1 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 min-h-[500px]">
          {/* TAB 1: PROJECTS */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Manage Projects
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add, edit, or remove showcase items from your portfolio.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: "",
                      slug: "",
                      preview: "",
                      body: "",
                      image_url: "",
                      link: "",
                      github: "",
                      tech: [],
                      year: "",
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="bg-tertiary hover:bg-[#5f2f1c] active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition"
                >
                  <Plus size={16} /> New Project
                </button>
              </div>

              {/* PROJECTS TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Image</th>
                      <th className="py-3 px-4 font-bold">Title</th>
                      <th className="py-3 px-4 font-bold">Slug</th>
                      <th className="py-3 px-4 font-bold">Tech</th>
                      <th className="py-3 px-4 text-right font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                      >
                        <td className="py-3 px-4">
                          <img
                            src={project.image_url || "/placeholder.jpg"}
                            alt={project.title}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/150";
                            }}
                          />
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {project.title}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-500 font-mono">
                          {project.slug}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 text-slate-600 text-xxs px-2 py-0.5 rounded font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="p-2 text-primary hover:bg-primary/5 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id!)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-10 text-slate-400"
                        >
                          No projects found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MESSAGES */}
          {activeTab === "messages" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Messages & Inquiries
                </h2>
                <p className="text-sm text-slate-500">
                  Read messages submitted by users through the contact form.
                </p>
              </div>

              {/* MESSAGES LIST */}
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl border border-slate-100 hover:shadow-md transition flex flex-col gap-3 relative"
                  >
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Message"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center gap-x-4 gap-y-1">
                      <h4 className="font-bold text-slate-800">{msg.name}</h4>
                      <span className="text-slate-400 hidden md:inline">|</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-sm text-tertiary hover:underline flex items-center gap-1 font-medium"
                      >
                        {msg.email} <ExternalLink size={12} />
                      </a>
                      <span className="text-slate-400 hidden md:inline">|</span>
                      <span className="text-xs text-slate-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                    No messages received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Site Settings
                </h2>
                <p className="text-sm text-slate-500">
                  Update links, contact details, and resume details shown on the homepage.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    CV / Resume Link (Google Drive / Dropbox)
                  </label>
                  <input
                    type="url"
                    required
                    value={settings.cv_url}
                    onChange={(e) =>
                      setSettings({ ...settings, cv_url: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    WhatsApp Phone Number (with Country Code, e.g. 6288294102558)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.phone_number}
                    onChange={(e) =>
                      setSettings({ ...settings, phone_number: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm font-mono"
                    placeholder="e.g. 6288294102558"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="e.g. arelarel576@gmail.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-tertiary hover:bg-[#5f2f1c] active:scale-95 text-white py-2.5 px-6 rounded-xl font-bold text-sm shadow-sm transition self-start disabled:opacity-50"
                >
                  {savingSettings ? "Saving Settings..." : "Save Settings"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      {/* --- ADD / EDIT PROJECT MODAL --- */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-primary text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSaveProject}
              className="p-6 flex-grow overflow-y-auto flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={handleTitleChange}
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="e.g. Voting App Osis"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">
                    Slug (URL Path)
                  </label>
                  <input
                    type="text"
                    value={projectForm.slug}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, slug: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm font-mono"
                    placeholder="e.g. voting-app-osis"
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-700">
                  Short Preview (One sentence)
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.preview}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, preview: e.target.value })
                  }
                  className="border p-2.5 rounded-xl text-sm"
                  placeholder="e.g. Simple voting counter system"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-slate-700">
                  Detailed Body Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={projectForm.body}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, body: e.target.value })
                  }
                  className="border p-2.5 rounded-xl text-sm"
                  placeholder="Tell more about the project, features, challenges..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Project Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border p-2 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
                />
                {uploadingImage && (
                  <span className="text-xs text-primary font-bold animate-pulse">
                    Uploading image...
                  </span>
                )}
                {projectForm.image_url && (
                  <div className="mt-2 relative w-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={projectForm.image_url}
                      alt="Preview"
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">
                    Live Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={projectForm.link || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, link: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">
                    GitHub Repository Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={projectForm.github}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, github: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="https://github.com/ArelSmith/repo"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">
                    Project Year (Optional)
                  </label>
                  <input
                    type="number"
                    value={projectForm.year || ""}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, year: e.target.value })
                    }
                    className="border p-2.5 rounded-xl text-sm"
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>

              {/* TECH STACK CHIPS INPUT */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Technologies Used
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="border p-2.5 rounded-xl text-sm flex-grow"
                    placeholder="e.g. React, Tailwind CSS, Node.js"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="bg-primary text-white px-4 rounded-xl font-bold text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {projectForm.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium border border-slate-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-tertiary hover:bg-[#5f2f1c] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

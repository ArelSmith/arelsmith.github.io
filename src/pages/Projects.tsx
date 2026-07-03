import Footer from "@/components/Footer";
import Layout from "@/Layout";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProjectsType {
  id?: number;
  title: string;
  slug: string;
  preview: string;
  body: string;
  image?: string;
  image_url?: string;
  link: string | null;
  github: string | null;
  tech: string[] | string;
  year?: number | string;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 6;

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState<(number | string)[]>([]);

  // Fetch unique years for filter option
  useEffect(() => {
    const fetchYears = async () => {
      const { data, error } = await supabase.from("projects").select("year");
      if (!error && data) {
        const yearsList = Array.from(
          new Set(data.map((p) => p.year).filter(Boolean)),
        ).sort((a, b) => Number(b) - Number(a));
        setAvailableYears(yearsList);
      }
    };
    fetchYears();
  }, []);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedYear]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase.from("projects").select("*", { count: "exact" });

      if (search.trim()) {
        query = query.ilike("title", `%${search}%`);
      }

      if (selectedYear) {
        query = query.eq("year", parseInt(selectedYear, 10));
      }

      const { data, error, count } = await query
        .order("year", { ascending: false })
        .order("id", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        if (data) setProjects(data);
        if (count !== null) setTotalCount(count);
      }
      setLoading(false);
    };

    fetchProjects();
  }, [currentPage, search, selectedYear]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleClick = (project: ProjectsType) => {
    localStorage.setItem("selectedProject", JSON.stringify(project));
    navigate(`/projects/${project.slug}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>Projects | Arel Smith</title>
        <meta name="description" content="Projects display of Arel Smith" />
      </Helmet>
      <div className="min-h-screen flex flex-col gap-y-10 mx-auto items-center mt-[76px] mb-20">
        <h1 className="text-5xl lg:text-7xl font-bold">My Projects</h1>

        {/* SEARCH AND FILTER CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl px-4 justify-between items-center mt-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent text-sm bg-white shadow-sm"
          />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent text-sm bg-white shadow-sm cursor-pointer"
          >
            <option value="">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 mt-20">
            <div className="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-800 font-semibold">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <ul className="flex flex-col lg:flex-row lg:flex-wrap lg:gap-x-4 justify-center gap-y-4 mt-8">
            {projects.map((project, index) => {
              const projectImage = project.image || project.image_url;
              const projectTech = Array.isArray(project.tech)
                ? project.tech
                : typeof project.tech === "string"
                  ? project.tech
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  : [];

              return (
                <li
                  key={index}
                  className="group rounded-lg shadow-md relative w-75 lg:w-150 cursor-pointer overflow-hidden border border-slate-100"
                  onClick={() => handleClick(project)}
                >
                  {project.year && (
                    <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      {project.year}
                    </div>
                  )}
                  {projectImage && (
                    <img
                      src={projectImage}
                      loading="lazy"
                      alt={project.title}
                      className="transition-opacity duration-300 w-full h-auto object-cover"
                    />
                  )}
                  <div className="transition-all absolute inset-0 bg-white flex flex-col gap-y-2 lg:gap-y-4 justify-center items-center opacity-0 group-hover:opacity-100 p-4">
                    <h2 className="text-2xl font-semibold text-slate-800">
                      {project.title}
                    </h2>
                    <p className="text-center text-slate-600">
                      {project.preview}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {projectTech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-500 text-white text-sm font-medium py-1 px-3 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-10 text-slate-500">No projects available</p>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-row justify-center items-center gap-x-2 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition active:scale-95"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition active:scale-95 ${
                  currentPage === page
                    ? "bg-tertiary text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition active:scale-95"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default Projects;

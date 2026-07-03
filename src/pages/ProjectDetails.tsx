import Layout from "@/Layout";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Github } from "lucide-react";

type Project = {
  title: string;
  slug: string;
  preview: string;
  body: string;
  image?: string;
  image_url?: string;
  link?: string | null;
  github?: string | null;
  tech?: string[] | string;
  year?: number | string;
};

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem("selectedProject");

    if (!storedProjects) {
      navigate("/projects");
      return;
    }

    try {
      const parsed = JSON.parse(storedProjects);
      if (Array.isArray(parsed)) {
        const foundProject = parsed.find((p) => p.slug === slug);
        if (!foundProject) {
          navigate("/projects");
          return;
        }
        setProject(foundProject);
      } else {
        setProject(parsed);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      navigate("/projects");
    }
  }, [navigate, slug]);

  useEffect(() => {
    if (project) {
      localStorage.removeItem("selectedProject");
    }
  }, [project]);

  if (!project) return null;

  const projectImage = project.image || project.image_url;
  const projectTech: string[] = Array.isArray(project.tech)
    ? project.tech
    : typeof project.tech === "string"
    ? project.tech.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <Layout>
      <Helmet>
        <title>{project.title} | Arel Smith</title>
        <meta name="description" content={project.body} />
      </Helmet>
      <div className="max-w-5xl h-full mx-auto mt-[76px] flex flex-col gap-y-4 lg:gap-y-8 items-center mb-25">
        {projectImage && (
          <div className="relative w-full">
            <img src={projectImage} alt={project.title} className="w-full h-auto" />
            {project.year && (
              <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-md">
                {project.year}
              </div>
            )}
          </div>
        )}
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <p className="p-5 lg:p-0 text-center text-lg">{project.body}</p>
        
        {projectTech.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold">Technologies Used</h3>
            <div className="flex flex-row flex-wrap gap-x-2 justify-center gap-y-2">
              {projectTech.map((tech, index) => (
                <span
                  key={index}
                  className="bg-white text-gray-800 text-sm font-medium py-1 px-3 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </>
        )}
        
        <div className="flex flex-row gap-x-2">
          <Link
            to="/projects"
            className="bg-tertiary text-center text-white text-sm py-2 px-4 rounded"
          >
            Back to project
          </Link>

          {project.link && (
            <Link
              to={project.link}
              target="_blank"
              className="border hover:bg-tertiary text-center hover:text-white transition-colors border-tertiary text-tertiary text-sm py-2 px-4 rounded"
            >
              Visit Project
            </Link>
          )}

          {project.github && (
            <Link
              to={project.github}
              target="_blank"
              className="bg-white hover:bg-tertiary text-center hover:text-white transition-colors border-tertiary text-sm py-2 px-4 rounded flex flex-row justify-center items-center gap-x-2"
            >
              <Github /> View on GitHub
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default ProjectDetails;

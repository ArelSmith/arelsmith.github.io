import Layout from "@/Layout";
import aboutMeThumbnail from "@/assets/profile_about_me.webp";
import { useContext, useState, useEffect, type FC } from "react";
import { motion } from "motion/react";
import AnimationProvider from "@/context/Animation/AnimationProvider";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";

import image1 from "@/assets/image_1.webp";
import image2 from "@/assets/image_2.webp";
import image3 from "@/assets/image_3.webp";
import { Box, Smartphone } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import Marquee from "react-fast-marquee";

// images
import html from "@/assets/html.svg";
import css from "@/assets/css.svg";
import javascript from "@/assets/javascript.svg";
import typescript from "@/assets/typescript.svg";
import php from "@/assets/php.svg";
import react from "@/assets/react.svg";
import nextjs from "@/assets/nextjs.svg";
import tailwindcss from "@/assets/tailwindcss.svg";
import bootstrap from "@/assets/bootstrap.svg";
import nodejs from "@/assets/nodejs.svg";
import express from "@/assets/express.svg";
import laravel from "@/assets/laravel.svg";
import vscode from "@/assets/visual-studio-code.svg";
import git from "@/assets/git.svg";
import github from "@/assets/github.svg";
import vite from "@/assets/vitejs.svg";
import docker from "@/assets/docker.svg";
import postman from "@/assets/postman.svg";
import strapi from "@/assets/strapi-icon.svg";

import figma from "@/assets/figma.svg";
import photoshop from "@/assets/photoshop.svg";
import illustrator from "@/assets/illustrator.svg";
import coreldraw from "@/assets/coreldraw.svg";
import canva from "@/assets/canva.svg";
import premiere from "@/assets/premiere.svg";
import capcut from "@/assets/capcut.svg";
import chatgpt from "@/assets/openai-chatgpt.svg";
import Footer from "@/components/Footer";
import { AnimationContext } from "@/context/Animation/AnimationContext";

const Jumbotron: FC = () => {
  const ctx = useContext(AnimationContext);
  if (!ctx) return null;
  const { jumbotronRef, itemVariants, isInView1 } = ctx;
  return (
    <div
      ref={jumbotronRef}
      className="flex flex-col lg:flex-row-reverse lg:items-center mx-auto lg:mt-0 mt-[76px] gap-y-6"
    >
      <img
        src={aboutMeThumbnail}
        alt="About me Thumbnail"
        className="lg:w-1/2 lg:h-screen"
      />
      <div className="flex flex-col gap-y-2 lg:max-w-96 max-w-60 mx-auto">
        <motion.h1
          variants={itemVariants}
          initial="close"
          animate={isInView1 ? "open" : "close"}
          custom={0.1}
          className="text-5xl lg:text-7xl font-bold text-center text-slate-800"
        >
          About me
        </motion.h1>
        <motion.div
          variants={itemVariants}
          initial="close"
          animate={isInView1 ? "open" : "close"}
          custom={0.2}
          className="w-15 h-2 mx-auto bg-slate-800 rounded-3xl"
        ></motion.div>
        <motion.p
          variants={itemVariants}
          initial="close"
          animate={isInView1 ? "open" : "close"}
          custom={0.3}
          className="text-center text-slate-800"
        >
          You're arrived at the right place to learn more about the person
          behind the projects. Here's a closer look at my journey, my passions,
          and the values that shape my works.
        </motion.p>
      </div>
    </div>
  );
};

const SelfDetail: FC = () => {
  const ctx = useContext(AnimationContext);
  if (!ctx) return null;
  const { selfDetailRef, itemVariants, isInView2 } = ctx;
  return (
    <div className="h-screen w-10/12 mx-auto flex flex-col lg:flex-row mt-50 justify-around items-center gap-y-20">
      <div ref={selfDetailRef} className="lg:w-5/12 w-50 relative">
        <motion.img
          variants={itemVariants}
          initial="close"
          animate={isInView2 ? "open" : "close"}
          custom={0.1}
          src={image1}
          alt="Image 1"
          className="lg:w-100 w-200"
        />
        <motion.img
          variants={itemVariants}
          initial="close"
          animate={isInView2 ? "open" : "close"}
          custom={0.2}
          src={image2}
          alt="Image 2"
          className="lg:w-100 w-200 absolute top-25 left-25 lg:top-50 lg:left-50 scale-45  "
        />
        <motion.img
          variants={itemVariants}
          initial="close"
          animate={isInView2 ? "open" : "close"}
          custom={0.3}
          src={image3}
          alt="Image 3"
          className="lg:w-100 w-200 absolute -top-25 -left-25 lg:-top-50 lg:-left-50 scale-45"
        />
      </div>
      <div className="lg:w-5/12 flex flex-col gap-y-5">
        <motion.h1
          variants={itemVariants}
          initial="close"
          animate={isInView2 ? "open" : "close"}
          custom={0.4}
          className="text-5xl font-bold text-center text-slate-800"
        >
          Arel Smith
        </motion.h1>
        <motion.p
          variants={itemVariants}
          initial="close"
          animate={isInView2 ? "open" : "close"}
          custom={0.5}
          className="text-center text-slate-800"
        >
          I am 18-year old person that has interest in Web Development. While my
          foundation lies in the world of design, I've developed a strong
          passion for web development, especially in crafting and building
          clean, responsive interfaces that blend aesthetics with functionality.
          I enjoy learning new technologies, building digital experiences, and
          constantly challenging myself to grow as both designer and web
          developer. This portofolio is a reflection of that journey and I'm
          just getting started.
        </motion.p>
      </div>
    </div>
  );
};

const MySkill: FC = () => {
  const skills = [
    {
      icon: <Box className="w-8 h-8 text-gray-700" />,
      title: "Web Development",
      description: "Building modern, responsive web applications",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-gray-700" />,
      title: "Visual and Creative",
      description:
        "Giving life to ideas through visual storytelling and my foundation as a Visual Communication Student",
    },
  ];
  const stacks = [
    [
      html,
      css,
      javascript,
      typescript,
      php,
      react,
      nextjs,
      tailwindcss,
      bootstrap,
      nodejs,
      express,
      laravel,
      vscode,
      git,
      github,
      vite,
      docker,
      postman,
      strapi,
    ],
    [
      figma,
      photoshop,
      illustrator,
      coreldraw,
      canva,
      premiere,
      capcut,
      chatgpt,
    ],
  ];
  const [activeTechStack, setActiveTechStack] = useState<number | null>(0);

  const ctx = useContext(AnimationContext);

  if (!ctx) return null;

  const { skillsRef, itemVariants, isInView3 } = ctx;

  return (
    <div ref={skillsRef} className=" flex flex-col gap-y-10">
      <div className=" w-10/12 mx-auto flex flex-col gap-y-30 mt-50">
        <div className="flex flex-col gap-y-5">
          <motion.h1
            variants={itemVariants}
            initial="close"
            animate={isInView3 ? "open" : "close"}
            custom={0.1}
            className="text-5xl lg:text-7xl font-bold text-slate-800 text-center"
          >
            Skills & Expertise
          </motion.h1>
          <motion.p
            variants={itemVariants}
            initial="close"
            animate={isInView3 ? "open" : "close"}
            custom={0.2}
            className="text-slate-800 text-center text-xl"
          >
            All of my technical skills.
          </motion.p>
        </div>
        <div className="flex flex-col lg:flex-row gap-y-10 mx-auto gap-x-10">
          {skills.map((skill, key) => (
            <div
              key={key}
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => setActiveTechStack(key)}
            >
              <ServiceCard
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
              />
            </div>
          ))}
        </div>
      </div>
      {activeTechStack !== null && (
        <div className="py-10 text-center flex flex-col gap-y-10">
          <h1 className="text-3xl lg:text-5xl font-semibold text-slate-800 text-center">
            Tools & Language -{" "}
            {skills.map((skill) => skill.title).at(activeTechStack)}
          </h1>
          <Marquee
            className="h-full"
            loop={0}
            speed={200}
            pauseOnHover
            autoFill={true}
          >
            {stacks[activeTechStack].map((stack, idx) => (
              <span
                key={idx}
                className=" text-white px-5 text-sm flex flex-row"
              >
                <img src={stack} alt="" width={64} />
              </span>
            ))}
          </Marquee>
        </div>
      )}
    </div>
  );
};

interface ExperienceType {
  id?: number;
  company: string;
  role: string;
  type: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  skills: string[];
}

const ProfessionalExperience: FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("id", { ascending: false });
      if (!error && data) {
        setExperiences(data);
      }
      setLoading(false);
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="w-10/12 mx-auto flex flex-col items-center gap-4 mt-20 mb-20">
        <div className="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-800 font-semibold">Loading experiences...</p>
      </div>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <div className="w-10/12 mx-auto flex flex-col gap-y-16 mt-32 mb-20">
      {/* Title */}
      <h1 className="text-3xl lg:text-5xl font-semibold text-slate-800 text-center">
        Professional Experience
      </h1>

      {/* Vertical Timeline container */}
      <div className="relative border-l-2 border-slate-400 ml-4 md:ml-0 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:h-full md:before:w-0.5 md:before:bg-slate-400">
        {experiences.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={idx}
              className={`relative mb-16 flex flex-col md:flex-row ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-6 md:left-1/2 md:-translate-x-1/2 z-10 w-4 h-4 bg-slate-900 rounded-full border-4 border-white shadow-md"></div>

              {/* Content Panel */}
              <div className="w-full md:w-5/12 pl-8 md:pl-0 md:px-8 flex flex-col items-start md:items-stretch">
                {/* Date / Location Info Box */}
                <div className="inline-flex items-center gap-x-4 bg-secondary text-white rounded-2xl px-5 py-2.5 text-xs font-semibold shadow-md mb-4 self-start">
                  <div className="text-center min-w-16">
                    <span className="block text-white font-bold text-sm">
                      {exp.start_date}
                    </span>
                    <span className="block text-slate-400 font-normal uppercase text-[9px] mt-0.5">
                      Start
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-600"></div>
                  <div className="text-center min-w-16">
                    <span className="block text-white font-bold text-sm">
                      {exp.end_date}
                    </span>
                    <span className="block text-slate-400 font-normal uppercase text-[9px] mt-0.5">
                      End
                    </span>
                  </div>
                  <div className="w-px h-6 bg-slate-600"></div>
                  <div className="text-center min-w-16">
                    <span className="block text-white font-bold text-sm">
                      {exp.location}
                    </span>
                    <span className="block text-slate-400 font-normal uppercase text-[9px] mt-0.5">
                      Location
                    </span>
                  </div>
                </div>

                {/* Main Job Card */}
                <div className="bg-[#f3f4f6]/60 border border-slate-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition duration-200 w-full">
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {exp.company}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500 mb-4">
                    <span className="font-semibold text-slate-700">
                      {exp.role}
                    </span>
                    <span>•</span>
                    <span>{exp.type}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  {/* Skill badges */}
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold py-1.5 px-3.5 rounded-2xl shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer for desktop layout alignment */}
              <div className="hidden md:block md:w-5/12"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AboutMe: FC = () => {
  return (
    <AnimationProvider>
      <Layout>
        <Helmet>
          <title>About Me | Arel Smith</title>
          <meta name="description" content="Learn more about Arel Smith" />
        </Helmet>
        <Jumbotron />
        <SelfDetail />
        <MySkill />
        <ProfessionalExperience />
        <Footer />
      </Layout>
    </AnimationProvider>
  );
};

export default AboutMe;

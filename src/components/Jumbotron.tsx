import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "motion/react";
import { ReactTyped } from "react-typed";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

// Image
import profile from "../../src/assets/profile.webp";

const Jumbotron = () => {
  const sectionRef = useRef(null);
  const [contactPanel, setContactPanel] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const isInView = useInView(sectionRef, {
    once: false,
  });

  const [settings, setSettings] = useState({
    cv_url: "https://drive.google.com/file/d/1N8tszeV8zBmDDT6NFS0xzJQ3dQjO13lp/view?usp=sharing",
    phone_number: "6288294102558",
    email: "arelarel576@gmail.com",
  });

  const itemVariants: Variants = {
    open: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom,
        type: "tween",
      },
    }),
    close: {
      opacity: 0,
      x: -80,
      transition: {
        type: "tween",
      },
    },
    closeReversed: {
      opacity: 0,
      x: 80,
      transition: {
        type: "tween",
      },
    },
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setSettings({
          cv_url: data.cv_url || settings.cv_url,
          phone_number: data.phone_number || settings.phone_number,
          email: data.email || settings.email,
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const updateScreenWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateScreenWidth();

    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);
  return (
    <main id="home">
      <div className="max-w-8/12 mx-auto flex flex-col-reverse gap-y-6 lg:flex-row lg:min-h-screen mt-[76px] lg:mt-0 items-center justify-between">
        <div className="flex flex-col gap-y-5 lg:max-w-4/12 w-full">
          <div>
            <motion.h3
              ref={sectionRef}
              variants={itemVariants}
              initial="close"
              animate={isInView ? "open" : "close"}
              custom={0.2}
              className="text-lg w-30 mx-auto lg:mx-0 text-center text-bg bg-tertiary rounded-3xl px-3 py-1"
            >
              Arel Smith
            </motion.h3>
            <div className="max-w-3xl h-35 lg:text-left text-center lg:h-55 mt-5">
              <ReactTyped
                strings={["Fullstack Web <br /> Developer"]}
                loop
                typeSpeed={60}
                className="text-5xl lg:text-7xl lg:w-[150%] font-bold text-slate-800"
              />
            </div>
          </div>
          <motion.p
            ref={sectionRef}
            variants={itemVariants}
            initial="close"
            animate={isInView ? "open" : "close"}
            custom={0.4}
            className="lg:text-left text-center text-xl text-slate-800 opacity-75 font-medium"
          >
            Hello! I am Arel Smith, a 18-year old Fullstack Web Developer that
            passionate about building clean, user-friendly websites that blend
            both aesthetic design and functional development. <br />
            Let's build something awesome!
          </motion.p>
          <div className="flex flex-row justify-around">
            <motion.div
              ref={sectionRef}
              variants={itemVariants}
              initial="close"
              animate={isInView ? "open" : "close"}
              custom={0.5}
              whileTap={{ scale: 0.9 }}
              className="flex flex-row justify-around lg:justify-start lg:gap-x-5 lg:w-100"
            >
              <a
                href={settings.cv_url}
                target="_blank"
                className="text-white bg-tertiary hover:bg-[#5f2f1c] transition duration-150 px-4 py-2 rounded-2xl shadow-xl lg:text-2xl lg:px-6 lg:py-4"
              >
                Download CV
              </a>
            </motion.div>
            <motion.div
              ref={sectionRef}
              variants={itemVariants}
              initial="close"
              animate={isInView ? "open" : "close"}
              custom={0.6}
              whileTap={{ scale: 0.9 }}
              className="flex flex-row justify-around lg:justify-start lg:gap-x-5 lg:w-100"
            >
              <button
                onClick={() => setContactPanel(true)}
                className="text-tertiary hover:cursor-pointer border border-tertiary hover:text-white transition duration-150 hover:bg-tertiary px-4 py-2 rounded-2xl shadow-xl lg:text-2xl lg:px-6 lg:py-4"
              >
                Contact me
              </button>
            </motion.div>
          </div>
        </div>
        <div className="max-w-2xl">
          <motion.img
            ref={sectionRef}
            variants={itemVariants}
            initial="closeReversed"
            animate={isInView ? "open" : "closeReversed"}
            src={profile}
            loading="lazy"
            alt="Profile"
            className="grayscale-0 lg:grayscale hover:grayscale-0 transition duration-300"
          />
        </div>
      </div>
      {contactPanel && (
        <div
          className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className="w-full max-w-md rounded-lg bg-tertiary p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h2
                id="modalTitle"
                className="text-xl font-bold text-white sm:text-2xl"
              >
                Contact Me
              </h2>

              <button
                type="button"
                onClick={() => setContactPanel(false)}
                className="-me-4 -mt-4 rounded-full p-2 text-white transition-colors hover:text-gray-600 hover:cursor-pointer focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-pretty text-white">
                How would you contact me?
              </p>
            </div>

            <footer className="mt-6 flex justify-end gap-2">
              <Link
                to={`mailto:${settings.email}`}
                className="rounded-2xl hover:cursor-pointer bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Email
              </Link>

              <Link
                to={
                  isMobile
                    ? `https://wa.me/${settings.phone_number}`
                    : `https://web.whatsapp.com/send?phone=${settings.phone_number}`
                }
                className="rounded-2xl hover:cursor-pointer bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Whatsapp
              </Link>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default Jumbotron;

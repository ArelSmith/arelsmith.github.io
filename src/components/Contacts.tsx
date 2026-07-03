import { Github, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { motion, useInView, type Variants } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import contactImage from "@/assets/contact_image_cropped.webp";
import { supabase } from "@/lib/supabase";

const Contacts = () => {
  const MotionLink = motion.create(Link);
  const itemRef = useRef(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInView = useInView(itemRef, {
    once: false,
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
  const [settings, setSettings] = useState({
    phone_number: "6288294102558",
    email: "arelarel576@gmail.com",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (data) {
        setSettings({
          phone_number: data.phone_number || settings.phone_number,
          email: data.email || settings.email,
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const updateScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateScreenWidth();

    window.addEventListener("resize", updateScreenWidth);
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);
  return (
    <section id="contact">
      <div
        ref={itemRef}
        className="max-w-8/12 mx-auto flex flex-col-reverse gap-y-6 mt-50 lg:flex-row lg:min-h-screen lg:-mt-[76px] items-center justify-between mb-8"
      >
        <div className="flex flex-col gap-y-5 lg:max-w-4/12 w-full">
          <motion.h1
            variants={itemVariants}
            initial="close"
            animate={isInView ? "open" : "close"}
            custom={0.1}
            className="text-5xl lg:text-7xl lg:w-[150%] lg:text-left font-bold text-center text-slate-800"
          >
            Let me know!
          </motion.h1>
          <motion.p
            variants={itemVariants}
            initial="close"
            animate={isInView ? "open" : "close"}
            custom={0.2}
            className="lg:text-left text-center text-xl text-slate-800 opacity-75 font-medium"
          >
            Interested in working together or have a project in mind? Don't
            hesistate to reach out, let's bring your ideas to life! <br />
          </motion.p>

          <motion.form
            onSubmit={handleSubmitMessage}
            variants={itemVariants}
            initial="close"
            animate={isInView ? "open" : "close"}
            custom={0.25}
            className="flex flex-col gap-y-3 mt-4 mb-4 text-left w-full"
          >
            <div className="flex flex-col gap-1">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white text-slate-800 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="email"
                required
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white text-slate-800 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <textarea
                required
                rows={3}
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white text-slate-800 text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-tertiary text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-[#5f2f1c] active:scale-95 transition disabled:opacity-50 hover:cursor-pointer"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {submitSuccess && (
              <span className="text-green-600 text-xs font-semibold">
                Message sent successfully! Thank you.
              </span>
            )}
            {submitError && (
              <span className="text-red-500 text-xs font-semibold">
                Error: {submitError}
              </span>
            )}
          </motion.form>

          <div className="flex flex-row gap-x-2 justify-center lg:justify-start">
            <MotionLink
              initial={{ y: 80, opacity: 0 }}
              animate={
                isInView
                  ? {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.3,
                      },
                    }
                  : { y: 80, opacity: 0 }
              }
              to="https://www.instagram.com/arelsmith6/"
              target="_blank"
              className="bg-slate-800 text-white p-3 rounded-4xl hover:bg-slate-600 transition"
            >
              <Instagram />
            </MotionLink>
            <MotionLink
              initial={{ y: 80, opacity: 0 }}
              animate={
                isInView
                  ? {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.4,
                      },
                    }
                  : { y: 80, opacity: 0 }
              }
              to="https://github.com/ArelSmith/"
              target="_blank"
              className="bg-slate-800 text-white p-3 rounded-4xl hover:bg-slate-600 transition"
            >
              <Github />
            </MotionLink>
            <MotionLink
              initial={{ y: 80, opacity: 0 }}
              animate={
                isInView
                  ? {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.5,
                      },
                    }
                  : { y: 80, opacity: 0 }
              }
              to={`mailto:${settings.email}`}
              className="bg-slate-800 text-white p-3 rounded-4xl hover:bg-slate-600 transition"
            >
              <Mail />
            </MotionLink>
            <MotionLink
              initial={{ y: 80, opacity: 0 }}
              animate={
                isInView
                  ? {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.6,
                      },
                    }
                  : { y: 80, opacity: 0 }
              }
              to="https://www.linkedin.com/in/arel-smith-9633b6293/"
              target="_blank"
              className="bg-slate-800 text-white p-3 rounded-4xl hover:bg-slate-600 transition"
            >
              <Linkedin />
            </MotionLink>
            <MotionLink
              initial={{ y: 80, opacity: 0 }}
              animate={
                isInView
                  ? {
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.7,
                      },
                    }
                  : { y: 80, opacity: 0 }
              }
              to={
                isMobile
                  ? `https://wa.me/${settings.phone_number}`
                  : `https://web.whatsapp.com/send?phone=${settings.phone_number}`
              }
              target="_blank"
              className="bg-slate-800 text-white p-3 rounded-4xl hover:bg-slate-600 transition"
            >
              <Phone />
            </MotionLink>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 lg:max-w-4/12 w-full">
          <motion.img
            variants={itemVariants}
            initial="close"
            animate={isInView ? "open" : "closeReversed"}
            custom={0.3}
            src={contactImage}
            alt="Contact Image"
            className="grayscale-0 lg:grayscale hover:grayscale-0 hover:scale-110 transition duration-150"
          />
        </div>
      </div>
    </section>
  );
};

export default Contacts;

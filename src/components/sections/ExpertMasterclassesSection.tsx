"use client";

/**
 * ExpertMasterclassesSection
 * Full-width section with mentor card marquee and "Become A Mentor"
 * application form overlay. Themed to match the Aspirant purple brand.
 */
import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface ExpertMasterclassesSectionProps {
  className?: string;
}

export const ExpertMasterclassesSection: React.FC<
  ExpertMasterclassesSectionProps
> = ({ className = "" }) => {
  const [showMentorScreen, setShowMentorScreen] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    brief: "",
    socialLink: "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    phone: "",
    brief: "",
    socialLink: "",
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      brief: "",
      socialLink: "",
    };

    const nameTrim = formData.name.trim();
    if (!nameTrim) {
      newErrors.name = "Name is required.";
      valid = false;
    } else if (nameTrim.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nameTrim)) {
      newErrors.name = "Name can only contain alphabets and spaces.";
      valid = false;
    }

    const emailTrim = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim) {
      newErrors.email = "Email address is required.";
      valid = false;
    } else if (!emailRegex.test(emailTrim)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    const phoneTrim = formData.phone.trim();
    if (!phoneTrim) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (!/^\+?[0-9\s\-]{10,15}$/.test(phoneTrim)) {
      newErrors.phone = "Enter a valid phone number (10-15 digits).";
      valid = false;
    }

    const briefTrim = formData.brief.trim();
    if (!briefTrim) {
      newErrors.brief = "Brief description is required.";
      valid = false;
    } else if (briefTrim.length < 20) {
      newErrors.brief = "Please write at least 20 characters in the brief.";
      valid = false;
    }

    const linkTrim = formData.socialLink.trim();
    if (!linkTrim) {
      newErrors.socialLink = "Social media link is required.";
      valid = false;
    } else {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      if (!urlPattern.test(linkTrim)) {
        newErrors.socialLink = "Please enter a valid social media URL.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    const API_URL = "YOUR_API_ENDPOINT_HERE";

    if (API_URL === "YOUR_API_ENDPOINT_HERE") {
      setTimeout(() => {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          brief: "",
          socialLink: "",
        });
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to submit application. Please try again later.",
        );
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        brief: "",
        socialLink: "",
      });
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmitError("");
  };

  const closeMentorScreen = React.useCallback(() => {
    setShowMentorScreen(false);
    if (window.location.hash === "#become-mentor") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  React.useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#become-mentor") {
        setShowMentorScreen(true);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  React.useEffect(() => {
    if (showMentorScreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showMentorScreen]);

  const mentors = [
    {
      name: "Shekhar Dutt",
      role: "Sleepy Classes Founder",
      image: "/mentors/mentor3.png",
    },
    {
      name: "Atish Mathur",
      role: "10+ Year Experience Polity Expert",
      image: "/mentors/mentor4.png",
    },
    {
      name: "Subha Ranjan",
      role: "PSIR Expert",
      image: "/mentors/mentor2.png",
    },
    {
      name: "Parveen Kaswan",
      role: "IFS Indian Forest Service",
      image: "/mentors/mentor1.png",
    },
    {
      name: "Maj. Gen. G D Bakshi",
      role: "Combat veteran,Phd in Strategic Studies",
      image: "/mentors/mentor5.png",
    }
  ];

  const extendedMentors = [
    ...mentors,
    ...mentors,
    ...mentors,
    ...mentors,
    ...mentors,
    ...mentors,
  ];

  const inputClass = (hasError: boolean) =>
    `h-12 w-full rounded-xl border px-4 text-base text-ink placeholder:text-ink-subtle focus:outline-none transition-all duration-200 ${
      hasError
        ? "border-red-500 bg-red-50/10 focus:border-red-500"
        : "border-box-border bg-box-bg/50 focus:border-[var(--brand)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
    }`;

  return (
    <>
      <section
        id="become-mentor"
        ref={sectionRef}
        className={`relative w-full overflow-hidden bg-[#f8f9ff] py-14 font-body md:py-16 lg:py-20 ${className}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(79,70,229,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full">
          <div
            className="mx-auto mb-10 flex w-full max-w-[1240px] flex-col gap-4 px-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="max-w-[720px]">
              <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Learn from the best
              </p>
              <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Expert Masterclasses
              </h2>
              <p className="mt-2 font-body text-sm font-normal leading-relaxed text-ink-muted sm:text-base lg:text-lg">
                Live sessions from top mentors for clarity, direction, and
                confidence in your prep.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setShowMentorScreen(true);
                window.history.replaceState(null, "", "#become-mentor");
              }}
            >
              Become A Mentor
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Button>
          </div>

          <div
            className="em-marquee-wrap relative w-full overflow-hidden pb-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28"
              style={{
                background:
                  "linear-gradient(90deg, #f8f9ff 0%, transparent 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28"
              style={{
                background:
                  "linear-gradient(270deg, #f8f9ff 0%, transparent 100%)",
              }}
            />

            <div className="em-marquee flex w-max items-start gap-8 px-4 sm:gap-10">
              {extendedMentors.map((mentor, index) => (
                <article
                  key={`marquee-${mentor.name}-${index}`}
                  className="em-card group flex w-[180px] shrink-0 flex-col items-center text-center sm:w-[200px]"
                >
                  {/* Circular portrait — crops away rectangular white photo bg */}
                  <div className="relative h-[168px] w-[168px] sm:h-[188px] sm:w-[188px]">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 210deg, #4f46e5, #a5b4fc, #4f46e5)",
                        padding: "3px",
                      }}
                    />
                    <div className="absolute inset-[3px] overflow-hidden rounded-full bg-[#eef2ff] shadow-[0_12px_32px_rgba(79,70,229,0.18)]">
                      <Image
                        src={mentor.image}
                        alt={mentor.name}
                        fill
                        sizes="188px"
                        className="object-cover object-[center_12%] transition-transform duration-500 ease-out group-hover:scale-105"
                        priority={index < 4}
                      />
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-base font-bold leading-tight tracking-tight text-ink sm:text-lg">
                    {mentor.name}
                  </h3>
                  <p className="mt-1 max-w-[11rem] font-body text-sm font-medium leading-snug text-brand">
                    {mentor.role}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showMentorScreen && (
        <div
          className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-white py-10 font-body md:py-16"
          style={{ animation: "em-fade-in 0.35s ease-out forwards" }}
        >
          <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold leading-tight tracking-tight text-ink sm:text-2xl md:text-3xl">
                  Join Aspirant Adda as mentor
                </h2>
                <p className="mt-2 max-w-[840px] font-body text-sm leading-relaxed text-ink-muted sm:text-base">
                  Empower the next generation of learners by sharing your
                  strategies and subject expertise.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={closeMentorScreen}
                className="shrink-0 whitespace-nowrap"
              >
                ← Back
              </Button>
            </div>

            <div className="grid grid-cols-1 items-center gap-10 pb-16 md:grid-cols-[1.1fr_0.9fr]">
              {isSubmitted ? (
                <div
                  className="my-6 flex w-full max-w-[620px] flex-col items-center rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm"
                  style={{ animation: "em-fade-in 0.4s ease-out forwards" }}
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                    ✓
                  </div>
                  <h3 className="font-display text-xl font-bold text-green-900">
                    Application Submitted!
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-green-700">
                    Thank you for applying to Aspirant Adda. Our team will
                    review your details and connect with you soon.
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" onClick={handleResetForm}>
                      Submit Another Application
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full max-w-[620px] flex-col gap-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="px-1 text-sm font-bold text-ink-muted">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={inputClass(!!errors.name)}
                      />
                      {errors.name && (
                        <span className="px-1 text-xs font-medium text-red-500">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="px-1 text-sm font-bold text-ink-muted">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className={inputClass(!!errors.phone)}
                      />
                      {errors.phone && (
                        <span className="px-1 text-xs font-medium text-red-500">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="px-1 text-sm font-bold text-ink-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@example.com"
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && (
                      <span className="px-1 text-xs font-medium text-red-500">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="px-1 text-sm font-bold text-ink-muted">
                      Brief Description
                    </label>
                    <textarea
                      name="brief"
                      value={formData.brief}
                      onChange={handleChange}
                      placeholder="e.g. I cleared UPSC CSE 2022 with AIR 45. I specialize in GS Paper 2 and PSIR optional..."
                      className={`h-[150px] w-full resize-none rounded-xl border px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none transition-all duration-200 ${
                        errors.brief
                          ? "border-red-500 bg-red-50/10"
                          : "border-box-border bg-box-bg/50 focus:border-[var(--brand)] focus:bg-white"
                      }`}
                    />
                    {errors.brief && (
                      <span className="px-1 text-xs font-medium text-red-500">
                        {errors.brief}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="px-1 text-sm font-bold text-ink-muted">
                      Social Media Link
                    </label>
                    <input
                      type="text"
                      name="socialLink"
                      value={formData.socialLink}
                      onChange={handleChange}
                      placeholder="e.g. linkedin.com/in/rahulsharma"
                      className={inputClass(!!errors.socialLink)}
                    />
                    {errors.socialLink && (
                      <span className="px-1 text-xs font-medium text-red-500">
                        {errors.socialLink}
                      </span>
                    )}
                  </div>

                  {submitError && (
                    <p className="mt-1 px-1 text-xs font-medium text-red-500">
                      {submitError}
                    </p>
                  )}

                  <div className="mt-2">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </form>
              )}

              <div className="relative mx-auto hidden h-[240px] w-full max-w-[400px] md:block md:h-[300px]">
                <Image
                  src="/masterclass/image.svg"
                  alt="Mentor joining illustration"
                  fill
                  sizes="400px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes em-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }

        .em-marquee {
          animation: em-marquee 40s linear infinite;
        }

        .em-marquee-wrap:hover .em-marquee {
          animation-play-state: paused;
        }

        .em-card {
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .em-card:hover {
          transform: translateY(-6px);
        }

        @keyframes em-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .em-marquee { animation: none; }
          .em-card { transition: none; }
        }
      `,
        }}
      />
    </>
  );
};


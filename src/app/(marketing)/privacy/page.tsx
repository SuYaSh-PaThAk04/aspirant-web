import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy – Aspirant Adda" },
  description:
    "Learn how Aspirant Adda collects, uses, and protects your personal information on our platform.",
  alternates: {
    canonical: "/privacy",
  },
};

const collectItems = [
  {
    title: "Personal Information",
    description:
      "Name, email, phone number, and profile details during registration.",
  },
  {
    title: "Usage Data",
    description:
      "Chat messages, posts, call logs, and interactions to improve platform services.",
  },
  {
    title: "Device Information",
    description:
      "IP address, device type, OS, and other technical identifiers.",
  },
];

const useItems = [
  "Provide and personalize platform services",
  "Improve user experience and recommend content",
  "Ensure community safety and platform integrity",
  "Communicate updates and support information",
];

const recordingItems = [
  "Stored securely and retained for a maximum of 30 days",
  "Maintained strictly for safety, moderation, and legal compliance purposes",
  "Not accessed unless triggered by user report, grievance, or valid legal request",
  "Encrypted and accessible only to authorized personnel in exceptional circumstances",
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-body text-ink">
      <Navbar variant="page" />

      <main>
        <section
          className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20"
          style={{
            background:
              "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 45%, #c7d2fe 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "rgba(79,70,229,0.18)" }}
          />
          <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-8">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-[#4f46e5] sm:text-sm">
              Legal
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Privacy <span className="text-[#4f46e5]">Policy</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/65 sm:text-lg">
              Your privacy is important to us. Learn how we collect, use, and
              protect your personal information.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[900px] space-y-8 px-6 lg:px-8">
            <div className="rounded-[1.5rem] border border-[#4f46e5]/12 bg-[#f8f9ff] p-6 sm:p-8">
              <p className="font-body text-base leading-relaxed text-ink/75 sm:text-lg">
                This Privacy Policy describes how Aspirant Adda collects, uses,
                and protects your personal information when you use the
                platform.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Information We{" "}
                <span className="text-[#4f46e5]">Collect</span>
              </h2>
              <div className="mt-6 space-y-5">
                {collectItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef2ff]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#4f46e5]" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-body text-[0.95rem] leading-relaxed text-ink/65">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                How We Use Your{" "}
                <span className="text-[#4f46e5]">Information</span>
              </h2>
              <p className="mt-4 font-body text-base text-ink/70">
                Your information is used to:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {useItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-sm text-ink/70 sm:text-[0.95rem]"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#4f46e5]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl border border-[#4f46e5]/15 bg-[#eef2ff] p-4">
                <p className="font-body text-sm font-medium text-[#3730a3] sm:text-base">
                  We do not sell or rent your data to third parties.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Recording and{" "}
                <span className="text-[#4f46e5]">Storage</span>
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                To enhance user safety and ensure platform integrity, Aspirant
                Adda may record peer-to-peer video and audio calls made through
                the platform. These recordings are:
              </p>
              <ul className="mt-5 space-y-3">
                {recordingItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-sm text-ink/70 sm:text-[0.95rem]"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#4f46e5]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl border border-[#4f46e5]/15 bg-[#f8f9ff] p-4">
                <p className="font-body text-sm font-medium text-[#3730a3] sm:text-base">
                  By participating in calls on the platform, you consent to this
                  call recording policy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6">
                <h3 className="font-display text-xl font-bold text-ink">
                  Data Sharing
                </h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 font-body text-sm text-ink/70">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#4f46e5]" />
                    With law enforcement when legally required
                  </li>
                  <li className="flex items-start gap-3 font-body text-sm text-ink/70">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#4f46e5]" />
                    With service providers under strict confidentiality
                  </li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6">
                <h3 className="font-display text-xl font-bold text-ink">
                  Data Security
                </h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-ink/70">
                  We implement appropriate technical and organizational measures
                  to protect user data. However, no method of electronic
                  transmission or storage is completely secure.
                </p>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-[#f8f9ff] p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-ink">
                User Responsibility and Content
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-ink/70">
                Aspirant Adda is a social platform for connecting users, and all
                content shared is the responsibility of the individual user.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/12 bg-[#eef2ff] p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-ink">
                Policy Updates
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-ink/70">
                We may update this Privacy Policy periodically and encourage
                users to review it regularly for any changes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </div>
  );
}

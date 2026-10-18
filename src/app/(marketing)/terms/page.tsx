import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions – Aspirant Adda" },
  description:
    "Read the Terms & Conditions for using Aspirant Adda. Your use of the platform constitutes agreement to these terms.",
  alternates: {
    canonical: "/terms",
  },
};

const prohibited = [
  "Engage in any obscene, pornographic, abusive, threatening, or otherwise unlawful behavior",
  "Share or disseminate adult content, including during video/audio calls",
  "Harass, stalk, defame, or harm other users",
  "Use the Platform for commercial advertising or solicitation",
  "Attempt to bypass any moderation, safety, or security mechanisms",
  "Upload or distribute any copyrighted or proprietary material unless authorized",
];

const extraTerms = [
  {
    title: "Platform Liability",
    body: "We act as an intermediary under Section 79 of the IT Act, 2000. We are not responsible for any user content, video/audio calls, or interactions.",
  },
  {
    title: "Indemnification",
    body: "You agree to indemnify and hold harmless Aspirant Adda and its team from any liabilities arising from your use of the platform.",
  },
  {
    title: "Termination",
    body: "We reserve the right to suspend or terminate access at any time if behavior is deemed inappropriate or harmful.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by Indian law and subject to courts of Haryana.",
  },
];

export default function TermsPage() {
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
              Terms & <span className="text-[#4f46e5]">Conditions</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/65 sm:text-lg">
              Please read these terms carefully before using our platform. Your
              use of Aspirant Adda constitutes agreement to these terms.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[900px] space-y-8 px-6 lg:px-8">
            <div className="rounded-[1.5rem] border border-[#4f46e5]/12 bg-[#f8f9ff] p-6 sm:p-8">
              <p className="font-body text-base leading-relaxed text-ink/75 sm:text-lg">
                Welcome to Aspirant Adda, a digital community platform designed
                exclusively to connect UPSC aspirants for educational
                collaboration, communication, and peer support. By accessing or
                using Aspirant Adda (website and/or mobile application), you
                agree to be bound by these Terms and Conditions (&quot;Terms&quot;).
                If you do not agree with any part of these Terms, please do not
                use the platform.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Nature of the{" "}
                <span className="text-[#4f46e5]">Platform</span>
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                Aspirant Adda is a peer-to-peer (P2P) platform that connects
                students and aspirants for academic networking, mentorship, and
                community engagement. We provide the technological
                infrastructure to enable these interactions and do not
                participate in or moderate individual communications.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                <span className="text-[#4f46e5]">Eligibility</span>
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                You must be at least 18 years of age to use the Platform. By
                accessing or using the Services, you represent and warrant that
                you meet this requirement.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                User <span className="text-[#4f46e5]">Conduct</span>
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                You agree to use the Platform only for lawful purposes and in
                accordance with these Terms. You shall not:
              </p>
              <ul className="mt-5 space-y-3">
                {prohibited.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-sm text-ink/70 sm:text-[0.95rem]"
                  >
                    <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500">
                      ×
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-ink">
                Violation Consequences
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-ink/70">
                Any violation may result in suspension, banning, or legal action
                at our discretion. Aspirant Adda may delete or disable content
                at any time without notice if found violating terms.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Copyright and Resource{" "}
                <span className="text-[#4f46e5]">Sharing</span>
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-[#4f46e5]/15 bg-[#eef2ff] p-4">
                  <h4 className="font-display font-semibold text-[#1e1b4b]">
                    User Responsibility
                  </h4>
                  <p className="mt-1 font-body text-sm text-[#3730a3]">
                    By uploading or sharing any resource, you affirm rights to
                    do so. Unauthorized sharing is prohibited.
                  </p>
                </div>
                <div className="rounded-xl border border-[#4f46e5]/12 bg-[#f8f9ff] p-4">
                  <h4 className="font-display font-semibold text-[#1e1b4b]">
                    Platform&apos;s Right to Remove
                  </h4>
                  <p className="mt-1 font-body text-sm text-ink/70">
                    We may remove any content that appears unauthorized or
                    violates our Terms.
                  </p>
                </div>
                <div className="rounded-xl border border-[#4f46e5]/12 bg-[#f8f9ff] p-4">
                  <h4 className="font-display font-semibold text-[#1e1b4b]">
                    Notice &amp; Takedown
                  </h4>
                  <p className="mt-1 font-body text-sm text-ink/70">
                    Valid takedown requests will be processed as per IT Act
                    2000. Content may be removed within legal timeframe.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Content Removal{" "}
                <span className="text-[#4f46e5]">Mechanism</span>
              </h2>
              <p className="mt-4 font-body text-base text-ink/70">
                To report any violation, use the in-app report feature or email:
              </p>
              <div className="mt-4 space-y-2 rounded-xl border border-[#4f46e5]/10 bg-[#f8f9ff] p-4 font-body text-sm text-ink/75">
                <p>
                  <span className="font-semibold text-ink">Email:</span>{" "}
                  <a
                    href="mailto:oyeaspirantadda@gmail.com"
                    className="font-medium text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    oyeaspirantadda@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-ink">Subject:</span>{" "}
                  Content Removal Request – [User handle/Incident Details]
                </p>
                <p>
                  <span className="font-semibold text-ink">Description:</span>{" "}
                  Include evidence like screenshots, timestamps, etc.
                </p>
              </div>
              <p className="mt-4 font-body text-sm text-ink/65">
                We acknowledge complaints within 24 hours and resolve them
                within 15 days.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/12 bg-[#eef2ff] p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Grievance Officer{" "}
                <span className="text-[#4f46e5]">Details</span>
              </h2>
              <div className="mt-5 space-y-2 rounded-xl border border-[#4f46e5]/10 bg-white p-5 font-body text-sm text-ink/75 sm:text-base">
                <p>
                  <span className="font-semibold text-ink">Name:</span> Tushar
                  Singla
                </p>
                <p>
                  <span className="font-semibold text-ink">Designation:</span>{" "}
                  Grievance Officer
                </p>
                <p>
                  <span className="font-semibold text-ink">Email:</span>{" "}
                  <a
                    href="mailto:oyeaspirantadda@gmail.com"
                    className="font-medium text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    oyeaspirantadda@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-ink">Phone:</span>{" "}
                  <a
                    href="tel:+917011596808"
                    className="font-medium text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    +91 7011596808
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {extraTerms.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-white p-6"
                >
                  <h3 className="font-display text-xl font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/10 bg-[#f8f9ff] p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-ink">
                Modifications
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-ink/70">
                We may revise these Terms at any time. Continued use of the
                Platform implies acceptance of the latest version.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#4f46e5]/12 bg-[#eef2ff] p-6 text-center sm:p-8">
              <p className="font-body text-base text-ink/75">
                For any questions, contact us at:{" "}
                <a
                  href="mailto:oyeaspirantadda@gmail.com"
                  className="font-semibold text-[#4f46e5] hover:text-[#4338ca]"
                >
                  oyeaspirantadda@gmail.com
                </a>
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

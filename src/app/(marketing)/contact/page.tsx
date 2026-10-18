import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { ContactForm } from "@/components/marketing/ContactForm";
import { WhatsAppFloat } from "@/components/marketing/WhatsAppFloat";

export const metadata: Metadata = {
  title: { absolute: "Contact Us – Aspirant Adda" },
  description:
    "Get in touch with Aspirant Adda. We're here to help with questions, support, and partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

const contactChannels = [
  {
    title: "Email",
    href: "mailto:oyeaspirantadda@gmail.com",
    label: "oyeaspirantadda@gmail.com",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Phone",
    href: "tel:+917011596808",
    label: "+91 7011596808",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    title: "WhatsApp",
    href: "https://wa.me/917011596808?text=Hello%20I%20need%20info%20about%20Aspirant%20Adda",
    label: "Chat with us instantly",
    external: true,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.002 2C6.478 2 2 6.486 2 12.018a9.93 9.93 0 001.383 5.019L2 22l5.063-1.354a9.977 9.977 0 004.939 1.271H12c5.522 0 10-4.486 10-10.018C22 6.486 17.522 2 12.002 2zm0 18c-1.624 0-3.14-.437-4.447-1.201l-.32-.191-3.008.805.801-2.934-.21-.327A7.945 7.945 0 014 12.018c0-4.419 3.584-8.002 8.002-8.002 4.419 0 8.002 3.583 8.002 8.002 0 4.418-3.583 8.002-8.002 8.002zm4.482-5.61c-.25-.124-1.47-.725-1.697-.808-.227-.083-.393-.124-.56.124-.165.248-.643.808-.788.974-.144.165-.29.186-.54.062-.248-.124-1.047-.386-1.995-1.232-.738-.656-1.236-1.467-1.38-1.715-.144-.248-.016-.382.108-.506.111-.111.248-.29.372-.434.124-.144.165-.248.248-.414.083-.165.041-.31-.02-.434-.062-.124-.56-1.346-.767-1.844-.202-.486-.408-.42-.56-.427l-.476-.008c-.165 0-.434.062-.662.31s-.87.85-.87 2.07.891 2.401 1.014 2.57c.124.165 1.75 2.675 4.24 3.749.593.256 1.057.41 1.418.525.595.19 1.137.163 1.564.1.476-.071 1.47-.601 1.676-1.181.206-.58.206-1.077.144-1.181-.062-.103-.227-.165-.476-.289z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-body text-ink">
      <Navbar variant="page" />

      <main>
        <section
          className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
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
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-0 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "rgba(129,140,248,0.28)" }}
          />
          <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-8">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-[#4f46e5] sm:text-sm">
              Support
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Contact <span className="text-[#4f46e5]">Us</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/65 sm:text-lg lg:text-xl">
              Get in touch with us. We&apos;re here to help you with any
              questions or support you need.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Get In <span className="text-[#4f46e5]">Touch</span>
                </h2>
                <p className="mt-4 font-body text-base leading-relaxed text-ink/65 sm:text-lg">
                  We&apos;d love to hear from you. Send us a message and
                  we&apos;ll respond as soon as possible.
                </p>

                <div className="mt-8 space-y-4">
                  {contactChannels.map((channel) => (
                    <div
                      key={channel.title}
                      className="flex items-start gap-4 rounded-[1.25rem] border border-[#4f46e5]/12 bg-[#f8f9ff] p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4f46e5] text-white">
                        {channel.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-ink">
                          {channel.title}
                        </h3>
                        <a
                          href={channel.href}
                          {...(channel.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="mt-1 inline-block font-body text-sm font-medium text-[#4f46e5] transition-colors hover:text-[#4338ca]"
                        >
                          {channel.label}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#4f46e5]/12 bg-[#f8f9ff] p-7 sm:p-8">
                <h3 className="mb-6 font-display text-2xl font-bold text-ink">
                  Send us a Message
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppFloat />
      <Footer />
    </div>
  );
}

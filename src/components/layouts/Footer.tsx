"use client";

/**
 * Footer
 * Dark brand-themed footer aligned with the Transform CTA —
 * brand block, nav columns, and socials.
 */
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const whatsappMessage = encodeURIComponent(
    "Hey i need help regurading aspirant adda website",
  );

  const socialLinks = [
    {
      href: `https://wa.me/917011596808?text=${whatsappMessage}`,
      alt: "WhatsApp",
      icon: "/logo/whatsapp.svg",
      ariaLabel: "Chat on WhatsApp at +91 70115 96808",
    },
    {
      href: "https://x.com/AspirantAdda_",
      alt: "X (Twitter)",
      icon: "/logo/Social Icons-1.svg",
      ariaLabel: "Follow Aspirant Adda on X",
    },
    {
      href: "https://www.instagram.com/aspirantadda",
      alt: "Instagram",
      icon: "/logo/Social Icons-2.svg",
      ariaLabel: "Follow Aspirant Adda on Instagram",
    },
    {
      href: "https://www.linkedin.com/company/aspirant-adda/posts/?feedView=all",
      alt: "LinkedIn",
      icon: "/logo/Social Icons-3.svg",
      ariaLabel: "Follow Aspirant Adda on LinkedIn",
    },
  ];

  const exploreLinks = [
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Courses", href: "/#courses" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer
      className={`relative w-full overflow-hidden bg-[#1e1b4b] text-white ${className}`}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .footer-link-text {
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .footer-link-underline {
          transform: scaleX(0);
          transition: transform 0.25s ease;
          background: #a5b4fc;
        }
        @media (hover: hover) {
          .footer-link:hover .footer-link-text {
            transform: translateY(-1px);
            color: #ffffff;
          }
          .footer-link:hover .footer-link-underline {
            transform: scaleX(1);
          }
          .footer-social:hover {
            transform: translateY(-2px);
            background: #ffffff;
            box-shadow: 0 12px 28px rgba(0,0,0,0.25);
          }
        }
        .footer-link:active .footer-link-text,
        .footer-link:focus .footer-link-text {
          color: #ffffff;
        }
        .footer-link:active .footer-link-underline,
        .footer-link:focus .footer-link-underline {
          transform: scaleX(1);
        }
      `,
        }}
      />

      {/* Soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(79,70,229,0.35)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(129,140,248,0.22)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-12 pb-2 md:px-12 md:pt-14 lg:px-16 lg:pt-16">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pb-12">
          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-left lg:col-span-5">
            <p className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-white md:text-4xl">
              Aspirant
              <br />
              Adda
            </p>
            <p className="mt-3 max-w-[340px] font-body text-sm leading-relaxed text-white/70 md:text-[0.95rem]">
              Your community for serious exam prep — doubts solved, progress
              tracked, and mentors who actually care.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social inline-flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300"
                >
                  <Image
                    src={social.icon}
                    alt={social.alt}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col items-center sm:items-start lg:col-span-2 lg:col-start-7">
            <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a5b4fc]">
              Explore
            </p>
            <ul className="flex flex-col items-center space-y-3 sm:items-start">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="footer-link group relative block w-fit py-0.5 text-[0.95rem] font-medium text-white/80"
                  >
                    <span className="footer-link-text relative z-10 inline-block">
                      {link.label}
                    </span>
                    <span className="footer-link-underline absolute bottom-0 left-0 h-px w-full origin-left" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center sm:items-start lg:col-span-2">
            <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a5b4fc]">
              Legal
            </p>
            <ul className="flex flex-col items-center space-y-3 sm:items-start">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="footer-link group relative block w-fit py-0.5 text-[0.95rem] font-medium text-white/80"
                  >
                    <span className="footer-link-text relative z-10 inline-block">
                      {link.label}
                    </span>
                    <span className="footer-link-underline absolute bottom-0 left-0 h-px w-full origin-left" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center sm:items-start lg:col-span-2">
            <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a5b4fc]">
              Connect
            </p>
            <a
              href="mailto:oyeaspirantadda@gmail.com"
              className="footer-link group relative block w-fit py-0.5 text-[0.95rem] font-medium text-white/80"
            >
              <span className="footer-link-text relative z-10 inline-block">
                oyeaspirantadda@gmail.com
              </span>
              <span className="footer-link-underline absolute bottom-0 left-0 h-px w-full origin-left" />
            </a>
            <a
              href={`https://wa.me/917011596808?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link group relative mt-3 block w-fit py-0.5 text-[0.95rem] font-medium text-white/80"
            >
              <span className="footer-link-text relative z-10 inline-block">
                +91 70115 96808
              </span>
              <span className="footer-link-underline absolute bottom-0 left-0 h-px w-full origin-left" />
            </a>
            <p className="mt-3 max-w-[210px] text-center font-body text-xs leading-relaxed text-white/50 sm:text-left">
              Built for aspirants across India.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-2 px-6 py-4 sm:flex-row md:px-12 lg:px-16">
          <p className="text-xs text-white/55 md:text-sm">
            © 2026 Aspirant Adda · India
          </p>
          <p className="text-xs text-white/45">Prep smarter. Rise higher.</p>
        </div>
      </div>
    </footer>
  );
};

/**
 * Button
 * Polymorphic button with primary / outline variants.
 * Uses the shared brand tokens from globals.css.
 */
import React from "react";

type ButtonAsButton = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: "primary" | "outline";
  children: React.ReactNode;
};

type ButtonAsAnchor = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center gap-2 px-[28px] py-[12px] text-sm font-semibold leading-[24px] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95 font-body";

  const variants = {
    primary:
      "bg-[var(--brand)] text-white hover:text-white hover:bg-[var(--brand-hover)] active:brightness-90 active:shadow-inner",
    outline:
      "bg-white text-[var(--brand)] border-2 border-[var(--brand)] hover:text-white hover:bg-[var(--brand-hover)] hover:border-[var(--brand-hover)] active:brightness-90 active:shadow-inner",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className ?? ""}`;

  if ((props as ButtonAsAnchor).href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a href={href} className={combinedClassName} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={combinedClassName}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

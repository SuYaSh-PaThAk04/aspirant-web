export function ThemeImage({
  alt,
  className = "",
}: {
  alt: string;
  className?: string;
}) {
  return (
    <>
      <img src="/adda-features-dark.jpg" alt={alt} className={`theme-dark-only ${className}`} />
      <img src="/adda-features-light.jpg" alt="" className={`theme-light-only ${className}`} />
    </>
  );
}

export default function EducatorsBanner() {
  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{ minHeight: 220 }}
    >
      {/* Background image — replace with your actual banner image */}
      <img
        src="/Com-images/Banner.png"
        alt="Educators Banner"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(80,60,200,0.45)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={{ minHeight: 220, padding: "40px 24px" }}
      >
        <h3
          className="font-bold text-white mb-2"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          }}
        >
          30+ Educators Have Joined
        </h3>
        <p
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: "0.9rem",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: "24px",
          }}
        >
          Get guidance from experienced mentors, toppers, and subject experts.
        </p>

        {/* CTA Button */}
        <button
          style={{
            background: "#fff",
            color: "#333",
            border: "none",
            borderRadius: "999px",
            padding: "12px 28px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          → Connect with Our Team
        </button>
      </div>
    </div>
  );
}
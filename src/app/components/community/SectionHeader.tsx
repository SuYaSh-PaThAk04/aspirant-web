export default function SectionHeader() {
  return (
    <div className="text-center mb-14">
      <h2
        className="font-bold mb-3"
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#111",
        }}
      >
        <span style={{ color: "#7063FF" }}>Connecting Aspirants</span>{" "}
        <span style={{ color: "#111" }}>Across India</span>
      </h2>
      <p style={{ color: "#6b7280", fontSize: "0.95rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        A growing network of learners, mentors, and achievers from every corner of the country.
      </p>
    </div>
  );
}
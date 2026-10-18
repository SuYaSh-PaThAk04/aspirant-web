type MemberCardProps = {
  label: string;
  imageSrc: string;
};

export default function MemberCard({ label, imageSrc }: MemberCardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "24px",
          background: "#ece9ff",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageSrc}
          alt={label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "#111",
        }}
      >
        {label}
      </span>
    </div>
  );
}
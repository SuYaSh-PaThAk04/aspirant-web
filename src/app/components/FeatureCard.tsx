import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
}

export default function FeatureCard({ title, description, image }: FeatureCardProps) {
  return (
    <div className="group cursor-pointer"
      style={{

    fontWeight: 400,
    fontFamily: "var(--font-poppins)",
    letterSpacing: "0%",
  }} >
      {/* Image Container */}
      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ height: "220px" }}
      >
        <Image
          src={image}
          alt={title}
          width={400}
          height={220}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="text-lg text-gray-900 mb-2 tracking-tight"
      style={{
       fontSize: "32px", 
      }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
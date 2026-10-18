import MemberCard from "./MemberCard";

const members = [
  { label: "Freshers",  imageSrc: "/Com-images/Member-img.jpg"  },
  { label: "Seniors",   imageSrc: "/Com-images/Member-img.jpg"   },
  { label: "Mentors",   imageSrc: "/Com-images/Member-img.jpg"   },
  { label: "Officers",  imageSrc: "/Com-images/Member-img.jpg" },
];
export default function MembersGrid() {
  return (
    <div className="flex flex-wrap justify-center gap-10 mb-16">
      {members.map((m) => (
        <MemberCard key={m.label} label={m.label} imageSrc={m.imageSrc} />
      ))}
    </div>
  );
}
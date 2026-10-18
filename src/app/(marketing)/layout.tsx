import { Plus_Jakarta_Sans, Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`marketing ${poppins.variable} ${jakarta.variable}`}>{children}</div>;
}

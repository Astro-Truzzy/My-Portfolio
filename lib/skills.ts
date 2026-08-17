export type SkillCategoryId = "languages" | "frontend" | "backend" | "tools";

export type Skill = {
  name: string;
  category: SkillCategoryId;
  /** simpleicons.org slug; omit when no public mark exists */
  slug?: string;
  hex?: string;
};

export const skillCategories: {
  id: SkillCategoryId | "all";
  title: string;
  heading: string;
  description: string;
}[] = [
  {
    id: "all",
    title: "All",
    heading: "Technical Expertise",
    description:
      "The stack on the résumé — languages, product UI, backends, and the environment I ship in. Drag the desk; nothing here is a wish list.",
  },
  {
    id: "languages",
    title: "Languages",
    heading: "Languages",
    description:
      "What the products are written in: JavaScript and TypeScript first, plus Python and Solidity where the work needed them.",
  },
  {
    id: "frontend",
    title: "Frontend",
    heading: "Frontend & UI",
    description:
      "Web, native, motion, charts, and the design tools behind Ridely, Ownbase, and the client interfaces.",
  },
  {
    id: "backend",
    title: "Backend",
    heading: "Backend & Data",
    description:
      "APIs, stores, and integrations: Node, SQL and document data, Supabase, payments, and the GitHub/GitLab/OpenAI rails on Ownbase.",
  },
  {
    id: "tools",
    title: "Tools",
    heading: "Tools & Env",
    description:
      "How work moves from a repo to something running: Git, Docker, Vercel, Hostinger, and the rest of the shipping bench.",
  },
];

export const skills: Skill[] = [
  { name: "JavaScript", category: "languages", slug: "javascript", hex: "F7DF1E" },
  { name: "TypeScript", category: "languages", slug: "typescript", hex: "3178C6" },
  { name: "HTML5", category: "languages", slug: "html5", hex: "E34F26" },
  { name: "CSS3", category: "languages", slug: "css", hex: "663399" },
  { name: "Python", category: "languages", slug: "python", hex: "3776AB" },
  { name: "Solidity", category: "languages", slug: "solidity", hex: "363636" },
  { name: "React.js", category: "frontend", slug: "react", hex: "61DAFB" },
  { name: "Next.js", category: "frontend", slug: "nextdotjs", hex: "FFFFFF" },
  { name: "React Native", category: "frontend", slug: "react", hex: "61DAFB" },
  { name: "Tailwind CSS", category: "frontend", slug: "tailwindcss", hex: "06B6D4" },
  { name: "Framer Motion", category: "frontend", slug: "framer", hex: "0055FF" },
  { name: "Three.js", category: "frontend", slug: "threedotjs", hex: "FFFFFF" },
  { name: "Chart.js", category: "frontend", slug: "chartdotjs", hex: "FF6384" },
  { name: "Recharts", category: "frontend", slug: "recharts", hex: "22B5BF" },
  { name: "Figma", category: "frontend", slug: "figma", hex: "F24E1E" },
  { name: "Adobe XD", category: "frontend", slug: "adobexd", hex: "FF61F6" },
  { name: "Canva", category: "frontend", slug: "canva", hex: "00C4CC" },
  { name: "CorelDraw", category: "frontend", slug: "coreldraw", hex: "24B6C5" },
  { name: "Node.js", category: "backend", slug: "nodedotjs", hex: "5FA04E" },
  { name: "Express.js", category: "backend", slug: "express", hex: "FFFFFF" },
  { name: "MongoDB", category: "backend", slug: "mongodb", hex: "47A248" },
  { name: "MySQL", category: "backend", slug: "mysql", hex: "4479A1" },
  { name: "Supabase", category: "backend", slug: "supabase", hex: "3FCF8E" },
  { name: "Appwrite", category: "backend", slug: "appwrite", hex: "FD366E" },
  { name: "Paystack", category: "backend", slug: "paystack", hex: "00C3F7" },
  { name: "OpenAI API", category: "backend", slug: "openai", hex: "FFFFFF" },
  { name: "CoinMarketCap API", category: "backend", slug: "coinmarketcap", hex: "17181B" },
  { name: "Finnhub API", category: "backend" },
  { name: "GitHub API", category: "backend", slug: "github", hex: "FFFFFF" },
  { name: "GitLab API", category: "backend", slug: "gitlab", hex: "FC6D26" },
  { name: "Solana", category: "backend", slug: "solana", hex: "9945FF" },
  { name: "Smart Contract Integration", category: "backend" },
  { name: "Git", category: "tools", slug: "git", hex: "F05032" },
  { name: "Docker", category: "tools", slug: "docker", hex: "2496ED" },
  { name: "Postman", category: "tools", slug: "postman", hex: "FF6C37" },
  { name: "Vercel", category: "tools", slug: "vercel", hex: "FFFFFF" },
  { name: "Hostinger", category: "tools", slug: "hostinger", hex: "673DE6" },
  { name: "Google Cloud Console", category: "tools", slug: "googlecloud", hex: "4285F4" },
  { name: "XAMPP", category: "tools", slug: "xampp", hex: "FB7A24" },
];

export function skillsIn(category: SkillCategoryId | "all") {
  if (category === "all") return skills;
  return skills.filter((s) => s.category === category);
}

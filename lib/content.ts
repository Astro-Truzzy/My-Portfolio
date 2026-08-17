export type SocialLink = {
  label: string;
  href: string;
  /** Set when the resume did not include a URL. */
  placeholder?: boolean;
};

export type ProofStat = {
  value: string;
  label: string;
};

export type Capability = {
  title: string;
  description: string;
  stack: [string, string, string];
  command: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  type: "Work" | "Personal";
  category: string;
  language: string;
  date: string;
  hoverLine: string;
  story: string;
  stack: string[];
  accent: string;
  image: string;
  metric?: { value: string; label: string };
  links: ProjectLink[];
};

export type Role = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  duration: string;
  current?: boolean;
  bullets: string[];
  skills: string[];
};

export type Education = {
  credential: string;
  org: string;
  dates: string;
  location: string;
  notes: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export const site = {
  name: "Trust Williams",
  firstName: "Trust",
  lastName: "Williams",
  role: "Full-Stack Developer | Founder",
  shortRole: "Full-Stack Engineer",
  email: "Taresy.dev@gmail.com",
  phone: "+234 808 701 5029",
  phoneSecondary: "+234 814 854 4045",
  location: "Port Harcourt, Rivers State, Nigeria",
  city: "Port Harcourt",
  timezone: "Africa/Lagos",
  timezoneAbbr: "WAT",
  availability: "Open to Full-Stack Developer roles",
  resumeHref: "/Trust-Williams-CV.pdf",
  resumeFilename: "Trust-Williams-CV.pdf",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  origin: "Edo State, Nigeria",
} as const;

export const socials: SocialLink[] = [
  {
    label: "Email",
    href: `mailto:${site.email}`,
  },
  {
    label: "GitHub",
    href: "https://github.com/Astro-Truzzy",
  },
  {
    label: "LinkedIn",
    href: "",
    placeholder: true,
  },
];

export const hero = {
  valueProposition:
    "I found and ship products end-to-end — Ridely, a dispatch platform piloting in Benin City, and Ownbase, which gives business owners plain-language control of their codebase. Training in molecular diagnostics still shapes the work: precision, hypothesis-driven thinking, and comfort with complex data.",
  primaryCta: "Start a conversation",
  secondaryCta: "View work",
  microBar: {
    years: { value: "2", label: "yrs shipping" },
    stack: ["Next.js", "React", "Node", "TS", "RN"],
    education: "B.Sc. Microbiology, UNIBEN ’24",
  },
} as const;

export const about = {
  bio: [
    "I’m a builder and a founder, originally from Edo State, now based in Port Harcourt. Over the years I’ve written code, made sense of data, and crafted interfaces people actually enjoy using — which is how I learned to see a digital product as a whole, not a pile of tickets.",
    "As founder of Ridely (dispatch logistics) and Ownbase (developer access and code management), I’ve taken products from a market gap through architecture, design, shipping, and the messy middle of getting them in front of people. I also serve as an EdoTechWave Ambassador, working on tech accessibility across Nigeria.",
    "My first discipline was molecular diagnostics and clinical biotechnology. That scientific habit — precision, hypothesis-driven thinking, comfort with complex data — is still how I approach engineering problems.",
    "Whether I’m in a codebase, on a product roadmap, or in a dataset, I bring the same bar: curiosity, rigor, craft, and work that actually ships.",
  ],
  overlayTags: ["Next.js", "Node.js", "React Native"],
  values: [
    {
      title: "Ownership",
      body: "I don’t just implement tickets. I identify the gap, design the system, and steer it through launch — the same path I took with Ridely and Ownbase.",
    },
    {
      title: "Precision",
      body: "Lab training stuck. I treat data, access, and edge cases as first-class, not afterthoughts — especially when non-technical people depend on the output.",
    },
    {
      title: "Enablement",
      body: "I taught frontend to 20+ students at Luzoma; 40% went on to freelance, and several landed full-time roles. I want the work to outlive the repo.",
    },
  ],
};

export const proof: ProofStat[] = [
  { value: "2", label: "Years shipping products since founding Ridely (2024)" },
  { value: "20+", label: "Students taught frontend at Luzoma Microsystems" },
  { value: "24", label: "Repos connected on Ownbase in the first cycle" },
  { value: "1st", label: "Runner-up, Edo Tech Stars Hackathon (2024)" },
];

export const capabilities: Capability[] = [
  {
    title: "Full-stack product",
    description:
      "Own the storefront-to-admin path: auth, data, dashboards, and a UI that still works on a phone. Built this way on Nexus Gadgets and Core Wealth Market.",
    stack: ["Next.js", "Node.js", "MySQL"],
    command: "trust ship --stack next,node,mysql --ssr",
  },
  {
    title: "APIs & live data",
    description:
      "Orchestrate multiple sources into one live view. CryptoNow pulled CoinMarketCap and Finnhub so pricing stayed current without a manual refresh.",
    stack: ["Node.js", "Chart.js", "Express"],
    command: "trust aggregate --live --sources cmc,finnhub",
  },
  {
    title: "AI in the product",
    description:
      "Use models where they remove a real bottleneck. Ownbase uses OpenAI to summarize repositories in language a business owner can actually read.",
    stack: ["OpenAI", "TypeScript", "Supabase"],
    command: "trust summarize --repo --audience non-technical",
  },
  {
    title: "Developer tools",
    description:
      "Give non-technical owners visibility and control when engineers hold the keys. Ownbase links GitHub/GitLab, gates access, and translates git activity into plain language.",
    stack: ["GitHub API", "GitLab API", "Supabase"],
    command: "trust ownbase --link-repo --watch activity",
  },
  {
    title: "Mobile, end to end",
    description:
      "Ship cross-platform apps with real-time tracking and dual roles. Ridely is React Native on iOS/Android, with rider tracking and distance-based pricing.",
    stack: ["React Native", "React", "Node.js"],
    command: "trust mobile --ios --android --realtime",
  },
  {
    title: "Web3-aware frontends",
    description:
      "Build booking and access UIs on a decentralized rail. VeluxLink used Solana so talent could price and gate fan calls without a conventional middleman.",
    stack: ["Solana", "Auth", "Web frontend"],
    command: "trust bookings --chain solana --access-gated",
  },
];

export const projects: Project[] = [
  {
    id: "ridely",
    title: "Ridely",
    type: "Work",
    category: "Product",
    language: "React Native",
    date: "09/2024 – Present",
    hoverLine:
      "Dispatch logistics for last-mile delivery — tracking, pricing, dual dashboards.",
    story:
      "Businesses in Benin City needed a reliable way to put parcels on bikes without running a dispatch desk themselves. I founded Ridely and built it end-to-end: architecture, design, development, deployment, and go-to-market. The product is a cross-platform React Native app (iOS/Android) with real-time rider tracking, a distance-based dynamic pricing engine, and separate dashboards for customers and riders. We are piloting with 3 test riders and a waitlist of 30+ signups in Benin City. The same build earned 1st Runner-Up at the Edo Tech Stars Hackathon.",
    stack: ["React Native", "React", "Node.js"],
    accent: "#2ee6c5",
    image: "/work/ridely.png",
    metric: { value: "30+", label: "waitlist signups in Benin City" },
    links: [
      { label: "Live", href: "https://ridelyweb.com" },
      { label: "GitHub", href: "https://github.com/Astro-Truzzy/Ridely" },
      { label: "App repo", href: "https://github.com/Astro-Truzzy/Ridely-App" },
    ],
  },
  {
    id: "ownbase",
    title: "Ownbase",
    type: "Work",
    category: "Developer tools",
    language: "TypeScript",
    date: "01/2026 – 06/2026",
    hoverLine:
      "Repo access and plain-language activity for non-technical business owners.",
    story:
      "When a developer leaves, too many owners discover they never actually controlled the repo. I conceptualized and built Ownbase so non-technical business owners could see and govern their codebase. The platform links GitHub and GitLab, applies granular access, and uses Supabase to turn commits, pushes, and PRs into plain-language activity. OpenAI auto-summarizes repositories so an owner can understand the work without a developer in the room. Early cycle: 24 repos connected, 11 users, and 4 early business owners onboarded.",
    stack: ["Node.js", "TypeScript", "React", "Supabase", "OpenAI"],
    accent: "#7aa2ff",
    image: "/work/ownbase.png",
    metric: { value: "24", label: "repos connected" },
    links: [
      { label: "Live", href: "https://ownbase.cloud" },
      { label: "GitHub", href: "https://github.com/Astro-Truzzy/OwnBase" },
    ],
  },
  {
    id: "core-wealth",
    title: "Core Wealth Market",
    type: "Work",
    category: "Fintech",
    language: "Full stack",
    date: "03/2026",
    hoverLine:
      "Live crypto trading: markets, execution, and portfolios in one interface.",
    story:
      "The brief was a crypto trading platform where people could watch markets, place trades, and manage digital-asset portfolios without wrestling the plumbing. I designed and built a working product: a backend for live market data, trade execution, and account management, sized for real-time load, plus an interface that made dense financial data readable. Client-reported estimates cited an average 33% increase in trader earnings after adoption — a number I treat as their measurement, not a lab result, but it is what they reported.",
    stack: ["Full stack", "Live market data"],
    accent: "#e2b15c",
    image: "/work/core-wealth.png",
    metric: { value: "33%", label: "client-reported lift in trader earnings" },
    links: [
       { label: "Live", href: "https://corewealthmarket.com" },
      { label: "GitHub", href: "https://github.com/Astro-Truzzy/CoreWealthMarket" },
    ],
  },
  {
    id: "nexus",
    title: "Nexus Gadgets",
    type: "Personal",
    category: "Commerce",
    language: "Next.js",
    date: "05/2026 – 06/2026",
    hoverLine:
      "Electronics storefront to fulfillment — cart, checkout, auth, admin.",
    story:
      "I wanted a complete commerce loop for gadgets and electronics, not a catalog demo. Nexus Gadgets covers browsing, search, filtering, a persistent cart, checkout, session-based auth, and dashboards so shoppers can track orders and manage accounts. An admin surface handles product and image management, user monitoring, and order status across fulfillment. The stack is Next.js (SSR), a Node.js API, and MySQL, with a responsive, accessible storefront on mobile and desktop.",
    stack: ["Next.js", "React", "Node.js", "MySQL"],
    accent: "#c084fc",
    image: "/work/nexus.jpg",
    metric: { value: "SSR", label: "storefront on Next.js" },
    links: [
      { label: "Live", href: "https://nexus-tech-complete.vercel.app" },
      { label: "GitHub", href: "https://github.com/Astro-Truzzy/Nexus-Tech-Complete" },
    ],
  },
  {
    id: "veluxlink",
    title: "VeluxLink",
    type: "Work",
    category: "Web3",
    language: "Frontend",
    date: "03/2025 – 06/2025",
    hoverLine:
      "Fan call bookings for public figures, priced and gated on Solana.",
    story:
      "VeluxLink needed a web interface for a Web3 product: celebrities and public figures monetizing fan time through voice and video bookings. I built the responsive frontend, including access controls so talent could decide who books and at what price, and wired in Solana infrastructure for a decentralized monetization layer. Third-party APIs and authentication protect fan and talent accounts; frontend features sit on database-backed services in collaboration with the backend team. I stayed on for maintenance as the requirements moved.",
    stack: ["Solana", "Auth", "Web frontend"],
    accent: "#f472b6",
    image: "/work/veluxlink.jpg",
    metric: { value: "Web3", label: "Solana booking rail" },
    links: [],
  },
];

export const experience: Role[] = [
  {
    title: "Founder & Full Stack Developer",
    company: "Ridely — Dispatch Logistics",
    location: "Benin City · Hybrid",
    start: "09/2024",
    end: null,
    duration: "1 yr 11 mos",
    current: true,
    bullets: [
      "Founded and shipped Ridely end-to-end, connecting businesses with riders for last-mile delivery — architecture through go-to-market.",
      "Built a React Native app (iOS/Android) with real-time rider tracking, distance-based pricing, and dual customer/rider dashboards.",
      "Piloting with 3 test riders and 30+ waitlist signups in Benin City; 1st Runner-Up at the Edo Tech Stars Hackathon.",
    ],
    skills: ["React Native", "React", "Node.js"],
  },
  {
    title: "Ambassador",
    company: "Edo Tech Wave",
    location: "Benin City",
    start: "02/2025",
    end: null,
    duration: "1 yr 6 mos",
    current: true,
    bullets: [
      "Ran social campaigns that raised the Edo Tech Wave brand among tech enthusiasts in Edo State.",
      "Planned workshops and meetups that put developers, designers, and innovators in the same room.",
      "Mentored junior members on skills, career paths, and entering the industry; recruited into a broader Benin City community.",
    ],
    skills: ["Community", "Mentorship"],
  },
  {
    title: "Full Stack Developer | Founder",
    company: "Ownbase — Developer Access & Code Management",
    location: "Remote",
    start: "01/2026",
    end: "06/2026",
    duration: "6 mos",
    bullets: [
      "Built Ownbase so non-technical owners could see and control their codebase after a developer walks away.",
      "Shipped GitHub/GitLab linking, granular access, and Supabase-backed activity that turns git events into plain language.",
      "Integrated OpenAI repo summaries; 24 repos connected, 11 users, 4 early business owners onboarded.",
    ],
    skills: ["Node.js", "TypeScript", "React", "Supabase", "OpenAI"],
  },
  {
    title: "Full Stack Developer",
    company: "Nexus Gadgets — E-commerce",
    location: "Remote",
    start: "05/2026",
    end: "06/2026",
    duration: "2 mos",
    bullets: [
      "Shipped a full gadgets/electronics commerce loop: storefront, cart, checkout, session auth, and order dashboards.",
      "Built an admin surface for catalog images, accounts, and fulfillment status.",
      "Next.js SSR + Node.js API + MySQL, with a responsive, accessible storefront.",
      "Helped the client grow their online presence; dashboard analytics showed a 43% increase in sales.",
    ],
    skills: ["Next.js", "React", "Node.js", "MySQL"],
  },
  {
    title: "Full Stack Developer",
    company: "Core Wealth Market — Crypto Trading",
    location: "Remote",
    start: "03/2026",
    end: "03/2026",
    duration: "1 mo",
    bullets: [
      "Designed and built a trading platform for live markets, execution, and portfolio management.",
      "Implemented a backend for market data, trade logic, and accounts under real-time load.",
      "Client-reported estimates cited an average 33% increase in trader earnings after adoption.",
    ],
    skills: ["Full stack", "Real-time data"],
  },
  {
    title: "Frontend Development Instructor",
    company: "Luzoma Microsystems",
    location: "Part-time",
    start: "06/2025",
    end: "06/2025",
    duration: "9 mo",
    bullets: [
      "Taught HTML, CSS, Bootstrap, JavaScript, and React.js to 20+ students, from beginners to career-switchers.",
      "Designed a path from fundamentals to portfolio-ready projects, with one-to-one mentoring at each learner’s pace.",
      "40% of students went on to freelance independently; several landed full-time development roles.",
    ],
    skills: ["HTML", "CSS", "Bootstrap", "JavaScript", "React.js", "Git"],
  },
  {
    title: "Front-end Developer",
    company: "VeluxLink",
    location: "Remote",
    start: "03/2025",
    end: "06/2025",
    duration: "4 mos",
    bullets: [
      "Built the responsive web UI for a Web3 booking product that lets public figures monetize fan voice and video calls.",
      "Implemented fan access controls (who can book, at what price) and Solana-based monetization wiring.",
      "Integrated third-party APIs, auth, and database-backed frontend features with the backend team; stayed on for iterative maintenance.",
    ],
    skills: ["Solana", "Auth", "Web frontend"],
  },
  {
    title: "Data Analytics",
    company: "CryptoNow — Real-Time Crypto Tracker",
    location: "Benin City",
    start: "01/2025",
    end: "04/2025",
    duration: "4 mos",
    bullets: [
      "Built a live crypto dashboard aggregating CoinMarketCap and Finnhub so pricing stayed current without a refresh.",
      "Added Chart.js history/trend views plus cap, volume, and percent-change across timeframes.",
      "Shipped search, filtering, and watchlists, with Node.js orchestration and a dark/light interface.",
    ],
    skills: ["React", "Node.js", "Chart.js", "CoinMarketCap API", "Finnhub API"],
  },
];

export const otherExperience =
  "Graphics Designer, TJ Enterprise / Valor’s Exchange (05/2025) — brand identity (logo, color, typography) and marketing materials for a Port Harcourt client.";

export const education: Education[] = [
  {
    credential: "B.Sc. in Microbiology",
    org: "University of Benin",
    dates: "2020 – 2024",
    location: "Benin City, Nigeria",
    notes: [
      "Group research project completed with a high distinction.",
      "Member, Nigerian Society for Microbiology; 45th Scientific Conference and AGM (2023).",
    ],
  },
  {
    credential: "Industrial Training (SIWES)",
    org: "Centre for Forensic Programs and DNA Studies (CEFPADS)",
    dates: "During B.Sc.",
    location: "Nigeria",
    notes: [
      "Structured data collection, technical documentation, and analytical research in a professional lab.",
    ],
  },
];

export const certifications = [
  { name: "Sarutech Frontend Development Certificate", detail: "April 2023 – August 2023" },
  { name: "Canva Design School Certificate", detail: "April 2024" },
  { name: "Python Development Certificate — Udemy", detail: "2023" },
  { name: "Backend Development Complete Guide — Udemy", detail: "2024" },
  { name: "Data Analytics Essentials — Cisco NetAcademy", detail: "August 2025" },
];

export const award = {
  title: "1st Runner-Up, Edo Tech Stars Hackathon",
  year: "2024",
  detail:
    "Competed against teams across Edo State; recognized for an executed solution under competition constraints.",
};

export const toolkit = {
  languages: [
    "JavaScript",
    "TypeScript",
    "HTML5",
    "CSS3",
    "Python",
    "Solidity",
  ],
  frontend: [
    "React.js",
    "Next.js",
    "React Native",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js",
    "Chart.js",
    "Recharts",
    "Figma",
    "Adobe XD",
    "Canva",
    "CorelDraw",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "Supabase",
    "Appwrite",
    "Paystack",
    "OpenAI API",
    "CoinMarketCap API",
    "Finnhub API",
    "GitHub API",
    "GitLab API",
    "Solana",
    "Smart Contract Integration",
  ],
  tools: [
    "Git",
    "Docker",
    "Postman",
    "Vercel",
    "Hostinger",
    "Google Cloud Console",
    "XAMPP",
  ],
};

export const spokenLanguages = [
  { name: "English", level: "Fluent" },
  { name: "German", level: "Basic conversational" },
  { name: "Japanese", level: "Basic conversational" },
];

export const faq: FaqItem[] = [
  {
    q: "What’s your background?",
    a: "I trained in molecular diagnostics and clinical biotechnology (B.Sc. Microbiology, University of Benin, 2020–2024), then moved fully into product engineering. I’m from Edo State, based in Port Harcourt, founder of Ridely and Ownbase, and an EdoTechWave Ambassador.",
  },
  {
    q: "What do you actually build with?",
    a: "Day to day: JavaScript/TypeScript, React, Next.js, React Native, Node.js/Express, MySQL or MongoDB, and Supabase. I’ve also shipped with OpenAI, Solana, Chart.js, and the GitHub/GitLab APIs. Python is in the toolkit; I don’t pretend it’s my primary product language.",
  },
  {
    q: "How do you like to collaborate?",
    a: "Most of the client and platform work (Ownbase, Nexus Gadgets, Core Wealth Market, VeluxLink) was remote. Ridely is hybrid out of Benin City. I’ve also taught part-time — I write things down, I show work early, and I stay until the interface matches the requirement.",
  },
  {
    q: "Can I see a résumé?",
    a: "Yes. Use the Résumé link in the header or the contact column — it’s the same CV this site is built from. Public repos and live demos that exist on GitHub are linked on the work section.",
  },
  {
    q: "What’s the fastest way to reach you?",
    a: `Email ${site.email}. I also listed ${site.phone} on the CV. Code is at github.com/Astro-Truzzy. LinkedIn was not on the résumé — send the URL if you want it on this site.`,
  },
];

export const contactCopy = {
  headline: "Let’s Talk",
  ask: "If you’re hiring a full-stack engineer who can own a product — not just a ticket queue — write me.",
};

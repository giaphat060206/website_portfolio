export type NavItem = { id: string; label: string };

export type SkillGroup = { title: string; items: string[] };

export type Project = {
  slug: string;
  title: string;
  role: string;
  bullets: [string, string];
  tags: string[];
  source: string;
  live?: string;
};

export type EducationEntry = {
  school: string;
  degree: string;
  dates: string;
  detail: string;
  location: string;
};

export type Certification = { name: string; detail?: string; date: string };

export type Cv = {
  name: string;
  role: string;
  location: string;
  intro: string;
  award: string;
  summary: string;
  languages: string;
  links: { email: string; github: string; linkedin: string; resume: string };
  nav: NavItem[];
  skills: SkillGroup[];
  projects: Project[];
  education: EducationEntry[];
  certifications: Certification[];
};

export const cv: Cv = {
  name: "Nguyen Don Gia Phat",
  role: "Software Engineering Student · RMIT Vietnam",
  location: "Ho Chi Minh City, Vietnam",
  intro:
    "I'm a software engineering student building secure full-stack web and mobile applications. I care about parsers, backend infrastructure, and interfaces that stay out of the way.",
  award: "1st Place — RMIT Hack-A-Venture 2025",
  summary:
    "I'm in my third year of a Bachelor of Software Engineering (Honours) at RMIT, working across TypeScript, Rust, Python, and Java. Most of what I build starts with a question about how something works internally and ends as a working tool I can hand to someone else. I'm looking for an internship or junior role where I can ship production code and learn from people who have done it longer.",
  languages: "Vietnamese — native · English — fluent (IELTS 7.5)",
  links: {
    email: "giaphat060206@gmail.com",
    github: "https://github.com/giaphat060206",
    linkedin: "https://www.linkedin.com/in/ph%C3%A1t-gia-492b39294/",
    resume: "/CV_GiaPhat.pdf",
  },
  nav: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "contact", label: "Contact" },
  ],
  skills: [
    {
      title: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "HTML/CSS",
        "Tailwind",
        "Flutter",
        "JavaFX",
      ],
    },
    {
      title: "Backend",
      items: [
        "Node.js",
        "Express",
        "Python",
        "Java",
        "Rust",
        "C/C++",
        "REST APIs",
        "Socket.IO",
      ],
    },
    {
      title: "Data & Infrastructure",
      items: [
        "PostgreSQL",
        "MongoDB",
        "Oracle",
        "Supabase",
        "Neon",
        "Docker",
        "Vercel",
        "Git",
        "GitHub Actions",
      ],
    },
  ],
  projects: [
    {
      slug: "syntax-scalpel",
      title: "SyntaxScalpel",
      role: "Parser & AI Integration Engineer",
      bullets: [
        "Built a local-first Tauri v2 desktop app that dissects a source tree into interactive dependency graphs and function-level call graphs using tree-sitter parsers written in Rust.",
        "Implemented a React Flow canvas with Eclipse Layout Kernel placement.",
      ],
      tags: ["Rust", "TypeScript", "Tauri", "tree-sitter", "React Flow"],
      source: "https://github.com/giaphat060206/SyntaxScalpel",
    },
    {
      slug: "tictactoang",
      title: "TicTacToang",
      role: "Frontend Developer",
      bullets: [
        "Developed a Gomoku webpage with single-player, local multiplayer, and online multiplayer, plus game customization, profile, match history, and replay.",
        "Contributed to a 5-person Scrum team to ship the webpage for 50+ concurrent players, implementing dynamic mobile UI/UX for admin, guest, and player pages.",
      ],
      tags: ["React", "Socket.IO", "Express", "MongoDB", "Tailwind"],
      source: "https://github.com/RMIT-Full-Stack-Development-2026A/Group1",
      live: "https://tictactoang.vercel.app",
    },
    {
      slug: "event-manager",
      title: "Event Manager",
      role: "Team Lead, Frontend, Backend & DB",
      bullets: [
        "Developed a full-featured event management system with a graphical interface and a relational database backend using Java, JavaFX, and PostgreSQL.",
        "Designed the complete database schema, configured PostgreSQL/JDBC, managed Maven builds, and generated standalone executable JARs.",
      ],
      tags: ["Java", "JavaFX", "PostgreSQL", "Maven"],
      source:
        "https://github.com/RMIT-Vietnam-Teaching/assignment-2-build-a-backend-sgs-tut02-group1",
    },
    {
      slug: "smart-path-finder",
      title: "Smart Path Finder",
      role: "Leader, Graph Generation & Path Finding",
      bullets: [
        "Engineered a dual-optimization pathfinding system on a perfect square graph that computes both shortest-distance and fastest-time routes using Dijkstra's algorithm.",
        "Simulated real-world accumulated hourly traffic variations to model realistic navigation paths.",
      ],
      tags: ["Python", "Dijkstra"],
      source: "https://github.com/giaphat060206/Algorithms_and_Analysis_Group11",
    },
  ],
  education: [
    {
      school: "RMIT University",
      degree: "Bachelor of Software Engineering (Honours)",
      dates: "Oct 2024 – Sep 2028",
      detail: "GPA 3.3/4.0",
      location: "Ho Chi Minh City, Vietnam",
    },
  ],
  certifications: [
    {
      name: "IELTS Band 7.5",
      detail: "Reading 9 · Listening 8.5 · Writing 7 · Speaking 6",
      date: "Aug 2023",
    },
    {
      name: "Certified SOLIDWORKS Associate (CSWA)",
      date: "Jun 2025",
    },
    {
      name: "Big-O Coding Blue: Algorithms & Interview Patterns",
      date: "May 2026",
    },
  ],
};

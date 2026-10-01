export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  contribution: string;
  stack: string[];
  github: string;
  live: string | null;
  image: string | null;
  visual: "library" | "store" | "flowers" | "experiments";
  color: string;
  evidence: string;
};

// Public repositories were inspected on 2026-10-01. Ownership is verified;
// exact individual contributions and project dates are not published.
export const projects: Project[] = [
  {
    id: "01", name: "Library system", category: "BACKEND / WEB APPLICATION",
    description: "A PHP application for books, inventory, borrowing, returns, and overdue reporting. A practical look at the workflows behind a library.",
    contribution: "Public repository owner · individual contribution details to be confirmed",
    stack: ["PHP", "SQL", "CSS", "JavaScript"],
    github: "https://github.com/DalyTechie/php_system", live: null,
    image: null, visual: "library", color: "#bfcbfa",
    evidence: "Book CRUD files, borrowing and return handlers, dashboard components, and SQL table definitions in the public repository.",
  },
  {
    id: "02", name: "TechStore", category: "FRONTEND / STOREFRONT",
    description: "A phone and electronics storefront with product categories, featured devices, and a dedicated contact page.",
    contribution: "Public repository owner · HTML and CSS implementation present in source",
    stack: ["HTML", "CSS", "Responsive layout"],
    github: "https://github.com/DalyTechie/phoneshop_soc", live: "https://dalytechie.github.io/phoneshop_soc/",
    image: "/projects/techstore.webp", visual: "store", color: "#e1e2d9",
    evidence: "index.html, contact.html, style.css, and mystyle.css in the public repository.",
  },
  {
    id: "03", name: "Lyly's Flower", category: "FRONTEND / E-COMMERCE UI",
    description: "A flower-shop interface with bouquet collections, customer reviews, contact, and separate login and registration screens.",
    contribution: "Public repository owner · storefront and account-page source available",
    stack: ["HTML", "CSS", "Responsive layout"],
    github: "https://github.com/DalyTechie/lylyflowerstore.githup.io", live: "https://dalytechie.github.io/lylyflowerstore.githup.io/",
    image: "/projects/flowers.webp", visual: "flowers", color: "#e5dcd7",
    evidence: "Storefront, login, registration, CSS, and original product imagery in the public repository.",
  },
  {
    id: "04", name: "Frontend studies", category: "LEARNING / INTERFACE EXPERIMENTS",
    description: "A collection of frontend exercises: video backgrounds, loading animations, custom scrollbars, and creative image effects. Small studies in how interfaces move.",
    contribution: "Public repository owner · scope follows the published repository",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/DalyTechie/HTML-CSS-JAVASCRIPT-100-PROJECT", live: null,
    image: null, visual: "experiments", color: "#c7d4c7",
    evidence: "Repository name and public file tree. No claims of 100 completed projects.",
  },
];

// Preserved for editing, not presented as verified case studies: the previous
// portfolio listed these names but supplied only href="#" for code and demos.
export const legacyProjectListings = [
  { name: "E-Commerce Platform", stack: ["Laravel", "PHP", "MySQL", "Bootstrap"] },
  { name: "Task Management App", stack: ["React", "Node.js", "MongoDB", "Socket.io"] },
  { name: "Data Analytics Dashboard", stack: ["Python", "Django", "JavaScript", "Chart.js"] },
  { name: "Personal Blog Platform", stack: ["PHP", "MySQL", "JavaScript", "CSS"] },
  { name: "Restaurant Ordering App", stack: ["Vue", "Express", "PostgreSQL", "Tailwind"] },
  { name: "Learning Management System", stack: ["Laravel", "Vue", "MySQL", "Redis"] },
];

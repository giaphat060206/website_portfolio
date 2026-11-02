import {
  siCplusplus,
  siDocker,
  siExpress,
  siFlutter,
  siGit,
  siGithubactions,
  siHtml5,
  siMongodb,
  siNeon,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siRust,
  siSocketdotio,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

export type SkillIcon = { path: string; fillRule?: "evenodd" };

const generic = {
  /** Three stacked bars — no mark exists for "REST APIs". */
  api: { path: "M3 5h18v2H3zM3 11h11v2H3zM3 17h14v2H3z" },
  /** Window outline — JavaFX has no Simple Icons mark. */
  window: {
    path: "M4 4h16v16H4V4Zm2 2v12h12V6H6Z",
    fillRule: "evenodd",
  } as SkillIcon,
  /** Database cylinder — Oracle was removed from Simple Icons. */
  database: {
    path: "M12 3c-4.42 0-8 1.12-8 2.5v13C4 19.88 7.58 21 12 21s8-1.12 8-2.5v-13C20 4.12 16.42 3 12 3Zm0 2c3.31 0 6 .67 6 1.5S15.31 8 12 8 6 7.33 6 6.5 8.69 5 12 5Zm6 5.75V13c0 .83-2.69 1.5-6 1.5S6 13.83 6 13v-2.25c1.31.48 3.53.75 6 .75s4.69-.27 6-.75Zm0 5V18c0 .83-2.69 1.5-6 1.5S6 18.83 6 18v-2.25c1.31.48 3.53.75 6 .75s4.69-.27 6-.75Z",
    fillRule: "evenodd",
  } as SkillIcon,
} satisfies Record<string, SkillIcon>;

export const skillIcons: Record<string, SkillIcon> = {
  // Frontend
  React: { path: siReact.path },
  "Next.js": { path: siNextdotjs.path },
  TypeScript: { path: siTypescript.path },
  "HTML/CSS": { path: siHtml5.path },
  Tailwind: { path: siTailwindcss.path },
  Flutter: { path: siFlutter.path },
  JavaFX: generic.window,
  // Backend
  "Node.js": { path: siNodedotjs.path },
  Express: { path: siExpress.path },
  Python: { path: siPython.path },
  Java: { path: siOpenjdk.path },
  Rust: { path: siRust.path },
  "C/C++": { path: siCplusplus.path },
  "REST APIs": generic.api,
  "Socket.IO": { path: siSocketdotio.path },
  // Data & Infrastructure
  PostgreSQL: { path: siPostgresql.path },
  MongoDB: { path: siMongodb.path },
  Oracle: generic.database,
  Supabase: { path: siSupabase.path },
  Neon: { path: siNeon.path },
  Docker: { path: siDocker.path },
  Vercel: { path: siVercel.path },
  Git: { path: siGit.path },
  "GitHub Actions": { path: siGithubactions.path },
};

import type { StaticImageData } from "next/image";
import ssTitle from "@/app/assets/images/syntax-scalpel/title.webp";
import ssGraph from "@/app/assets/images/syntax-scalpel/graph.webp";
import neoWelcome from "@/app/assets/images/neo-messenger/welcome.webp";
import neoChat from "@/app/assets/images/neo-messenger/group-chat.webp";
import finDepartment from "@/app/assets/images/fin-recruit/department-head-dashboard.webp";
import finExecutive from "@/app/assets/images/fin-recruit/executive-board-dashboard.webp";
import emEvents from "@/app/assets/images/event-manager/event-management.webp";
import emTickets from "@/app/assets/images/event-manager/ticket-management.webp";
import pfMain from "@/app/assets/images/pathfinder/main.webp";
import pfInput from "@/app/assets/images/pathfinder/input.webp";
import tttWelcome from "@/app/assets/images/tictactoang/welcome.webp";
import tttBoard from "@/app/assets/images/tictactoang/board.webp";
import tttProfile from "@/app/assets/images/tictactoang/profile.webp";
import tttAdmin from "@/app/assets/images/tictactoang/admin.webp";

export type ProjectImage = { src: StaticImageData; alt: string; wide?: boolean };

export const projectImages: Record<string, ProjectImage[]> = {
  "syntax-scalpel": [
    {
      src: ssTitle,
      alt: "SyntaxScalpel welcome screen previewing a dependency graph of a mixed Rust and TypeScript project",
    },
    {
      src: ssGraph,
      alt: "SyntaxScalpel file and folder dependency graph of a Python codebase",
    },
  ],
  "neo-messenger": [
    {
      src: neoWelcome,
      alt: "NEO Messenger landing page with the headline “Communicate with Luminous Clarity” and a preview of a group chat",
      wide: true,
    },
    {
      src: neoChat,
      alt: "NEO Messenger group chat with the conversation list, an emoji reaction, and the message composer",
      wide: true,
    },
  ],
  "fin-recruit": [
    {
      src: finDepartment,
      alt: "Fin-Recruit department head dashboard with round 1 evaluation progress, applicant counters, and the candidate table",
      wide: true,
    },
    {
      src: finExecutive,
      alt: "Fin-Recruit executive board dashboard with the active cohort, pending approvals, and heads by department",
      wide: true,
    },
  ],
  tictactoang: [
    {
      src: tttWelcome,
      alt: "TicTacToang welcome screen with game mode selection",
    },
    {
      src: tttBoard,
      alt: "TicTacToang Gomoku board during a single-player match against the medium bot",
    },
    {
      src: tttProfile,
      alt: "TicTacToang player profile with match history and statistics",
      wide: true,
    },
    {
      src: tttAdmin,
      alt: "TicTacToang admin dashboard showing total and premium players, active rooms, total matches, and monthly revenue",
      wide: true,
    },
  ],
  "event-manager": [
    {
      src: emEvents,
      alt: "Event Manager desktop application listing events",
    },
    {
      src: emTickets,
      alt: "Event Manager ticket management screen",
    },
  ],
  "smart-path-finder": [
    {
      src: pfInput,
      alt: "Smart Path Finder input screen for the start and destination intersections",
    },
    {
      src: pfMain,
      alt: "Smart Path Finder simulation showing shortest-distance and fastest-time routes",
    },
  ],
};

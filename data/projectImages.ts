import type { StaticImageData } from "next/image";
import ssTitle from "@/app/assets/images/syntax-scalpel/title.webp";
import ssGraph from "@/app/assets/images/syntax-scalpel/graph.webp";
import emEvents from "@/app/assets/images/event-manager/event-management.webp";
import emTickets from "@/app/assets/images/event-manager/ticket-management.webp";
import pfMain from "@/app/assets/images/pathfinder/main.webp";
import tttWelcome from "@/app/assets/images/tictactoang/welcome.webp";
import tttBoard from "@/app/assets/images/tictactoang/board.webp";
import tttAdmin from "@/app/assets/images/tictactoang/admin.webp";

export type ProjectImage = { src: StaticImageData; alt: string };

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
      src: tttAdmin,
      alt: "TicTacToang admin dashboard showing total and premium players, active rooms, total matches, and monthly revenue",
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
      src: pfMain,
      alt: "Smart Path Finder simulation showing shortest-distance and fastest-time routes",
    },
  ],
};

import type { StaticImageData } from "next/image";
import ssTitle from "@/app/assets/images/syntax-scalpel/title.webp";
import ssGraph from "@/app/assets/images/syntax-scalpel/graph.webp";
import emEvents from "@/app/assets/images/event-manager/event-management.webp";
import emTickets from "@/app/assets/images/event-manager/ticket-management.webp";
import pfMain from "@/app/assets/images/pathfinder/main.webp";
import tttWelcome from "@/app/assets/images/tictactoang/welcome.webp";
import tttBoard from "@/app/assets/images/tictactoang/board.webp";

export type ProjectImage = { src: StaticImageData; alt: string };

export const projectImages: Record<string, ProjectImage[]> = {
  "syntax-scalpel": [
    {
      src: ssTitle,
      alt: "SyntaxScalpel showing a parsed TypeScript repository as an interactive dependency graph",
    },
    {
      src: ssGraph,
      alt: "SyntaxScalpel function-level call graph rendered on a React Flow canvas",
    },
  ],
  tictactoang: [
    {
      src: tttWelcome,
      alt: "TicTacToang welcome screen with game mode selection",
    },
    {
      src: tttBoard,
      alt: "TicTacToang Gomoku board during an online multiplayer match",
    },
  ],
  "event-manager": [
    {
      src: emEvents,
      alt: "Event Manager desktop application listing events",
    },
    {
      src: emTickets,
      alt: "Event Manager ticket management screen backed by PostgreSQL",
    },
  ],
  "smart-path-finder": [
    {
      src: pfMain,
      alt: "Smart Path Finder simulation showing shortest-distance and fastest-time routes",
    },
  ],
};

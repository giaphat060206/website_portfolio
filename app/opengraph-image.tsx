import { ImageResponse } from "next/og";
import { cv } from "@/data/cv";

export const dynamic = "force-static";
export const alt = "Nguyen Don Gia Phat — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#08080A",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 2,
            width: 120,
            background: "#7C93A8",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 84,
            color: "#F5F5F4",
            fontFamily: "serif",
            lineHeight: 1.1,
          }}
        >
          {cv.name}
        </div>
        <div style={{ fontSize: 30, color: "#A1A1AA", marginTop: 24 }}>
          {cv.role}
        </div>
      </div>
    ),
    { ...size },
  );
}

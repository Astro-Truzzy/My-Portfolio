import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.name} — ${site.shortRole}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080a",
          color: "#f3efe6",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#2ee6c5" }}>
          {site.shortRole.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, letterSpacing: -4, lineHeight: 0.9 }}>
            {site.firstName}
          </div>
          <div style={{ fontSize: 96, letterSpacing: -4, lineHeight: 0.9, color: "#a39e94" }}>
            {site.lastName}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a39e94" }}>
          Ridely · Ownbase · Port Harcourt
        </div>
      </div>
    ),
    { ...size },
  );
}

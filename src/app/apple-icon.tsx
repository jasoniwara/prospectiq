import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#2a2622",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#e8503a" }} />
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f4b740" }} />
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3f9e6d" }} />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#faf3e9",
            letterSpacing: -2,
          }}
        >
          2P
        </div>
      </div>
    ),
    { ...size }
  );
}

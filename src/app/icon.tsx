import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          gap: 4,
          background: "#2a2622",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#e8503a" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f4b740" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#3f9e6d" }} />
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#faf3e9",
            letterSpacing: -1,
          }}
        >
          2P
        </div>
      </div>
    ),
    { ...size }
  );
}

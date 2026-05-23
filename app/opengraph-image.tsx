import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "Turanix — IT-продукты для бизнеса";

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
          background: "#0d0f12",
          color: "#f7f8f3",
          padding: "70px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 0,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "#e2ff67",
                color: "#0d0f12",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              T
            </div>
            <span>Turanix</span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(247,248,243,0.58)" }}>
            KZ · 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 82,
              lineHeight: 1,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            <span>Сайты, приложения</span>
            <span>и автоматизация</span>
            <span style={{ color: "#e2ff67" }}>для бизнеса.</span>
          </div>
          <div
            style={{
              marginTop: 34,
              maxWidth: 850,
              fontSize: 28,
              lineHeight: 1.34,
              color: "rgba(247,248,243,0.64)",
            }}
          >
            Сайты · Мобайл · CRM · Telegram · AI-консультанты
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 18,
            color: "rgba(247,248,243,0.56)",
          }}
        >
          <span>turanix.kz</span>
          <span>·</span>
          <span>hello@turanix.kz</span>
          <span>·</span>
          <span>БИН 260540022744</span>
        </div>
      </div>
    ),
    size,
  );
}

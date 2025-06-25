"use client";

interface PanelHeaderProps {
  title: string;
  line: boolean;
}

export function PanelHeader({ title, line }: PanelHeaderProps) {
  return (
    <>
      <div style={{ padding: "15px" }}>
        <h3
          style={{
            color: "var(--Primary-White, #FFF)",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "120%",
          }}
        >
          {title}
        </h3>
      </div>
      {line && (
        <div
          style={{
            width: "100%",
            height: 1,
            background: "#353945",
            marginBottom: "16px",
          }}
        />
      )}
    </>
  );
}

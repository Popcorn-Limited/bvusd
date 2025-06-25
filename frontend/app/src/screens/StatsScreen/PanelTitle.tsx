"use client";

interface PanelHeaderProps {
  title: string;
  line: boolean;
}

export function PanelHeader({ title, line }: PanelHeaderProps) {
  return (
    <>
      <div style={{ paddingTop: "15px", paddingBottom: "15px", paddingLeft: "25px" }}>
        <h3
          style={{
            color: "var(--Primary-White, #FFF)",
            fontFamily: "KHTeka",
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

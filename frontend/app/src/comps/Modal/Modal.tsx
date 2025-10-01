export function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#111315",
          borderRadius: "18px",
          padding: "40px",
          width: "600px",
          maxWidth: "90%",
          color: "#fff",
          position: "relative",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            color: "#aaa",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
export default function Highlight({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: bg, color: fg, padding: "0.5em" }}>
      {children}
    </div>
  );
}
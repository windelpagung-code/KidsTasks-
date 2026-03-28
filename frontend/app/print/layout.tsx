export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "white", margin: 0, padding: 0 }}>
      {children}
    </div>
  );
}

export const metadata = {
  title: "Alarmfase Rood",
  description: "Podcast over hulpverlening en echte verhalen."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0f0f0f", color: "white" }}>
        {children}
      </body>
    </html>
  );
}

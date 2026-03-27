import "./globals.css";

export const metadata = {
  title: "Mercedes Xiong Portfolio",
  description: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

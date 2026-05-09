import { ThemeProvider } from "@/components/theam-provider"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"
import Header from "@/components/header";
import "./globals.css";

export const metadata = {
  title: "EventFluxAI",
  description: "Discover and manage events with AI-powered insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-950 via-zinc-900 to-stone-900 text-white">
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

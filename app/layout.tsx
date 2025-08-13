import type { Metadata } from "next";
import Providers from "./providers";
import DataSourceBadge from "@/components/DataSourceBadge";

export const metadata: Metadata = {
  title: "Front-dduksangLAB",
};

// Force dynamic rendering to avoid SSR issues with context
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
        <DataSourceBadge />
      </body>
    </html>
  );
}
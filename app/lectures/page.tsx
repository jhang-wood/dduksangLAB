import LecturesClient from "./LecturesClient";

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default function LecturesPage() {
  // (Optionally do server-side data fetch here without hooks)
  return <LecturesClient />;
}
"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ padding: 24 }}>
        <h1>전역 오류</h1>
        <p>{error?.message}</p>
      </body>
    </html>
  );
}
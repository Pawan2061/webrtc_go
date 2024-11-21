"use client";

import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  async () => (await import("./wrapper")).default,
  {
    ssr: false,
  }
);

export default function Page() {
  return <ExcalidrawWrapper />;
}

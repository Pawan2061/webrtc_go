// "use client";

// import dynamic from "next/dynamic";
// const ExcalidrawWrapper = dynamic(
//   async () => (await import("./wrapper")).default,
//   {
//     ssr: false,
//   }
// );

// export default function Page() {
//   return <ExcalidrawWrapper />;
// }
"use client";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

export default function App() {
  const store = useSyncDemo({ roomId: "myapp-abc123" });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} />
    </div>
  );
}

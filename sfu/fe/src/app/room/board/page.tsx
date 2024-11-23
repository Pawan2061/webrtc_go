"use client";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";

export default function Board() {
  const store = useSyncDemo({ roomId: "myapp-abc123" });

  return (
    <div className="w-full h-full">
      <Tldraw store={store} />
    </div>
  );
}

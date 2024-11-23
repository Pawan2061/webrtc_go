"use client";
import { useState } from "react";
import Board from "@/app/board/page";
export default function ShowBoard() {
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
  };

  return (
    <div className="flex-1 relative  ">
      {showWhiteboard && <Board key="ejnejfdneje" />}
      <div className="absolute bottom-4 left-44 z-10 flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
          onClick={toggleWhiteboard}
        >
          Stop board
        </button>
      </div>
    </div>
  );
}

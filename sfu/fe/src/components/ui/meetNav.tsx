"use client";
import { useRouter } from "next/navigation";

export default function MeetNav() {
  const router = useRouter();
  return (
    <main className="w-full mx-auto w-screen-lg h-20 relative border-b border-gray-100 flex justify-center items-center space-x-6">
      <button
        className="bg-transparent  hover:text-white py-2 px-4 border bg-[#3C4852] border-slate-300  hover:bg-[#546470]    rounded"
        onClick={() => {
          router.push("/room/board");
        }}
      >
        Slides
      </button>
      <button className="bg-transparent  hover:text-white py-2 px-4 border bg-[#3C4852] border-slate-300  hover:bg-[#546470]    rounded">
        Room
      </button>
      <button className="bg-transparent  hover:text-white py-2 px-4 border bg-[#3C4852] border-slate-300  hover:bg-[#546470]    rounded">
        Board
      </button>
    </main>
  );
}

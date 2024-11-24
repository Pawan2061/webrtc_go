"use client";
import React, { useState } from "react";
import AuthModal from "./Auth";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <main className="w-full m-auto w-screen-lg h-20 relative border-b border-gray-100 flex items-center">
        <div className="flex justify-around w-full">
          <img
            src="https://static.uacdn.net/production/_next/static/images/logo.svg?q=75&auto=format%2Ccompress&w=384"
            alt="Logo"
          />
          <div className="flex gap-6">
            <a href="/" className="rounded-full p-2 border">
              <img
                src="https://static.uacdn.net/production/_next/static/images/giftHomePage.svg?q=75&auto=format%2Ccompress&w=48"
                alt="Gift"
              />
            </a>
            <button
              className="bg-transparent hover:text-black py-2 px-6 border border-black bg-[#FFFFFF] hover:bg-slate-50 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Login
            </button>
            <button
              className="bg-transparent hover:text-white py-2 px-4 border bg-[#3C4852] border-slate-300 hover:bg-[#546470] rounded text-black"
              onClick={() => setIsModalOpen(true)}
            >
              Join for free
            </button>
          </div>
        </div>
      </main>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  Chat,
  LayoutContextProvider,
  VideoConference,
  useRoomInfo,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";
import { livekitShare, value } from "@/store/store";
import { useRecoilState } from "recoil";
import Board from "../board/page";

import PDFSlideshare from "@/components/ui/Slideshare";

const serverUrl = "wss://unacademy-ijd7o0e5.livekit.cloud";

export default function Room() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showSlides, setShowSlides] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      console.error("No token found. Redirecting to signup...");
      router.push("/signup");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
    if (showSlides) setShowSlides(false);
  };

  const toggleSlides = () => {
    setShowSlides(!showSlides);
    if (showWhiteboard) setShowWhiteboard(false);
  };

  if (!token) {
    return <p>Loading...</p>;
  }
  const handleRecording = async () => {
    try {
      const response = await fetch("http://localhost:8080/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_name: "pawanroom",
          file_path: "/tmp/test.mp4",
          layout: "speaker",
        }),
      });

      console.log(response);

      if (!response.ok) {
        console.log(response);

        throw new Error("Failed to start recording");
      }

      const data = await response.json();
      console.log("Recording started:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <LayoutContextProvider>
      <div className="flex flex-col h-screen w-screen">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL || serverUrl}
          data-lk-theme="default"
          className="flex flex-col flex-1"
        >
          <div className="flex flex-1 overflow-hidden w-full">
            <div
              className={`flex-1 flex flex-col ${
                isMobile && isChatOpen ? "hidden" : "block"
              }`}
            >
              <div className="flex flex-1 h-[75vh]">
                <div className="flex-1 relative border-r border-gray-200">
                  {showWhiteboard ? (
                    <Board />
                  ) : showSlides ? (
                    <PDFSlideshare />
                  ) : (
                    <VideoConference />
                  )}
                </div>
              </div>

              <RoomAudioRenderer />
            </div>

            {isChatOpen && (
              <div
                className={`relative h-full border-l border-gray-200 transition-all duration-300 ${
                  isMobile ? "fixed top-0 right-0 w-full bg-white z-50" : "w-80"
                }`}
              >
                {isMobile && (
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-center mx-auto">
                      Messages
                    </h2>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="p-2 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <Chat className="h-full p-4" />
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-10 flex gap-2">
              <button
                onClick={toggleWhiteboard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                {showWhiteboard ? "Show Video" : "Show Whiteboard"}
              </button>
              <button
                onClick={toggleSlides}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                {showSlides ? "Show Video" : "Show Slides"}
              </button>
              <button
                onClick={handleRecording}
                className={`${
                  isRecording ? "bg-red-500" : "bg-green-500"
                } hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors`}
              >
                {isRecording ? "Recording..." : "Start recording"}
              </button>
            </div>
          </div>
        </LiveKitRoom>
      </div>
    </LayoutContextProvider>
  );
}

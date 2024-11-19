"use client";
import React, { useEffect, useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  Chat,
  LayoutContextProvider,
  ChatToggle,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useRouter } from "next/navigation";
import { LocalVideoStreamer } from "@/components/Canvas";
const serverUrl = "wss://unacademy-ijd7o0e5.livekit.cloud";

export default function Room() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const savedToken: any = localStorage.getItem("authToken");
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

  if (!token) {
    return <p>Loading...</p>;
  }

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
              <div className="flex-1 relative h-[75%]">
                <VideoConference />
              </div>
              <RoomAudioRenderer />

              {/* {videoFile && <LocalVideoStreamer videoFile={videoFile} />}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              /> */}
            </div>

            {(!isMobile || isChatOpen) && (
              <div
                className={`relative h-full border-l border-gray-200 transition-all duration-300 ${
                  isMobile ? "absolute top-0 left-0 w-full bg-white" : "w-0"
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
          </div>
        </LiveKitRoom>
      </div>
    </LayoutContextProvider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  return (
    <GridLayout
      tracks={tracks}
      className="h-[calc(75vh-var(--lk-control-bar-height))] w-full"
    >
      <ParticipantTile />
    </GridLayout>
  );
}

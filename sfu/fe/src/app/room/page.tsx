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
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track } from "livekit-client";

const serverUrl = "wss://unacademy-ijd7o0e5.livekit.cloud";

export default function Room() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      console.error("No token found. Redirecting to signup...");
      window.location.href = "/signup";
    }
  }, []);

  if (!token) {
    return <p>Loading...</p>;
  }

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL || serverUrl}
        data-lk-theme="default"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div className="flex-1 flex flex-col ">
          <div className="flex-1 relative">
            <MyVideoConference />
          </div>
          <RoomAudioRenderer />
          <ControlBar className="w-full" />
        </div>

        <div className="w-96 border-l border-gray-200 flex   flex-col">
          <Chat style={{ flex: 1 }} />{" "}
        </div>
      </LiveKitRoom>
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
  console.log(tracks);

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { Track } from "livekit-client";

const serverUrl = "wss://unacademy-ijd7o0e5.livekit.cloud";

export default function Room() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the token from localStorage
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      console.error("No token found. Redirecting to signup...");
      // Redirect to the signup page if no token exists
      window.location.href = "/signup";
    }
  }, []);

  // Render nothing until the token is available
  if (!token) {
    return <p>Loading...</p>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL || serverUrl}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
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

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";
import axios from "axios";

import { Track } from "livekit-client";
import { useEffect, useState } from "react";
const serverUrl = "wss://unacademy-ijd7o0e5.livekit.cloud";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzE4NTcxMDEsImlzcyI6IkFQSXd5TVk0dnloVmJ4NCIsIm5iZiI6MTczMTg0OTkwMSwic3ViIjoicXVpY2tzdGFydCB1c2VyIGkwczl0MCIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.j2NHhjAGDDGWGg5W5MUrhj-KqefN8sjsproYZApDrC4";

export default function App() {
  const [token, setToken] = useState("");
  useEffect(() => {
    const getToken = async () => {
      try {
        console.log("trying for token");

        const token = await axios.get("http://localhost:8080/getToken");
        setToken(token.data);
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    getToken();
  }, []);
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
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
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

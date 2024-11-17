import { useEffect, useRef } from "react";

export default function Receiver() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.ontrack = (event) => {
      console.log("this is receiver media", event);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
      }
    };

    pc.onicecandidate = (e) => {
      socket.send(
        JSON.stringify({ type: "iceCandidate", candidate: e.candidate })
      );
    };

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
      console.log("socket connected on receiver");
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        console.log("receiver recived offer", message.sdp);

        pc.setRemoteDescription(message.sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(JSON.stringify({ type: "createAnswer", sdp: answer }));
      } else if (message.type === "iceCandidate") {
        //@ts-ignore
        pc.addIceCandidate(message.candidate);
      }
    };
  }, []);

  return (
    <>
      <video autoPlay muted ref={videoRef}></video>
      Receiver
    </>
  );
}

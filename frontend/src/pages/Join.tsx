import { useEffect, useRef, useState } from "react";
import { useFetcher, useLocation } from "react-router-dom";
export const Join = () => {
  const location = useLocation();
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const userStream = useRef<MediaStream | null>(null);
  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const openCamera = async () => {
    const constants = {
      video: true,
      audio: true,
    };
    navigator.mediaDevices.getUserMedia(constants).then((stream) => {
      userVideo.current!.srcObject = stream;
      userStream.current = stream;
    });
  };
  useEffect(() => {
    openCamera().then(async () => {
      const roomId = location.pathname.split("/");
      console.log(
        `Connecting to WebSocket with URL: ws://localhost:8000/join?roomId=${roomId[2]}`
      );

      webSocketRef.current = new WebSocket(
        `ws://localhost:8000/join?roomId=${roomId[2]}`
      );
      await webSocketRef.current.addEventListener("open", () => {
        webSocketRef.current?.send(JSON.stringify({ join: true }));
      });
      await webSocketRef.current.addEventListener("message", async (e) => {
        const message = JSON.parse(e.data);
        if (message.join) {
          callUser();
        }
        if (message.offer) {
          handleOffer(message.offer);
        }
        if (message.answer) {
          console.log("receiving message");
          peerRef.current?.setRemoteDescription(
            new RTCSessionDescription(message.answer)
          );
        }
        if (message.iceCandidate) {
          console.log("receiving and adding ice candidate");
          try {
            await peerRef.current?.addIceCandidate(message.iceCandidate);
          } catch (error) {
            console.log("error in ice candidate");
          }
        }
      });
    });
  });
  const handleNegotiationNeeded = async () => {
    console.log("Creating Offer");

    try {
      const myOffer = await peerRef.current?.createOffer();
      await peerRef.current?.setLocalDescription(myOffer);

      await webSocketRef.current!.send(
        JSON.stringify({ offer: peerRef.current!.localDescription })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleIceCandidateEvent = async (e: any) => {
    console.log("Found Ice Candidate");
    if (e.candidate) {
      console.log(e.candidate);
      await webSocketRef.current!.send(
        JSON.stringify({ iceCandidate: e.candidate })
      );
    }
  };
  const handleTrackEvent = (e: any) => {
    console.log("receiving tracks");
    partnerVideo.current!.srcObject = e.streams[0];
  };
  const createPeer = () => {
    console.log("Creating Peer Connection");
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onnegotiationneeded = handleNegotiationNeeded;
    peer.onicecandidate = handleIceCandidateEvent;
    peer.ontrack = handleTrackEvent;

    return peer;
  };
  const handleOffer = async (offer: any) => {
    console.log("received offer,creating candidate");
    peerRef.current = createPeer();
    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    await userStream.current?.getTracks().forEach((track) => {
      peerRef.current?.addTrack(track, userStream.current!);
    });
    await webSocketRef.current?.send(
      JSON.stringify({ answer: peerRef.current.localDescription })
    );
  };

  const callUser = () => {};

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "whitesmoke",
          height: "200px",
          width: "100%",
        }}
      >
        <h1>Golang {"&"} React</h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          top: "100px",
          right: "100px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <video playsInline autoPlay muted controls={true} ref={userVideo} />
        <video playsInline autoPlay controls={true} ref={partnerVideo} />
      </div>
    </div>
  );
};

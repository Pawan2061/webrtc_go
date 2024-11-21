import React, { useEffect, useRef, useState } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";

export const LocalVideoStreamer = ({ videoFile }: { videoFile: File }) => {
  const { localParticipant }: any = useLocalParticipant();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const previousVideoFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (!localParticipant || !videoFile) return;

    if (previousVideoFileRef.current === videoFile) return;

    const videoElement: any = videoRef.current;
    if (!videoElement) return;

    const fileURL = URL.createObjectURL(videoFile);
    videoElement.src = fileURL;

    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err: any) => {
        console.error("Error playing the video:", err);
      });

    let videoTrackPublication: any = null;
    const handleVideoReady = () => {
      const stream = videoElement.captureStream();
      const videoTrack = stream.getVideoTracks()[0];

      videoTrackPublication = localParticipant.publishTrack(videoTrack, {
        name: "local_video_stream",
        source: Track.Source.Camera,
      });
    };

    videoElement.onloadedmetadata = handleVideoReady;

    return () => {
      if (videoTrackPublication) {
        localParticipant.unpublishTrack(videoTrackPublication);
      }
      URL.revokeObjectURL(fileURL);
      videoElement.src = "";
      setIsPlaying(false);
      previousVideoFileRef.current = videoFile;
    };
  }, [localParticipant, videoFile]);

  return (
    <div>
      <video ref={videoRef} controls style={{ display: "block" }} />
      {!isPlaying && <p>Video is not playing</p>}
    </div>
  );
};

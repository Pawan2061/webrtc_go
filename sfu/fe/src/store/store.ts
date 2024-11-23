"use client";
import { atom } from "recoil";

export const value = atom({
  key: "atom",
  default: 0,
});
export const livekitShare = atom({
  key: "livekitshare",
  default: {
    token: null as string | null,
    serverUrl: "wss://unacademy-ijd7o0e5.livekit.cloud",
    isConnected: false,
  },
});

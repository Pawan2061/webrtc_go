"use client";
import { atom, selector } from "recoil";

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

export const currentPageState = atom<number>({
  key: "currentPageState",
  default: 1,
});

export const totalPagesState = atom<number>({
  key: "totalPagesState",
  default: 0,
});

export const currentViewState = atom<string>({
  key: "currentViewState",
  default: "video",
});

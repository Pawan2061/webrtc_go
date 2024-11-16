import React from "react";
import { useNavigate } from "react-router-dom";
export const CreateRoom = () => {
  const navigate = useNavigate();
  const create = async (e: any) => {
    e.preventDefault();
    const resp: any = await fetch("http://localhost:8000/create");
    console.log(resp, "anuedbn");

    const { roomId } = await resp.json();
    console.log(roomId, "no id");

    navigate(`/room/${roomId}`, {
      state: {
        id: roomId,
      },
    });
  };
  return (
    <div>
      <button onClick={create}>Create room</button>
    </div>
  );
};

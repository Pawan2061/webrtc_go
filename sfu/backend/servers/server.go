package servers

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/livekit/protocol/auth"
	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

func GetJoinToken(room, identity string) string {
	at := auth.NewAccessToken(os.Getenv("LIVEKIT_API_KEY"), os.Getenv("LIVEKIT_API_SECRET"))
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(time.Hour)

	token, _ := at.ToJWT()
	return token
}

func CreateRoom() *livekit.Room {
	host := "https://unacademy-ijd7o0e5.livekit.cloud"
	apiKey := os.Getenv("LIVEKIT_API_KEY")
	apiSecret := os.Getenv("LIVEKIT_API_SECRET")

	if host == "" || apiKey == "" || apiSecret == "" {
		log.Fatal("LIVEKIT_HOST, LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set")
	}

	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)

	room, err := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
		Name:            "my-room",
		EmptyTimeout:    10 * 60,
		MaxParticipants: 20,
	})
	if err != nil {
		log.Printf("Failed to create room: %v", err)
		return nil
	}

	log.Printf("Room created: %s", room.Name)
	return room
}

package servers

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/livekit/protocol/auth"
	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

func GetJoinToken(room, identity string) string {
	apikey := os.Getenv("LIVEKIT_API_KEY")
	fmt.Println(apikey, "its here")

	at := auth.NewAccessToken("APIwyMY4vyhVbx4", "Q3MOMf7cwua3zag5sZIHrfKgnwcc6aGKmeGNWXhD8JuA")
	grant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
	fmt.Println("inside the grant")
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(time.Hour)

	fmt.Println("working for the grant")

	token, err := at.ToJWT()
	if err != nil {
		fmt.Println("Failed to generate the error", err)
	}

	fmt.Println(token, "token is here")
	fmt.Println("working for the grant", token)

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

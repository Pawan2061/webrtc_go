// servers/room.go
package servers

import (
	"backend/structs"
	"context"
	"fmt"
	"log"
	"os"
	"sync"

	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

var rooms = make(map[string]*structs.Room)
var mu sync.Mutex

func CreateWsroom() structs.Room {
	fmt.Println("creating ws")
	mu.Lock()
	defer mu.Unlock()
	roomId := "my-room"
	room := &structs.Room{
		ID: roomId,
	}
	rooms[roomId] = room
	fmt.Println(rooms[roomId])
	return *room

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

// servers/room.go
package servers

import (
	"backend/structs"
	"context"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/gorilla/websocket"
	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

var rooms = make(map[string]*structs.Room)
var participants = make(map[string]*structs.Participant)
var mu sync.Mutex

func AddParticipant(name string, conn *websocket.Conn) *structs.Participant {
	fmt.Println("inside bro")
	// mu.Lock()
	// defer mu.Unlock()
	fmt.Println("1dnbdejdneidw")

	participant := &structs.Participant{

		Name:       name,
		Connection: conn,
	}
	fmt.Println("1")

	participants[name] = participant
	fmt.Println(participant, "hjere")
	return participant
}
func CreateWsroom(roomId string, userId string, conn *websocket.Conn) structs.Room {
	mu.Lock()
	defer mu.Unlock()

	room := &structs.Room{
		ID: roomId,
	}
	fmt.Println("creating message")

	rooms[roomId] = room

	fmt.Println("before creating")
	participant := AddParticipant(userId, conn)
	fmt.Println("after creating")

	room.Participants = append(room.Participants, participant)
	fmt.Println("why inside")

	conn.WriteMessage(websocket.TextMessage, []byte("You have joined the room as the creator."))
	fmt.Println("almost inside")
	return *room
}

func JoinRoomws(roomId string, userId string, conn *websocket.Conn) string {
	mu.Lock()
	defer mu.Unlock()

	room, exists := rooms[roomId]
	if !exists {
		fmt.Println("why inside")
		return "Room does not exist"
	}

	participant, exists := participants[userId]
	fmt.Println("creating message")
	if !exists {
		participant = AddParticipant(userId, conn)
	}

	room.Participants = append(room.Participants, participant)

	for _, p := range room.Participants {
		if p.Name != participant.Name {
			if err := p.Connection.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("%s has joined the room.", participant.Name))); err != nil {
				log.Printf("Error broadcasting to participant %s: %v", p.Name, err)
			}
		}
	}

	fmt.Println("done bro")
	return "User joined"
}

func HandleMessage(roomId string, userId string) string {
	return "working"
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

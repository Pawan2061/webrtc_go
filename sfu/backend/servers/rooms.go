// servers/room.go
package servers

import (
	"backend/structs"
	"fmt"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

var rooms = make(map[string]*structs.Room)
var participants = make(map[string]*structs.Participant)
var mu sync.Mutex

func AddParticipant(name string, conn *websocket.Conn) *structs.Participant {
	fmt.Println("inside bro")

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

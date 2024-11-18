package structs

import (
	"time"

	"github.com/gorilla/websocket"
)

type Participant struct {
	Name       string
	Connection *websocket.Conn
	JoinedAt   time.Time
}

// Room represents a chat room
type Room struct {
	ID           string
	Participants []*Participant
	CreatedAt    time.Time
}

type Message struct {
	MessageType string `json:"messageType"`
	Msg         any    `json:"msg"`
	Err         error  `json:"error"`
}

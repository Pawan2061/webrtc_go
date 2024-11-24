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

type Room struct {
	ID           string
	Participants []*Participant
	CreatedAt    time.Time
}

type Message struct {
	MessageType string `json:"messageType"`
	Msg         Msg    `json:"msg"`
}

type Msg struct {
	RoomID string `json:"roomID"`
	UserID string `json:"userID"`
}

type User struct {
	Id uint `json:"Id" gorm:"primaryKey"`

	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

type SigninRequest struct {
	username string
	password string
}

package servers

import (
	"backend/structs"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to websocket", err)
		return
	}
	fmt.Println("handling the sockjet")
	defer conn.Close()

	for {
		messageType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading the message:", err)
			return
		}
		fmt.Println("received mssg", string(msg))
		var message structs.Message

		if err := json.Unmarshal(msg, &message); err != nil {
			log.Println("Error unmarshalling message:", err)
			return
		}

		fmt.Println("Message Type:", messageType)
		response := handleMessage(message, conn)

		conn.WriteJSON(response)
		fmt.Println(response)

	}

}

func handleMessage(msg structs.Message, conn *websocket.Conn) any {
	var response any
	switch msg.MessageType {
	case "createRoom":
		room := CreateWsroom(msg.Msg.RoomID, msg.Msg.UserID, conn)
		fmt.Println("response is there")

		response = room

	case "joinRoom":

		info := JoinRoomws(msg.Msg.RoomID, msg.Msg.UserID, conn)
		fmt.Println("response is there")

		response = info
	case "sendMessage":

		info := HandleMessage(msg.Msg.RoomID, msg.Msg.UserID)
		response = info

	}

	fmt.Println(response)
	return response

}

package services

import (
	"backend/structs"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var Allrooms structs.RoomMap

func CreateRoomRequest(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	roomId := Allrooms.CreateRoom()
	fmt.Println("it is here again", roomId)
	type resp struct {
		Roomid string `json:"room id"`
	}
	log.Println(Allrooms.Map)
	json.NewEncoder(w).Encode(resp{Roomid: roomId})

}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type broadCastMessage struct {
	Message map[string]interface{}
	RoomId  string
	Client  *websocket.Conn
}

var broadCast = make(chan broadCastMessage)

func broadCaster() {
	for {
		msg := <-broadCast

		for _, client := range Allrooms.Map[msg.RoomId] {
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)
				if err != nil {
					log.Fatal(err)
					client.Conn.Close()
				}
			}
		}
	}

}

func JoinRoomRequestHandler(w http.ResponseWriter, r *http.Request) {
	roomId, ok := r.URL.Query()["roomId"]
	if !ok {
		log.Println("RoomId missing in url paramenter")

	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("error here")
		log.Fatal("wWebsocket  updrade error", err)

	}
	Allrooms.InsertIntoRoom(roomId[0], false, ws)
	go broadCaster()

	for {
		var msg broadCastMessage
		err := ws.ReadJSON(&msg.Message)
		if err != nil {

			log.Fatal("Read error", err)
		}

		msg.Client = ws
		msg.RoomId = roomId[0]

		broadCast <- msg

	}

}

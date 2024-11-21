package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Session struct {
	sender   *websocket.Conn
	receiver *websocket.Conn
}

func (s *Session) handleConn(w http.ResponseWriter, r *http.Request) {

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer ws.Close()

	for {
		var msg map[string]interface{}

		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			return
		}

		fmt.Printf("Msg Received in backend: %v\n", msg)

		msgType, ok := msg["type"].(string)
		if !ok {
			fmt.Println("Error: Missing or invalid 'type' in message.")
			continue
		}

		switch msgType {
		case "sender":
			s.sender = ws
			fmt.Println("Sender socket connected.")

		case "receiver":
			s.receiver = ws
			fmt.Println("Receiver socket connected.")

		case "createOffer":
			fmt.Printf("Offer Received in backend: %v\n", msg)
			if ws != s.sender || s.sender == nil {
				fmt.Println("Not the sender or sender is nil, ignoring.")
				return
			}
			fmt.Print(s.receiver != nil)

			if s.receiver != nil {

				if err := s.receiver.WriteJSON(map[string]interface{}{"type": "createOffer", "sdp": msg["sdp"]}); err != nil {
					fmt.Println("Error sending createOffer to receiver:", err)
				} else {
					fmt.Println("Sent createOffer to receiver.")
				}
			} else {
				fmt.Println("Receiver not connected yet.")
			}

		case "createAnswer":
			fmt.Printf("Create Answer Received in backend: %v\n", msg)
			if ws != s.receiver || s.receiver == nil {
				fmt.Println("Not the receiver or receiver is nil, ignoring.")
				continue
			}
			if s.sender != nil {
				if err := s.sender.WriteJSON(msg); err != nil {
					fmt.Println("Error forwarding createAnswer to sender:", err)
				} else {
					fmt.Println("Sent createAnswer to sender.")
				}
			} else {
				fmt.Println("Sender not connected yet.")
			}

		case "iceCandidate":
			fmt.Printf("ICE Candidate Received in backend: %v\n", msg)

			candidate, ok := msg["candidate"]
			if !ok {
				fmt.Println("Error: Missing or invalid 'candidate' in message.")
				continue
			}

			if s.sender != nil && s.receiver != nil {
				if ws == s.sender {
					if err := s.receiver.WriteJSON(map[string]interface{}{"type": "iceCandidate", "candidate": candidate}); err != nil {
						fmt.Println("Error forwarding ICE candidate to receiver:", err)
					} else {
						fmt.Println("Sent ICE candidate to receiver.")
					}
				} else if ws == s.receiver {
					if err := s.sender.WriteJSON(map[string]interface{}{"type": "iceCandidate", "candidate": candidate}); err != nil {
						fmt.Println("Error forwarding ICE candidate to sender:", err)
					} else {
						fmt.Println("Sent ICE candidate to sender.")
					}
				}
			} else {
				fmt.Println("Either sender or receiver is not connected yet.")
			}
		}
	}
}

func main() {
	s := &Session{
		sender:   nil,
		receiver: nil,
	}
	http.HandleFunc("/ws", s.handleConn)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}

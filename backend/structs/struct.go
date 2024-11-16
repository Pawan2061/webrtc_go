package structs

import (
	"fmt"
	"sync"

	"github.com/gorilla/websocket"
	"golang.org/x/exp/rand"
)

type Participant struct {
	Host bool
	Conn *websocket.Conn
}
type RoomMap struct {
	Mutex sync.RWMutex
	Map   map[string][]Participant
}

func (r *RoomMap) Init() {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	if r.Map == nil {
		r.Map = make(map[string][]Participant)
	}
}

func (r *RoomMap) Get(roomId string) []Participant {
	r.Mutex.RLock()
	defer r.Mutex.RUnlock()
	return r.Map[roomId]
}

func (r *RoomMap) CreateRoom() string {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	rand.Seed(rand.Uint64())
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")
	b := make([]rune, 8)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]

	}
	roomId := string(b)
	r.Map[roomId] = []Participant{}
	fmt.Println(roomId, "roomidis here pawan")

	return roomId

}

func (r *RoomMap) InsertIntoRoom(roomId string, host bool, conn *websocket.Conn) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	p := Participant{host, conn}
	r.Map[roomId] = append(r.Map[roomId], p)
}

func (r *RoomMap) DeleteRoom(roomId string) {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()
	delete(r.Map, roomId)

}

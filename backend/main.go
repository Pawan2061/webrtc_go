package main

import (
	"backend/services"
	"fmt"
	"log"
	"net/http"
)

func main() {
	services.Allrooms.Init()
	http.HandleFunc("/create", services.CreateRoomRequest)
	http.HandleFunc("/join", services.JoinRoomRequestHandler)
	log.Println("starting server at port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("working")

}

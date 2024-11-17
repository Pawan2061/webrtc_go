package main

import (
	"backend/middlewares"
	"backend/servers"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/getToken", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(servers.GetJoinToken("my-room", "identity")))
	})
	corsEnabled := middlewares.EnableCors(http.DefaultServeMux)

	log.Println("working fine")

	log.Fatal(http.ListenAndServe(":8080", corsEnabled))
}

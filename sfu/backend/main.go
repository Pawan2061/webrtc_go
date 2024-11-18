// main.go
package main

import (
	"backend/middlewares"
	"backend/servers"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("working inside main")
	r := gin.Default()
	r.Use(middlewares.GinEnableCors())

	fmt.Println("after middlewaress")
	r.GET("/getToken", func(c *gin.Context) {
		fmt.Println("getting the token")
		token := servers.GetJoinToken("my-room", "identity")
		fmt.Println("got the token", token)
		c.String(200, token)
	})

	r.GET("/createRoom", func(c *gin.Context) {
		room := servers.CreateRoom()
		c.JSON(200, gin.H{
			"room": room,
			"name": room.Name,
		})
	})

	r.GET("/ws", func(ctx *gin.Context) {
		servers.HandleSocket(ctx)

	})
	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {

		log.Fatalf("Failed to start server: %v", err)
	}
}

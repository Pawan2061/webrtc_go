package main

import (
	"backend/middlewares"
	"backend/servers"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SignupRequest struct {
	Username string `json:"username"`
	Room     string `json:"room"`
	Password string `json:"password"`
}

func main() {
	fmt.Println("working inside main")
	r := gin.Default()

	r.Use(middlewares.GinEnableCors())

	r.POST("/getToken", func(c *gin.Context) {
		fmt.Println("getting the token")
		var req SignupRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		token := servers.GetJoinToken(req.Room, req.Username)
		if token == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token})
	})

	r.GET("/createRoom", func(c *gin.Context) {
		room := servers.CreateRoom()
		c.JSON(http.StatusOK, gin.H{
			"room": room,
			"name": room.Name,
		})
	})

	// WebSocket route
	r.GET("/ws", func(ctx *gin.Context) {
		servers.HandleSocket(ctx)
	})

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

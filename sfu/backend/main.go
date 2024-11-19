package main

import (
	"backend/middlewares"
	"backend/servers"
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

type SignupRequest struct {
	Username string `json:"username"`
	Room     string `json:"room"`
	Password string `json:"password"`
}
type StartRecordingRequest struct {
	RoomName string `json:"room_name"`
	FilePath string `json:"file_path"`
	Layout   string `json:"layout"`
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

	r.POST("/record", func(c *gin.Context) {
		var req StartRecordingRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		}
		ctx := context.Background()

		egressClient := lksdk.NewEgressClient(
			"https://my-livekit-host",
			"livekit-api-key",
			"livekit-api-secret",
		)
		fileRequest := &livekit.RoomCompositeEgressRequest{
			RoomName: "MY-ROOM",
			Layout:   "speaker",
			Output: &livekit.RoomCompositeEgressRequest_File{
				File: &livekit.EncodedFileOutput{
					FileType: livekit.EncodedFileType_MP4,
					Filepath: "",
				},
			},
		}

		info, err := egressClient.StartRoomCompositeEgress(ctx, fileRequest)
		if err != nil {
			log.Printf("Failed to start egress: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start recording"})
			return

		}

		egressId := info.EgressId
		c.JSON(http.StatusOK, gin.H{
			"message":   "Recording started",
			"egress_id": egressId,
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

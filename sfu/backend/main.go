package main

import (
	"backend/database"
	"backend/middlewares"
	"backend/servers"
	"backend/structs"
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Roomsignup struct {
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

	database.SetupDatabase()
	r := gin.Default()

	r.Use(middlewares.GinEnableCors())

	r.POST("/auth/signup", func(c *gin.Context) {
		fmt.Println("Inside the signup")

		var user structs.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
			return
		}

		var userFound structs.User
		result := database.Db.Where("username = ?", user.Username).First(&userFound)

		if result.Error == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Username already used",
			})
			return
		}

		if result.Error != nil && result.Error != gorm.ErrRecordNotFound {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": result.Error.Error(),
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		user.Password = string(hashedPassword)

		if err := database.Db.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		fmt.Println("user is created")

		user.Password = ""

		c.JSON(http.StatusOK, gin.H{
			"data": user,
		})
	})

	r.POST("/auth/login", func(c *gin.Context) {
		var user structs.User
		fmt.Println("reached here")
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "bad request",
				"error":   err.Error(),
			})
			return
		}
		fmt.Println("workings")

		var userFound structs.User
		result := database.Db.Where("username = ?", user.Username).First(&userFound)
		if result.Error != nil {
			fmt.Println(result.Error)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid credentials",
			})
			return
		}
		fmt.Println("checked here")

		err := bcrypt.CompareHashAndPassword([]byte(userFound.Password), []byte(user.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid credentials",
			})
			return
		}

		token, err := middlewares.GenerateJWT(userFound.Username)
		fmt.Println(token, "token is here")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "could not generate token",
			})
			return
		}

		fmt.Println("generatign the token", token)
		c.JSON(http.StatusOK, gin.H{
			"message": "login successful",
			"token":   token,
		})
	})

	r.POST("/getToken", func(c *gin.Context) {
		fmt.Println("getting the token")
		var req Roomsignup

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
			log.Printf("Error binding JSON: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		log.Printf("Received request: %+v", req)

		ctx := context.Background()
		egressClient := lksdk.NewEgressClient(
			"wss://unacademy-ijd7o0e5.livekit.cloud",
			"APIwyMY4vyhVbx4",
			"Q3MOMf7cwua3zag5sZIHrfKgnwcc6aGKmeGNWXhD8JuA",
		)

		fileRequest := &livekit.RoomCompositeEgressRequest{
			RoomName: req.RoomName,
			Layout:   req.Layout,
			Output: &livekit.RoomCompositeEgressRequest_File{
				File: &livekit.EncodedFileOutput{
					FileType: livekit.EncodedFileType_MP4,
					Filepath: "public/my-room-test.mp4",
				},
			},
		}
		log.Printf("Egress Request: %+v", fileRequest)

		info, err := egressClient.StartRoomCompositeEgress(ctx, fileRequest)
		if err != nil {
			log.Printf("Failed to start egress: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start recording"})
			return
		}

		log.Printf("Egress started successfully: %+v", info)
		c.JSON(http.StatusOK, gin.H{"message": "Recording started", "info": info})
	})

	r.GET("/ws", func(ctx *gin.Context) {
		fmt.Println("handling websockets")
		servers.HandleSocket(ctx)
	})
	r.POST("/upload", servers.HandlePdfUpload)
	r.GET("/uploads/:file", servers.GetPdf)

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

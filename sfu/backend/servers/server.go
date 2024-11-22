package servers

import (
	"backend/middlewares"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/livekit/protocol/auth"
	livekit "github.com/livekit/protocol/livekit"
	lksdk "github.com/livekit/server-sdk-go"
)

type UploadResponse struct {
	Filename     string `json:"filename"`
	OriginalName string `json:"originalName"`
	TotalPages   int    `json:"totalPages"`
}

func GetJoinToken(room, identity string) string {
	apikey := os.Getenv("LIVEKIT_API_KEY")
	fmt.Println(apikey, "its here")

	at := auth.NewAccessToken("APIwyMY4vyhVbx4", "Q3MOMf7cwua3zag5sZIHrfKgnwcc6aGKmeGNWXhD8JuA")
	canSubscribe := true
	canPublish := true
	canPublishData := true

	grant := &auth.VideoGrant{
		RoomJoin:       true,
		Room:           room,
		CanSubscribe:   &canSubscribe,
		CanPublish:     &canPublish,
		CanPublishData: &canPublishData,
	}
	fmt.Println("inside the grant")
	at.AddGrant(grant).
		SetIdentity(identity).
		SetValidFor(time.Hour)

	fmt.Println("working for the grant")

	token, err := at.ToJWT()
	if err != nil {
		fmt.Println("Failed to generate the error", err)
	}

	fmt.Println(token, "token is here")
	fmt.Println("working for the grant", token)

	return token
}

func CreateRoom() *livekit.Room {
	host := "https://unacademy-ijd7o0e5.livekit.cloud"
	apiKey := os.Getenv("LIVEKIT_API_KEY")
	apiSecret := os.Getenv("LIVEKIT_API_SECRET")

	if host == "" || apiKey == "" || apiSecret == "" {
		log.Fatal("LIVEKIT_HOST, LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set")
	}

	roomClient := lksdk.NewRoomServiceClient(host, apiKey, apiSecret)

	room, err := roomClient.CreateRoom(context.Background(), &livekit.CreateRoomRequest{
		Name:            "my-room",
		EmptyTimeout:    10 * 60,
		MaxParticipants: 20,
	})
	if err != nil {
		log.Printf("Failed to create room: %v", err)
		return nil
	}

	log.Printf("Room created: %s", room.Name)
	return room
}
func HandlePdfUpload(c *gin.Context) {
	file, err := c.FormFile("pdf")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file from form"})
		return
	}

	// Generate a unique filename to avoid path traversal and filename conflicts
	uniqueFilename := uuid.New().String() + filepath.Ext(file.Filename)

	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		if mkdirErr := os.Mkdir(uploadDir, 0755); mkdirErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
			return
		}
	}

	filePath := filepath.Join(uploadDir, uniqueFilename)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	pages, err := middlewares.GetPDFPageCount(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read PDF metadata"})
		return
	}

	response := UploadResponse{
		Filename:     uniqueFilename, // Use the unique filename
		OriginalName: file.Filename,
		TotalPages:   pages,
	}
	c.JSON(http.StatusOK, response)
}

func GetPdf(c *gin.Context) {
	doc := c.Param("file")
	uploadsDir := "./uploads"

	fmt.Println(doc)
	fmt.Println("serving the directory")
	filePath := filepath.Join(uploadsDir, filepath.Clean(doc))

	fmt.Printf("Requested document: %s\n", doc)
	fmt.Printf("Resolved file path: %s\n", filePath)

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		fmt.Println(filePath)
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	c.Writer.Header().Set("Content-Type", "application/pdf")
	c.File(filePath)
}

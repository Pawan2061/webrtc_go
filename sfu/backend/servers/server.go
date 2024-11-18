package servers

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/livekit/protocol/auth"
)

func GetJoinToken(room, identity string) string {

	apiKey := os.Getenv("LIVEKIT_API_KEY")
	apiSecret := os.Getenv("LIVEKIT_API_SECRET")

	if apiKey == "" || apiSecret == "" {
		log.Fatal("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be set")
	}
	at := auth.NewAccessToken(apiKey, apiSecret)
	if at == nil {
		log.Fatal("Failed to create access token")
	}

	videoGrant := &auth.VideoGrant{
		RoomJoin: true,
		Room:     room,
	}
	at.AddGrant(videoGrant).
		SetIdentity(identity).
		SetValidFor(time.Hour)

	token, err := at.ToJWT()
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return ""
	}

	fmt.Println("Token generated:", token)
	return token
}

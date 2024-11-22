package middlewares

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateJWT(username string) (string, error) {
	fmt.Println("im here")

	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	}
	fmt.Println("i left there")
	fmt.Println(claims, "claims here")

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	fmt.Println(token, "it should be here")

	// jwtSecret := os.Getenv("JWT_SECRET")
	// fmt.Println(jwtSecret, "secret here")
	// if jwtSecret == "" {
	// 	return "", fmt.Errorf("JWT_SECRET environment variable not set")
	// }

	signedToken, err := token.SignedString([]byte("pawan1"))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

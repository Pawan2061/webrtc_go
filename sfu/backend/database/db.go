package database

import (
	"backend/structs"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func SetupDatabase() {
	var err error

	fmt.Println("wprking for db setup")

	dsn := "postgresql://Pawan2061:eTuqbHO0GJD8@ep-icy-fire-a52bon09.us-east-2.aws.neon.tech/twitter?sslmode=require"

	Db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = Db.AutoMigrate(&structs.User{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
}

package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/config"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/server"
)

func main() {
	cfg := config.Server()

	// Give time for the database to start
	time.Sleep(5000 * time.Millisecond)

	// connect to db
	db := orm.Init(cfg)
	defer db.Close()

	server.Run(cfg, db)
}

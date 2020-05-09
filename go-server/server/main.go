package server

import (
	"log"
	"net/http"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/go-chi/chi"
	"github.com/jinzhu/gorm"
)

// Run starts a new server
func Run(cfg *util.ServerConfig, db *gorm.DB) {
	router := chi.NewRouter()

	registerMiddleware(router, db, cfg)

	registerRoutes(router, cfg, db)

	log.Println("Server listening @ \"/\" on " + cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, router))
}

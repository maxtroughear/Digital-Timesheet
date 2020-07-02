package server

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/go-chi/chi"
	"github.com/jinzhu/gorm"
)

func registerMiddleware(router *chi.Mux, db *gorm.DB, cfg *util.ServerConfig) {
	router.Use(dataloader.Middleware(db))
	router.Use(auth.Middleware(db, &cfg.JWT))
}

package server

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/handler"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/jinzhu/gorm"
)

func registerRoutes(router *chi.Mux, cfg *util.ServerConfig, db *gorm.DB) {
	router.Handle(cfg.APIPath, handler.GraphqlHandler(db, cfg))

	if cfg.Environment == "development" {
		router.Handle(cfg.PlaygroundPath, playground.Handler("GraphQL playground", cfg.PlaygroundAPIPath))
	}
}

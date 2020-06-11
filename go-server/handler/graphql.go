package handler

import (
	"context"
	"net/http"
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/directive"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/resolver"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/jinzhu/gorm"
)

// GraphqlHandler constructs and returns a http handler
func GraphqlHandler(db *gorm.DB, cfg *util.ServerConfig) http.Handler {
	c := generated.Config{
		Resolvers: &resolver.Resolver{
			DB:  db,
			Cfg: cfg,
		},
		Directives: directive.Register(db, cfg),
	}

	gqlHandler := handler.New(generated.NewExecutableSchema(c))

	gqlHandler.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
	})
	gqlHandler.AddTransport(transport.Options{})
	gqlHandler.AddTransport(transport.GET{})
	gqlHandler.AddTransport(transport.POST{})
	gqlHandler.AddTransport(transport.MultipartForm{})

	gqlHandler.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(200),
	})

	// gqlHandler.Use(ext.AccessControl{
	// 	DB: db,
	// 	E:  accesscontrol.Init(db),
	// })

	if cfg.Environment == "development" {
		gqlHandler.Use(extension.Introspection{})
		gqlHandler.Use(apollotracing.Tracer{})
	} else {
		gqlHandler.Use(&extension.ComplexityLimit{
			Func: func(ctx context.Context, rc *graphql.OperationContext) int {
				return cfg.GraphQL.ComplexityLimit
			},
		})
	}

	return gqlHandler
}

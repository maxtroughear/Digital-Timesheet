package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graph"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graph/generated"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/go-chi/chi"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "3000"

func main() {
	// Give time for the database to start
	time.Sleep(5000 * time.Millisecond)

	db := initDB()
	defer db.Close()

	router := chi.NewRouter()

	router.Use(dataloader.Middleware(db))
	router.Use(auth.Middleware(db))

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	gqlConfig := generated.Config{
		Resolvers: &graph.Resolver{
			DB: db,
		},
	}

	//gqlHandler := handler.NewDefaultServer(generated.NewExecutableSchema(gqlConfig))

	gqlHandler2 := handler.New(generated.NewExecutableSchema(gqlConfig))

	gqlHandler2.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
	})
	gqlHandler2.AddTransport(transport.Options{})
	gqlHandler2.AddTransport(transport.GET{})
	gqlHandler2.AddTransport(transport.POST{})
	gqlHandler2.AddTransport(transport.MultipartForm{})

	gqlHandler2.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(200),
	})

	if os.Getenv("ENVIRONMENT") == "development" || true {
		// IN DEVELOPMENT
		gqlHandler2.Use(extension.Introspection{})

		router.Handle("/graphql", playground.Handler("GraphQL playground", "/api/"))
		log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	} else {
		// IN PRODUCTION
		gqlHandler2.Use(&extension.ComplexityLimit{
			Func: func(ctx context.Context, rc *graphql.OperationContext) int {
				return 200
			},
		})
	}
	router.Handle("/", gqlHandler2)

	log.Printf("running on port:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func initDB() *gorm.DB {
	db, err := gorm.Open("postgres", "host="+os.Getenv("POSTGRES_HOST")+" user="+os.Getenv("POSTGRES_USER")+" password="+os.Getenv("POSTGRES_PASSWORD")+" dbname="+os.Getenv("POSTGRES_DB")+" sslmode=disable")

	if err != nil {
		log.Println("Failed to connect to database")
		log.Println(err)
		os.Exit(10)
	}

	// db.DropTableIfExists(&model.Company{})
	// db.DropTableIfExists(&model.User{})

	db.AutoMigrate(&model.Company{})
	db.AutoMigrate(&model.User{})

	var company model.Company

	db.Where(model.Company{
		Code: "SA",
	}).Attrs(model.Company{
		Name: "Service Admins",
	}).FirstOrCreate(&company)

	hash, err := auth.HashPassword("servicepass")

	var user model.User
	var user2 model.User

	db.Where(model.User{
		CompanyID: company.ID,
		// Check role
	}).Attrs(model.User{
		Username: "serviceadmin",
		Password: hash,
	}).FirstOrCreate(&user)

	db.Where(model.User{
		CompanyID: company.ID,
		Username:  "serviceadmin2",
		// Check role
	}).Attrs(model.User{
		Username: "serviceadmin2",
		Password: hash,
	}).FirstOrCreate(&user2)

	return db
}

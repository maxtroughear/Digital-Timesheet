package config

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/joho/godotenv"
)

// Server retrieves config from environment variables
func Server() *util.ServerConfig {
	godotenv.Load()

	return &util.ServerConfig{
		Version:     util.MustGet("APP_VERSION"),
		Environment: util.MustGet("ENVIRONMENT"),
		Port:        util.MustGet("PORT"),
		JWT: util.JWTConfig{
			Secret: util.MustGet("JWT_SECRET_KEY"),
		},
		GraphQL: util.GqlConfig{
			ComplexityLimit: 200,
		},
		Database: util.DatabaseConfig{
			Host:     util.MustGet("POSTGRES_HOST"),
			User:     util.MustGet("POSTGRES_USER"),
			Password: util.MustGet("POSTGRES_PASSWORD"),
			Database: util.MustGet("POSTGRES_DB"),
		},
	}
}

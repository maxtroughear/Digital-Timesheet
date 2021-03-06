package config

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/joho/godotenv"
)

// Server retrieves config from environment variables
func Server() *util.ServerConfig {
	godotenv.Load()

	return &util.ServerConfig{
		Version:           util.MustGet("APP_VERSION"),
		Environment:       util.MustGet("ENVIRONMENT"),
		APIPath:           util.CanGet("API_PATH", "/"),
		PlaygroundPath:    util.CanGet("PLAYGROUND_PATH", "/graphql"),
		PlaygroundAPIPath: util.CanGet("PLAYGROUND_API_PATH", "/api/"),
		Port:              util.MustGet("PORT"),
		JWT: util.JWTConfig{
			Secret: util.MustGetSecretFromEnv("JWT_SECRET_KEY"),
		},
		GraphQL: util.GqlConfig{
			ComplexityLimit: 200,
		},
		Database: util.DatabaseConfig{
			Host:           util.MustGet("POSTGRES_HOST"),
			User:           util.MustGet("POSTGRES_USER"),
			Password:       util.MustGetSecretFromEnv("POSTGRES_PASSWORD"),
			Database:       util.MustGet("POSTGRES_DB"),
			MaxConnections: util.CanGetInt32("POSTGRES_MAX_CONNECTIONS", 20),
		},
		Redis: util.RedisConfig{
			Address: util.MustGet("REDIS_ADDRESS"),
		},
	}
}

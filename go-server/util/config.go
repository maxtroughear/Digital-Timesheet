package util

type ServerConfig struct {
	Version           string
	Environment       string
	APIPath           string
	PlaygroundPath    string
	PlaygroundAPIPath string
	Port              string
	GraphQL           GqlConfig
	JWT               JWTConfig
	Database          DatabaseConfig
}

type JWTConfig struct {
	Secret string
}

type GqlConfig struct {
	ComplexityLimit int
}

type DatabaseConfig struct {
	Host           string
	User           string
	Password       string
	Database       string
	MaxConnections int
}

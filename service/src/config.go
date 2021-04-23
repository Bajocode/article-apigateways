package main

// Config validates and provides default env vars
type Config struct {
	ServerPort string `env:"SERVER_PORT" envDefault:"9000"`
}

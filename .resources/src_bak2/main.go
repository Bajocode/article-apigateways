package main

import (
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/caarlos0/env/v6"
)

func main() {
	var cfg Config

	if err := env.Parse(&cfg); err != nil {
		log.Fatal(err.Error())
	}

	http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/hello/")

		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "Hello world\n")
	})

	err := http.ListenAndServe(":"+cfg.ServerPort, nil)

	if err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}

package main

import (
	"log"
	"net/http"

	"cart-service/cart"
	"cart-service/store"
	"cart-service/util"

	"github.com/caarlos0/env/v6"
	"github.com/sirupsen/logrus"
)

func main() {
	var (
		cfg util.Config
		s   store.Store
	)

	if err := env.Parse(&cfg); err != nil {
		log.Fatal(err.Error())
	}

	if cfg.LocalStore {
		s = store.NewLocalStore()
	} else {
		s = store.NewRedisAdapter(&cfg)
	}

	h := cart.NewHandler(cart.NewRepository(s, cfg.RedisCartTTL))
	l := logrus.New()

	if cfg.AppEnv == "prod" {
		l.SetFormatter(&logrus.JSONFormatter{})
	} else {
		l.SetFormatter(&logrus.TextFormatter{})
	}

	if level, err := logrus.ParseLevel(cfg.LoggerLevel); err == nil {
		l.SetLevel(level)
	}

	http.Handle("/", LogMiddleware(l, cart.ErrorHandler(h.Route, l)))
	l.Fatal(http.ListenAndServe(":"+cfg.ServerPort, nil))
}

package main

import "net/http"

// Handling defines request handling behaviors
type Handling interface {
	Route(http.ResponseWriter, *http.Request) error
	handleGet(http.ResponseWriter, *http.Request) error
	handlePut(http.ResponseWriter, *http.Request) error
	handleDel(http.ResponseWriter, *http.Request) error
}

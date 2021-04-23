package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

var title string

type handler struct {
	repo *Repository
}

// NewHandler constructs a new request handler
func NewHandler(r *Repository) Handling {
	return &handler{r}
}

func (h *handler) Route(w http.ResponseWriter, r *http.Request) error {
	title = extractRouteParamAfter(r, "messages")

	switch r.Method {
	case http.MethodGet:
		return h.handleGet(w, r)
	case http.MethodPut:
		return h.handlePut(w, r)
	case http.MethodDelete:
		return h.handleDel(w, r)
	}

	return nil
}

func (h *handler) handleGet(w http.ResponseWriter, r *http.Request) error {
	msg, err := h.repo.Get(r.Context(), title)

	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err = json.NewEncoder(w).Encode(msg); err != nil {
		return fmt.Errorf("Server error (response encoding): %v", err)
	}

	return nil
}

func (h *handler) handlePut(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	return nil
}

func (h *handler) handleDel(w http.ResponseWriter, r *http.Request) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	return nil
}

func extractRouteParamAfter(r *http.Request, prefix string) string {
	param := strings.TrimPrefix(r.URL.Path, "/"+prefix)

	return strings.TrimPrefix(param, "/")
}

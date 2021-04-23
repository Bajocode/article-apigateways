package main

import (
	"context"
	"encoding/json"
)

// Repository encapsulates Message data access logic
type Repository struct {
	cache Caching
}

// NewRepository constructs a new repository with cache
func NewRepository(c Caching) *Repository {
	return &Repository{c}
}

// Get retrieves and unmatshals a message for title
func (r *Repository) Get(ctx context.Context, title string) (*Message, error) {
	var (
		msg *Message
		enc []byte
		err error
	)

	if enc, err = r.cache.Get(ctx, title); err != nil {
		return nil, err
	}
	err = json.Unmarshal(enc, &msg)

	return msg, err
}

// Update marshals and updates a message for title
func (r *Repository) Update(ctx context.Context, title string, msg Message) (*Message, error) {
	var (
		enc []byte
		err error
	)

	if enc, err = json.Marshal(msg); err != nil {
		return nil, err
	}
	if err = r.cache.Put(ctx, title, enc); err != nil {
		return nil, err
	}

	return r.Get(ctx, title)
}

// Delete deletes a message for title
func (r *Repository) Delete(ctx context.Context, title string) error {
	return r.cache.Del(ctx, title)
}

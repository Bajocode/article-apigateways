package main

import "context"

// Caching defines caching behaviors
type Caching interface {
	Get(ctx context.Context, key string) ([]byte, error)
	Put(ctx context.Context, key string, val []byte) error
	Del(ctx context.Context, key string) error
}

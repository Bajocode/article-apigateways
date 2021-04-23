package main

import (
	"context"
	"errors"
	"sync"
)

type cache struct {
	m  map[string][]byte
	mx sync.RWMutex
}

// NewCache constructs a new local cache
func NewCache() Caching {
	return &cache{m: make(map[string][]byte)}
}

func (s *cache) Get(ctx context.Context, key string) ([]byte, error) {
	s.mx.RLock()
	defer s.mx.RUnlock()
	value, ok := s.m[key]
	if !ok {
		return nil, errors.New("Key not found")
	}
	return value, nil
}

func (s *cache) Put(ctx context.Context, key string, val []byte) error {
	s.mx.Lock()
	defer s.mx.Unlock()
	s.m[key] = val
	return nil
}

func (s *cache) Del(ctx context.Context, key string) error {
	s.mx.Lock()
	defer s.mx.Unlock()
	delete(s.m, key)
	return nil
}

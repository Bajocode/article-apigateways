## Validation
```bash
{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/cart",
      "method": "PUT",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
          "alg": "HS256",
          "jwk-url": "http://identity-service:9005/jwks.json",
          "disable_jwk_security": true,
          "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/{JWT.userid}/cart",
          "encoding": "no-op",
          "sd": "static",
          "method": "PUT",
          "host": [
            "http://cart-service:9002"
          ],
          "disable_host_sanitize": true,
          "is_collection": false
        }
      ]
    },
    {
      "endpoint": "/users",
      "method": "GET",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "sd": "static",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/register",
      "method": "POST",
      "extra_config": {
        "github.com/devopsfaith/krakend-ratelimit/juju/router": {
          "maxRate": 100,
          "clientMaxRate": 5,
          "strategy": "ip"
        },
        "github.com/devopsfaith/krakend-jsonschema": {
          "type": "object",
          "required": ["email", "password"],
          "properties": {
            "email": { "type": "string" },
            "password": { "type": "string" }
          }
        }
      },
      "backend": [
        {
          "url_pattern": "/auth/register",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "extra_config": {
        "github.com/devopsfaith/krakend-ratelimit/juju/router": {
          "maxRate": 10,
          "clientMaxRate": 5,
          "strategy": "ip"
        }
      },
      "backend": [
        {
          "url_pattern": "/auth/login",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

curl 'http://0.0.0.0:8000/auth/register' \
  --request "POST" \
  --header "Content-type: application/json" \
  --data '{"email": "somebody@nobody.com", "passwor": "mpassword"}' \

400 Bad Request

curl 'http://0.0.0.0:8000/auth/register' \
  --request "POST" \
  --header "Content-type: application/json" \
  --data '{"email": "somebody@nobody.com", "password": "mpassword"}' \
```

## Regulation
```bash
{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/cart",
      "method": "PUT",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/{JWT.userid}/cart",
          "encoding": "no-op",
          "sd": "static",
          "method": "PUT",
          "host": [
            "http://cart-service:9002"
          ],
          "disable_host_sanitize": true,
          "is_collection": false
        }
      ]
    },
    {
      "endpoint": "/users",
      "method": "GET",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "sd": "static",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/register",
      "method": "POST",
      "extra_config": {
        "github.com/devopsfaith/krakend-ratelimit/juju/router": {
          "maxRate": 100,
          "clientMaxRate": 5,
          "strategy": "ip"
        }
      },
      "backend": [
        {
          "url_pattern": "/auth/register",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "extra_config": {
        "github.com/devopsfaith/krakend-ratelimit/juju/router": {
          "maxRate": 10,
          "clientMaxRate": 5,
          "strategy": "ip"
        }
      },
      "backend": [
        {
          "url_pattern": "/auth/login",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

for i in {1..100}; do curl \
  --request "POST" \
  --header "Content-type: application/json" \
  --data '{"email": "somebody@nobody.com", "password": "mpassword"}' \
  'http://0.0.0.0:8000/auth/login'; done
```

## Authentication
### Same with krakend auth
```bash
JWT_EABLED=false
docker compose down && docker compose up

{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/users",
      "method": "GET",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "sd": "static",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/register",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/register",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/login",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

{
	TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZXJpZCJ9

	curl 'http://0.0.0.0:8000/users' \
		--request "GET" \
		--header "authorization: Bearer ${TOKEN}"	
 }
 
[
	{
        "id":"f06b084b-9d67-4b01-926b-f90c6246eed9",
		"email":"somebody@nobody.com"
	}
]


```

### Cart endpoints
```bash
{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/cart",
      "method": "PUT",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/{JWT.userid}/cart",
          "encoding": "no-op",
          "sd": "static",
          "method": "PUT",
          "host": [
            "http://cart-service:9002"
          ],
          "disable_host_sanitize": true,
          "is_collection": false
        }
      ]
    },
    {
      "endpoint": "/users",
      "method": "GET",
      "output_encoding": "no-op",
      "extra_config": {
        "github.com/devopsfaith/krakend-jose/validator": {
            "alg": "HS256",
            "jwk-url": "http://identity-service:9005/jwks.json",
            "disable_jwk_security": true,
            "kid": "userid"
        }
      },
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "sd": "static",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/register",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/register",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/login",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

curl 'http://0.0.0.0:8000/cart' \
  --request "PUT" \
  --header "Content-type: application/json" \
  --header "authorization: Bearer ${TOKEN}" \
  --data '{"items": [{"productid": "94e8d5de-2192-4419-b824-ccbe7b21fa6f", "quantity": 2, "price": 200}]}'

{"items":[{"productid":"94e8d5de-2192-4419-b824-ccbe7b21fa6f","quantity":2,"price":200}]}
```

## Routing
### Users

```bash
# krakend.json
{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/users",
      "method": "GET",
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

# curl
curl \
  --request "GET" \
  'http://0.0.0.0:8000/users'

{
  "status": 401,
  "message": "No Authentication header"
}
```

### `Users with auth`
* `GET / users +  headers_to_pass: [Authorization]`
* `POST /auth/register`
* `POST /auth/login`

```bash
# krakend.json
{
  "version": 2,
  "port": 8000,
  "sd": "static",
  "output_encoding": "no-op",
  "endpoints": [
    {
      "endpoint": "/users",
      "method": "GET",
      "output_encoding": "no-op",
      "headers_to_pass": ["Authorization"],
      "backend": [
        {
          "url_pattern": "/users",
          "encoding": "no-op",
          "sd": "static",
          "method": "GET",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/register",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/register",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    },
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "backend": [
        {
          "url_pattern": "/auth/login",
          "encoding": "no-op",
          "method": "POST",
          "host": [
            "http://identity-service:9005"
          ]
        }
      ]
    }
  ]
}

# docker-compose
docker compose restart gateway

# curl
curl 'http://0.0.0.0:8000/auth/register' \
  --request "POST" \
  --header "Content-type: application/json" \
  --data '{"email": "somebody@nobody.com", "password": "mypassword"}' \
  
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZXJ...",
  "expiry": 1623536812
}

curl 'http://0.0.0.0:8000/auth/login' \
  --request "POST" \
  --header "Content-type: application/json" \
  --data '{"email": "somebody@nobody.com", "password": "mypassword"}' \

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZXJ...",
  "expiry": 1623536812
}

{
	TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVzZXJpZCJ9

	curl 'http://0.0.0.0:8000/users' \
		--request "GET" \
		--header "authorization: Bearer ${TOKEN}"	
 }
 
[
	{
        "id":"f06b084b-9d67-4b01-926b-f90c6246eed9",
		"email":"somebody@nobody.com"
	}
]
```





package auth

import (
	"context"
	"log"
	"net/http"
	"strings"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model"
	argonpass "github.com/dwin/goArgonPass"
	"github.com/jinzhu/gorm"
)

var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

// LoginUser attempts to verify the supplied password with the stored hash in the User model
func LoginUser(user model.User, password string) (string, error) {
	err := argonpass.Verify(password, user.Password)
	if err != nil {
		// log failed login attempt, badactor strike
		log.Println("Failed to verify password")
		return "", err
	}
	return buildAndSignToken(user)
}

// HashPassword attempts to hash the supplied password
func HashPassword(password string) (string, error) {
	return argonpass.Hash(password)
}

// Middleware decodes the authorization cookie
func Middleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			a := r.Header.Get("authorization")

			// allow unauthenticated users through
			if a == "" {
				next.ServeHTTP(w, r)
				return
			}

			// split token from Bearer

			splitToken := strings.Split(a, "Bearer")

			if len(splitToken) != 2 || len(splitToken[1]) < 2 {
				log.Println("Bad token format")
				next.ServeHTTP(w, r)
				return
			}

			token := strings.TrimSpace(splitToken[1])

			// process and validate jwt token
			userID, err := validateTokenAndGetUserID(token)
			if err != nil {
				log.Println("Failed to validate token")
				log.Println(err)
				next.ServeHTTP(w, r)
				return
			}
			// get user from database

			user, err := dataloader.For(r.Context()).UserByID.Load(int64(userID))

			if err != nil {
				log.Println("failed to retreive user")
				log.Println(err)
				next.ServeHTTP(w, r)
				return
			}

			ctx := context.WithValue(r.Context(), userCtxKey, user)

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// For find the user from the context. Middleware must have run
func For(ctx context.Context) *model.User {
	raw, _ := ctx.Value(userCtxKey).(*model.User)
	return raw
}

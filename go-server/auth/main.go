package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	argonpass "github.com/dwin/goArgonPass"
	"github.com/jinzhu/gorm"
)

var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

type authContext struct {
	User   *model.User
	Secure bool
}

// LoginUser generates a signed JWT token
func LoginUser(user *model.User, cfg *util.JWTConfig) (string, error) {
	return buildAndSignToken(user, cfg, 0)
}

func LoginUserSecure(user *model.User, cfg *util.JWTConfig) (string, error) {
	return buildAndSignToken(user, cfg, 1*time.Hour)
}

// VerifyPassword verifies a password against the stored hash
func VerifyPassword(user *model.User, password string) bool {
	return argonpass.Verify(password, user.Password) == nil
}

// HashPassword attempts to hash the supplied password
func HashPassword(password string) (string, error) {
	return argonpass.Hash(password)
}

// Middleware decodes the authorization header
func Middleware(db *gorm.DB, cfg *util.JWTConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			a := r.Header.Get("authorization")
			aSecure := r.Header.Get("authorizationsecure")

			// allow unauthenticated users through
			if a == "" {
				next.ServeHTTP(w, r)
				return
			}

			token, err := splitToken(a)

			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			// process and validate jwt token
			userID, err := validateTokenAndGetUserID(token, cfg)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}
			// get user from database

			user, err := dataloader.For(r.Context()).UserByID.Load(int64(userID))

			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			// check if secure token exists and is valid
			secure := false
			tokenSecure, err := splitToken(aSecure)
			if err == nil {
				userIDSecure, _ := validateTokenAndGetUserID(tokenSecure, cfg)
				if userIDSecure == user.ID {
					secure = true
				}
			}

			ctx := context.WithValue(r.Context(), userCtxKey, authContext{
				User:   user,
				Secure: secure,
			})

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// For find the user from the context. Middleware must have run
func For(ctx context.Context) authContext {
	raw, _ := ctx.Value(userCtxKey).(authContext)
	return raw
}

func splitToken(header string) (string, error) {
	splitToken := strings.Split(header, "Bearer")

	if len(splitToken) != 2 || len(splitToken[1]) < 2 {
		return "", fmt.Errorf("Bad token format")
	}

	return strings.TrimSpace(splitToken[1]), nil
}
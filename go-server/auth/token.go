package auth

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/dgrijalva/jwt-go"
	"github.com/emvi/hide"
)

// UserClaim structure
type UserClaim struct {
	UserID hide.ID `json:"userId"`
	jwt.StandardClaims
}

func validateTokenAndGetUserID(t string, cfg *util.JWTConfig) (hide.ID, error) {
	token, err := jwt.ParseWithClaims(t, &UserClaim{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.Secret), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(*UserClaim); ok && token.Valid && token.Method == jwt.SigningMethodHS384 {
		return claims.UserID, nil
	}
	return 0, err
}

// buildAndSignToken signs and returned a JWT token from a User
func buildAndSignToken(u *model.User, cfg *util.JWTConfig, expires time.Duration) (string, error) {
	claims := UserClaim{
		UserID: u.ID,
		StandardClaims: jwt.StandardClaims{
			Issuer:   "dts",
			IssuedAt: time.Now().Unix(),
			Subject:  u.Company.Code + "/" + u.Email,
		},
	}

	if expires != 0 {
		claims.ExpiresAt = time.Now().Add(expires).Unix()
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS384, claims)
	return token.SignedString([]byte(cfg.Secret))
}

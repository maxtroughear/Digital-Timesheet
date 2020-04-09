package auth

import (
	"os"
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model"
	"github.com/dgrijalva/jwt-go"
	"github.com/emvi/hide"
)

// UserClaim structure
type UserClaim struct {
	UserID hide.ID `json:"userId"`
	jwt.StandardClaims
}

var signingKey = []byte(os.Getenv("SECRET_TOKEN_KEY"))

func validateTokenAndGetUserID(t string) (hide.ID, error) {
	token, err := jwt.ParseWithClaims(t, &UserClaim{}, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(*UserClaim); ok && token.Valid && token.Method == jwt.SigningMethodHS256 {
		return claims.UserID, nil
	}
	return 0, err
}

// buildAndSignToken signs and returned a JWT token from a User
func buildAndSignToken(u model.User) (string, error) {
	claims := UserClaim{
		u.ID,
		jwt.StandardClaims{
			Issuer:   "dts",
			IssuedAt: time.Now().Unix(),
			Subject:  u.Company.Code + "/" + u.Username,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(signingKey)
}

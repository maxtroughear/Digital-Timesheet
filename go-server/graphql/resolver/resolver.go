// Package resolver holds all graphql resolvers for queries and mutations
package resolver

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/jinzhu/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Resolver structure
type Resolver struct {
	DB  *gorm.DB
	Cfg *util.ServerConfig
}

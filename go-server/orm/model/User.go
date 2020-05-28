package model

import (
	"github.com/emvi/hide"
)

// `User` belongs to `Company`, `CompanyID` is the foreign key

// User model
type User struct {
	ModelSoftDelete
	Username     string `gorm:"UNIQUE_INDEX:idx_user_company"`
	Password     string
	Firstname    string
	Lastname     string
	CompanyID    hide.ID       `gorm:"unique_index:idx_user_company" json:"company"`
	Company      Company       `json:"-"`
	BuiltinRoles []BuiltinRole `gorm:"many2many:user_builtinroles" json:"-"`
	CustomRoles  []CustomRole  `gorm:"many2many:user_customroles" json:"-"`
}

// Roles returns all roles a user has as the Role interface
func (u User) Roles() []Role {
	roles := make([]Role, len(u.BuiltinRoles)+len(u.CustomRoles))

	var index uint

	for _, role := range u.BuiltinRoles {
		roles[index] = role
		index++
	}

	for _, role := range u.CustomRoles {
		roles[index] = role
		index++
	}

	return roles
}

package model

import (
	"github.com/emvi/hide"
)

// `User` belongs to `Company`, `CompanyID` is the foreign key

// User model
type User struct {
	ModelSoftDelete
	Username    string `gorm:"UNIQUE_INDEX:idx_user_company"`
	Password    string
	Firstname   string
	Lastname    string
	CompanyID   hide.ID      `gorm:"unique_index:idx_user_company" json:"company"`
	Company     Company      `json:"-"`
	Permissions []Permission `gorm:"many2many:user_permissions"`
}

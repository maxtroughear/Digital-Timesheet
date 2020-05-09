package accesscontrol

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

func EnsurePermissions(db *gorm.DB) {

}

func seedPermissions(db *gorm.DB) {
	// User object Permissions

	// Me permission, allows actions related to the logged in user
	db.FirstOrCreate(&model.Permission{
		Permission: "Me:View",
	})
	db.FirstOrCreate(&model.Permission{
		Permission: "Me:Edit",
	})

	// User permission, allows actions on a single user
	db.FirstOrCreate(&model.Permission{
		Permission: "User:View",
	})
	db.FirstOrCreate(&model.Permission{
		Permission: "User:Edit",
	})
	db.FirstOrCreate(&model.Permission{
		Permission: "User:Create",
	})
	db.FirstOrCreate(&model.Permission{
		Permission: "User:Delete",
	})

	// Users permission, allows actions on groups of users
	db.FirstOrCreate(&model.Permission{
		Permission: "Users:View",
	})
}

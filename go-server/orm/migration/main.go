package migration

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

func AutoMigrateAll(db *gorm.DB) {
	db.AutoMigrate(&model.Company{})
	db.AutoMigrate(&model.Permission{})
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.TwoFactor{})
}

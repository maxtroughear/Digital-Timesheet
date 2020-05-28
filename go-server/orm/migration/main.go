package migration

import (
	"log"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

func AutoMigrateAll(db *gorm.DB) {
	log.Println("Migrating models...")
	db.AutoMigrate(&model.Company{})
	db.AutoMigrate(&model.Permission{})
	db.AutoMigrate(&model.BuiltinRole{})
	db.AutoMigrate(&model.CustomRole{})
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.TwoFactor{})
	log.Println("Done")
}

func DropAll(db *gorm.DB) {
	log.Println("Dropping all tables...")
	db.DropTableIfExists(&model.Company{})
	db.DropTableIfExists(&model.Permission{})
	db.DropTableIfExists(&model.BuiltinRole{})
	db.DropTableIfExists(&model.CustomRole{})
	db.DropTableIfExists(&model.User{})
	db.DropTableIfExists(&model.TwoFactor{})
	log.Println("Done")
}

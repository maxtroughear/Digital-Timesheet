package migration

import (
	"log"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

func AutoMigrateAll(db *gorm.DB) {
	log.Println("Migrating models...")
	db.AutoMigrate(&model.Company{})
	db.AutoMigrate(&model.Domain{})
	db.AutoMigrate(&model.BuiltinRole{})
	db.AutoMigrate(&model.Permission{})
	db.AutoMigrate(&model.CustomRole{})
	db.AutoMigrate(&model.TwoFactor{})
	db.AutoMigrate(&model.User{})
	log.Println("Done")
}

func DropAll(db *gorm.DB) {
	log.Println("Dropping all tables...")
	db.DropTableIfExists(&model.Company{})
	db.DropTableIfExists(&model.Domain{})
	db.DropTableIfExists(&model.BuiltinRole{})
	db.DropTableIfExists(&model.CustomRole{})
	db.DropTableIfExists(&model.Permission{})
	db.DropTableIfExists(&model.TwoFactor{})
	db.DropTableIfExists(&model.User{})
	log.Println("Done")
}

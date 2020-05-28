package orm

import (
	"log"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/accesscontrol"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/migration"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/seed"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// Init connects to and initialises the database
func Init(cfg *util.ServerConfig) *gorm.DB {
	dbCfg := cfg.Database
	db, err := gorm.Open("postgres", "host="+dbCfg.Host+" user="+dbCfg.User+" password="+dbCfg.Password+" dbname="+dbCfg.Database+" sslmode=disable")

	if err != nil {
		log.Println("Failed to connect to db")
		panic(err)
	}

	if cfg.Environment == "development" {
		// clear db
		migration.DropAll(db)
	}

	migration.AutoMigrateAll(db)

	accesscontrol.EnsurePermissions(db)
	accesscontrol.EnsureBuiltinRoles(db)

	seed.RequiredUsers(db)

	return db
}

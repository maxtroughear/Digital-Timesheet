package orm

import (
	"log"
	"time"

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

	connectionString := constructConnectionString(&dbCfg)

	db, err := gorm.Open("postgres", connectionString)
	db.BlockGlobalUpdate(true)

	if err != nil {
		log.Println("Failed to connect to db")
		log.Println(connectionString)
		panic(err)
	}

	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(dbCfg.MaxConnections)
	db.DB().SetConnMaxLifetime(time.Hour * 1)

	if cfg.Environment == "development" {
		// clear db
		// note: does not drop tables used for many2many relationships, please bare this in mind!
		migration.DropAll(db)
	}

	migration.AutoMigrateAll(db)

	accesscontrol.EnsurePermissions(db)
	accesscontrol.EnsureBuiltinRoles(db)

	seed.RequiredUsers(db)

	return db
}

func constructConnectionString(dbCfg *util.DatabaseConfig) string {
	return "host=" + dbCfg.Host + " user=" + dbCfg.User + " password=" + dbCfg.Password + " dbname=" + dbCfg.Database + " sslmode=disable"
}

package accesscontrol

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/operation"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/subject"
	"github.com/jinzhu/gorm"
)

// EnsurePermissions ensures that all permissions exist in the database
func EnsurePermissions(db *gorm.DB) {
	seedPermissions(db)
}

// EnsureBuiltinRoles ensure that all builtin roles exist in the database
func EnsureBuiltinRoles(db *gorm.DB) {
	seedRoles(db)
}

func seedPermissions(db *gorm.DB) {
	// All Permissions
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.Any,
		Operation: operation.Any,
	})

	// User object Permissions

	// Me permission, allows actions related to the logged in user
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.Me,
		Operation: operation.Read,
	})
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.Me,
		Operation: operation.Update,
	})

	// User permission, allows actions on a single user
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.User,
		Operation: operation.Read,
	})
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.User,
		Operation: operation.Update,
	})
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.User,
		Operation: operation.Create,
	})
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.User,
		Operation: operation.Delete,
	})

	// Users permission, allows actions on groups of users
	db.FirstOrCreate(&model.Permission{}, model.Permission{
		Subject:   subject.Users,
		Operation: operation.Read,
	})
}

func seedRoles(db *gorm.DB) {

	// Service Admin role
	// Should have all permissions for now

	perm := model.Permission{}

	db.Where(model.Permission{
		Subject:   subject.Any,
		Operation: operation.Any,
	}).First(&perm)

	serviceAdminRole := model.BuiltinRole{}

	db.Where(model.BuiltinRole{
		Name: "Service Admin",
	}).Attrs(model.BuiltinRole{
		Description: "",
		Permissions: []model.Permission{
			perm,
		},
	}).FirstOrCreate(&serviceAdminRole)

}

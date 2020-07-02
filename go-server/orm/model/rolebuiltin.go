package model

import (
	"strings"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/operation"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/subject"
)

// BuiltinRole is a built in group of permissions
type BuiltinRole struct {
	Model
	Name        string
	Description string
	Permissions []Permission `gorm:"many2many:builtinrole_permissions"`
}

// GetName returns the name of the role
func (r BuiltinRole) GetName() string {
	return r.Name
}

// GetDescription returns the description of the role
func (r BuiltinRole) GetDescription() string {
	return r.Name
}

// GetPermissions return the roles permissions
func (r BuiltinRole) GetPermissions() []Permission {
	return r.Permissions
}

// CheckPermission will compare a permission string (like from graphql schema)
func (r BuiltinRole) CheckPermission(requestedPerm string) bool {
	strings := strings.Split(requestedPerm, ":")
	if len(strings) != 2 {
		return false
	}

	var sub subject.Subject
	var op operation.Operation

	sub.FromString(strings[0])
	op.FromString(strings[1])

	// Run through permissions to check for the permission
	for _, perm := range r.Permissions {
		if perm.CheckPermission(sub, op) {
			return true
		}
	}
	return false
}

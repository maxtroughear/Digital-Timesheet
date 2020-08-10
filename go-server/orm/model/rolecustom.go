package model

import (
	"strings"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/operation"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/subject"
	"github.com/emvi/hide"
)

// CustomRole is a group of permissions that is created for a specific company
type CustomRole struct {
	SoftDelete
	Name        string
	Description string
	CompanyID   hide.ID
	Company     Company      `json:"-"`
	Permissions []Permission `gorm:"many2many:customrole_permissions"`
}

// GetName returns the name of the role
func (r CustomRole) GetName() string {
	return r.Name
}

// GetDescription returns the description of the role
func (r CustomRole) GetDescription() string {
	return r.Name
}

// GetPermissions return the roles permissions
func (r CustomRole) GetPermissions() []Permission {
	return r.Permissions
}

// CheckPermission will compare a permission string (like from graphql schema)
func (r CustomRole) CheckPermission(requestedPerm string) bool {
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

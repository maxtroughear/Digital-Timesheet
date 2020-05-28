package model

import "github.com/emvi/hide"

// CustomRole is a group of permissions that is created for a specific company
type CustomRole struct {
	ModelSoftDelete
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
	// Run through permissions to check for the permission
	for _, perm := range r.Permissions {
		if perm.CheckPermission(requestedPerm) {
			return true
		}
	}
	return false
}

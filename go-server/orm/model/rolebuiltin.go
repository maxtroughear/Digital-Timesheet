package model

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
	// Run through permissions to check for the permission
	for _, perm := range r.Permissions {
		if perm.CheckPermission(requestedPerm) {
			return true
		}
	}
	return false
}

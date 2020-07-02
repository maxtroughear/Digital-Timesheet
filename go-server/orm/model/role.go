package model

// Role interface
type Role interface {
	GetName() string
	GetDescription() string
	CheckPermission(string) bool
	GetPermissions() []Permission
}

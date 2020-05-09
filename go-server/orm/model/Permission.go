package model

type Permission struct {
	ModelSoftDelete
	Permission string
	Users      []User `gorm:"many2many:user_permissions"`
}

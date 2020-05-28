package model

import (
	"log"
	"strings"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/operation"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model/permission/subject"
)

// Permission model
type Permission struct {
	Model
	Subject   subject.Subject     `gorm:"type:integer"`
	Operation operation.Operation `gorm:"type:integer"`
}

// CheckPermission check a full permission string (like ones from the graphql schema)
// And return whether or not the permission matches
func (p Permission) CheckPermission(permString string) bool {
	if permString == p.Subject.String()+":"+p.Operation.String() {
		return true
	}

	strings := strings.Split(permString, ":")
	if len(strings) != 2 {
		log.Println("permString invalid format", permString)
		return false
	}

	if p.Subject == subject.Any || p.Subject.String() == strings[0] {
		// subject is valid
		if p.Operation == operation.Any || p.Operation.String() == strings[1] {
			return true
		}
	}

	return false
}

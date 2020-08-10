package seed

import (
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

// RequiredUsers ensures that at least a default ServiceAdmin account exists
func RequiredUsers(db *gorm.DB) {
	var company model.Company

	db.Where(model.Company{
		Code: "sa",
	}).Attrs(model.Company{
		Name: "Service Admins",
	}).FirstOrCreate(&company)

	var domain model.Domain

	// TODO: make default domain configurable via env variables
	db.Where(model.Domain{
		Domain:    "kiwisheets.com",
		CompanyID: company.ID,
	}).FirstOrCreate(&domain)

	// TODO: make default password configurable via env variables
	hash, _ := auth.HashPassword("servicepass")

	var serviceAdminRole model.BuiltinRole

	// get service admin role
	db.Where(model.BuiltinRole{
		Name: "Service Admin",
	}).First(&serviceAdminRole)

	var user model.User

	db.Where(model.User{
		CompanyID: company.ID,
		// Check role
	}).Attrs(model.User{
		Email:     "serviceadmin@" + domain.Domain,
		Firstname: "Service",
		Lastname:  "Admin",
		Password:  hash,
		BuiltinRoles: []model.BuiltinRole{
			serviceAdminRole,
		},
	}).FirstOrCreate(&user)
}

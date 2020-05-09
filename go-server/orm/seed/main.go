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
		Code: "SA",
	}).Attrs(model.Company{
		Name: "Service Admins",
	}).FirstOrCreate(&company)

	hash, _ := auth.HashPassword("servicepass")

	var user model.User

	db.Where(model.User{
		CompanyID: company.ID,
		// Check role
	}).Attrs(model.User{
		Username: "serviceadmin",
		Password: hash,
	}).FirstOrCreate(&user)
}

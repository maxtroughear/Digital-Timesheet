package dataloader

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/emvi/hide"
	"github.com/jinzhu/gorm"
)

func newRoleByUserIDLoader(db *gorm.DB) *generated.RoleLoader {
	return generated.NewRoleLoader(generated.RoleLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(keys []int64) ([][]model.Role, []error) {
			roles := make([][]model.Role, len(keys))
			errors := make([]error, len(keys))

			for i, key := range keys {
				{
					var builtinRoles []model.BuiltinRole
					err := db.Model(&model.User{
						SoftDelete: model.SoftDelete{
							ID: hide.ID(key),
						},
					}).Preload("Permissions").Related(&builtinRoles, "BuiltinRoles").Error

					if err != nil {
						errors[i] = err
						continue
					}

					for _, role := range builtinRoles {
						roles[i] = append(roles[i], role)
					}
				}
				var customRoles []*model.CustomRole
				{
					err := db.Model(&model.User{
						SoftDelete: model.SoftDelete{
							ID: hide.ID(key),
						},
					}).Preload("Permissions").Related(&customRoles, "CustomRoles").Error

					if err != nil {
						errors[i] = err
						continue
					}
					for _, role := range customRoles {
						roles[i] = append(roles[i], role)
					}
				}
			}

			return roles, errors
		},
	})
}

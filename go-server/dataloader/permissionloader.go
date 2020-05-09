package dataloader

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/emvi/hide"
	"github.com/jinzhu/gorm"
)

func newPermissionsByUserIDLoader(db *gorm.DB) *generated.PermissionsLoader {
	return generated.NewPermissionsLoader(generated.PermissionsLoaderConfig{
		MaxBatch: 50,
		Wait:     1 * time.Millisecond,
		Fetch: func(userIDs []int64) ([][]*model.Permission, []error) {
			var perms [][]*model.Permission
			var errs []error

			for i, userID := range userIDs {
				var permissions []*model.Permission
				err := db.Model(&model.User{
					ModelSoftDelete: model.ModelSoftDelete{
						ID: hide.ID(userID),
					},
				}).Related(&permissions, "Permissions").Error

				if err != nil {
					errs[i] = err
					continue
				}
				perms[i] = permissions
			}

			return perms, errs
		},
	})
}

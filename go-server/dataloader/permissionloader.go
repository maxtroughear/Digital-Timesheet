package dataloader

// import (
// 	"time"

// 	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
// 	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
// 	"github.com/jinzhu/gorm"
// )

// func newPermissionCheckerByIDLoader(db *gorm.DB) *generated.PermissionChecker {
// 	return generated.NewPermissionChecker(generated.PermissionCheckerConfig{
// 		MaxBatch: 200,
// 		Wait: 1 * time.Millisecond,
// 		Fetch: func(keys []int64) ([]*bool, []error) {
// 			success := make([]*bool, len(keys))
// 			errors := make([]error, len(keys))

// 			for i, key := range keys {
// 				var builtinRoles []*model.BuiltinRole
// 				err := db.Model(&model.User{
// 					ModelSoftDelete: model.ModelSoftDelete{
// 						ID: hide.ID(key),
// 					},
// 				}).Related(builtinRoles, "BuiltinRoles")

// 				if err != nil {
// 					errors[i] = err
// 					continue
// 				}

// 				for _, role := range builtinRoles {

// 				}
// 			}
// 		}
// 	})
// }

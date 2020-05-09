package dataloader

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/emvi/hide"
	"github.com/jinzhu/gorm"
)

func newUserByIDLoader(db *gorm.DB) *generated.UserLoader {
	return generated.NewUserLoader(generated.UserLoaderConfig{
		MaxBatch: 100,
		Wait:     1 * time.Millisecond,
		Fetch: func(ids []int64) ([]*model.User, []error) {
			rows, err := db.Model(&model.User{}).Where(ids).Rows()
			defer rows.Close()

			if err != nil {
				return nil, []error{err}
			}

			// map users
			userByID := map[int64]*model.User{}

			for rows.Next() {
				var user model.User
				db.ScanRows(rows, &user)
				userByID[int64(user.ID)] = &user
			}

			// order users
			users := make([]*model.User, len(ids))
			for i, id := range ids {
				users[i] = userByID[id]
				i++
			}

			return users, nil
		},
	})
}

func newUsersByCompanyIDLoader(db *gorm.DB) *generated.UserSliceLoader {
	return generated.NewUserSliceLoader(generated.UserSliceLoaderConfig{
		MaxBatch: 100,
		Wait:     1 * time.Millisecond,
		Fetch: func(companyIDs []int64) ([][]*model.User, []error) {
			var companyUsers [][]*model.User
			//var errs []error

			for _, companyID := range companyIDs {
				db.Model(model.Company{
					ModelSoftDelete: model.ModelSoftDelete{
						ID: hide.ID(companyID),
					},
				}).Related(&companyUsers)
			}

			rows, err := db.Model(&model.User{}).Where("company_id IN (?)", companyIDs).Rows()

			if err != nil {
				return nil, []error{err}
			}

			defer rows.Close()

			// group by company ID
			groupByCompanyID := make(map[int64][]*model.User, len(companyIDs))
			//errByCompanyID := make(map[int64]error, len(companyIDs))

			for rows.Next() {
				var user model.User
				err := db.ScanRows(rows, &user)
				if err != nil {
					//errByCompanyID[]
				}
				groupByCompanyID[int64(user.CompanyID)] = append(groupByCompanyID[int64(user.CompanyID)], &user)
			}

			// order
			users := make([][]*model.User, len(companyIDs))
			for i, companyID := range companyIDs {
				users[i] = groupByCompanyID[companyID]
			}

			return users, nil
		},
	})
}

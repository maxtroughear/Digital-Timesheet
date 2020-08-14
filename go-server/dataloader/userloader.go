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
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(ids []int64) ([]*model.User, []error) {
			rows, err := db.Model(&model.User{}).Where(ids).Rows()

			if err != nil {
				if rows != nil {
					rows.Close()
				}
				return nil, []error{err}
			}
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
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(companyIDs []int64) ([][]*model.User, []error) {
			companyUsers := make([][]*model.User, len(companyIDs))
			var errs []error

			for i, companyID := range companyIDs {
				err := db.Model(model.Company{
					SoftDelete: model.SoftDelete{
						ID: hide.ID(companyID),
					},
				}).Related(&companyUsers[i]).Error

				if err != nil {
					errs[i] = err
				}
			}

			return companyUsers, errs

			// deprecated

			rows, err := db.Model(&model.User{}).Where("company_id IN (?)", companyIDs).Rows()

			if err != nil {
				if rows != nil {
					rows.Close()
				}
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
func newUserByEmailLoader(db *gorm.DB) *generated.UserStringLoader {
	return generated.NewUserStringLoader(generated.UserStringLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(emails []string) ([]*model.User, []error) {
			rows, err := db.Model(&model.User{}).Where("email IN (?)", emails).Rows()

			if err != nil {
				if rows != nil {
					rows.Close()
				}
				return nil, []error{err}
			}
			defer rows.Close()

			// map
			userByEmail := map[string]*model.User{}

			for rows.Next() {
				var user model.User
				db.ScanRows(rows, &user)
				userByEmail[user.Email] = &user
			}

			// order
			users := make([]*model.User, len(emails))
			for i, email := range emails {
				users[i] = userByEmail[email]
				i++
			}

			return users, nil
		},
	})
}

package dataloader

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/jinzhu/gorm"
)

func newCompanyByIDLoader(db *gorm.DB) *generated.CompanyLoader {
	return generated.NewCompanyLoader(generated.CompanyLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(ids []int64) ([]*model.Company, []error) {
			rows, err := db.Model(&model.Company{}).Where(ids).Rows()

			if err != nil {
				if rows != nil {
					rows.Close()
				}
				return nil, []error{err}
			}
			defer rows.Close()

			// map
			companyByID := map[int64]*model.Company{}

			for rows.Next() {
				var company model.Company
				db.ScanRows(rows, &company)
				companyByID[int64(company.ID)] = &company
			}

			// order
			companies := make([]*model.Company, len(ids))
			for i, id := range ids {
				companies[i] = companyByID[id]
				i++
			}

			return companies, nil
		},
	})
}

func newCompanyByUserIDLoader(db *gorm.DB) *generated.CompanyLoader {
	return generated.NewCompanyLoader(generated.CompanyLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(userIDs []int64) ([]*model.Company, []error) {
			// get users
			userRows, err := db.Model(&model.User{}).Select("id, company_id").Where(userIDs).Rows()

			if err != nil {
				if userRows != nil {
					userRows.Close()
				}
				return nil, []error{err}
			}
			defer userRows.Close()

			// map user IDs to company IDs and company IDs to nil
			// map to nil so that we only get unique companies from DB

			companyIDbyUserID := map[int64]int64{}
			companyByCompanyID := map[int64]*model.Company{}

			for userRows.Next() {
				var user model.User
				db.ScanRows(userRows, &user)
				companyIDbyUserID[int64(user.ID)] = int64(user.CompanyID)
				companyByCompanyID[int64(user.CompanyID)] = nil
			}

			// convert map to slice of now unique company IDs

			companyIDs := []int64{}
			for id := range companyByCompanyID {
				companyIDs = append(companyIDs, id)
			}

			companyRows, err := db.Model(&model.Company{}).Where(companyIDs).Rows()

			if err != nil {
				if companyRows != nil {
					companyRows.Close()
				}
				return nil, []error{err}
			}
			defer companyRows.Close()

			// map companies to company IDs

			for companyRows.Next() {
				var company model.Company
				db.ScanRows(companyRows, &company)
				companyByCompanyID[int64(company.ID)] = &company
			}

			// map companies to user IDs
			companyByUserID := map[int64]*model.Company{}
			for userID, companyID := range companyIDbyUserID {
				companyByUserID[userID] = companyByCompanyID[companyID]
			}

			// order
			companies := make([]*model.Company, len(userIDs))
			for i, id := range userIDs {
				companies[i] = companyByUserID[id]
				i++
			}

			return companies, nil
		},
	})
}

func newCompanyByCodeLoader(db *gorm.DB) *generated.CompanyStringLoader {
	return generated.NewCompanyStringLoader(generated.CompanyStringLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(companyCodes []string) ([]*model.Company, []error) {
			rows, err := db.Model(&model.Company{}).Where("code IN (?)", companyCodes).Rows()

			if err != nil {
				if rows != nil {
					rows.Close()
				}
				return nil, []error{err}
			}
			defer rows.Close()

			// map
			companyByCode := map[string]*model.Company{}

			for rows.Next() {
				var company model.Company
				db.ScanRows(rows, &company)
				companyByCode[company.Code] = &company
			}

			// order
			companies := make([]*model.Company, len(companyCodes))
			for i, code := range companyCodes {
				companies[i] = companyByCode[code]
				i++
			}

			return companies, nil
		},
	})
}

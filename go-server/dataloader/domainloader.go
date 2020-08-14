package dataloader

import (
	"time"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/emvi/hide"
	"github.com/jinzhu/gorm"
)

func newDomainsByCompanyIDLoader(db *gorm.DB) *generated.DomainSliceLoader {
	return generated.NewDomainSliceLoader(generated.DomainSliceLoaderConfig{
		MaxBatch: 1000,
		Wait:     1 * time.Millisecond,
		Fetch: func(companyIDs []int64) ([][]*model.Domain, []error) {
			companyDomains := make([][]*model.Domain, len(companyIDs))
			var errs []error

			for i, companyID := range companyIDs {
				err := db.Model(model.Company{
					SoftDelete: model.SoftDelete{
						ID: hide.ID(companyID),
					},
				}).Related(&companyDomains[i]).Error

				if err != nil {
					errs[i] = err
				}
			}

			return companyDomains, errs
		},
	})
}

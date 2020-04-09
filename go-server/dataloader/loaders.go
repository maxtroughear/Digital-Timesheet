package dataloader

//go:generate go run github.com/vektah/dataloaden UserLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model.User
//go:generate go run github.com/vektah/dataloaden UserSliceLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model.User
//go:generate go run github.com/vektah/dataloaden CompanyLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model.Company
//go:generate go run github.com/vektah/dataloaden CompanyStringLoader string *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model.Company

import (
	"context"
	"net/http"

	"github.com/jinzhu/gorm"
)

var loadersKey = &contextKey{"dataloaders"}

type contextKey struct {
	name string
}

// Loaders structure contains usable dataloaders
type Loaders struct {
	UserByID         *UserLoader
	UsersByCompanyID *UserSliceLoader
	CompanyByID      *CompanyLoader
	CompanyByUserID  *CompanyLoader
	CompanyByCode    *CompanyStringLoader
}

// Middleware handles dataloader requests
func Middleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			loaders := &Loaders{
				UserByID:         newUserByIDLoader(db),
				UsersByCompanyID: newUsersByCompanyIDLoader(db),
				CompanyByID:      newCompanyByIDLoader(db),
				CompanyByUserID:  newCompanyByUserIDLoader(db),
				CompanyByCode:    newCompanyByCodeLoader(db),
			}

			ctx := context.WithValue(
				r.Context(),
				loadersKey,
				loaders,
			)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// For returns the available dataloaders
func For(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey).(*Loaders)
}

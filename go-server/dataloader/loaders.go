package dataloader

import (
	"context"
	"net/http"

	"github.com/jinzhu/gorm"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader/generated"
)

var loadersKey = &contextKey{"dataloaders"}

type contextKey struct {
	name string
}

// Loaders structure contains usable dataloaders
type Loaders struct {
	UserByID           *generated.UserLoader
	UsersByCompanyID   *generated.UserSliceLoader
	UserByEmail        *generated.UserStringLoader
	CompanyByID        *generated.CompanyLoader
	CompanyByUserID    *generated.CompanyLoader
	CompanyByCode      *generated.CompanyStringLoader
	DomainsByCompanyID *generated.DomainSliceLoader
	RolesByUserID      *generated.RoleLoader
	//PermissionByUserID *generated.PermissionsLoader
}

// Middleware handles dataloader requests
func Middleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			loaders := &Loaders{
				UserByID:           newUserByIDLoader(db),
				UsersByCompanyID:   newUsersByCompanyIDLoader(db),
				UserByEmail:        newUserByEmailLoader(db),
				CompanyByID:        newCompanyByIDLoader(db),
				CompanyByUserID:    newCompanyByUserIDLoader(db),
				CompanyByCode:      newCompanyByCodeLoader(db),
				DomainsByCompanyID: newDomainsByCompanyIDLoader(db),
				RolesByUserID:      newRoleByUserIDLoader(db),
				//PermissionByUserID: newPermissionsByUserIDLoader(db),
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

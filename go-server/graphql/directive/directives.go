package directive

import (
	"context"
	"fmt"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/util"
	"github.com/99designs/gqlgen/graphql"
	"github.com/jinzhu/gorm"
)

func Register(db *gorm.DB, cfg *util.ServerConfig) generated.DirectiveRoot {
	return generated.DirectiveRoot{
		IsAuthenticated: func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
			if auth.For(ctx).User == nil {
				return nil, fmt.Errorf("Not logged in")
			}
			return next(ctx)
		},
		IsSecureAuthenticated: func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
			if auth.For(ctx).User == nil {
				return nil, fmt.Errorf("Not logged in")
			}
			if auth.For(ctx).Secure == false {
				return nil, fmt.Errorf("Not logged in with time sensitive token")
			}
			return next(ctx)
		},
		HasPerms: func(ctx context.Context, obj interface{}, next graphql.Resolver, perms []string) (res interface{}, err error) {
			if auth.For(ctx).User == nil {
				return nil, fmt.Errorf("Not logged in")
			}

			// use dataloader to attempt to find if the user has the required permissions

			return next(ctx)
		},
	}
}

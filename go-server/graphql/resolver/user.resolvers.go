package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
	"github.com/emvi/hide"
)

func (r *mutationResolver) CreateUser(ctx context.Context, code string, username string, password string) (*model.User, error) {
	// get code
	company, err := dataloader.For(ctx).CompanyByCode.Load(code)

	if err != nil {
		return nil, fmt.Errorf("unable to create User. Company not found")
	}

	hash, err := auth.HashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("unable to create User. Password invalid")
	}

	var user = model.User{
		Company:  *company,
		Username: username,
		Password: hash,
	}

	if err := r.DB.Create(&user).Error; err != nil {
		return nil, fmt.Errorf("unable to create User. Already exists")
	}

	return &user, nil
}

func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	return auth.For(ctx).User, nil
}

func (r *queryResolver) User(ctx context.Context, id hide.ID) (*model.User, error) {
	user, err := dataloader.For(ctx).UserByID.Load(int64(id))

	return user, err
}

func (r *userResolver) Company(ctx context.Context, obj *model.User) (*model.Company, error) {
	return dataloader.For(ctx).CompanyByID.Load(int64(obj.CompanyID))
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }

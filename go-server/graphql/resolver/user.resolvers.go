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
	"github.com/jinzhu/gorm"
)

func (r *mutationResolver) CreateUser(ctx context.Context, code *string, email string, password string) (*model.User, error) {
	// get code

	var company *model.Company

	if code == nil {
		// if no code is provided, use currently logged in user's company
		company = &auth.For(ctx).User.Company
	} else {
		// find valid code
		var err error
		company, err = dataloader.For(ctx).CompanyByCode.Load(*code)
		if err != nil {
			return nil, fmt.Errorf("unable to create User. Company not found")
		}
	}

	// verify that this user has the ability to create a user for this company

	hash, err := auth.HashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("unable to create User. Password invalid")
	}

	var user = model.User{
		Company:  *company,
		Email:    email,
		Password: hash,
	}

	if err := r.DB.Create(&user).Error; err != nil {
		return nil, fmt.Errorf("unable to create User. Already exists")
	}

	return &user, nil
}

func (r *mutationResolver) DeleteUser(ctx context.Context, id hide.ID) (bool, error) {
	if err := r.DB.Delete(&model.User{
		SoftDelete: model.SoftDelete{
			ID: id,
		},
	}).Error; err == gorm.ErrRecordNotFound {
		return false, fmt.Errorf("User not found")
	} else if err != nil {
		return false, fmt.Errorf("No user specified")
	}

	return true, nil
}

func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	return auth.For(ctx).User, nil
}

func (r *queryResolver) User(ctx context.Context, id hide.ID) (*model.User, error) {
	user, err := dataloader.For(ctx).UserByID.Load(int64(id))

	return user, err
}

func (r *queryResolver) SearchUsers(ctx context.Context, search string) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Company(ctx context.Context, obj *model.User) (*model.Company, error) {
	return dataloader.For(ctx).CompanyByID.Load(int64(obj.CompanyID))
}

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }

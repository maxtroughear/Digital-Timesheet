package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graph/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/model"
)

func (r *mutationResolver) EnableTwoFactor(ctx context.Context, secret string, token string) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) DisableTwoFactor(ctx context.Context, password string) (bool, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Login(ctx context.Context, code string, username string, password string, twoFactor *string) (*model.AuthData, error) {
	company, err := dataloader.For(ctx).CompanyByCode.Load(code)

	if err != nil || company == nil {
		return nil, fmt.Errorf("Company not found")
	}

	// unique query so not using a dataloader
	var user model.User
	if err := r.DB.Where(&model.User{
		Username:  username,
		CompanyID: company.ID,
	}).First(&user).Error; err != nil {
		return nil, fmt.Errorf("Username or Password Incorrect")
	}
	user.Company = *company

	// check is 2FA is enabled

	token, err := auth.LoginUser(user, password)

	if err != nil {
		return nil, fmt.Errorf("Username or Password Incorrect")
	}

	return &model.AuthData{
		User:             &user,
		Token:            &token,
		TwoFactorEnabled: false,
	}, nil
}

func (r *queryResolver) TwoFactorQr(ctx context.Context, secret string) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

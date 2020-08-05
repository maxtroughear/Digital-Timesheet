package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/dataloader"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/generated"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/modelgen"
	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model"
)

func (r *mutationResolver) Login(ctx context.Context, code string, username string, password string, twoFactor *string) (*modelgen.AuthData, error) {
	// TODO: move logic into auth package

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

	if !auth.VerifyPassword(&user, password) {
		return nil, fmt.Errorf("Username or Password Incorrect")
	}

	// check is 2FA is enabled
	var twoFA model.TwoFactor

	if err := r.DB.Model(&user).Related(&twoFA).Error; err == nil {
		// attempt 2FA auth
		if twoFactor == nil || *twoFactor == "" {
			return &modelgen.AuthData{
				TwoFactorEnabled: true,
			}, nil
		}
		if !auth.VerifyTwoFactor(&twoFA, *twoFactor) {
			return nil, fmt.Errorf("Invalid 2FA code")
		}
	}

	token, err := auth.LoginUser(&user, &r.Cfg.JWT)

	if err != nil {
		return nil, err
	}

	return &modelgen.AuthData{
		User:             &user,
		Token:            &token,
		TwoFactorEnabled: twoFA.Secret != "",
	}, nil
}

func (r *mutationResolver) LoginSecure(ctx context.Context, password string) (string, error) {
	return auth.LoginUserSecure(auth.For(ctx).User, &r.Cfg.JWT)
}

func (r *mutationResolver) ChangePassword(ctx context.Context, oldPassword string, newPassword string) (bool, error) {
	user := auth.For(ctx).User

	if !auth.VerifyPassword(user, oldPassword) {
		return false, fmt.Errorf("Password Incorrect")
	}

	hash, err := auth.HashPassword(newPassword)
	if err != nil {
		return false, fmt.Errorf("Bad password")
	}

	if err := r.DB.Model(&user).Update("Password", hash).Error; err != nil {
		return true, err
	}

	return true, nil
}

func (r *mutationResolver) NewTwoFactorBackups(ctx context.Context) ([]string, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) EnableTwoFactor(ctx context.Context, secret string, token string) ([]string, error) {
	return auth.EnableTwoFactor(r.DB, auth.For(ctx).User, secret, token)
}

func (r *mutationResolver) DisableTwoFactor(ctx context.Context, password string) (bool, error) {
	return auth.DisableTwoFactor(r.DB, auth.For(ctx).User, password)
}

func (r *queryResolver) TwoFactorBackups(ctx context.Context) ([]string, error) {
	return auth.GetBackupKeys(r.DB, auth.For(ctx))
}

func (r *queryResolver) TwoFactorEnabled(ctx context.Context) (bool, error) {
	// check is 2FA is enabled
	user := auth.For(ctx).User
	var twoFA model.TwoFactor

	if err := r.DB.Model(&user).Related(&twoFA).Error; err == nil {
		// if no error, two factor is enabled
		return true, nil
	}

	return false, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }

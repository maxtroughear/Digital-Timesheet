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

func (r *companyResolver) Users(ctx context.Context, obj *model.Company) ([]*model.User, error) {
	return dataloader.For(ctx).UsersByCompanyID.Load(obj.IDint())
}

func (r *companyResolver) Domains(ctx context.Context, obj *model.Company) ([]string, error) {
	domains, errs := dataloader.For(ctx).DomainsByCompanyID.Load(obj.IDint())

	domainStrings := make([]string, len(domains))
	for i, domain := range domains {
		domainStrings[i] = domain.Domain
	}

	return domainStrings, errs
}

func (r *mutationResolver) CreateCompany(ctx context.Context, name string, code string) (*model.Company, error) {
	var company = model.Company{
		Code: code,
		Name: name,
	}
	if err := r.DB.Create(&company).Error; err != nil {
		return nil, fmt.Errorf("Unable to create Company. Already exists")
	}

	return &company, nil
}

func (r *queryResolver) Company(ctx context.Context, id *hide.ID) (*model.Company, error) {
	if id == nil || *id == 0 {
		return dataloader.For(ctx).CompanyByID.Load(int64(auth.For(ctx).User.CompanyID))
	}

	return dataloader.For(ctx).CompanyByID.Load(int64(*id))
}

func (r *queryResolver) CompanyName(ctx context.Context, code string) (string, error) {
	company, err := dataloader.For(ctx).CompanyByCode.Load(code)

	if company == nil {
		return "", fmt.Errorf("No company exists")
	}

	return company.Name, err
}

// Company returns generated.CompanyResolver implementation.
func (r *Resolver) Company() generated.CompanyResolver { return &companyResolver{r} }

type companyResolver struct{ *Resolver }

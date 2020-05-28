package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/graphql/generated"
)

func (r *queryResolver) Version(ctx context.Context) (string, error) {
	return "0.0.0", nil
}

func (r *queryResolver) Test(ctx context.Context) (string, error) {
	return "Test response", nil
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }

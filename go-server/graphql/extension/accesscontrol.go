package extension

import (
	"context"
	"log"

	"git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/auth"
	"github.com/99designs/gqlgen/graphql"
	"github.com/emvi/hide"
	"github.com/jinzhu/gorm"
)

type AccessControl struct {
	DB *gorm.DB
}

var _ interface {
	graphql.FieldInterceptor
	graphql.HandlerExtension
} = &AccessControl{}

const accessControlExtension = "AccessControl"

func (c AccessControl) ExtensionName() string {
	return accessControlExtension
}

func (c AccessControl) Validate(schema graphql.ExecutableSchema) error {
	return nil
}

func (c AccessControl) InterceptField(ctx context.Context, next graphql.Resolver) (res interface{}, err error) {
	fc := graphql.GetFieldContext(ctx)

	if auth.For(ctx).User != nil {
		user := auth.For(ctx).User
		log.Println("Auth:")
		companyID, _ := hide.ToString(user.CompanyID)
		log.Printf("- UserID: %v", user.IDstring())
		log.Printf("- CompanyID: %v", companyID)
		//userID, _ := hide.ToString(auth.For(ctx).User.ID)
		//c.E.GetRolesForUser(userID)
	}

	if fc.IsMethod {
		log.Println("Object:")
		log.Printf("- %v", fc.Path())
		log.Printf("- %v", fc.Field.Name)
		log.Printf("- %v", fc.Object)

		res := fc.Object + "." + fc.Field.Name
		log.Printf("- %v", res)
	} else {
		log.Println("Field:")
		log.Printf("- %v", fc.Path())
		log.Printf("- %v", fc.Field.Name)
		log.Printf("- %v", fc.Object)
		res := fc.Object + "." + fc.Field.Name
		log.Printf("- %v", res)
	}

	return next(ctx)
}

// Package generated contains generated dataloader configurations
package generated

//go:generate go run github.com/vektah/dataloaden UserLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User
//go:generate go run github.com/vektah/dataloaden UserSliceLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User
//go:generate go run github.com/vektah/dataloaden UserStringLoader string *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User
//go:generate go run github.com/vektah/dataloaden UserStringSliceLoader string []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User

//go:generate go run github.com/vektah/dataloaden CompanyLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Company
//go:generate go run github.com/vektah/dataloaden CompanyStringLoader string *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Company

//go:generate go run github.com/vektah/dataloaden DomainSliceLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Domain

//ignore me go:generate go run github.com/vektah/dataloaden PermissionsLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Permission

// Checks if user has permission by ID
//go:generate go run github.com/vektah/dataloaden RoleLoader int64 []git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Role

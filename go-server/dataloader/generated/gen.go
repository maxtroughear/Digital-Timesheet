package generated

//go:generate go run github.com/vektah/dataloaden UserLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User
//go:generate go run github.com/vektah/dataloaden UserSliceLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.User
//go:generate go run github.com/vektah/dataloaden CompanyLoader int64 *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Company
//go:generate go run github.com/vektah/dataloaden CompanyStringLoader string *git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Company
//go:generate go run github.com/vektah/dataloaden PermissionsLoader int64 []*git.maxtroughear.dev/max.troughear/digital-timesheet/go-server/orm/model.Permission

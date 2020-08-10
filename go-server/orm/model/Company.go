package model

// `Company` has many `Users`

// Company model
type Company struct {
	ModelSoftDelete
	Code    string `gorm:"unique_index:idx_code"`
	Name    string
	Users   []User
	Domains []Domain
}

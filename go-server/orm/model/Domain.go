package model

import "github.com/emvi/hide"

// Domains belong to Companies

// Domain model
type Domain struct {
	Model
	Domain    string
	CompanyID hide.ID
	Company   Company
}

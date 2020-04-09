package model

import "github.com/emvi/hide"

// TwoFactor model contains the 2FA data for a user
type TwoFactor struct {
	Model
	UserID     hide.ID
	User       User
	Enabled    bool
	Secret     string
	BackupKeys []string
}

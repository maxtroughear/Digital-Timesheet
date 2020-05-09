package model

import (
	"github.com/emvi/hide"
	"github.com/lib/pq"
)

// TwoFactor model contains the 2FA data for a user
type TwoFactor struct {
	Model
	UserID     hide.ID
	User       User
	Secret     string
	BackupKeys pq.StringArray `gorm:"type:varchar(10)[]"`
}

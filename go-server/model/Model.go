package model

import (
	"time"

	"github.com/emvi/hide"
)

// Model Default model structure
type Model struct {
	ID        hide.ID `gorm:"type: bigserial;primary_key" json:"id"` // int64
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

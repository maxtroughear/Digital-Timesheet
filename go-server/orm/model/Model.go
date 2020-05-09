package model

import (
	"time"

	"github.com/emvi/hide"
)

// ModelSoftDelete Default model structure with soft deleting
type ModelSoftDelete struct {
	ID        hide.ID `gorm:"type: bigserial;primary_key" json:"id"` // int64
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

// Model Default model structure with hard deleting
type Model struct {
	ID        hide.ID `gorm:"type: bigserial;primary_key" json:"id"` // int64
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (m ModelSoftDelete) IDstring() string {
	id, err := hide.ToString(m.ID)
	if err != nil || id == "null" {
		return ""
	}
	return id
}

func (m Model) IDstring() string {
	id, err := hide.ToString(m.ID)
	if err != nil || id == "null" {
		return ""
	}
	return id
}

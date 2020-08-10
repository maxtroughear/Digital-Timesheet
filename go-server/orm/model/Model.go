/*
Package model is responsible for the models
*/
package model

import (
	"time"

	"github.com/emvi/hide"
)

// SoftDelete Default model structure with soft deleting
type SoftDelete struct {
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

// IDstring returns the ID as a hash string
func (m SoftDelete) IDstring() string {
	id, err := hide.ToString(m.ID)
	if err != nil || id == "null" {
		return ""
	}
	return id
}

// IDint returns the ID as an int64
func (m SoftDelete) IDint() int64 {
	return int64(m.ID)
}

// IDstring returns the ID as a hash string
func (m Model) IDstring() string {
	id, err := hide.ToString(m.ID)
	if err != nil || id == "null" {
		return ""
	}
	return id
}

// IDint returns the ID as an int64
func (m Model) IDint() int64 {
	return int64(m.ID)
}

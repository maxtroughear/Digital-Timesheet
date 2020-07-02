package subject

import (
	"database/sql/driver"
	"fmt"
)

type Subject int64

const (
	None Subject = iota
	Any
	Me
	User
	Users
	Company
)

var subjectStrings = [...]string{
	"",
	"*",
	"Me",
	"User",
	"Users",
	"Company",
}

// Scan converts int64 value to OperationType
func (s *Subject) Scan(value interface{}) error {
	*s = Subject(value.(int64))
	return nil
}

// Value returns the OperationType as an int
func (s Subject) Value() (driver.Value, error) {
	return int64(s), nil
}

func (s Subject) String() string {
	return subjectStrings[s]
}

func (s *Subject) FromString(value string) error {
	for i, subjectString := range subjectStrings {
		if value == subjectString {
			*s = Subject(int64(i))
			return nil
		}
	}
	return fmt.Errorf("invalid subject string")
}

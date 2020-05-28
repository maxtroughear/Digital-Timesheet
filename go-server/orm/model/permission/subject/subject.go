package subject

import "database/sql/driver"

type Subject int64

const (
	None Subject = iota
	Any
	Me
	User
	Users
)

var subjectStrings = [...]string{
	"",
	"*",
	"Me",
	"User",
	"Users",
}

// Scan converts a string value to OperationType
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

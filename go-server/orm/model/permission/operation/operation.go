package operation

import (
	"database/sql/driver"
	"fmt"
)

// Operation is an enum representing the operation on a permission
type Operation int64

const (
	// None is no permission
	None Operation = iota

	// Any means all operations
	Any

	// Create operations
	Create

	// Read operations
	Read

	// Update or edit operations
	Update

	// Delete operations
	Delete
)

var operationTypeStrings = [...]string{
	"",
	"*",
	"Create",
	"Read",
	"Update",
	"Delete",
}

// Scan converts a string value to OperationType
func (o *Operation) Scan(value interface{}) error {
	*o = Operation(value.(int64))
	return nil
}

// Value returns the OperationType as an int
func (o Operation) Value() (driver.Value, error) {
	return int64(o), nil
}

func (o Operation) String() string {
	return operationTypeStrings[o]
}

func (o *Operation) FromString(value string) error {
	for i, operationString := range operationTypeStrings {
		if value == operationString {
			*o = Operation(int64(i))
			return nil
		}
	}
	return fmt.Errorf("invalid operation string")
}

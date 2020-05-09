package model

import (
	"fmt"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/emvi/hide"
)

// MarshalID implements marshalling for IDs
func MarshalID(id hide.ID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		s, _ := hide.ToString(id)
		io.WriteString(w, strconv.Quote(s))
	})
}

// UnmarshalID implements reverse marshalling for IDs from strings
func UnmarshalID(v interface{}) (hide.ID, error) {
	str, ok := v.(string)
	if !ok {
		return 0, fmt.Errorf("IDs must be strings")
	}
	i, err := hide.FromString(str)
	return hide.ID(i), err
}

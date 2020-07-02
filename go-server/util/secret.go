package util

import (
	"fmt"
	"io/ioutil"
	"strconv"
)

func MustGetSecretFromEnv(env string) string {
	fileEnvTag := env + "_FILE"

	secret := CanGet(env, fileEnvTag)

	// check if env is either the default or if it is the env variable with _FILE
	if secret == fileEnvTag {
		// get the secret from the file from the env + _FILE variable
		return MustGetSecretFromFile(MustGet(fileEnvTag))
	}

	// return the secret obtained directly from the env variable
	return secret
}

func MustGetSecretUint64FromEnv(env string) uint64 {
	fileEnvTag := env + "_FILE"

	secret := CanGet(env, fileEnvTag)

	// check if env is either the default or if it is the env variable with _FILE
	if secret == fileEnvTag {
		// get the secret from the file from the env + _FILE variable
		return MustGetSecretUint64FromFile(MustGet(fileEnvTag))
	}

	u, err := strconv.ParseUint(string(secret), 10, 64)

	if err != nil {
		panic(fmt.Errorf("Secret not uint64: " + env))
	}

	// return the secret obtained directly from the env variable
	return u
}

func MustGetSecretFromFile(filename string) string {
	secret, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(fmt.Errorf("Secret missing: " + filename))
	}
	return string(secret)
}

func MustGetSecretUint64FromFile(filename string) uint64 {
	secret, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(fmt.Errorf("Secret missing: " + filename))
	}

	u, err := strconv.ParseUint(string(secret), 10, 64)

	if err != nil {
		panic(fmt.Errorf("Secret not uint64: " + filename))
	}

	return u
}

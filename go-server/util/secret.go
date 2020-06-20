package util

import (
	"fmt"
	"io/ioutil"
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

func MustGetSecretFromFile(filename string) string {
	secret, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(fmt.Errorf("Secret missing: " + filename))
	}
	return string(secret)
}

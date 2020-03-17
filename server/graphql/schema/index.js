const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
	_id: ID!
	username: String!
	password: String
	createdEvents: [Event!]
}

type Event {
	_id: ID!
	title: String!
	description: String!
	price: Float!
	date: String!
	creator: User!
}

type AuthData {
	userID: ID!
	token: String!
	tokenExpiration: Int!
}

input UserInput {
	username: String!
	password: String!
}

input EventInput {
	title: String!
	description: String!
	price: Float!
	date: String!
}

type RootQuery {
	events: [Event!]!
	login(username: String!, password: String!): AuthData!
}

type RootMutation {
	createEvent(eventInput: EventInput): Event
	createUser(userInput: UserInput): User
}

schema {
	query: RootQuery
	mutation: RootMutation
}
`);
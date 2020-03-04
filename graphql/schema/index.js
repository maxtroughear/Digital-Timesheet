const { buildSchema } = require('graphql');

exports = buildSchema(`
type User {
	_id: ID!
	userID: String!
	password: String
	createdEvents: [Event!]
}

type Event {
	_id: ID!
	title: String!
	description: String!
	price: Float!
	date: String!
}

input UserInput {
	userID: String!
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
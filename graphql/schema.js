const { gql } = require('apollo-server');

const typeDefs = gql`

type Query {
	events: [Event!]!
	login(username: String!, password: String!): AuthData!
}

type Mutation {
	createEvent(eventInput: EventInput): Event
	createUser(username: String!, password: String!): User
}

type User {
	_id: ID!
	username: String!
	password: String
	createdEvents: [Event!]
}

type Event @cacheControl(maxAge: 30) {
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
`;

module.exports = typeDefs;
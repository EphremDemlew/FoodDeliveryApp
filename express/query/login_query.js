// Login Query
const LOGIN_HASURA_OPERATION = `
query login($email: String!){
  Accounts(where: {email: {_eq: $email}}){
	id
    email
    password
    role
    first_name
  }
}

`;

module.exports = LOGIN_HASURA_OPERATION;

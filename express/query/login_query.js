// Login Query
const LOGIN_HASURA_OPERATION = `
query login($phone_number: String!){
  Accounts(where: {phone_number: {_eq: $phone_number}}){
	id
  phone_number
  password
  role
  first_name
  }
}

`;

module.exports = LOGIN_HASURA_OPERATION;

// Admin Login Query
const ADMIN_LOGIN_HASURA_OPERATION = `
query adminLogin($email: String!){
  Accounts(where: {email: {_eq: $email}}){
		id
    email
    password
    role
    first_name
  }
}
`;

module.exports = ADMIN_LOGIN_HASURA_OPERATION;

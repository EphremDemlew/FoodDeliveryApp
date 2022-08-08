// Admin Login Query
const ADMIN_LOGIN_HASURA_OPERATION = `
query adminLogin($email: String!){
  Accounts(where: {email: {_eq: $email}}){
		id
    email
    password
  }
}
`;

module.exports = ADMIN_LOGIN_HASURA_OPERATION;

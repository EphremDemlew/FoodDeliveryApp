// Admin Login Query
const ADMIN_LOGIN_HASURA_OPERATION = `
Accounts(where: {_and: {id: {_eq: "d9f0fd4e-a883-409b-83ae-9f64ad587068"}, phone_number: {_eq: "09123456"}}}) {
  id
  first_name
  last_name
  phone_number
  password
}
`;

module.exports = ADMIN_LOGIN_HASURA_OPERATION;

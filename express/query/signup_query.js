const signup_HASURA_OPERATION = `
mutation signup( $first_name: String!, $last_name:String!,$password:String!,$role:String!) {
  insert_Accounts_one(object: {first_name: $first_name, last_name: $last_name, password: $password, role: $role}) {
    password
    email
    id
    role
    Phone_Number
    first_name
    last_name
  }
}
`;

module.exports = signup_HASURA_OPERATION;

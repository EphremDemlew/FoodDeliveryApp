const signup_HASURA_OPERATION = `
mutation signup($first_name:String!,$last_name:String!,$password:String!,$role:String! , $phone_number:String!) {
  insert_Accounts_one(object: {first_name: $first_name, last_name: $last_name, password: $password, role: $role, phone_number: $phone_number}) {
    id
    phone_number
    first_name
    last_name
    password
    role
  }
}
`;

module.exports = signup_HASURA_OPERATION;

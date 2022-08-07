const signup_HASURA_OPERATION = `
mutation signup($email:String!,$first_name:String!,$last_name:String!,$password:String!,$role:String! , $Phone_Number:String!) {
  insert_Accounts_one(object: {email: $email, first_name: $first_name, last_name: $last_name, password: $password, role: $role, Phone_Number: $Phone_Number}) {
    id
    email
    first_name
    last_name
    password
    role
  }
}
`;

module.exports = signup_HASURA_OPERATION;

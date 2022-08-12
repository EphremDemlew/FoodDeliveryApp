const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signup_query = require("./query/signup_query");
const login_query = require("./query/login_query");
const admin_login_query = require("./query/adminlogin_query");
const checkOut = require("./query/checkout.js");
require("dotenv").config();

const app = express();

app.use(express.json());
// app.use(helmet());

app.get("/", (req, res) => {
  res.send("Server running ... ");
});

// signup query execute
const signup_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: signup_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// login query execute
const login_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: login_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};
// login query execute
const admin_login_execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    body: JSON.stringify({
      query: admin_login_query,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// Sign Up Request Handler
app.post("/signup", async (req, res) => {
  // get request input
  const { first_name, last_name, role, phone_number } = req.body.input;

  // run some business logic
  const password = await bcrypt.hash(req.body.input.password, 10);
  // execute the Hasura operation
  const { data, errors } = await signup_execute({
    first_name,
    last_name,
    password,
    role,
    phone_number,
  });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // token claim for users
  const customertokenContents = {
    sub: data.insert_Accounts_one.id,
    name: first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["customer", "anonymous", "delivery_person"],
      "x-hasura-user-id": data.insert_Accounts_one.id,
      "x-hasura-default-role": "customer",
      "x-hasura-role": "customer",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  // token claim for authors
  const delivery_persontokenContents = {
    sub: data.insert_Accounts_one.id,
    name: first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["customer", "anonymous", "delivery_person"],
      "x-hasura-user-id": data.insert_Accounts_one.id,
      "x-hasura-default-role": "delivery_person",
      "x-hasura-role": "delivery_person",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(
    data.insert_Accounts_one.role == "delivery_person"
      ? delivery_persontokenContents
      : customertokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );
  console.log(data.insert_Accounts_one.role);
  console.log(token);
  // success
  return res.json({
    ...data.insert_Accounts_one,
    token: token,
  });
});

// Login Request Handler
app.post("/Login", async (req, res) => {
  // get request input
  const { phone_number, password } = req.body.input;

  const { data, errors } = await login_execute({ phone_number });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }
  if (data.Accounts.length === 0) {
    return res
      .status(400)
      .json({ message: "Account not found, Please Sign Up." });
  }

  const validPassword = await bcrypt.compare(
    password,
    data.Accounts[0].password
  );
  if (!validPassword)
    return res
      .status(400)
      .json({ message: "Invalid Phone Number or Password." });
  console.log("The password is " + validPassword);

  // token claim for customer
  const customertokenContents = {
    sub: data.Accounts[0].id,
    name: data.Accounts[0].first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["customer", "anonymous", "delivery_person"],
      "x-hasura-user-id": data.Accounts[0].id,
      "x-hasura-default-role": "customer",
      "x-hasura-role": "customer",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  // token claim for delivery_person
  const delivery_persontokenContents = {
    sub: data.Accounts[0].id,
    name: data.Accounts[0].first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["customer", "anonymous", "delivery_person"],
      "x-hasura-user-id": data.Accounts[0].id,
      "x-hasura-default-role": "delivery_person",
      "x-hasura-role": "delivery_person",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(
    data.Accounts[0].role == "delivery_person"
      ? delivery_persontokenContents
      : customertokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );

  console.log("......................");
  console.log(token);
  console.log("......................");

  // success
  return res.json({
    ...data.Accounts[0],
    token: token,
  });
});
// Admin Login Request Handler
app.post("/adminLogin", async (req, res) => {
  // get request input
  const { phone_number, password } = req.body.input;

  const { data, errors } = await admin_login_execute({ phone_number });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  const validPassword = await bcrypt.compare(
    password,
    data.Accounts[0].password
  );
  if (!validPassword)
    return res.status(400).json({ message: "Invalid Email or Password." });

  // token claim for admin users
  const admintokenContents = {
    sub: data.Accounts[0].id,
    name: data.Accounts[0].first_name,
    iat: Date.now() / 1000,
    iss: "https://myapp.com/",
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["admin"],
      "x-hasura-user-id": data.Accounts[0].id,
      "x-hasura-default-role": "admin",
      "x-hasura-role": "admin",
    },
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(
    admintokenContents,
    process.env.HASURA_JWT_SECRET_KEY || "z8pXvFrDjGWb3mRSJBAp9ZljHRnMofLF"
  );

  console.log("......................" + data.Accounts[0]);
  console.log(token);
  console.log("......................");

  // success
  return res.json({
    ...data.Accounts[0],
    token: token,
  });
});

app.post("/checkout", checkOut);
const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

import { app } from "../app";
import { jest } from "@jest/globals";
import { User } from "../models/usersModel";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Test @POST /api/users/login", () => {
  // mocking a function is to make sure that the coverage of the testing is only the function that we have written as opposed to including the dependencies

  // let us mock the external functions from other libraries

  const mockSignInData = {
    // this is mocking the request body that we are sending to the signup and login route
    email: "testuser05@example.com",
    password: "TestPassword5!",
  };

  // this is mocking the ID creation done by Mongodb externally
  const mockUserId = "mockUserId";

  // this is mocking the document created by MongoDB upon successful sign up
  const mockUserAccount = {
    _id: mockUserId,
    email: mockSignInData.email,
    // its acceptable to use the external function such as bcrypt.hash here because we are not yet testing, just creating the mock data
    password: bcrypt.hash(mockSignInData.password, 10),
    subscription: "starter",
  };

  beforeAll(() => {
    // initializes all created mock data before the testing begins

    // this is the mock for the find one function
    jest.spyOn(User, "findOne").mockImplementation(({ email }) => {
      if (email === mockSignInData.email) {
        // forcing the findOne function to return the mockUserAccount result
        return Promise.resolve(mockUserAccount);
      }
    });

    // mock compare
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation((password, hashedPassword) => {
        return Promise.resolve(
          password === mockSignInData.password &&
            hashedPassword === mockUserAccount.password
        );
      });

    // mock jwt sign
    jest.spyOn(jwt, "sign").mockImplementation(() => "mockJwtToken");

    // mock find by id and update
    jest
      .spyOn(User, "findByIdAndUpdate")
      .mockImplementation((id, fieldToBeUpdatedInTheObject) => {
        if (id === mockUserId) {
          return Promise.resolve({
            ...mockSignInData,
            ...fieldToBeUpdatedInTheObject,
          });
        }
      });
  });

  test("Login POST request with correct data", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(mockSignInData);

    // assertions are expected results of test suites
    // assertions are declared using the expect function from jest

    // Response must have status code 200
    expect(response.status).toBe(200);

    // The token must be returned in the response
    expect(response.body).toHaveProperty("token", "mockJwtToken");

    const { user } = response.body;

    // The response should return a user object with 2 fields email and subscription
    expect(user).toHaveProperty("email" && "subscription");

    // email and subscription, having the data type String
    expect(user.email && user.subscription).toEqual(expect.any(String));
  });
});

// import request from "supertest";
// import { app } from "../app.js";
// import { User } from "../models/usersModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { jest } from "@jest/globals";

// describe("Test @POST /api/users/login", () => {
//   const signInData = {
//     email: "marvin@example.com",
//     password: "examplepassword",
//   };

//   const mockUserId = "mockUserId";
//   const mockUser = {
//     _id: mockUserId,
//     email: signInData.email,
//     password: bcrypt.hash(signInData.password, 10),
//     subscription: "starter",
//   };

//   beforeAll(() => {
//     // Mock User.findOne
//     jest.spyOn(User, "findOne").mockImplementation(({ email }) => {
//       if (email === signInData.email) {
//         return Promise.resolve(mockUser);
//       }
//       return Promise.resolve(null);
//     });

//     // Mock bcrypt.compare
//     jest
//       .spyOn(bcrypt, "compare")
//       .mockImplementation((password, hashedPassword) => {
//         return Promise.resolve(
//           password === signInData.password &&
//             hashedPassword === mockUser.password
//         );
//       });

//     // Mock jwt.sign
//     jest.spyOn(jwt, "sign").mockImplementation(() => "mockJwtToken");

//     // Mock User.findByIdAndUpdate
//     jest.spyOn(User, "findByIdAndUpdate").mockImplementation((id, update) => {
//       if (id === mockUserId) {
//         return Promise.resolve({ ...mockUser, ...update });
//       }
//       return Promise.resolve(null);
//     });
//   });

//   afterAll(() => {
//     jest.restoreAllMocks();
//   });

//   test("Test login with correct data.", async () => {
//     const response = await request(app)
//       .post("/api/users/login")
//       .send(signInData);

//     console.log("Login Data:", signInData);
//     console.log("Response status code:", response.status);
//     console.log("Response body:", response.body);
//     console.log("Response body USER:", response.body.user);

//     // Response must have status code 200
//     expect(response.status).toBe(200);

//     // The token must be returned in the response
//     expect(response.body).toHaveProperty("token", "mockJwtToken");

//     const { user } = response.body;

//     // The response should return a user object with 2 fields email and subscription
//     expect(user).toHaveProperty("email" && "subscription");

//     // email and subscription, having the data type String
//     expect(user.email && user.subscription).toEqual(expect.any(String));
//   });
// });